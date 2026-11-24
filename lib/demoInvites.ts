import { createHmac, randomBytes, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';
import { Resend } from 'resend';
import type { DemoInvite } from '@prisma/client';
import { siteUrl } from '@/lib/clientAuth';

export const ALERT_EMAIL = process.env.DEMO_ALERT_EMAIL?.trim() || 'serter@altiqdesign.com';

export const newInviteToken = () => randomBytes(24).toString('base64url'); // URL-safe, 192 bits
export const inviteLink = (token: string) => `${siteUrl()}/ai-receptionist?invite=${encodeURIComponent(token)}`;

export const escapeHtml = (v: string) =>
    v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export type InviteState = 'ok' | 'expired' | 'exhausted';
export function inviteState(i: Pick<DemoInvite, 'expiresAt' | 'callsUsed' | 'maxCalls'>): InviteState {
    if (i.expiresAt && i.expiresAt.getTime() <= Date.now()) return 'expired';
    if (i.callsUsed >= i.maxCalls) return 'exhausted';
    return 'ok';
}

// Returns true when the email was accepted by Resend. Never throws.
export async function sendMail(opts: { to: string; subject: string; html: string }): Promise<boolean> {
    const apiKey = process.env.RESEND_API_KEY?.trim();
    if (!apiKey) {
        console.error('sendMail skipped: RESEND_API_KEY missing');
        return false;
    }
    try {
        const { error } = await new Resend(apiKey).emails.send({
            from: process.env.AUTH_EMAIL_FROM?.trim() || 'ALTIQDESIGN <onboarding@resend.dev>',
            to: [opts.to],
            subject: opts.subject,
            html: opts.html,
        });
        if (error) {
            console.error('sendMail failed:', error);
            return false;
        }
        return true;
    } catch (error) {
        console.error('sendMail failed:', error);
        return false;
    }
}

/* ---------- admin session (ADMIN_SECRET -> signed HTTP-only cookie) ---------- */

export const ADMIN_COOKIE = 'altiq_admin';
export const ADMIN_TTL_SECONDS = 12 * 60 * 60;

function adminKey(): string | null {
    const s = process.env.ADMIN_SECRET?.trim();
    return s ? createHmac('sha256', 'altiq-admin-session-v1').update(s).digest('hex') : null;
}
const adminSign = (key: string, payload: string) => createHmac('sha256', key).update(payload).digest('base64url');

export function adminSecretMatches(input: string): boolean {
    const s = process.env.ADMIN_SECRET?.trim();
    if (!s) return false;
    const a = createHmac('sha256', 'cmp').update(input).digest();
    const b = createHmac('sha256', 'cmp').update(s).digest();
    return timingSafeEqual(a, b);
}

export function createAdminCookieValue(): string | null {
    const key = adminKey();
    if (!key) return null;
    const exp = String(Math.floor(Date.now() / 1000) + ADMIN_TTL_SECONDS);
    return `${exp}.${adminSign(key, exp)}`;
}

export async function isAdmin(): Promise<boolean> {
    const key = adminKey();
    const value = (await cookies()).get(ADMIN_COOKIE)?.value;
    if (!key || !value) return false;
    const [exp, sig] = value.split('.');
    if (!exp || !sig || Number(exp) < Date.now() / 1000) return false;
    const given = Buffer.from(sig);
    const expected = Buffer.from(adminSign(key, exp));
    return given.length === expected.length && timingSafeEqual(given, expected);
}

export const adminCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
};
