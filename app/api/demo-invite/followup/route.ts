import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { createRateLimiter, clientIp } from '@/lib/rateLimit';
import { ALERT_EMAIL, escapeHtml, sendMail } from '@/lib/demoInvites';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const isLimited = createRateLimiter(8, 10 * 60 * 1000);

const bodySchema = z.discriminatedUnion('kind', [
    z.object({
        kind: z.literal('callback'),
        token: z.string().min(10).max(100),
        phone: z.string().trim().regex(/^\+?[\d\s()-]{6,30}$/, 'Invalid phone number'),
    }),
    z.object({
        kind: z.literal('feedback'),
        token: z.string().min(10).max(100),
        rating: z.enum(['Great', 'Needs tweaking', 'Not for us']),
    }),
]);

const oneLine = (v: string) => v.replace(/[\r\n]+/g, ' ').trim();

// Post-demo actions from the invite link: callback request (phone only) or 1-click feedback.
// The invite supplies name/email, so visitors only type a phone number. Always emails the owner.
export async function POST(req: Request) {
    if (isLimited(clientIp(req))) return NextResponse.json({ message: 'Too many requests. Please try again later.' }, { status: 429 });

    const parsed = bodySchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) return NextResponse.json({ message: parsed.error.issues[0]?.path[0] === 'phone' ? 'Please enter a valid phone number.' : 'Invalid request.' }, { status: 400 });
    const body = parsed.data;

    // Any real invite (even used up) may follow up; expiry only matters for making calls.
    const invite = await prisma.demoInvite.findUnique({ where: { token: body.token } });
    if (!invite) return NextResponse.json({ message: 'Invalid link.' }, { status: 404 });

    const details = `<ul>
<li><strong>Business:</strong> ${escapeHtml(invite.businessName)}</li>
<li><strong>Contact:</strong> ${escapeHtml(invite.contactName ?? '-')}</li>
<li><strong>Email:</strong> ${escapeHtml(invite.email)}</li>
<li><strong>Invite phone:</strong> ${escapeHtml(invite.phone ?? '-')}</li>
<li><strong>Calls used:</strong> ${invite.callsUsed} / ${invite.maxCalls}</li>
</ul>`;

    const ok =
        body.kind === 'callback'
            ? await sendMail({
                  to: ALERT_EMAIL,
                  subject: oneLine(`Callback requested: ${invite.businessName} — ${body.phone}`),
                  replyTo: invite.email,
                  html: `<p><strong>${escapeHtml(invite.businessName)}</strong> asked for a callback after the voice demo.</p><p><strong>Call them on: ${escapeHtml(body.phone)}</strong></p>${details}`,
              })
            : await sendMail({
                  to: ALERT_EMAIL,
                  subject: oneLine(`Demo feedback: "${body.rating}" — ${invite.businessName}`),
                  replyTo: invite.email,
                  html: `<p>Voice demo feedback from <strong>${escapeHtml(invite.businessName)}</strong>: <strong>${escapeHtml(body.rating)}</strong></p>${details}`,
              });

    if (!ok) return NextResponse.json({ message: 'Could not send that right now. Please try again, or book a call below.' }, { status: 502 });
    return NextResponse.json({ ok: true });
}
