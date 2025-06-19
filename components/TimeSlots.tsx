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
        // 1) Exclude already-booked times
        if (bookedTimes.includes(slot)) return false;

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
            <h3 className="font-semibold text-white">Select a time for {date.toDateString()} :</h3>
            <div className="grid grid-cols-4 gap-4 mt-2">
                {available.map(time => (
                    <button key={time} onClick={() => onSelect(time)}
                            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                        {time}
                    </button>
                ))}

            </div>
        </div>

    )

}
