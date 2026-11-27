



import BookingClient from './BookingClient';
import { isBookableDay, isValidDateStr, isValidSlot, isWithinWindow } from '@/lib/slots';

// Optional deep link from the website's AI receptionist: /booking?date=YYYY-MM-DD&time=HH:MM
function parseDeepLink(date?: string, time?: string) {
    if (!date || !time || !isValidDateStr(date) || !isValidSlot(time)) return {};
    if (!isWithinWindow(date) || !isBookableDay(date)) return {};
    return { initialDate: date, initialTime: time };
}

export default async function BookingPage({
    searchParams,
}: {
    searchParams: Promise<{ date?: string; time?: string }>;
}) {
    const { date, time } = await searchParams;
    const link = parseDeepLink(date, time);

    return (
        <main className="pt-40 ml-20 max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-4 text-ink" >Book an Appointment</h1>
            {/* Calendar */}
            <BookingClient {...link} />
            {/* Time slots (conditional) */}
            {/* Booking form (conditional) */}
        </main>
    );
}