'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'

export interface MonthView {
    y: number
    m: number // 0-11
}

const pad = (n: number) => String(n).padStart(2, '0')
export const dayKey = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`
export const monthOf = (dateStr: string): MonthView => ({ y: Number(dateStr.slice(0, 4)), m: Number(dateStr.slice(5, 7)) - 1 })
const sameMonth = (a: MonthView, b: MonthView) => a.y === b.y && a.m === b.m
const monthIndex = (v: MonthView) => v.y * 12 + v.m
const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const arrow =
    'flex h-9 w-9 items-center justify-center rounded-full text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-transparent'

// Compact month picker (Monday-first). Pure UI: the parent decides which days are selectable.
export default function DatePicker({ month, onMonthChange, selected, today, isSelectable, onSelect, isClosed, onClosedClick, minMonth, maxMonth }: {
    month: MonthView
    onMonthChange: (m: MonthView) => void
    selected: string | null
    today: string
    isSelectable: (d: string) => boolean
    onSelect: (d: string) => void
    isClosed?: (d: string) => boolean // closed days stay clickable so we can explain why
    onClosedClick?: (d: string) => void
    minMonth: MonthView
    maxMonth: MonthView
}) {
    const first = new Date(Date.UTC(month.y, month.m, 1))
    const lead = (first.getUTCDay() + 6) % 7
    const daysInMonth = new Date(Date.UTC(month.y, month.m + 1, 0)).getUTCDate()
    const label = first.toLocaleDateString('en-AU', { month: 'long', year: 'numeric', timeZone: 'UTC' })
    const shift = (delta: number) => {
        const d = new Date(Date.UTC(month.y, month.m + delta, 1))
        onMonthChange({ y: d.getUTCFullYear(), m: d.getUTCMonth() })
    }
    const viewingOtherMonth = !sameMonth(month, monthOf(today))

    return (
        <div>
            <div className="mb-3 flex items-center justify-between">
                <h3 className="text-base font-semibold text-slate-900" aria-live="polite">{label}</h3>
                <div className="flex items-center gap-1">
                    {viewingOtherMonth && (
                        <button
                            type="button"
                            onClick={() => onMonthChange(monthOf(today))}
                            className="mr-1 rounded-full px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                        >
                            Today
                        </button>
                    )}
                    <button type="button" aria-label="Previous month" className={arrow} disabled={monthIndex(month) <= monthIndex(minMonth)} onClick={() => shift(-1)}>
                        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button type="button" aria-label="Next month" className={arrow} disabled={monthIndex(month) >= monthIndex(maxMonth)} onClick={() => shift(1)}>
                        <ChevronRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-y-1 text-center">
                {WEEKDAYS.map((w) => (
                    <span key={w} className="pb-2 text-xs font-medium uppercase tracking-wide text-slate-400">{w}</span>
                ))}
                {Array.from({ length: lead }).map((_, i) => <span key={`b${i}`} />)}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                    const d = i + 1
                    const key = dayKey(month.y, month.m, d)
                    const ok = isSelectable(key)
                    const closed = !ok && !!isClosed?.(key)
                    const isSelected = key === selected
                    const isToday = key === today
                    return (
                        <button
                            key={key}
                            type="button"
                            disabled={!ok && !closed}
                            aria-disabled={closed || undefined}
                            title={closed ? 'Closed on weekends' : undefined}
                            onClick={() => (ok ? onSelect(key) : onClosedClick?.(key))}
                            aria-pressed={isSelected}
                            aria-current={isToday ? 'date' : undefined}
                            aria-label={new Date(`${key}T00:00:00Z`).toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })}
                            className={`relative mx-auto flex h-10 w-10 items-center justify-center rounded-full text-sm transition-colors ${
                                isSelected
                                    ? 'bg-slate-900 font-semibold text-white'
                                    : ok
                                      ? 'font-medium text-slate-900 hover:bg-slate-100'
                                      : 'cursor-not-allowed text-slate-300'
                            } ${isToday && !isSelected ? 'ring-1 ring-slate-300' : ''}`}
                        >
                            {d}
                            {isToday && <span aria-hidden="true" className={`absolute bottom-1 h-1 w-1 rounded-full ${isSelected ? 'bg-white' : 'bg-cobalt'}`} />}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
