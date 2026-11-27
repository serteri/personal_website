import { ALERT_EMAIL, escapeHtml, sendMail } from '@/lib/demoInvites';
import { siteUrl } from '@/lib/clientAuth';
import { SLOT_MINUTES, TIMEZONE, brisbaneInstant } from '@/lib/slots';

export interface BookingEmailInput {
    date: string; // Brisbane YYYY-MM-DD
    time: string; // Brisbane HH:mm
    name: string;
    email: string;
    phone: string;
    notes?: string;
    manageUrl?: string;
}

const oneLine = (v: string) => v.replace(/[\r\n]+/g, ' ').trim();

export const manageUrlFor = (token: string) => `${siteUrl()}/book/manage/${token}`;

/** Where owner notifications go, and the reply-to on visitor emails. */
export const ownerEmail = () => process.env.NOTIFY_EMAIL?.trim() || process.env.GOOGLE_CALENDAR_ID?.trim() || ALERT_EMAIL;

/** "Friday 28 November 2026 at 10:20 (Brisbane time)" */
export function formatBrisbane(date: string, time: string): string {
    const day = new Intl.DateTimeFormat('en-AU', { timeZone: TIMEZONE, weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(
        brisbaneInstant(date, time)
    );
    return `${day} at ${time} (Brisbane time)`;
}

const table = (rows: string[][]) =>
    `<table>${rows
        .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#64748b">${k}</td><td style="padding:4px 0"><strong>${escapeHtml(v)}</strong></td></tr>`)
        .join('')}</table>`;

const manageBlock = (url?: string) =>
    url ? `<p><a href="${escapeHtml(url)}" style="display:inline-block;padding:10px 18px;background:#0f172a;color:#fff;border-radius:999px;text-decoration:none">Cancel or reschedule your appointment</a></p>` : '';

const firstName = (name: string) => escapeHtml(name.split(' ')[0]);

/** Notification to the owner + confirmation (with manage link) to the visitor. Never throws; failures are logged by sendMail. */
export async function sendBookingEmails(b: BookingEmailInput): Promise<void> {
    const when = formatBrisbane(b.date, b.time);
    const rows = [
        ['When', when],
        ['Duration', `${SLOT_MINUTES} minutes`],
        ['Name', b.name],
        ['Email', b.email],
        ['Phone', b.phone],
        ...(b.notes ? [['Notes', b.notes]] : []),
    ];
    await Promise.all([
        sendMail({ to: ownerEmail(), subject: oneLine(`New booking: ${b.name} — ${b.date} ${b.time}`), replyTo: b.email, html: `<p>New booking received.</p>${table(rows)}` }),
        sendMail({
            to: b.email,
            subject: `Your appointment is booked — ${b.date} ${b.time}`,
            replyTo: ownerEmail(),
            html: `<p>Hi ${firstName(b.name)},</p><p>Your appointment is confirmed for <strong>${escapeHtml(when)}</strong> (${SLOT_MINUTES} minutes).</p>${manageBlock(b.manageUrl)}<p>— ALTIQDESIGN</p>`,
        }),
    ]);
}

export async function sendCancellationEmails(b: BookingEmailInput): Promise<void> {
    const when = formatBrisbane(b.date, b.time);
    await Promise.all([
        sendMail({
            to: ownerEmail(),
            subject: oneLine(`Booking cancelled: ${b.name} — ${b.date} ${b.time}`),
            replyTo: b.email,
            html: `<p>A booking was cancelled by the visitor.</p>${table([['Was', when], ['Name', b.name], ['Email', b.email], ['Phone', b.phone]])}`,
        }),
        sendMail({
            to: b.email,
            subject: `Your appointment was cancelled — ${b.date} ${b.time}`,
            replyTo: ownerEmail(),
            html: `<p>Hi ${firstName(b.name)},</p><p>Your appointment on <strong>${escapeHtml(when)}</strong> has been cancelled.</p><p>You can book a new time any time at <a href="${escapeHtml(siteUrl())}/booking">${escapeHtml(siteUrl())}/booking</a>.</p><p>— ALTIQDESIGN</p>`,
        }),
    ]);
}

export async function sendRescheduledEmails(b: BookingEmailInput & { oldDate: string; oldTime: string }): Promise<void> {
    const was = formatBrisbane(b.oldDate, b.oldTime);
    const now = formatBrisbane(b.date, b.time);
    await Promise.all([
        sendMail({
            to: ownerEmail(),
            subject: oneLine(`Booking rescheduled: ${b.name} — now ${b.date} ${b.time}`),
            replyTo: b.email,
            html: `<p>A booking was rescheduled by the visitor.</p>${table([['Was', was], ['Now', now], ['Name', b.name], ['Email', b.email], ['Phone', b.phone]])}`,
        }),
        sendMail({
            to: b.email,
            subject: `Your appointment was rescheduled — ${b.date} ${b.time}`,
            replyTo: ownerEmail(),
            html: `<p>Hi ${firstName(b.name)},</p><p>Your appointment has been moved.</p>${table([['Was', was], ['Now', now]])}${manageBlock(b.manageUrl)}<p>— ALTIQDESIGN</p>`,
        }),
    ]);
}
