import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getStripe } from '@/lib/stripe';
import { planPrices } from '@/lib/receptionistPlans';
import { createRateLimiter, clientIp } from '@/lib/rateLimit';

export const dynamic = 'force-dynamic';

const isLimited = createRateLimiter(10, 10 * 60 * 1000);
const bodySchema = z.object({ plan: z.enum(['pilot', 'starter', 'growth']) });

export async function POST(req: Request) {
    if (isLimited(clientIp(req))) {
        return NextResponse.json({ error: 'Too many requests. Please try again shortly.' }, { status: 429 });
    }

    let plan;
    try {
        plan = bodySchema.parse(await req.json()).plan;
    } catch {
        return NextResponse.json({ error: 'Invalid plan.' }, { status: 400 });
    }

    const config = planPrices(plan);
    if (!config) {
        console.error('Checkout misconfigured: missing Stripe price env vars for plan', plan);
        return NextResponse.json({ error: 'Checkout is not configured for this plan yet.' }, { status: 500 });
    }

    const origin = process.env.NEXT_PUBLIC_SITE_URL?.trim() || new URL(req.url).origin;
    try {
        const session = await getStripe().checkout.sessions.create({
            mode: config.mode,
            // Metered overage prices take no quantity; base/pilot prices are quantity 1
            line_items: config.prices.map((price, i) => (i === 0 ? { price, quantity: 1 } : { price })),
            // One-off payments only create a Customer when asked to; we key Clients on the customer id
            ...(config.mode === 'payment' ? { customer_creation: 'always' as const } : {}),
            phone_number_collection: { enabled: true },
            custom_fields: [
                {
                    key: 'business_name',
                    label: { type: 'custom', custom: 'Business name' },
                    type: 'text',
                    text: { minimum_length: 2, maximum_length: 100 },
                },
            ],
            metadata: { plan },
            ...(config.mode === 'subscription' ? { subscription_data: { metadata: { plan } } } : {}),
            success_url: `${origin}/ai-receptionist?checkout=success`,
            cancel_url: `${origin}/ai-receptionist?checkout=cancelled#pricing`,
        });
        if (!session.url) throw new Error('No session URL');
        return NextResponse.json({ url: session.url });
    } catch (error) {
        console.error('Stripe checkout error:', error);
        return NextResponse.json({ error: 'Could not start checkout. Please try again.' }, { status: 502 });
    }
}
