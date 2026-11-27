import type { Booking } from '@prisma/client';
import { SLOT_MINUTES, bookingInterval, brisbaneParts } from '@/lib/slots';

export const MODIFY_CUTOFF_MS = 2 * 60 * 60_000; // no changes within 2 hours of the appointment
export const CUTOFF_MESSAGE = 'Changes are not available within 2 hours of the appointment. Please contact us directly.';
export const TOKEN_RE = /^[a-f0-9]{48}$/; // 24 random bytes, hex

type Row = Pick<Booking, 'date' | 'time' | 'status'>;

export function canModify(b: Row, now = Date.now()): boolean {
    return b.status === 'CONFIRMED' && bookingInterval(b).start - now >= MODIFY_CUTOFF_MS;
}

/** What the manage page may see: no email, phone, ids or tokens. */
export function publicView(b: Row & { firstName: string; lastName: string }, now = Date.now()) {
    const { start, end } = bookingInterval(b);
    const { date, time } = brisbaneParts(start);
    return {
        date,
        time,
        durationMinutes: Math.round((end - start) / 60_000) || SLOT_MINUTES,
        name: `${b.firstName} ${b.lastName}`,
        status: b.status,
        canModify: canModify(b, now),
    };
}
