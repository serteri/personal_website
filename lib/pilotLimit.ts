import type { Client } from '@prisma/client';
import prisma from '@/lib/prisma';
import { escapeHtml, sendMail } from '@/lib/demoInvites';
import { siteUrl } from '@/lib/clientAuth';

type PilotFields = Pick<Client, 'plan' | 'minutesUsedCurrentPeriod' | 'monthlyMinuteLimit' | 'currentPeriodEnd'>;

// Only the pilot is hard-capped. STARTER / GROWTH keep answering and are billed for overage via meter events.
export function pilotExhausted(c: PilotFields, now = new Date()): boolean {
    return c.plan === 'PILOT' && (c.minutesUsedCurrentPeriod >= c.monthlyMinuteLimit || c.currentPeriodEnd.getTime() < now.getTime());
}

// Sends the "upgrade" email at most once per pilot (atomic flag), never throws.
export async function notifyPilotExhaustedOnce(client: Pick<Client, 'id' | 'email' | 'businessName'>) {
    try {
        const { count } = await prisma.client.updateMany({ where: { id: client.id, limitNotifiedAt: null }, data: { limitNotifiedAt: new Date() } });
        if (count !== 1) return;
        const sent = await sendMail({
            to: client.email,
            subject: 'Your AI Receptionist pilot has ended — upgrade to keep answering calls',
            html: `<p>Hi ${escapeHtml(client.businessName)},</p>
<p>Your 30-day pilot has used all of its included minutes (or reached its end date), so your AI receptionist has stopped answering calls for now.</p>
<p>To switch it back on, choose <strong>Starter</strong> or <strong>Growth</strong> from your dashboard:</p>
<p><a href="${siteUrl()}/dashboard">Go to your dashboard</a></p>
<p>— ALTIQDESIGN, Albion, Brisbane</p>`,
        });
        if (!sent) await prisma.client.update({ where: { id: client.id }, data: { limitNotifiedAt: null } }); // retry on next event
    } catch (error) {
        console.error('Pilot exhausted notification failed:', error);
    }
}
