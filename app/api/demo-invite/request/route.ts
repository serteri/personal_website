import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { createRateLimiter, clientIp } from '@/lib/rateLimit';
import { ALERT_EMAIL, escapeHtml, inviteLink, inviteState, newInviteToken, sendMail } from '@/lib/demoInvites';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const byIp = createRateLimiter(3, 60 * 60 * 1000);
const DAY = 24 * 60 * 60 * 1000;

const bodySchema = z.object({
    contactName: z.string().trim().min(2).max(100),
    businessName: z.string().trim().min(2).max(120),
    email: z.string().trim().toLowerCase().email().max(254),
    phone: z.string().trim().max(30).optional().or(z.literal('')),
    website: z.string().max(200).optional(), // honeypot
});

const OK = { message: 'Check your inbox for your personal voice demo link.' };

export async function POST(req: Request) {
    let body;
    try {
        body = bodySchema.parse(await req.json());
    } catch {
        return NextResponse.json({ error: 'Please check your details and try again.' }, { status: 400 });
    }
    if (body.website?.trim()) return NextResponse.json(OK); // bots: pretend success, do nothing
    if (byIp(clientIp(req))) {
        return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }
    if (!process.env.RESEND_API_KEY?.trim()) {
        console.error('Demo invite request misconfigured: RESEND_API_KEY missing');
        return NextResponse.json({ error: 'Requests are temporarily unavailable.' }, { status: 503 });
    }

    // One inbound invite per email per 24h: re-send the same link instead of minting new free calls.
    const existing = await prisma.demoInvite.findFirst({
        where: { email: body.email, source: 'inbound_form', createdAt: { gt: new Date(Date.now() - DAY) } },
        orderBy: { createdAt: 'desc' },
    });
    if (existing) {
        if (inviteState(existing) === 'ok') {
            await sendMail({
                to: existing.email,
                subject: 'Your ALTIQDESIGN live voice demo link',
                html: prospectEmail(existing.contactName ?? body.contactName, inviteLink(existing.token)),
            });
        }
        return NextResponse.json(OK);
    }

    const invite = await prisma.demoInvite.create({
        data: {
            token: newInviteToken(),
            businessName: body.businessName,
            contactName: body.contactName,
            email: body.email,
            phone: body.phone || null,
            source: 'inbound_form',
            maxCalls: 3,
            expiresAt: new Date(Date.now() + 7 * DAY),
        },
    });
    const link = inviteLink(invite.token);

    const sent = await sendMail({
        to: invite.email,
        subject: 'Your ALTIQDESIGN live voice demo link',
        html: prospectEmail(body.contactName, link),
    });
    if (!sent) {
        await prisma.demoInvite.delete({ where: { id: invite.id } }).catch(() => undefined);
        return NextResponse.json({ error: 'We could not send your demo link. Please try again shortly.' }, { status: 502 });
    }

    await sendMail({
        to: ALERT_EMAIL,
        subject: `New Voice Demo Request: ${invite.businessName} (${invite.email})`,
        html: `<p>New inbound voice demo request:</p>
<ul>
<li><strong>Name:</strong> ${escapeHtml(body.contactName)}</li>
<li><strong>Business:</strong> ${escapeHtml(invite.businessName)}</li>
<li><strong>Email:</strong> ${escapeHtml(invite.email)}</li>
<li><strong>Phone:</strong> ${escapeHtml(invite.phone ?? '-')}</li>
<li><strong>Invite link:</strong> <a href="${link}">${link}</a></li>
</ul>`,
    });

    return NextResponse.json(OK);
}

function prospectEmail(name: string, link: string) {
    return `<p>Hi ${escapeHtml(name)},</p>
<p>Here is your personal link to talk live with Sam, our AI receptionist. It includes 3 demo calls and is valid for 7 days.</p>
<p><a href="${link}">Start your live voice demo</a></p>
<p>Tip: try reporting a burst pipe in Newstead, or ask about after-hours availability.</p>
<p>— ALTIQDESIGN, Albion, Brisbane</p>`;
}
