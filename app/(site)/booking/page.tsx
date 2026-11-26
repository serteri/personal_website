



import BookingClient from './BookingClient';



const ALLOWED_SLOTS = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

// Optional deep link from the website's AI receptionist: /booking?date=YYYY-MM-DD&time=HH:MM
function parseDeepLink(date?: string, time?: string) {
    if (!date || !time || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !ALLOWED_SLOTS.includes(time)) return {};
    const d = new Date(`${date}T00:00:00Z`);
    if (Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== date) return {};
    if (d.getTime() < Date.now() - 48 * 60 * 60 * 1000) return {}; // not in the past
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