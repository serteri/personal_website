



import BookingClient from './BookingClient';
import prisma from '@/lib/prisma';
import { Booking } from "@prisma/client";


export default async function BookingPage() {

    const raw = await prisma.booking.findMany();
    const events = raw.map( (b:Booking) => ({
        title: `${b.firstName} ${b.lastName}`,
        start: b.date.toISOString(),
    }));


    return (
        <main className="pt-40 ml-20 max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-4 text-white" >Book an Appointment</h1>
            {/* Calendar */}
            <BookingClient initialEvents={events}  />
            {/* Time slots (conditional) */}
            {/* Booking form (conditional) */}
        </main>
    );
}