import { NextResponse } from 'next/server';
import { getSessionClient, siteUrl } from '@/lib/clientAuth';
import { getStripe } from '@/lib/stripe';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST() {
    const client = await getSessionClient();
    if (!client) return NextResponse.json({ error: 'Please log in again.' }, { status: 401 });
    try {
        const session = await getStripe().billingPortal.sessions.create({
            customer: client.stripeCustomerId,
            return_url: `${siteUrl()}/dashboard`,
        });
        return NextResponse.json({ url: session.url });
    } catch (error) {
        console.error('Billing portal error:', error);
        return NextResponse.json({ error: 'Could not open billing right now. Please try again.' }, { status: 502 });
    }
}
