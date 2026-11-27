'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Phone } from 'lucide-react'

const RATINGS = ['Great', 'Needs tweaking', 'Not for us'] as const

async function post(body: object): Promise<{ ok: boolean; message?: string }> {
    try {
        const res = await fetch('/api/demo-invite/followup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
        const data = await res.json().catch(() => ({}))
        return res.ok ? { ok: true } : { ok: false, message: data.message || 'Something went wrong. Please try again.' }
    } catch {
        return { ok: false, message: 'Network error. Please try again.' }
    }
}

// Shown after a demo call ends, or when the invite has no calls left.
export default function DemoFollowUp({ token, contactName, remaining, onCallAgain }: {
    token: string
    contactName: string | null
    remaining: number
    onCallAgain?: () => void
}) {
    const [phone, setPhone] = useState('')
    const [cb, setCb] = useState<'idle' | 'sending' | 'done'>('idle')
    const [cbError, setCbError] = useState('')
    const [rating, setRating] = useState<string | null>(null)
    const [ratingBusy, setRatingBusy] = useState(false)
    const [ratingError, setRatingError] = useState('')

    async function requestCallback(e: React.FormEvent) {
        e.preventDefault()
        setCb('sending')
        setCbError('')
        const r = await post({ kind: 'callback', token, phone })
        if (r.ok) setCb('done')
        else { setCb('idle'); setCbError(r.message ?? '') }
    }

    async function sendRating(value: (typeof RATINGS)[number]) {
        setRatingBusy(true)
        setRatingError('')
        const r = await post({ kind: 'feedback', token, rating: value })
        if (r.ok) setRating(value)
        else setRatingError(r.message ?? '')
        setRatingBusy(false)
    }

    return (
        <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50/60 p-5 text-left sm:p-6">
            <h4 className="text-lg font-semibold text-slate-900">
                {contactName ? `Thanks for trying it, ${contactName}!` : 'Thanks for trying it!'}
            </h4>
            <p className="mt-1 text-sm text-slate-600">
                That’s what your callers would hear — 24/7, on your number. Let’s set it up for your business.
            </p>

            <Link
                href="/booking"
                className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md sm:w-auto"
            >
                Book a 20-min Setup Call
            </Link>

            <div className="mt-5 border-t border-blue-200/70 pt-4">
                {cb === 'done' ? (
                    <p role="status" className="text-sm font-semibold text-emerald-700">Got it — we’ll call you shortly.</p>
                ) : (
                    <form onSubmit={requestCallback}>
                        <label htmlFor="cb-phone" className="text-sm font-semibold text-slate-800">Prefer a callback? Just add your number.</label>
                        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                            <input
                                id="cb-phone"
                                type="tel"
                                inputMode="tel"
                                autoComplete="tel"
                                required
                                minLength={6}
                                maxLength={30}
                                placeholder="04xx xxx xxx"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none sm:max-w-xs"
                            />
                            <button
                                type="submit"
                                disabled={cb === 'sending'}
                                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 hover:border-blue-500 hover:text-blue-600 disabled:opacity-60"
                            >
                                <Phone className="h-4 w-4" aria-hidden="true" />
                                {cb === 'sending' ? 'Sending…' : 'Request a Callback'}
                            </button>
                        </div>
                        {cbError && <p role="alert" className="mt-2 text-sm text-red-600">{cbError}</p>}
                    </form>
                )}
            </div>

            <div className="mt-5 border-t border-blue-200/70 pt-4">
                {rating ? (
                    <p role="status" className="text-sm font-semibold text-emerald-700">Thanks for the feedback ({rating}).</p>
                ) : (
                    <>
                        <p className="text-sm font-semibold text-slate-800">How did it sound?</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {RATINGS.map((r) => (
                                <button
                                    key={r}
                                    type="button"
                                    disabled={ratingBusy}
                                    onClick={() => sendRating(r)}
                                    className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:border-blue-500 hover:text-blue-600 disabled:opacity-60"
                                >
                                    {r}
                                </button>
                            ))}
                        </div>
                        {ratingError && <p role="alert" className="mt-2 text-sm text-red-600">{ratingError}</p>}
                    </>
                )}
            </div>

            {remaining > 0 && onCallAgain && (
                <button type="button" onClick={onCallAgain} className="mt-5 text-sm font-semibold text-blue-700 underline-offset-2 hover:underline">
                    Try another demo call ({remaining} left)
                </button>
            )}
        </div>
    )
}
