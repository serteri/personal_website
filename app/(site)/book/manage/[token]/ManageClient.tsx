'use client'

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import TimeSlots from '@/components/TimeSlots';
import { MAX_DAYS_AHEAD, brisbaneToday } from '@/lib/slots';

interface View {
    date: string; // Brisbane YYYY-MM-DD
    time: string; // Brisbane HH:mm
    durationMinutes: number;
    name: string;
    status: 'CONFIRMED' | 'CANCELLED';
    canModify: boolean;
}

type Mode = 'view' | 'reschedule' | 'cancel';

const longDate = (date: string) =>
    new Date(`${date}T00:00:00Z`).toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

const btnPrimary = 'rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-zinc-400';
const btnGhost = 'rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-ink hover:border-cobalt hover:text-cobalt disabled:cursor-not-allowed disabled:opacity-50';

export default function ManageClient({ token }: { token: string }) {
    const api = `/api/booking/manage/${token}`;
    const [view, setView] = useState<View | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [mode, setMode] = useState<Mode>('view');
    const [busy, setBusy] = useState(false);
    const [message, setMessage] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);

    // Reschedule state
    const [newDate, setNewDate] = useState('');
    const [slots, setSlots] = useState<string[]>([]);
    const [slotsLoading, setSlotsLoading] = useState(false);
    const [slotsError, setSlotsError] = useState(false);
    const [newTime, setNewTime] = useState<string | null>(null);

    const load = useCallback(async () => {
        try {
            const res = await fetch(api, { cache: 'no-store' });
            if (res.status === 404) return setNotFound(true);
            if (!res.ok) throw new Error(String(res.status));
            setView(await res.json());
        } catch {
            setMessage({ kind: 'error', text: 'Could not load your appointment. Please refresh and try again.' });
        } finally {
            setLoading(false);
        }
    }, [api]);

    useEffect(() => { void load(); }, [load]);

    // Live slots for the chosen day
    useEffect(() => {
        if (mode !== 'reschedule' || !newDate) return;
        let cancelled = false;
        setSlotsLoading(true);
        setSlotsError(false);
        setNewTime(null);
        fetch(`/api/availability?date=${newDate}`, { cache: 'no-store' })
            .then(r => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
            .then((d: { slots: string[] }) => !cancelled && setSlots(d.slots))
            .catch(() => { if (!cancelled) { setSlots([]); setSlotsError(true); } })
            .finally(() => { if (!cancelled) setSlotsLoading(false); });
        return () => { cancelled = true; };
    }, [mode, newDate]);

    async function send(method: 'DELETE' | 'PATCH', body?: object) {
        setBusy(true);
        setMessage(null);
        try {
            const res = await fetch(api, {
                method,
                headers: body ? { 'Content-Type': 'application/json' } : undefined,
                body: body ? JSON.stringify(body) : undefined,
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                setMessage({ kind: 'error', text: data.message || 'Something went wrong. Please try again.' });
                if (res.status === 409) setNewTime(null); // slot was just taken: choose another
                return;
            }
            setMessage({ kind: 'ok', text: data.message });
            setMode('view');
            setNewDate('');
            await load();
        } catch {
            setMessage({ kind: 'error', text: 'Network error. Please try again.' });
        } finally {
            setBusy(false);
        }
    }

    if (loading) return <p className="text-ink" role="status">Loading your appointment…</p>;

    if (notFound || !view) {
        return (
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
                <p className="font-semibold text-ink">{notFound ? 'We couldn’t find that appointment.' : 'Something went wrong.'}</p>
                {message && <p role="alert" className="mt-2 text-sm text-red-600">{message.text}</p>}
                <p className="mt-2 text-sm text-slate-600">Check the link in your confirmation email, or book a new time.</p>
                <Link href="/booking" className={`${btnPrimary} mt-4 inline-block`}>Book an appointment</Link>
            </div>
        );
    }

    const cancelled = view.status === 'CANCELLED';

    return (
        <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
                <p className="text-sm text-slate-500">
                    {cancelled ? 'Cancelled appointment' : 'Your appointment'} · {view.name}
                </p>
                <p className={`mt-1 text-lg font-bold ${cancelled ? 'text-slate-400 line-through' : 'text-cobalt'}`}>
                    {longDate(view.date)} at {view.time}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                    {view.durationMinutes} minutes · Brisbane time (AEST) ·{' '}
                    <span className={`font-semibold ${cancelled ? 'text-red-600' : 'text-emerald-600'}`}>{cancelled ? 'Cancelled' : 'Confirmed'}</span>
                </p>
            </div>

            {message && (
                <p role={message.kind === 'error' ? 'alert' : 'status'} className={`font-semibold ${message.kind === 'ok' ? 'text-green-600' : 'text-red-600'}`}>
                    {message.text}
                </p>
            )}

            {cancelled ? (
                <div className="rounded-2xl bg-slate-50 p-6">
                    <p className="text-ink">This appointment has been cancelled. A confirmation email is on its way.</p>
                    <Link href="/booking" className={`${btnPrimary} mt-4 inline-block`}>Book a new appointment</Link>
                </div>
            ) : (
                <>
                    {!view.canModify && (
                        <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800" role="note">
                            Changes aren’t available within 2 hours of the appointment. Please contact us directly if you need to change it.
                        </p>
                    )}

                    {mode === 'view' && (
                        <div className="flex flex-wrap gap-3">
                            <button className={btnPrimary} disabled={!view.canModify} onClick={() => { setMessage(null); setMode('reschedule'); }}>
                                Reschedule
                            </button>
                            <button className={btnGhost} disabled={!view.canModify} onClick={() => { setMessage(null); setMode('cancel'); }}>
                                Cancel appointment
                            </button>
                        </div>
                    )}

                    {mode === 'cancel' && (
                        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
                            <p className="font-semibold text-ink">Cancel this appointment?</p>
                            <p className="mt-1 text-sm text-slate-700">{longDate(view.date)} at {view.time}. This can’t be undone, but you can book again any time.</p>
                            <div className="mt-4 flex flex-wrap gap-3">
                                <button className="rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60" disabled={busy} onClick={() => send('DELETE')}>
                                    {busy ? 'Cancelling…' : 'Yes, cancel it'}
                                </button>
                                <button className={btnGhost} disabled={busy} onClick={() => setMode('view')}>Keep my appointment</button>
                            </div>
                        </div>
                    )}

                    {mode === 'reschedule' && (
                        <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
                            <label className="block text-sm font-semibold text-ink">
                                Pick a new day
                                <input
                                    type="date"
                                    value={newDate}
                                    min={brisbaneToday()}
                                    max={brisbaneToday(Date.now() + MAX_DAYS_AHEAD * 24 * 3_600_000)}
                                    onChange={e => setNewDate(e.target.value)}
                                    className="mt-1 block w-full rounded-xl border border-line bg-white p-3 text-ink focus:border-cobalt focus:outline-none sm:w-auto"
                                />
                            </label>

                            {newDate && (
                                <TimeSlots date={new Date(`${newDate}T00:00:00`)} slots={slots} loading={slotsLoading} error={slotsError} onSelect={setNewTime} />
                            )}

                            {newTime && newDate && (
                                <p className="text-sm text-ink">
                                    New time: <strong>{longDate(newDate)} at {newTime}</strong>
                                </p>
                            )}

                            <div className="flex flex-wrap gap-3">
                                <button className={btnPrimary} disabled={busy || !newDate || !newTime} onClick={() => send('PATCH', { date: newDate, time: newTime })}>
                                    {busy ? 'Rescheduling…' : 'Confirm new time'}
                                </button>
                                <button className={btnGhost} disabled={busy} onClick={() => { setMode('view'); setNewDate(''); }}>Back</button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
