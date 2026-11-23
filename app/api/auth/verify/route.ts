import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createSessionValue, hashToken, SESSION_COOKIE, SESSION_TTL_SECONDS, sessionCookieOptions, siteUrl } from '@/lib/clientAuth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: Request) {
    const fail = () => NextResponse.redirect(`${siteUrl()}/dashboard?login=invalid`);
    const token = new URL(req.url).searchParams.get('token');
    if (!token || token.length > 200) return fail();

    try {
        const hashed = hashToken(token);
        // Atomic single-use: only one request can flip usedAt from null
        const { count } = await prisma.magicLinkToken.updateMany({
            where: { token: hashed, usedAt: null, expiresAt: { gt: new Date() } },
            data: { usedAt: new Date() },
        });
        if (count !== 1) return fail();

        const record = await prisma.magicLinkToken.findUnique({ where: { token: hashed }, select: { email: true } });
        const client = record && (await prisma.client.findUnique({ where: { email: record.email }, select: { id: true } }));
        if (!client) return fail();

        const res = NextResponse.redirect(`${siteUrl()}/dashboard`);
        res.cookies.set(SESSION_COOKIE, createSessionValue(client.id), { ...sessionCookieOptions, maxAge: SESSION_TTL_SECONDS });
        return res;
    } catch (error) {
        console.error('Magic link verify error:', error);
        return fail();
    }
}
