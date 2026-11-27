import { ALERT_EMAIL, escapeHtml, sendMail } from '@/lib/demoInvites';
import { SLOT_MINUTES, TIMEZONE, brisbaneInstant } from '@/lib/slots';

export interface BookingEmailInput {
    date: string; // Brisbane YYYY-MM-DD
    time: string; // Brisbane HH:mm
    name: string;
    email: string;
    phone: string;
    notes?: string;
}

const oneLine = (v: string) => v.replace(/[\r\n]+/g, ' ').trim();

/** "Friday 28 November 2026 at 10:20 (Brisbane time)" */
export function formatBrisbane(date: string, time: string): string {
    const day = new Intl.DateTimeFormat('en-AU', { timeZone: TIMEZONE, weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(
        brisbaneInstant(date, time)
    );
    return `${day} at ${time} (Brisbane time)`;
}

/** Notification to the owner + confirmation to the visitor. Never throws; failures are logged by sendMail. */
export async function sendBookingEmails(b: BookingEmailInput): Promise<void> {
    const when = formatBrisbane(b.date, b.time);
    const owner = process.env.NOTIFY_EMAIL?.trim() || process.env.GOOGLE_CALENDAR_ID?.trim() || ALERT_EMAIL;

    const rows = [
        ['When', when],
        ['Duration', `${SLOT_MINUTES} minutes`],
        ['Name', b.name],
        ['Email', b.email],
        ['Phone', b.phone],
        ...(b.notes ? [['Notes', b.notes]] : []),
    ];
    const table = rows.map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#64748b">${k}</td><td style="padding:4px 0"><strong>${escapeHtml(v)}</strong></td></tr>`).join('');

    await Promise.all([
        sendMail({
            to: owner,
            subject: oneLine(`New booking: ${b.name} — ${b.date} ${b.time}`),
            replyTo: b.email,
            html: `<p>New booking received.</p><table>${table}</table>`,
        }),
        sendMail({
            to: b.email,
            subject: `Your appointment is booked — ${b.date} ${b.time}`,
            html: `<p>Hi ${escapeHtml(b.name.split(' ')[0])},</p><p>Your appointment is confirmed for <strong>${escapeHtml(when)}</strong> (${SLOT_MINUTES} minutes).</p><p>If you need to change it, just reply to this email.</p><p>— ALTIQDESIGN</p>`,
        }),
    ]);
}
