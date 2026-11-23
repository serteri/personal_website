import { createHash, createHmac, randomBytes, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

export const SESSION_COOKIE = 'altiq_session';
export const SESSION_TTL_SECONDS = 7 * 24 * 60 * 60;
export const MAGIC_LINK_TTL_MS = 15 * 60 * 1000;

export const siteUrl = () => (process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'https://www.altiqdesign.com').replace(/\/$/, '');

function secret(): string {
    const s = process.env.AUTH_SECRET?.trim() || process.env.STRIPE_SECRET_KEY?.trim();
    if (!s) throw new Error('AUTH_SECRET (or STRIPE_SECRET_KEY) is not set');
    // Domain-separated so a Stripe key is never used raw as an HMAC key
    return createHmac('sha256', 'altiq-client-session-v1').update(s).digest('hex');
}

const sign = (payload: string) => createHmac('sha256', secret()).update(payload).digest('base64url');

export const hashToken = (token: string) => createHash('sha256').update(token).digest('hex');
export const newToken = () => randomBytes(32).toString('base64url');

export function createSessionValue(clientId: string): string {
    const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
    const payload = `${clientId}.${exp}`;
    return `${payload}.${sign(payload)}`;
}

function readSession(value: string | undefined): string | null {
    if (!value) return null;
    const i = value.lastIndexOf('.');
    if (i < 0) return null;
    const payload = value.slice(0, i);
    const given = Buffer.from(value.slice(i + 1));
    const expected = Buffer.from(sign(payload));
    if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null;
    const [clientId, exp] = payload.split('.');
    if (!clientId || !exp || Number(exp) < Date.now() / 1000) return null;
    return clientId;
}

export const sessionCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
};

// Returns the logged-in Client (fresh from the DB) or null.
export async function getSessionClient() {
    let id: string | null;
    try {
        id = readSession((await cookies()).get(SESSION_COOKIE)?.value);
    } catch {
        return null; // secret missing or malformed cookie: treat as logged out
    }
    return id ? prisma.client.findUnique({ where: { id } }) : null;
}
