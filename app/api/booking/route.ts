import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';


const ALLOWED_SLOTS = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

// Strict server-side validation
const bookingSchema = z.object({
    firstName: z.string().trim().min(1).max(80),
    lastName: z.string().trim().min(1).max(80),
    email: z.string().trim().toLowerCase().email().max(254),
    phone: z.string().trim().regex(/^\+?[\d\s()-]{5,30}$/, 'Invalid phone number'),
    date: z.string().datetime(), // ISO 8601
    time: z.string().refine(t => ALLOWED_SLOTS.includes(t), 'Invalid time slot'),
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

        const { firstName, lastName, email, phone, date, time } = bookingSchema.parse(body);

        // Build the appointment instant (same convention as before: slot hours set in UTC)
        const bookingDateTime = new Date(date);
        const [hours, minutes] = time.split(':').map(Number);
        bookingDateTime.setUTCHours(hours, minutes, 0, 0);

        // Reject past dates (14h tolerance for the UTC convention above across timezones)
        if (bookingDateTime.getTime() < Date.now() - 14 * 60 * 60 * 1000) {
            return NextResponse.json({ message: 'Please choose a future date and time.' }, { status: 400 });
        }

        // Double-booking guard: check + insert in one serializable transaction
        const created = await prisma.$transaction(async (tx) => {
            const clash = await tx.booking.findFirst({
                where: { date: bookingDateTime, time },
                select: { id: true },
            });
            if (clash) return null;
            return tx.booking.create({
                data: { firstName, lastName, email, phone, date: bookingDateTime, time },
                select: { date: true, time: true },
            });
        }, { isolationLevel: 'Serializable' });

        if (!created) {
            return NextResponse.json({ message: 'That time slot is no longer available.' }, { status: 409 });
        }

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
