import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { getDbBusy, getGoogleBusy } from '@/lib/availability';
import { createCalendarEvent, deleteCalendarEvent, updateCalendarEvent } from '@/lib/googleCalendar';
import { manageUrlFor, sendCancellationEmails, sendRescheduledEmails } from '@/lib/bookingEmail';
import { CUTOFF_MESSAGE, TOKEN_RE, canModify, publicView } from '@/lib/manage';
import {
    CLOSED_DAY_MESSAGE, SLOT_MINUTES, bookingInterval, brisbaneInstant, brisbaneParts, isBookableDay, isValidDateStr, isValidSlot, isWithinWindow, overlaps, slotInterval,
} from '@/lib/slots';

const NO_STORE = { 'Cache-Control': 'no-store' };
const json = (body: unknown, status = 200) => NextResponse.json(body, { status, headers: NO_STORE });
const notFound = () => json({ message: 'Booking not found.' }, 404);

type Ctx = { params: Promise<{ token: string }> };

async function findBooking(ctx: Ctx) {
    const { token } = await ctx.params;
    if (!TOKEN_RE.test(token)) return null;
    return prisma.booking.findUnique({ where: { manageToken: token } });
}

export async function GET(_req: Request, ctx: Ctx) {
    const booking = await findBooking(ctx);
    if (!booking) return notFound();
    return json(publicView(booking));
}

// Cancel
export async function DELETE(_req: Request, ctx: Ctx) {
    try {
        const booking = await findBooking(ctx);
        if (!booking) return notFound();
        if (booking.status !== 'CONFIRMED') return json({ message: 'This appointment is already cancelled.' }, 400);
        if (!canModify(booking)) return json({ message: CUTOFF_MESSAGE }, 400);

        // Conditional update so two concurrent cancels can't both proceed.
        const { count } = await prisma.booking.updateMany({
            where: { id: booking.id, status: 'CONFIRMED' },
            data: { status: 'CANCELLED', cancelledAt: new Date() },
        });
        if (count === 0) return json({ message: 'This appointment is already cancelled.' }, 400);

        // Outside any transaction: calendar + emails are best-effort.
        const { date, time } = brisbaneParts(bookingInterval(booking).start);
        const results = await Promise.allSettled([
            booking.googleEventId ? deleteCalendarEvent(booking.googleEventId) : Promise.resolve(true),
            sendCancellationEmails({ date, time, name: `${booking.firstName} ${booking.lastName}`, email: booking.email, phone: booking.phone }),
        ]);
        results.forEach(r => r.status === 'rejected' && console.error('Post-cancel step failed:', r.reason));

        return json({ message: 'Your appointment has been cancelled.' });
    } catch (error) {
        console.error('Cancel booking error:', error);
        return json({ message: 'An unexpected error occurred' }, 500);
    }
}

const rescheduleSchema = z.object({
    date: z.string().refine(isValidDateStr, 'Invalid date'),
    time: z.string().refine(isValidSlot, 'Invalid time slot'),
});

// Reschedule
export async function PATCH(req: Request, ctx: Ctx) {
    try {
        const booking = await findBooking(ctx);
        if (!booking) return notFound();
        if (booking.status !== 'CONFIRMED') return json({ message: 'This appointment is cancelled and can no longer be changed.' }, 400);
        if (!canModify(booking)) return json({ message: CUTOFF_MESSAGE }, 400);

        const parsed = rescheduleSchema.safeParse(await req.json().catch(() => null));
        if (!parsed.success) return json({ message: 'Invalid date or time.' }, 400);
        const { date, time } = parsed.data;

        if (!isBookableDay(date)) return json({ message: CLOSED_DAY_MESSAGE }, 400);
        if (!isWithinWindow(date)) return json({ message: 'Please choose an available day.' }, 400);
        const slot = slotInterval(date, time);
        if (slot.start <= Date.now()) return json({ message: 'Please choose a future date and time.' }, 400);

        const old = brisbaneParts(bookingInterval(booking).start);
        if (old.date === date && old.time === time) return json({ message: 'That is already your appointment time. Please choose a different time.' }, 400);

        const clash = () => json({ message: 'That time slot is no longer available.' }, 409);

        // Fresh Google check (not cached) before the transaction.
        const googleBusy = await getGoogleBusy(date, true);
        if (googleBusy.some(b => overlaps(slot, b))) return clash();

        // Database work only inside the transaction.
        const moved = await prisma.$transaction(async (tx) => {
            const current = await tx.booking.findUnique({ where: { id: booking.id }, select: { status: true } });
            if (current?.status !== 'CONFIRMED') return 'cancelled' as const;
            const busy = await getDbBusy(date, tx, booking.id);
            if (busy.some(b => overlaps(slot, b))) return 'clash' as const;
            await tx.booking.update({ where: { id: booking.id }, data: { date: brisbaneInstant(date, time), time } });
            return 'ok' as const;
        }, { isolationLevel: 'Serializable', maxWait: 10_000, timeout: 15_000 });

        if (moved === 'cancelled') return json({ message: 'This appointment is cancelled and can no longer be changed.' }, 400);
        if (moved === 'clash') return clash();

        // Outside the transaction: move (or recreate) the calendar event, then email.
        const name = `${booking.firstName} ${booking.lastName}`;
        const manageUrl = booking.manageToken ? manageUrlFor(booking.manageToken) : undefined;
        const results = await Promise.allSettled([
            (async () => {
                let result: 'updated' | 'missing' | 'skipped' = 'missing';
                if (booking.googleEventId) result = await updateCalendarEvent(booking.googleEventId, { date, time, durationMinutes: SLOT_MINUTES });
                if (result === 'missing') {
                    const googleEventId = await createCalendarEvent({ date, time, durationMinutes: SLOT_MINUTES, name, email: booking.email, phone: booking.phone });
                    if (googleEventId) await prisma.booking.update({ where: { id: booking.id }, data: { googleEventId } });
                }
            })(),
            sendRescheduledEmails({ date, time, oldDate: old.date, oldTime: old.time, name, email: booking.email, phone: booking.phone, manageUrl }),
        ]);
        results.forEach(r => r.status === 'rejected' && console.error('Post-reschedule step failed:', r.reason));

        return json({ message: 'Your appointment has been rescheduled.', date, time });
    } catch (error) {
        if (typeof error === 'object' && error !== null && (error as { code?: string }).code === 'P2034') {
            return json({ message: 'That time slot is no longer available.' }, 409);
        }
        console.error('Reschedule booking error:', error);
        return json({ message: 'An unexpected error occurred' }, 500);
    }
}
