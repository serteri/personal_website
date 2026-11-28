import type { Metadata } from 'next';
import BookingClient from './BookingClient';
import { isBookableDay, isValidDateStr, isValidSlot, isWithinWindow } from '@/lib/slots';

export const metadata: Metadata = {
    title: 'Book a Call',
    description: 'Book a free 20-minute call with Altiq Design to talk software, web design or AI voice receptionists for your Brisbane business.',
    alternates: { canonical: '/booking' },
};


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
        <main className="min-h-screen bg-slate-50 px-4 pb-20 pt-10 sm:pt-14">
            <div className="mx-auto max-w-4xl">
                <h1 className="mb-6 text-center text-3xl font-bold tracking-tight text-slate-900">Book a call with Altiq Design</h1>
                <BookingClient {...link} />
            </div>
        </main>
    );
}
