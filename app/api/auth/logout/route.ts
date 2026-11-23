import { NextResponse } from 'next/server';
import { SESSION_COOKIE, sessionCookieOptions, siteUrl } from '@/lib/clientAuth';

export const dynamic = 'force-dynamic';

export async function POST() {
    const res = NextResponse.redirect(`${siteUrl()}/dashboard`, 303);
    res.cookies.set(SESSION_COOKIE, '', { ...sessionCookieOptions, maxAge: 0 });
    return res;
}
