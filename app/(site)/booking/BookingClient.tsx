'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Check, Clock, Globe } from 'lucide-react'
import DatePicker, { monthOf, type MonthView } from '@/components/DatePicker'
import SlotList, { SlotSkeleton } from '@/components/SlotList'
import BookingForm from '@/components/BookingForm'
import { MAX_DAYS_AHEAD, SLOT_MINUTES, TIMEZONE, brisbaneToday, isBookableDay, isWithinWindow } from '@/lib/slots'

const longDate = (d: string) =>
    new Date(`${d}T00:00:00Z`).toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' })

const addDays = (d: string, n: number) => new Date(Date.parse(`${d}T00:00:00Z`) + n * 86_400_000).toISOString().slice(0, 10)

const selectable = (d: string) => isWithinWindow(d) && isBookableDay(d) // today..+90 days, closed Sundays

// Free slots for a Brisbane day from the server (Google Calendar + bookings + blocks). null = request failed.
async function loadSlots(date: string): Promise<string[] | null> {
    try {
        const res = await fetch(`/api/availability?date=${date}`, { cache: 'no-store' })
        if (!res.ok) return null
        return ((await res.json()) as { slots: string[] }).slots
    } catch {
        return null
    }
}

export default function BookingClient({ initialDate, initialTime }: { initialDate?: string; initialTime?: string }) {
    const [today] = useState(() => brisbaneToday())
    const minMonth = monthOf(today)
    const maxMonth = monthOf(addDays(today, MAX_DAYS_AHEAD))

    const [month, setMonth] = useState<MonthView>(monthOf(initialDate ?? today))
    const [selectedDate, setSelectedDate] = useState<string | null>(null)
    const [slots, setSlots] = useState<string[]>([])
    const [loading, setLoading] = useState(true) // true until the first day is chosen
    const [slotsError, setSlotsError] = useState(false)
    const [time, setTime] = useState<string | null>(null)
    const [notice, setNotice] = useState('')
    const [confirmed, setConfirmed] = useState<{ date: string; time: string; email: string } | null>(null)
    const seq = useRef(0) // ignore out-of-order responses

    const showDay = useCallback(async (date: string, keepTime?: string) => {
        const id = ++seq.current
        setSelectedDate(date)
        setTime(null)
        setLoading(true)
        setSlotsError(false)
        const result = await loadSlots(date)
        if (id !== seq.current) return
        setSlots(result ?? [])
        setSlotsError(result === null)
        if (result && keepTime && result.includes(keepTime)) setTime(keepTime)
        setLoading(false)
    }, [])

    // First load: deep link day, otherwise the next bookable day that actually has free times
    useEffect(() => {
        let cancelled = false
        ;(async () => {
            if (initialDate && selectable(initialDate)) {
                await showDay(initialDate, initialTime)
                return
            }
            let firstBookable: string | null = null
            for (let i = 0; i < 21; i++) {
                const d = addDays(today, i)
                if (!selectable(d)) continue
                firstBookable ??= d
                const result = await loadSlots(d)
                if (cancelled) return
                if (result && result.length > 0) {
                    setMonth(monthOf(d))
                    await showDay(d)
                    return
                }
            }
            if (!cancelled && firstBookable) await showDay(firstBookable)
        })()
        return () => { cancelled = true }
    }, [initialDate, initialTime, today, showDay])

    const pickDate = (d: string) => {
        setNotice('')
        void showDay(d)
    }

    // Booked by someone else while the form was open: back to the refreshed list
    const onConflict = () => {
        if (!selectedDate) return
        setNotice('That time was just taken. Please choose another.')
        void showDay(selectedDate)
    }

    if (confirmed) {
        return (
            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm sm:px-10">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <Check className="h-7 w-7" aria-hidden="true" />
                </span>
                <h2 className="mt-5 text-2xl font-bold text-slate-900">You’re booked!</h2>
                <p className="mt-3 text-lg font-semibold text-cobalt">{longDate(confirmed.date)} at {confirmed.time}</p>
                <p className="mt-1 text-sm text-slate-600">{SLOT_MINUTES}-minute consultation · {TIMEZONE} (AEST)</p>
                <p className="mx-auto mt-5 max-w-md text-sm text-slate-600">
                    A confirmation is on its way to <strong>{confirmed.email}</strong>, with a link to reschedule or cancel if your plans change.
                </p>
                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <Link href="/" className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800">Back to home</Link>
                    <button
                        type="button"
                        onClick={() => { setConfirmed(null); void showDay(selectedDate ?? today) }}
                        className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 hover:border-slate-900"
                    >
                        Book another time
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:grid md:grid-cols-[22rem_1fr]">
            {/* Left: summary + date picker */}
            <div className="border-b border-slate-200 p-6 md:border-b-0 md:border-r">
                <p className="text-sm font-medium text-slate-500">Altiq Design</p>
                <h2 className="mt-1 text-xl font-bold text-slate-900">20-Minute Consultation</h2>
                <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-slate-700">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1"><Clock className="h-3.5 w-3.5" aria-hidden="true" />{SLOT_MINUTES} min</span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1"><Globe className="h-3.5 w-3.5" aria-hidden="true" />{TIMEZONE}</span>
                </div>
                <div className="mt-6">
                    <DatePicker
                        month={month}
                        onMonthChange={setMonth}
                        selected={selectedDate}
                        today={today}
                        isSelectable={selectable}
                        onSelect={pickDate}
                        minMonth={minMonth}
                        maxMonth={maxMonth}
                    />
                </div>
            </div>

            {/* Right: times, then details form */}
            <div className="p-6 md:min-h-[28rem]">
                {loading || !selectedDate ? (
                    <SlotSkeleton />
                ) : time ? (
                    <div>
                        <button type="button" onClick={() => setTime(null)} className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900">
                            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Change time
                        </button>
                        <h3 className="text-base font-semibold text-slate-900">Your details</h3>
                        <p className="mb-4 mt-1 text-sm font-semibold text-cobalt">
                            {longDate(selectedDate)} at {time} <span className="font-normal text-slate-500">(Brisbane time)</span>
                        </p>
                        <BookingForm
                            date={new Date(`${selectedDate}T00:00:00`)}
                            time={time}
                            onSuccess={(email) => setConfirmed({ date: selectedDate, time, email })}
                            onConflict={onConflict}
                        />
                    </div>
                ) : (
                    <SlotList
                        heading={longDate(selectedDate)}
                        slots={slots}
                        error={slotsError}
                        notice={notice}
                        onSelect={setTime}
                        onRetry={() => void showDay(selectedDate)}
                    />
                )}
            </div>
        </div>
    )
}
