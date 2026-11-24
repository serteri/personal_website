import { NextResponse } from 'next/server';
import { ADMIN_COOKIE, ADMIN_TTL_SECONDS, adminCookieOptions, createAdminCookieValue, isAdmin } from '@/lib/demoInvites';

export const dynamic = 'force-dynamic';

// Valid session + activity => re-issue the cookie, sliding the 15-minute window.
export async function POST() {
    const value = createAdminCookieValue();
    if (!value || !(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const res = NextResponse.json({ ok: true });
    res.cookies.set(ADMIN_COOKIE, value, { ...adminCookieOptions, maxAge: ADMIN_TTL_SECONDS });
    return res;
}
