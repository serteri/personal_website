import type { ClientPlan } from '@prisma/client';

export type PlanKey = 'pilot' | 'starter' | 'growth';

export const PLAN_ENUM: Record<PlanKey, ClientPlan> = {
    pilot: 'PILOT',
    starter: 'STARTER',
    growth: 'GROWTH',
};

export const MINUTE_LIMITS: Record<ClientPlan, number> = {
    PILOT: 100, // hard cap, see lib/pilotLimit.ts
    STARTER: 150,
    GROWTH: 400,
};

export const PILOT_DAYS = 30;

// Stripe price IDs per plan (env). Overage prices are metered (no quantity).
export function planPrices(plan: PlanKey): { mode: 'payment' | 'subscription'; prices: string[] } | null {
    const env = (k: string) => process.env[k]?.trim();
    const collect = (...keys: string[]) => {
        const vals = keys.map(env);
        return vals.every(Boolean) ? (vals as string[]) : null;
    };
    if (plan === 'pilot') {
        const p = collect('STRIPE_PRICE_PILOT');
        return p && { mode: 'payment', prices: p };
    }
    if (plan === 'starter') {
        const p = collect('STRIPE_PRICE_STARTER_BASE', 'STRIPE_PRICE_STARTER_OVERAGE');
        return p && { mode: 'subscription', prices: p };
    }
    const p = collect('STRIPE_PRICE_GROWTH_BASE', 'STRIPE_PRICE_GROWTH_OVERAGE');
    return p && { mode: 'subscription', prices: p };
}
