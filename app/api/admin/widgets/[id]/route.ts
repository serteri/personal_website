import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';
import { isAdmin } from '@/lib/demoInvites';
import { widgetSchema } from '@/lib/widgetSchema';

export const dynamic = 'force-dynamic';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { id } = await params;
    const parsed = widgetSchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message || 'Invalid widget data.' }, { status: 400 });
    try {
        await prisma.chatWidget.update({ where: { id }, data: parsed.data });
        return NextResponse.json({ ok: true });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') return NextResponse.json({ error: 'That slug is already in use.' }, { status: 409 });
            if (error.code === 'P2025') return NextResponse.json({ error: 'Widget not found.' }, { status: 404 });
        }
        console.error('Widget update error:', error);
        return NextResponse.json({ error: 'Could not update the widget.' }, { status: 500 });
    }
}
