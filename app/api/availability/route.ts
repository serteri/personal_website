import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Public, read-only. Returns only the blocked time ranges: no reason/notes.
export async function GET() {
    const blocks = await prisma.availability.findMany({
        select: { start: true, end: true },
        orderBy: { start: 'asc' },
    });
    return NextResponse.json(blocks, { headers: { 'Cache-Control': 'no-store' } });
}

// Nothing in the app writes availability blocks, so write methods are closed.
const methodNotAllowed = () =>
    NextResponse.json({ message: 'Method Not Allowed' }, { status: 405, headers: { Allow: 'GET' } });

export const POST = methodNotAllowed;
export const PUT = methodNotAllowed;
export const PATCH = methodNotAllowed;
export const DELETE = methodNotAllowed;
