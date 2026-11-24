import { NextResponse } from 'next/server';
import { z } from 'zod';
import { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';
import { isAdmin } from '@/lib/demoInvites';

export const dynamic = 'force-dynamic';

const blankToNull = (max: number) =>
    z
        .string()
        .trim()
        .max(max)
        .transform((v) => (v === '' ? null : v));

const bodySchema = z.union([
    z.object({ action: z.literal('add_calls') }),
    z.object({ action: z.literal('expire') }),
    z
        .object({ notes: blankToNull(500).optional(), phone: blankToNull(30).optional() })
        .refine((v) => v.notes !== undefined || v.phone !== undefined),
]);

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Ctx) {
    if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { id } = await params;

    let body;
    try {
        body = bodySchema.parse(await req.json());
    } catch {
        return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
    }

    const data: Prisma.DemoInviteUpdateInput =
        'action' in body
            ? body.action === 'add_calls'
                ? { maxCalls: { increment: 3 } }
                : { expiresAt: new Date() }
            : { ...(body.notes !== undefined && { notes: body.notes }), ...(body.phone !== undefined && { phone: body.phone }) };

    try {
        const invite = await prisma.demoInvite.update({ where: { id }, data });
        return NextResponse.json({ ok: true, maxCalls: invite.maxCalls });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            return NextResponse.json({ error: 'Invite not found.' }, { status: 404 });
        }
        console.error('Invite update error:', error);
        return NextResponse.json({ error: 'Could not update the invite.' }, { status: 500 });
    }
}

export async function DELETE(_req: Request, { params }: Ctx) {
    if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { id } = await params;
    try {
        await prisma.demoInvite.delete({ where: { id } });
        return NextResponse.json({ ok: true });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            return NextResponse.json({ error: 'Invite not found.' }, { status: 404 });
        }
        console.error('Invite delete error:', error);
        return NextResponse.json({ error: 'Could not delete the invite.' }, { status: 500 });
    }
}
