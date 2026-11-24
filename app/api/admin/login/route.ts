import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createRateLimiter, clientIp } from '@/lib/rateLimit';
import { ADMIN_COOKIE, ADMIN_TTL_SECONDS, adminCookieOptions, adminSecretMatches, createAdminCookieValue } from '@/lib/demoInvites';

export const dynamic = 'force-dynamic';

const isLimited = createRateLimiter(5, 10 * 60 * 1000); // brute-force guard
const bodySchema = z.object({ secret: z.string().min(1).max(200) });

export async function POST(req: Request) {
    if (isLimited(clientIp(req))) return NextResponse.json({ error: 'Too many attempts. Try again later.' }, { status: 429 });
    const cookieValue = createAdminCookieValue();
    if (!cookieValue) return NextResponse.json({ error: 'ADMIN_SECRET is not configured.' }, { status: 500 });

    let secret: string;
    try {
        secret = bodySchema.parse(await req.json()).secret;
    } catch {
        return NextResponse.json({ error: 'Incorrect secret.' }, { status: 401 });
    }
    if (!adminSecretMatches(secret)) return NextResponse.json({ error: 'Incorrect secret.' }, { status: 401 });

    const res = NextResponse.json({ ok: true });
    res.cookies.set(ADMIN_COOKIE, cookieValue, { ...adminCookieOptions, maxAge: ADMIN_TTL_SECONDS });
    return res;
}

export async function DELETE() {
    const res = NextResponse.json({ ok: true });
    res.cookies.set(ADMIN_COOKIE, '', { ...adminCookieOptions, maxAge: 0 });
    return res;
}
