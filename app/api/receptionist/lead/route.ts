import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';
import { createRateLimiter, clientIp } from '@/lib/rateLimit';

const isLimited = createRateLimiter(5, 60 * 60 * 1000); // 5 / hour / IP

const BUSINESS_TYPES = ['Clinic', 'Tradie', 'NDIS', 'SaaS', 'Other'] as const;

const leadSchema = z.object({
    name: z.string().trim().min(2).max(80),
    email: z.string().trim().toLowerCase().email().max(254),
    businessType: z.enum(BUSINESS_TYPES),
    website: z.string().max(200).optional(), // honeypot
});

const escapeHtml = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export async function POST(req: Request) {
    if (isLimited(clientIp(req))) {
        return NextResponse.json({ message: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    try {
        const body = await req.json();

        // Honeypot: pretend success, send nothing.
        if (typeof body?.website === 'string' && body.website.trim() !== '') {
            return NextResponse.json({ message: 'Request received.' });
        }

        const { name, email, businessType } = leadSchema.parse(body);

        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ message: 'Requests are temporarily unavailable.' }, { status: 503 });
        }
        const resend = new Resend(apiKey);
        const { error } = await resend.emails.send({
            from: 'Contact Form <onboarding@resend.dev>',
            to: ['serteri@hotmail.com'],
            subject: `Voice demo access request: ${businessType}`,
            html: `<p>New voice demo access request:</p>
<ul>
<li><strong>Name:</strong> ${escapeHtml(name)}</li>
<li><strong>Email:</strong> ${escapeHtml(email)}</li>
<li><strong>Business type:</strong> ${escapeHtml(businessType)}</li>
</ul>`,
        });
        if (error) {
            console.error('Lead email error:', error);
            return NextResponse.json({ message: 'Could not send your request.' }, { status: 502 });
        }
        return NextResponse.json({ message: 'Request received.' });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: 'Invalid form data' }, { status: 400 });
        }
        console.error('Lead API error:', error);
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}
