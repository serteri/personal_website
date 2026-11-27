import prisma from '@/lib/prisma';
import { getBusyRanges } from '@/lib/googleCalendar';
import { bookingInterval, brisbaneDayRange, freeSlots, overlaps, type Interval } from '@/lib/slots';

const DAY = 24 * 60 * 60_000;

/** Busy intervals from Prisma only (bookings incl. legacy hourly rows, plus manual Availability blocks). */
export async function getDbBusy(dateStr: string, db: Pick<typeof prisma, 'booking' | 'availability'> = prisma): Promise<Interval[]> {
    const day = brisbaneDayRange(dateStr);
    // Legacy rows are stored on the UTC calendar day, so widen the query by a day each side, then filter exactly.
    const [bookings, blocks] = await Promise.all([
        db.booking.findMany({
            where: { date: { gte: new Date(day.start - DAY), lt: new Date(day.end + DAY) } },
            select: { date: true, time: true },
        }),
        db.availability.findMany({
            where: { start: { lt: new Date(day.end) }, end: { gt: new Date(day.start) } },
            select: { start: true, end: true },
        }),
    ]);
    return [...bookings.map(bookingInterval), ...blocks.map((b) => ({ start: b.start.getTime(), end: b.end.getTime() }))].filter((i) =>
        overlaps(i, day)
    );
}

/** Google busy ranges; if Google is configured but errors, log and continue with DB data only (fail open). */
export async function getGoogleBusy(dateStr: string, fresh = false): Promise<Interval[]> {
    try {
        return await getBusyRanges(dateStr, { fresh });
    } catch (error) {
        console.error('Google Calendar busy lookup failed; continuing without it:', error);
        return [];
    }
}

/** Free 20-minute slot start times for a Brisbane day, merged from Google + Bookings + Availability. */
export async function getFreeSlots(dateStr: string): Promise<string[]> {
    const [google, db] = await Promise.all([getGoogleBusy(dateStr), getDbBusy(dateStr)]);
    return freeSlots(dateStr, [...google, ...db]);
}
