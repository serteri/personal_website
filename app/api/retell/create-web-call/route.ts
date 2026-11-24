import { NextResponse } from 'next/server';
import { after } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { createRateLimiter, clientIp } from '@/lib/rateLimit';
import { ALERT_EMAIL, escapeHtml, inviteState, sendMail } from '@/lib/demoInvites';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const isLimited = createRateLimiter(20, 10 * 60 * 1000); // blunt per-IP guard on top of per-invite limits
const bodySchema = z.object({ inviteToken: z.string().min(10).max(100) });
const FORBIDDEN = { error: 'This demo link is invalid, expired, or has no calls left.' };

export async function POST(req: Request) {
    if (isLimited(clientIp(req))) return NextResponse.json({ error: 'Too many requests.' }, { status: 429 });

    const apiKey = process.env.RETELL_API_KEY?.trim();
    const agentId = process.env.RETELL_PLUMBING_AGENT_ID?.trim();
    if (!apiKey || !agentId) {
        console.error('Voice demo misconfigured', { hasApiKey: Boolean(apiKey), hasAgentId: Boolean(agentId) });
        return NextResponse.json({ error: 'Voice demo is not configured on the server.' }, { status: 500 });
    }

    let token: string;
    try {
        token = bodySchema.parse(await req.json()).inviteToken;
    } catch {
        return NextResponse.json(FORBIDDEN, { status: 403 });
    }

    const invite = await prisma.demoInvite.findUnique({ where: { token } });
    if (!invite || inviteState(invite) !== 'ok') return NextResponse.json(FORBIDDEN, { status: 403 });

    // Reserve one call atomically (two concurrent requests can't both take the last call)
    const reserved = await prisma.demoInvite.updateMany({
        where: { id: invite.id, callsUsed: { lt: invite.maxCalls } },
        data: { callsUsed: { increment: 1 }, lastCalledAt: new Date() },
    });
    if (reserved.count !== 1) return NextResponse.json(FORBIDDEN, { status: 403 });
    const callNumber = (await prisma.demoInvite.findUnique({ where: { id: invite.id }, select: { callsUsed: true } }))?.callsUsed ?? invite.callsUsed + 1;

    const refund = () =>
        prisma.demoInvite.update({ where: { id: invite.id }, data: { callsUsed: { decrement: 1 } } }).catch((e) => console.error('Refund failed:', e));

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    try {
        const res = await fetch('https://api.retellai.com/v3/create-web-call', {
            method: 'POST',
            headers: { 'content-type': 'application/json', Authorization: `Bearer ${apiKey}` },
            body: JSON.stringify({
                agent_id: agentId,
                metadata: { invite_token: invite.token, business_name: invite.businessName },
            }),
            signal: controller.signal,
        });
        if (!res.ok) {
            console.error('Retell create-web-call failed:', { status: res.status, body: (await res.text().catch(() => '')).slice(0, 500) });
            await refund();
            return NextResponse.json({ error: 'Could not start the voice call right now. Please try again shortly.' }, { status: 502 });
        }
        const data = await res.json();
        if (!data.access_token) {
            console.error('Retell response had no access_token; keys:', Object.keys(data ?? {}));
            await refund();
            return NextResponse.json({ error: 'Could not start the voice call right now. Please try again shortly.' }, { status: 502 });
        }

        after(() =>
            sendMail({
                to: ALERT_EMAIL,
                subject: `Voice Demo Call Started: ${invite.businessName} — Call #${callNumber} of ${invite.maxCalls}`,
                html: `<p><strong>${escapeHtml(invite.businessName)}</strong> started a live voice demo call.</p>
<ul>
<li><strong>Contact:</strong> ${escapeHtml(invite.contactName ?? '-')} (${escapeHtml(invite.email)})</li>
<li><strong>Call:</strong> #${callNumber} of ${invite.maxCalls}</li>
<li><strong>Retell call ID:</strong> ${escapeHtml(String(data.call_id ?? '-'))}</li>
</ul>`,
            })
        );

        return NextResponse.json({
            access_token: data.access_token,
            call_id: data.call_id,
            transport: data.transport,
            url: data.url,
            ice_servers: data.ice_servers,
            expires_at: data.expires_at,
            callsRemaining: invite.maxCalls - callNumber,
        });
    } catch (error) {
        console.error('Retell create-web-call error:', error);
        await refund();
        return NextResponse.json({ error: 'Could not start the voice call right now. Please try again shortly.' }, { status: 502 });
    } finally {
        clearTimeout(timer);
    }
}
