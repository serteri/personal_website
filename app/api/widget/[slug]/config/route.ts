import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, OPTIONS' };

export async function OPTIONS() {
    return new NextResponse(null, { status: 204, headers: CORS });
}

// Public: lets widget.js decide whether to show the launcher and in which colour. No private config is exposed.
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const w = await prisma.chatWidget.findUnique({ where: { slug }, select: { isActive: true, primaryColor: true, assistantName: true } });
    if (!w || !w.isActive) return NextResponse.json({ active: false }, { headers: CORS });
    return NextResponse.json({ active: true, color: w.primaryColor, name: w.assistantName }, { headers: { ...CORS, 'Cache-Control': 'public, max-age=60' } });
}
