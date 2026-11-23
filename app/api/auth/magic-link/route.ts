import { NextResponse } from 'next/server';
import { z } from 'zod';
import { Resend } from 'resend';
import prisma from '@/lib/prisma';
import { createRateLimiter, clientIp } from '@/lib/rateLimit';
import { hashToken, newToken, MAGIC_LINK_TTL_MS, siteUrl } from '@/lib/clientAuth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const byIp = createRateLimiter(10, 15 * 60 * 1000);
const byEmail = createRateLimiter(3, 15 * 60 * 1000); // stops mail-bombing one address
const bodySchema = z.object({ email: z.string().trim().toLowerCase().email().max(254) });

const GENERIC = 'If you have a registered account, a login link has been sent.';

export async function POST(req: Request) {
    let email: string;
    try {
        email = bodySchema.parse(await req.json()).email;
    } catch {
        return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }
    if (byIp(clientIp(req)) || byEmail(email)) {
        return NextResponse.json({ error: 'Too many requests. Please try again in a few minutes.' }, { status: 429 });
    }

    const apiKey = process.env.RESEND_API_KEY?.trim();
    if (!apiKey) {
        console.error('Magic link misconfigured: RESEND_API_KEY missing');
        return NextResponse.json({ error: 'Login is temporarily unavailable.' }, { status: 503 });
    }

    try {
        const client = await prisma.client.findUnique({ where: { email }, select: { id: true } });
        if (client) {
            const token = newToken();
            await prisma.magicLinkToken.create({
                data: { email, token: hashToken(token), expiresAt: new Date(Date.now() + MAGIC_LINK_TTL_MS) },
            });
            const link = `${siteUrl()}/api/auth/verify?token=${token}`;
            const { error } = await new Resend(apiKey).emails.send({
                from: process.env.AUTH_EMAIL_FROM?.trim() || 'ALTIQDESIGN <onboarding@resend.dev>',
                to: [email],
                subject: 'Your ALTIQDESIGN login link',
                html: `<p>Click below to log in to your AI Receptionist dashboard. This link expires in 15 minutes and works once.</p>
<p><a href="${link}">Log in to your dashboard</a></p>
<p>If you didn't request this, you can ignore this email.</p>`,
            });
            if (error) console.error('Magic link email failed:', error);
        }
    } catch (error) {
        console.error('Magic link error:', error);
    }
    // Same response whether or not the account exists (no account enumeration)
    return NextResponse.json({ message: GENERIC });
}
