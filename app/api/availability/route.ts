import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET() {
    const blocks = await prisma.availability.findMany();
    return NextResponse.json(blocks);
}

export async function POST(request: Request) {
    const data = await request.json();
    const block = await prisma.availability.create({
        data: {
            start: new Date(data.start),  // e.g. "2025-05-10T14:00"
            end: new Date(data.end),      // e.g. "2025-05-10T15:00"
            reason: data.reason || null
        }
    });
    return NextResponse.json(block, { status: 201 });
}