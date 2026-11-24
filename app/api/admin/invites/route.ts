import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { inviteLink, isAdmin, newInviteToken } from '@/lib/demoInvites';

export const dynamic = 'force-dynamic';

const bodySchema = z.object({
    businessName: z.string().trim().min(2).max(120),
    contactName: z.string().trim().max(100).optional().or(z.literal('')),
    email: z.string().trim().toLowerCase().email().max(254),
    phone: z.string().trim().max(30).optional().or(z.literal('')),
    notes: z.string().trim().max(500).optional().or(z.literal('')),
    maxCalls: z.coerce.number().int().min(1).max(20).default(3),
    expiresInDays: z.coerce.number().int().min(1).max(90).default(14),
});

export async function POST(req: Request) {
    if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    let body;
    try {
        body = bodySchema.parse(await req.json());
    } catch {
        return NextResponse.json({ error: 'Please check the form values.' }, { status: 400 });
    }

    const invite = await prisma.demoInvite.create({
        data: {
            token: newInviteToken(),
            businessName: body.businessName,
            contactName: body.contactName || null,
            email: body.email,
            phone: body.phone || null,
            notes: body.notes || null,
            source: 'outbound_email',
            maxCalls: body.maxCalls,
            expiresAt: new Date(Date.now() + body.expiresInDays * 24 * 60 * 60 * 1000),
        },
    });
    return NextResponse.json({ link: inviteLink(invite.token) });
}
