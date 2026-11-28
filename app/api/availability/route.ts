import { NextResponse } from 'next/server';
import { getFreeSlots } from '@/lib/availability';
import { CLOSED_DAY_MESSAGE, TIMEZONE, isBookableDay, isValidDateStr, isWithinWindow } from '@/lib/slots';

// Public, read-only. GET /api/availability?date=YYYY-MM-DD -> free 20-minute slots (Brisbane time).
// Returns only slot strings: no booking details, reasons or calendar data.
export async function GET(req: Request) {
    const date = new URL(req.url).searchParams.get('date') ?? '';
    if (!isValidDateStr(date)) {
        return NextResponse.json({ message: 'date must be YYYY-MM-DD' }, { status: 400 });
    }
    try {
        // Closed Saturdays and Sundays: no slots, flagged so the UI can explain
        if (!isBookableDay(date)) {
            return NextResponse.json({ date, timezone: TIMEZONE, slots: [], closed: true, message: CLOSED_DAY_MESSAGE }, { headers: { 'Cache-Control': 'no-store' } });
        }
        const slots = isWithinWindow(date) ? await getFreeSlots(date) : [];
        return NextResponse.json({ date, timezone: TIMEZONE, slots }, { headers: { 'Cache-Control': 'no-store' } });
    } catch (error) {
        console.error('Availability error:', error);
        return NextResponse.json({ message: 'Could not load availability' }, { status: 500 });
    }
}

// Nothing in the app writes availability blocks, so write methods are closed.
const methodNotAllowed = () =>
    NextResponse.json({ message: 'Method Not Allowed' }, { status: 405, headers: { Allow: 'GET' } });

export const POST = methodNotAllowed;
export const PUT = methodNotAllowed;
export const PATCH = methodNotAllowed;
export const DELETE = methodNotAllowed;
