import { createSign } from 'crypto';
import { BRISBANE_OFFSET, SLOT_MINUTES, TIMEZONE, brisbaneDayRange, brisbaneInstant, type Interval } from '@/lib/slots';

// Lightweight Google Calendar client: service-account JWT + fetch (no googleapis dependency).
// Share your calendar with GOOGLE_SERVICE_ACCOUNT_EMAIL ("Make changes to events") for this to work.

const SCOPE = 'https://www.googleapis.com/auth/calendar';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const API = 'https://www.googleapis.com/calendar/v3';

interface GoogleConfig {
    calendarId: string;
    email: string;
    privateKey: string;
}

let warned = false;
function config(): GoogleConfig | null {
    const calendarId = process.env.GOOGLE_CALENDAR_ID?.trim();
    const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim();
    const rawKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.trim();
    if (!calendarId || !email || !rawKey) {
        if (!warned) {
            warned = true;
            console.warn('Google Calendar not configured (GOOGLE_CALENDAR_ID / GOOGLE_SERVICE_ACCOUNT_EMAIL / GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY): skipping calendar busy-time checks and event creation.');
        }
        return null;
    }
    // Env vars often hold the key with literal "\n" sequences and wrapping quotes.
    const privateKey = rawKey.replace(/^"|"$/g, '').replace(/\\n/g, '\n');
    return { calendarId, email, privateKey };
}

export const googleCalendarConfigured = () => config() !== null;

const b64url = (v: string | Buffer) => Buffer.from(v).toString('base64url');

let cachedToken: { value: string; expiresAt: number } | null = null;

async function accessToken(cfg: GoogleConfig): Promise<string> {
    if (cachedToken && cachedToken.expiresAt - 60_000 > Date.now()) return cachedToken.value;
    const iat = Math.floor(Date.now() / 1000);
    const unsigned = `${b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))}.${b64url(
        JSON.stringify({ iss: cfg.email, scope: SCOPE, aud: TOKEN_URL, iat, exp: iat + 3600 })
    )}`;
    const signature = createSign('RSA-SHA256').update(unsigned).sign(cfg.privateKey);
    const res = await fetch(TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            assertion: `${unsigned}.${b64url(signature)}`,
        }),
    });
    const data = (await res.json().catch(() => ({}))) as { access_token?: string; expires_in?: number; error_description?: string };
    if (!res.ok || !data.access_token) throw new Error(`Google token request failed (${res.status}): ${data.error_description ?? 'unknown error'}`);
    cachedToken = { value: data.access_token, expiresAt: Date.now() + (data.expires_in ?? 3600) * 1000 };
    return data.access_token;
}

// Short cache so slot browsing doesn't hit Google on every click. Bookings pass { fresh: true }.
const busyCache = new Map<string, { at: number; ranges: Interval[] }>();
const CACHE_MS = 30_000;

/**
 * Busy intervals on the owner's calendar for a Brisbane day (YYYY-MM-DD).
 * Returns [] when Google isn't configured. Throws if Google is configured but the request fails,
 * so callers decide whether to fail open or closed.
 */
export async function getBusyRanges(dateStr: string, opts: { fresh?: boolean } = {}): Promise<Interval[]> {
    const cfg = config();
    if (!cfg) return [];
    const hit = busyCache.get(dateStr);
    if (!opts.fresh && hit && Date.now() - hit.at < CACHE_MS) return hit.ranges;

    const day = brisbaneDayRange(dateStr);
    const res = await fetch(`${API}/freeBusy`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${await accessToken(cfg)}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
            timeMin: new Date(day.start).toISOString(),
            timeMax: new Date(day.end).toISOString(),
            timeZone: TIMEZONE,
            items: [{ id: cfg.calendarId }],
        }),
    });
    const data = (await res.json().catch(() => ({}))) as {
        calendars?: Record<string, { busy?: { start: string; end: string }[]; errors?: { reason?: string }[] }>;
        error?: { message?: string };
    };
    if (!res.ok) throw new Error(`Google freeBusy failed (${res.status}): ${data.error?.message ?? 'unknown error'}`);
    const cal = data.calendars?.[cfg.calendarId];
    if (cal?.errors?.length) throw new Error(`Google freeBusy calendar error: ${cal.errors.map((e) => e.reason).join(', ')}`);

    const ranges = (cal?.busy ?? []).map((b) => ({ start: Date.parse(b.start), end: Date.parse(b.end) }));
    busyCache.set(dateStr, { at: Date.now(), ranges });
    return ranges;
}

export interface CalendarEventInput {
    date: string; // Brisbane YYYY-MM-DD
    time: string; // Brisbane HH:mm
    durationMinutes?: number;
    name: string;
    email: string;
    phone: string;
    notes?: string;
}

/** Adds the booking to the owner's calendar. No attendees (works on personal @gmail.com without delegation). */
export async function createCalendarEvent(input: CalendarEventInput): Promise<string | null> {
    const cfg = config();
    if (!cfg) return null;
    const start = brisbaneInstant(input.date, input.time);
    const end = new Date(start.getTime() + (input.durationMinutes ?? SLOT_MINUTES) * 60_000);
    const local = (d: Date) => new Date(d.getTime() + 10 * 3_600_000).toISOString().slice(0, 19) + BRISBANE_OFFSET;

    const res = await fetch(`${API}/calendars/${encodeURIComponent(cfg.calendarId)}/events`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${await accessToken(cfg)}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
            summary: `Booking: ${input.name}`,
            description: [`Name: ${input.name}`, `Email: ${input.email}`, `Phone: ${input.phone}`, input.notes ? `Notes: ${input.notes}` : ''].filter(Boolean).join('\n'),
            start: { dateTime: local(start), timeZone: TIMEZONE },
            end: { dateTime: local(end), timeZone: TIMEZONE },
        }),
    });
    const data = (await res.json().catch(() => ({}))) as { id?: string; error?: { message?: string } };
    if (!res.ok) throw new Error(`Google event creation failed (${res.status}): ${data.error?.message ?? 'unknown error'}`);
    return data.id ?? null;
}
