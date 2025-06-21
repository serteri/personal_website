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

// YENİ EKLENEN GET FONKSİYONU
export async function GET() {
    try {
        const bookings = await prisma.booking.findMany({
            orderBy: {
                date: 'asc',
            },
        });

        // BigInt ve Date tiplerini JSON uyumlu hale getiriyoruz
        const safeBookings = bookings.map(booking => ({
            ...booking,
            id: booking.id.toString(),
            createdAt: booking.createdAt.toISOString(),
            date: booking.date.toISOString(),
        }));

        return NextResponse.json(safeBookings);

    } catch (error) {
        console.error("Failed to fetch bookings:", error);
        return NextResponse.json({ message: "Failed to fetch bookings" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const validatedData = bookingSchema.parse(body);

        const { firstName, lastName, email, phone, date, time } = validatedData;

        // Gelen tarih ve saati birleştirip tam bir Date objesi oluşturuyoruz
        const bookingDateTime = new Date(date);
        const [hours, minutes] = time.split(':').map(Number);
        bookingDateTime.setUTCHours(hours, minutes, 0, 0); // Saat dilimi sorunlarını önlemek için UTC kullanmak daha güvenlidir

        // prisma.booking.create çağrısını güncelledik
        const newBooking = await prisma.booking.create({
            data: {
                firstName: firstName,
                lastName: lastName,
                email: email,
                phone: phone,         // YENİ: phone kaydediliyor
                date: bookingDateTime,
                time: time,           // YENİ: time kaydediliyor
            }
        });
// --- ÇÖZÜM BURADA ---
        // BigInt ve Date tiplerini JSON'un anlayacağı güvenli tiplere (string) çeviriyoruz.
        const safeBooking = {
            ...newBooking,
            id: newBooking.id.toString(), // BigInt'i string'e çevir
            createdAt: newBooking.createdAt.toISOString(), // Date'i string'e çevir
            date: newBooking.date.toISOString(), // Date'i string'e çevir
        };
        return NextResponse.json({ message: 'Booking successful!', booking: safeBooking }, { status: 201 });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: 'Invalid form data', errors: error.errors }, { status: 400 });
        }
        console.error("Booking API Error:", error);
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}