import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import prisma from '@/lib/prisma';
import { getStripe } from '@/lib/stripe';
import { MINUTE_LIMITS, PILOT_DAYS } from '@/lib/receptionistPlans';
import type { ClientPlan } from '@prisma/client';
import { Resend } from 'resend';

const escapeHtml = (v: string) =>
    v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Best-effort admin alert so the retellAgentId can be assigned right away. Never fails the webhook.
async function notifyNewClient(c: { email: string; businessName: string; phone: string | null; plan: ClientPlan }) {
    const apiKey = process.env.RESEND_API_KEY?.trim();
    if (!apiKey) return;
    try {
        const { error } = await new Resend(apiKey).emails.send({
            from: 'AI Receptionist <onboarding@resend.dev>',
            to: [process.env.ADMIN_NOTIFY_EMAIL?.trim() || 'serteri@hotmail.com'],
            subject: 'Yeni Müşteri Ödeme Yaptı — Retell Agent ID Ata',
            html: `<p>A new AI Receptionist customer just paid. Create their Retell agent and set <strong>retellAgentId</strong> on the Client row (Neon / Prisma Studio).</p>
<ul>
<li><strong>Business:</strong> ${escapeHtml(c.businessName)}</li>
<li><strong>Email:</strong> ${escapeHtml(c.email)}</li>
<li><strong>Phone:</strong> ${escapeHtml(c.phone ?? '-')}</li>
<li><strong>Plan:</strong> ${c.plan}</li>
</ul>`,
        });
        if (error) console.error('New-client notification failed:', error);
    } catch (error) {
        console.error('New-client notification failed:', error);
    }
}

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const customerId = (c: string | Stripe.Customer | Stripe.DeletedCustomer | null | undefined) =>
    typeof c === 'string' ? c : c?.id ?? null;

const toDate = (unixSeconds: number) => new Date(unixSeconds * 1000);

// In current Stripe API versions the billing period lives on the subscription items.
function subscriptionPeriod(sub: Stripe.Subscription): { start: Date; end: Date } | null {
    const item = sub.items.data[0];
    return item ? { start: toDate(item.current_period_start), end: toDate(item.current_period_end) } : null;
}

async function onCheckoutCompleted(session: Stripe.Checkout.Session) {
    if (session.payment_status === 'unpaid') return;
    const stripeCustomerId = customerId(session.customer);
    const email = session.customer_details?.email?.toLowerCase();
    const planKey = session.metadata?.plan;
    if (!stripeCustomerId || !email || !['pilot', 'starter', 'growth'].includes(planKey ?? '')) {
        console.error('Stripe checkout.session.completed: missing customer, email or plan', {
            sessionId: session.id,
            hasCustomer: Boolean(stripeCustomerId),
            hasEmail: Boolean(email),
            plan: planKey,
        });
        return;
    }
    const plan = planKey!.toUpperCase() as ClientPlan;

    let periodStart = new Date();
    let periodEnd = new Date(periodStart.getTime() + PILOT_DAYS * 24 * 60 * 60 * 1000);
    const subId = typeof session.subscription === 'string' ? session.subscription : session.subscription?.id;
    if (subId) {
        const period = subscriptionPeriod(await getStripe().subscriptions.retrieve(subId));
        if (period) {
            periodStart = period.start;
            periodEnd = period.end;
        }
    }

    const businessName =
        session.custom_fields?.find((f) => f.key === 'business_name')?.text?.value?.trim() ||
        session.customer_details?.name ||
        email;
    const phone = session.customer_details?.phone ?? null;

    const data = {
        businessName,
        phone,
        stripeCustomerId,
        plan,
        status: 'ACTIVE' as const,
        monthlyMinuteLimit: MINUTE_LIMITS[plan],
        minutesUsedCurrentPeriod: 0,
        limitNotifiedAt: null,
        currentPeriodStart: periodStart,
        currentPeriodEnd: periodEnd,
    };
    // Email is unique: a pilot customer who later subscribes (new Stripe customer) updates the same Client.
    await prisma.client.upsert({ where: { email }, create: { email, ...data }, update: data });
    await notifyNewClient({ email, businessName, phone, plan });
}

async function onInvoicePaid(invoice: Stripe.Invoice) {
    const stripeCustomerId = customerId(invoice.customer);
    const subRef = invoice.parent?.subscription_details?.subscription;
    const subId = typeof subRef === 'string' ? subRef : subRef?.id;
    if (!stripeCustomerId || !subId) return; // one-off (pilot) invoices don't reset anything

    const period = subscriptionPeriod(await getStripe().subscriptions.retrieve(subId));
    // updateMany: no-op (not an error) if checkout.session.completed hasn't created the Client yet;
    // that handler starts the period at 0 anyway.
    await prisma.client.updateMany({
        where: { stripeCustomerId },
        data: {
            minutesUsedCurrentPeriod: 0,
            limitNotifiedAt: null,
            status: 'ACTIVE',
            ...(period ? { currentPeriodStart: period.start, currentPeriodEnd: period.end } : {}),
        },
    });
}

export async function POST(req: Request) {
    const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
    const signature = req.headers.get('stripe-signature');
    if (!secret) {
        console.error('Stripe webhook misconfigured: STRIPE_WEBHOOK_SECRET missing');
        return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
    }
    if (!signature) return NextResponse.json({ error: 'Missing signature' }, { status: 400 });

    const rawBody = await req.text();
    let event: Stripe.Event;
    try {
        event = getStripe().webhooks.constructEvent(rawBody, signature, secret);
    } catch {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    try {
        switch (event.type) {
            case 'checkout.session.completed':
                await onCheckoutCompleted(event.data.object);
                break;
            case 'invoice.paid':
                await onInvoicePaid(event.data.object);
                break;
            case 'invoice.payment_failed': {
                const stripeCustomerId = customerId(event.data.object.customer);
                if (stripeCustomerId) {
                    await prisma.client.updateMany({ where: { stripeCustomerId }, data: { status: 'PAST_DUE' } });
                }
                break;
            }
            case 'customer.subscription.deleted': {
                const stripeCustomerId = customerId(event.data.object.customer);
                if (stripeCustomerId) {
                    await prisma.client.updateMany({ where: { stripeCustomerId }, data: { status: 'CANCELED' } });
                }
                break;
            }
        }
    } catch (error) {
        console.error('Stripe webhook handler error:', event.type, error);
        return NextResponse.json({ error: 'Handler failed' }, { status: 500 }); // Stripe will retry
    }
    return NextResponse.json({ received: true });
}
