import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { getDbBusy, getGoogleBusy } from '@/lib/availability';
import { createCalendarEvent } from '@/lib/googleCalendar';
import { sendBookingEmails } from '@/lib/bookingEmail';
import { SLOT_MINUTES, brisbaneInstant, isBookableDay, isValidDateStr, isValidSlot, isWithinWindow, overlaps, slotInterval } from '@/lib/slots';

// Strict server-side validation. `date` is the Brisbane calendar day (YYYY-MM-DD), `time` a slot from lib/slots.
const bookingSchema = z.object({
    firstName: z.string().trim().min(1).max(80),
    lastName: z.string().trim().min(1).max(80),
    email: z.string().trim().toLowerCase().email().max(254),
    phone: z.string().trim().regex(/^\+?[\d\s()-]{5,30}$/, 'Invalid phone number'),
    date: z.string().refine(isValidDateStr, 'Invalid date'),
    time: z.string().refine(isValidSlot, 'Invalid time slot'),
    notes: z.string().trim().max(1000).optional(),
    website: z.string().max(200).optional(), // honeypot: real users never fill this
});

// Best-effort per-IP rate limit (in memory: per server instance).
const RATE_LIMIT = 3;
const RATE_WINDOW_MS = 60_000;
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const recent = (hits.get(ip) ?? []).filter(t => now - t < RATE_WINDOW_MS);
    if (recent.length >= RATE_LIMIT) {
        hits.set(ip, recent);
        return true;
    }
    recent.push(now);
    hits.set(ip, recent);
    if (hits.size > 5000) {
        for (const [key, times] of hits) {
            if (times.every(t => now - t >= RATE_WINDOW_MS)) hits.delete(key);
        }
    }
    return false;
}

function clientIp(req: Request): string {
    return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
        || req.headers.get('x-real-ip')
        || 'unknown';
}

// Public endpoint: returns ONLY the date and time slot of upcoming bookings.
// Never select or return personal data (name, email, phone, ids) here.
export async function GET() {
    try {
        // 48h buffer so slots stored as UTC are not dropped early in far-ahead timezones
        const since = new Date(Date.now() - 48 * 60 * 60 * 1000);
        const bookings = await prisma.booking.findMany({
            where: { date: { gte: since } },
            select: { date: true, time: true },
            orderBy: { date: 'asc' },
        });

        return NextResponse.json(
            bookings.map(b => ({ date: b.date.toISOString(), time: b.time })),
            { headers: { 'Cache-Control': 'no-store' } }
        );
    } catch (error) {
        console.error("Failed to fetch bookings:", error);
        return NextResponse.json({ message: "Failed to fetch bookings" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    if (isRateLimited(clientIp(req))) {
        return NextResponse.json(
            { message: 'Too many requests. Please try again in a minute.' },
            { status: 429, headers: { 'Retry-After': '60' } }
        );
    }

    try {
        const body = await req.json();

        // Honeypot: pretend success, write nothing.
        if (typeof body?.website === 'string' && body.website.trim() !== '') {
            return NextResponse.json({ message: 'Booking successful!' }, { status: 200 });
        }

        const { firstName, lastName, email, phone, date, time, notes } = bookingSchema.parse(body);

        if (!isBookableDay(date) || !isWithinWindow(date)) {
            return NextResponse.json({ message: 'Please choose an available day.' }, { status: 400 });
        }
        const slot = slotInterval(date, time);
        if (slot.start <= Date.now()) {
            return NextResponse.json({ message: 'Please choose a future date and time.' }, { status: 400 });
        }

        const clash = () => NextResponse.json({ message: 'That time slot is no longer available.' }, { status: 409 });

        // Fresh Google check (not cached) before taking the slot.
        const googleBusy = await getGoogleBusy(date, true);
        if (googleBusy.some(b => overlaps(slot, b))) return clash();

        // Only database work runs inside the transaction; Google/Resend calls stay outside it.
        // Double-booking guard: check Bookings (incl. legacy hourly rows) + Availability blocks and insert atomically.
        const created = await prisma.$transaction(async (tx) => {
            const busy = await getDbBusy(date, tx);
            if (busy.some(b => overlaps(slot, b))) return null;
            return tx.booking.create({
                data: { firstName, lastName, email, phone, date: brisbaneInstant(date, time), time },
                select: { date: true, time: true },
            });
        }, {
            isolationLevel: 'Serializable',
            maxWait: 10_000, // wait for a connection: Neon cold starts can exceed Prisma's 2s default (P2028)
            timeout: 15_000, // max transaction run time
        });

        if (!created) return clash();

        // Saved. Calendar event + emails are best-effort: a failure must never lose or fail the booking.
        const name = `${firstName} ${lastName}`;
        const results = await Promise.allSettled([
            createCalendarEvent({ date, time, durationMinutes: SLOT_MINUTES, name, email, phone, notes }),
            sendBookingEmails({ date, time, name, email, phone, notes }),
        ]);
        results.forEach(r => r.status === 'rejected' && console.error('Post-booking step failed:', r.reason));

        return NextResponse.json(
            { message: 'Booking successful!', booking: { date: created.date.toISOString(), time: created.time } },
            { status: 201 }
        );

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: 'Invalid form data' }, { status: 400 });
        }
        // Serializable conflict: another request took the slot at the same moment
        if (typeof error === 'object' && error !== null && (error as { code?: string }).code === 'P2034') {
            return NextResponse.json({ message: 'That time slot is no longer available.' }, { status: 409 });
        }
        console.error("Booking API Error:", error);
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}
