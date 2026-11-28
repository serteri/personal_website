'use client'

export function SlotSkeleton() {
    return (
        <div aria-busy="true" aria-label="Loading available times">
            <div className="h-5 w-40 animate-pulse rounded bg-slate-200" />
            <div className="mt-2 h-3 w-56 animate-pulse rounded bg-slate-100" />
            <div className="mt-5 grid grid-cols-3 gap-2">
                {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="h-11 animate-pulse rounded-full bg-slate-100" style={{ animationDelay: `${(i % 6) * 80}ms` }} />
                ))}
            </div>
        </div>
    )
}

// Free Brisbane-time slots for the selected day, as pill buttons. Slots come from GET /api/availability.
export default function SlotList({ heading, slots, error, notice, onSelect, onRetry }: {
    heading: string
    slots: string[]
    error: boolean
    notice?: string
    onSelect: (time: string) => void
    onRetry: () => void
}) {
    return (
        <div>
            <h3 className="text-base font-semibold text-slate-900">{heading}</h3>
            <p className="mt-1 text-xs text-slate-500">Times shown in Brisbane time (AEST)</p>
            {notice && <p role="alert" className="mt-3 rounded-xl bg-amber-50 px-4 py-2.5 text-sm text-amber-800">{notice}</p>}

            {error ? (
                <div className="mt-4" role="alert">
                    <p className="text-sm text-red-600">Could not load available times.</p>
                    <button type="button" onClick={onRetry} className="mt-2 text-sm font-semibold text-cobalt hover:underline">Try again</button>
                </div>
            ) : slots.length === 0 ? (
                <p className="mt-4 text-sm text-slate-600">No times left on this day. Please pick another date.</p>
            ) : (
                <div className="mt-4 grid grid-cols-3 gap-2 md:max-h-[26rem] md:overflow-y-auto md:pr-1">
                    {slots.map((time) => (
                        <button
                            key={time}
                            type="button"
                            onClick={() => onSelect(time)}
                            className="min-h-[44px] rounded-full border border-slate-200 bg-white font-mono text-sm text-slate-900 transition-colors hover:border-slate-900 hover:bg-slate-900 hover:text-white"
                        >
                            {time}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
