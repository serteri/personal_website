'use client'

export default function TimeSlots({date,bookedTimes,onSelect}:{
    date: Date;
    bookedTimes: string[];      // e.g. ['10:00','14:00']
    onSelect: (time: string) => void;
}) {
    const allSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
    // Figure out “now” and reset seconds/millis for a clean compare
    const now = new Date();
    const isToday =
        now.toDateString() === date.toDateString();

    const available = allSlots.filter(slot => {
        // 2) If it’s today, exclude any slot ≤ current time
        if (isToday) {
            const [h, m] = slot.split(':').map(Number);
            if (
                h < now.getHours() ||
                (h === now.getHours() && m <= now.getMinutes())
            ) {
                return false;
            }
        }
        return true;
    });

    return (
        <div>
            <h3 className="font-semibold text-ink">Select a time for {date.toDateString()} :</h3>
            <div className="grid grid-cols-4 gap-4 mt-2">
                {available.map(time => {
                    const taken = bookedTimes.includes(time);
                    return (
                        <button key={time} onClick={() => onSelect(time)} disabled={taken}
                                title={taken ? 'Not available' : undefined}
                                className="p-2 bg-white border border-line text-ink font-mono text-sm hover:border-cobalt hover:text-cobalt disabled:bg-[#E4E4E7] disabled:text-zinc-400 disabled:line-through disabled:cursor-not-allowed disabled:hover:border-line disabled:hover:text-zinc-400">
                            {time}
                        </button>
                    );
                })}

            </div>
        </div>

    )

}
