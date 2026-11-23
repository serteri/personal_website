import { NextResponse } from 'next/server';
import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { verify } from 'retell-sdk';
import prisma from '@/lib/prisma';
import { getStripe } from '@/lib/stripe';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const payloadSchema = z.object({
    event: z.string(),
    call: z.object({
        call_id: z.string().min(1),
        agent_id: z.string().min(1),
        from_number: z.string().nullish(),
        duration_ms: z.number().nonnegative().optional(),
        start_timestamp: z.number().optional(),
        end_timestamp: z.number().optional(),
        call_analysis: z
            .object({
                call_summary: z.string().nullish(),
                custom_analysis_data: z.record(z.unknown()).nullish(),
            })
            .passthrough()
            .nullish(),
    }).passthrough(),
});

export async function POST(req: Request) {
    const apiKey = process.env.RETELL_API_KEY?.trim();
    if (!apiKey) {
        console.error('Retell webhook misconfigured: RETELL_API_KEY missing');
        return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
    }

    const rawBody = await req.text();
    const signature = req.headers.get('x-retell-signature');
    if (!signature || !(await verify(rawBody, apiKey, signature).catch(() => false))) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    let payload;
    try {
        payload = payloadSchema.parse(JSON.parse(rawBody));
    } catch {
        return NextResponse.json({ error: 'Bad payload' }, { status: 400 });
    }
    if (payload.event !== 'call_ended' && payload.event !== 'call_analyzed') return NextResponse.json({ ignored: true });

    const { call } = payload;
    const client = await prisma.client.findUnique({ where: { retellAgentId: call.agent_id } });
    if (!client) {
        // Not one of our paying clients (e.g. the public demo agent): acknowledge so Retell doesn't retry
        return NextResponse.json({ ignored: true });
    }

    if (payload.event === 'call_analyzed') {
        const analyzed = call.call_analysis;
        const { count } = await prisma.callLog.updateMany({
            where: { retellCallId: call.call_id },
            data: {
                summary: analyzed?.call_summary ?? null,
                isEmergency: analyzed?.custom_analysis_data?.is_emergency === true,
            },
        });
        // call_analyzed can race ahead of call_ended: a non-2xx makes Retell retry once the CallLog exists
        if (count === 0) return NextResponse.json({ error: 'Call not logged yet' }, { status: 503 });
        return NextResponse.json({ ok: true, updated: count });
    }

    const durationMs =
        call.duration_ms ??
        (call.start_timestamp && call.end_timestamp ? Math.max(0, call.end_timestamp - call.start_timestamp) : 0);
    const billedMinutes = Math.ceil(durationMs / 60000);
    const analysis = call.call_analysis;

    let before: number;
    let after: number;
    try {
        // Duplicate retellCallId (webhook retry) fails the unique constraint and rolls back the increment.
        [before, after] = await prisma.$transaction(async (tx) => {
            await tx.callLog.create({
                data: {
                    clientId: client.id,
                    retellCallId: call.call_id,
                    callerNumber: call.from_number ?? null,
                    durationSeconds: Math.round(durationMs / 1000),
                    billedMinutes,
                    summary: analysis?.call_summary ?? null,
                    isEmergency: analysis?.custom_analysis_data?.is_emergency === true,
                },
            });
            const updated = await tx.client.update({
                where: { id: client.id },
                data: { minutesUsedCurrentPeriod: { increment: billedMinutes } },
                select: { minutesUsedCurrentPeriod: true },
            });
            return [updated.minutesUsedCurrentPeriod - billedMinutes, updated.minutesUsedCurrentPeriod];
        });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            return NextResponse.json({ duplicate: true });
        }
        console.error('Retell webhook DB error:', error);
        return NextResponse.json({ error: 'Handler failed' }, { status: 500 });
    }

    // Only the minutes that newly crossed the included allowance are reported as overage.
    const overage = Math.max(0, after - client.monthlyMinuteLimit) - Math.max(0, before - client.monthlyMinuteLimit);
    const eventName =
        client.plan === 'STARTER'
            ? process.env.STRIPE_METER_STARTER_EVENT?.trim()
            : client.plan === 'GROWTH'
              ? process.env.STRIPE_METER_GROWTH_EVENT?.trim()
              : undefined;

    if (overage > 0 && eventName) {
        try {
            await getStripe().billing.meterEvents.create({
                event_name: eventName,
                payload: { stripe_customer_id: client.stripeCustomerId, value: String(overage) },
                identifier: `retell_${call.call_id}`, // makes Stripe-side retries idempotent
            });
        } catch (error) {
            // Call is already logged; surface for manual reconciliation but don't make Retell retry (would hit the duplicate guard)
            console.error('Stripe meter event failed:', { callId: call.call_id, overage, error });
        }
    } else if (overage > 0) {
        console.warn('Overage minutes not billed (no meter event for plan):', { plan: client.plan, overage });
    }

    return NextResponse.json({ ok: true, billedMinutes, overage });
}
