// Single source of truth for booking slots. Everything is Australia/Brisbane (UTC+10, no DST),
// so the fixed offset below is exact all year and needs no timezone library.

export const SLOT_MINUTES = 20;
export const TIMEZONE = 'Australia/Brisbane';
export const DAY_START = '09:00';
export const DAY_END = '18:00'; // end of day: the last slot STARTS at 17:40
export const BRISBANE_OFFSET = '+10:00';
export const MAX_DAYS_AHEAD = 90;
/** Legacy bookings were hourly, so they block a full hour. */
export const LEGACY_BOOKING_MINUTES = 60;

const MIN = 60_000;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export interface Interval {
    start: number; // epoch ms
    end: number;
}

const toMinutes = (hhmm: string) => {
    const [h, m] = hhmm.split(':').map(Number);
    return h * 60 + m;
};
const toHHMM = (mins: number) => `${String(Math.floor(mins / 60)).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}`;

/** All slot start times for a working day, e.g. ['09:00', '09:20', ... '17:40'] (27 slots). */
export function generateSlots(): string[] {
    const out: string[] = [];
    for (let m = toMinutes(DAY_START); m + SLOT_MINUTES <= toMinutes(DAY_END); m += SLOT_MINUTES) out.push(toHHMM(m));
    return out;
}

export const SLOTS = generateSlots();
export const isValidSlot = (time: string) => SLOTS.includes(time);

/** True only for real calendar dates in YYYY-MM-DD form. */
export function isValidDateStr(d: string): boolean {
    if (!DATE_RE.test(d)) return false;
    const t = new Date(`${d}T00:00:00Z`);
    return !Number.isNaN(t.getTime()) && t.toISOString().slice(0, 10) === d;
}

/** The exact instant of a Brisbane wall-clock date + time. */
export function brisbaneInstant(dateStr: string, time: string): Date {
    return new Date(`${dateStr}T${time}:00${BRISBANE_OFFSET}`);
}

/** [00:00, next 00:00) of a Brisbane day as epoch ms. */
export function brisbaneDayRange(dateStr: string): Interval {
    const start = brisbaneInstant(dateStr, '00:00').getTime();
    return { start, end: start + 24 * 60 * MIN };
}

/** Today's date in Brisbane as YYYY-MM-DD. */
export function brisbaneToday(now = Date.now()): string {
    return new Date(now + 10 * 60 * MIN).toISOString().slice(0, 10);
}

/** Day of week of a Brisbane date (0 = Sunday). */
export const brisbaneWeekday = (dateStr: string) => new Date(`${dateStr}T00:00:00Z`).getUTCDay();

export const isBookableDay = (dateStr: string) => brisbaneWeekday(dateStr) !== 0; // closed Sundays

/** Whether a date is today..MAX_DAYS_AHEAD in Brisbane. */
export function isWithinWindow(dateStr: string, now = Date.now()): boolean {
    const today = brisbaneToday(now);
    const last = brisbaneToday(now + MAX_DAYS_AHEAD * 24 * 60 * MIN);
    return dateStr >= today && dateStr <= last;
}

export const slotInterval = (dateStr: string, time: string, minutes = SLOT_MINUTES): Interval => {
    const start = brisbaneInstant(dateStr, time).getTime();
    return { start, end: start + minutes * MIN };
};

export const overlaps = (a: Interval, b: Interval) => a.start < b.end && b.start < a.end;

/**
 * The time window a stored Booking row occupies.
 *  - Legacy rows (before this change) stored the slot hour as the UTC hour of `date` (10:00 -> 10:00Z)
 *    and were 60 minutes long, so they block the full hour on that calendar day.
 *  - Current rows store the true instant (10:00 Brisbane -> 00:00Z) and are SLOT_MINUTES long.
 * The two can't be confused: a Brisbane slot 09:00-17:40 has UTC time-of-day 23:00-07:40, while a legacy
 * row's UTC time-of-day equals its slot time (09:00-18:00).
 */
export function bookingInterval(row: { date: Date; time: string }): Interval {
    const utcMinutes = row.date.getUTCHours() * 60 + row.date.getUTCMinutes();
    if (utcMinutes === toMinutes(row.time)) {
        return slotInterval(row.date.toISOString().slice(0, 10), row.time, LEGACY_BOOKING_MINUTES);
    }
    const start = row.date.getTime();
    return { start, end: start + SLOT_MINUTES * MIN };
}

/** Slots on a Brisbane day that are in the future and clear of every busy interval. */
export function freeSlots(dateStr: string, busy: Interval[], now = Date.now()): string[] {
    if (!isValidDateStr(dateStr) || !isBookableDay(dateStr)) return [];
    return SLOTS.filter((time) => {
        const slot = slotInterval(dateStr, time);
        return slot.start > now && !busy.some((b) => overlaps(slot, b));
    });
}

/** Brisbane YYYY-MM-DD and HH:mm of an instant (epoch ms). */
export function brisbaneParts(ms: number): { date: string; time: string } {
    const iso = new Date(ms + 10 * 60 * MIN).toISOString();
    return { date: iso.slice(0, 10), time: iso.slice(11, 16) };
}
