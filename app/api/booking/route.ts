import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';


// Formdan gelecek veriler için bir Zod şeması oluşturuyoruz (sunucu tarafı doğrulama)
const bookingSchema = z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(1),
    date: z.string().datetime(), // Gelen tarih ISO formatında olacak
    time: z.string(),
});


export async function POST(req: Request) {
    try {
        const body = await req.json();
        const validatedData = bookingSchema.parse(body);

        const { firstName, lastName, email, phone, date, time } = validatedData;

        // Gelen tarih ve saati birleştirip tam bir Date objesi oluşturuyoruz
        const bookingDateTime = new Date(date);
        const [hours, minutes] = time.split(':').map(Number);
        bookingDateTime.setHours(hours, minutes);

        // Veritabanına yeni rezervasyonu kaydediyoruz
        const newBooking = await prisma.booking.create({
            data: {
                firstName: firstName,
                lastName: lastName,
                email: email,
                date: bookingDateTime, // Veritabanına tam tarih olarak kaydediyoruz
            }
        });

        return NextResponse.json({ message: 'Booking successful!', booking: newBooking }, { status: 201 });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: 'Invalid form data', errors: error.errors }, { status: 400 });
        }
        console.error("Booking API Error:", error);
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}