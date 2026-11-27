'use client'

import { localDateKey } from '@/lib/dateKey';

// `slots` are the free Brisbane-time slot starts from GET /api/availability (computed server-side).
export default function TimeSlots({ date, slots, loading, error, onSelect }: {
    date: Date;
    slots: string[];
    loading: boolean;
    error: boolean;
    onSelect: (time: string) => void;
}) {
    return (
        <div>
            <h3 className="font-semibold text-ink">Select a time for {date.toDateString()}:</h3>
            <p className="mt-1 text-xs text-slate-500">20-minute appointments · times shown in Brisbane time (AEST)</p>

            {loading ? (
                <p className="mt-4 text-sm text-slate-500" role="status">Loading available times…</p>
            ) : error ? (
                <p className="mt-4 text-sm text-red-600" role="alert">Could not load available times. Please go back and try again.</p>
            ) : slots.length === 0 ? (
                <p className="mt-4 text-sm text-slate-600">No times left on {localDateKey(date)}. Please pick another day.</p>
            ) : (
                // 27 slots: 3 columns on mobile (9 even rows), 9 columns on desktop (3 even rows)
                <div className="mt-3 grid grid-cols-3 gap-2 md:grid-cols-9">
                    {slots.map(time => (
                        <button
                            key={time}
                            onClick={() => onSelect(time)}
                            className="min-h-[44px] rounded-lg border border-slate-200 bg-white py-2 font-mono text-sm text-ink transition-colors hover:border-cobalt hover:text-cobalt"
                        >
                            {time}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
