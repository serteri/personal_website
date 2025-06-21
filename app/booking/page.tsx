



import BookingClient from './BookingClient';



export default async function BookingPage() {

    return (
        <main className="pt-40 ml-20 max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-4 text-white" >Book an Appointment</h1>
            {/* Calendar */}
            <BookingClient  />
            {/* Time slots (conditional) */}
            {/* Booking form (conditional) */}
        </main>
    );
}