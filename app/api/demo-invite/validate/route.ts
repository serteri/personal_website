import { NextResponse } from 'next/server';
import { after } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { createRateLimiter, clientIp } from '@/lib/rateLimit';
import { ALERT_EMAIL, escapeHtml, inviteState, sendMail } from '@/lib/demoInvites';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const isLimited = createRateLimiter(30, 10 * 60 * 1000);
const bodySchema = z.object({ token: z.string().min(10).max(100) });

export async function POST(req: Request) {
    if (isLimited(clientIp(req))) return NextResponse.json({ valid: false }, { status: 429 });

    let token: string;
    try {
        token = bodySchema.parse(await req.json()).token;
    } catch {
        return NextResponse.json({ valid: false });
    }

    const invite = await prisma.demoInvite.findUnique({ where: { token } });
    if (!invite) return NextResponse.json({ valid: false });
    const state = inviteState(invite);
    // Used-up links still get a friendly "what next" screen (book a call / callback) instead of a dead end.
    if (state === 'exhausted') {
        return NextResponse.json({ valid: false, exhausted: true, businessName: invite.businessName, contactName: invite.contactName?.split(' ')[0] ?? null, maxCalls: invite.maxCalls });
    }
    if (state !== 'ok') return NextResponse.json({ valid: false });

    // First open: atomic flip so concurrent tabs/refreshes send only one alert
    if (!invite.openedAt) {
        const { count } = await prisma.demoInvite.updateMany({ where: { id: invite.id, openedAt: null }, data: { openedAt: new Date() } });
        if (count === 1) {
            after(() =>
                sendMail({
                    to: ALERT_EMAIL,
                    subject: `Demo Link Opened: ${invite.businessName} (${invite.email})`,
                    html: `<p><strong>${escapeHtml(invite.businessName)}</strong> just opened their voice demo link.</p>
<ul>
<li><strong>Contact:</strong> ${escapeHtml(invite.contactName ?? '-')}</li>
<li><strong>Email:</strong> ${escapeHtml(invite.email)}</li>
<li><strong>Source:</strong> ${escapeHtml(invite.source)}</li>
<li><strong>Calls:</strong> ${invite.callsUsed} / ${invite.maxCalls}</li>
</ul>`,
                })
            );
        }
    }

    return NextResponse.json({
        valid: true,
        businessName: invite.businessName,
        contactName: invite.contactName?.split(' ')[0] ?? null,
        callsRemaining: invite.maxCalls - invite.callsUsed,
        maxCalls: invite.maxCalls,
    });
}
