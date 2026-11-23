import Stripe from 'stripe';

let client: Stripe | null = null;

// Lazy so a missing key doesn't break `next build`; throws only when actually used.
export function getStripe(): Stripe {
    const key = process.env.STRIPE_SECRET_KEY?.trim();
    if (!key) throw new Error('STRIPE_SECRET_KEY is not set');
    client ??= new Stripe(key);
    return client;
}
