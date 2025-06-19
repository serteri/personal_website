import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET() {
    const bookings = await prisma.booking.findMany();
    return NextResponse.json(bookings);
}

export async function POST(request: Request) {
    const data = await request.json();
    const booking = await prisma.booking.create({
        data: {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
            date: new Date(data.date),  // e.g. "2025-05-10"
            time: data.time            // e.g. "14:00"
        }
    });
    return NextResponse.json(booking, { status: 201 });
}