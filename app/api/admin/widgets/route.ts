import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';
import { isAdmin } from '@/lib/demoInvites';
import { widgetSchema } from '@/lib/widgetSchema';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const parsed = widgetSchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message || 'Invalid widget data.' }, { status: 400 });
    try {
        const widget = await prisma.chatWidget.create({ data: parsed.data });
        return NextResponse.json({ id: widget.id });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            return NextResponse.json({ error: 'That slug is already in use.' }, { status: 409 });
        }
        console.error('Widget create error:', error);
        return NextResponse.json({ error: 'Could not create the widget.' }, { status: 500 });
    }
}
