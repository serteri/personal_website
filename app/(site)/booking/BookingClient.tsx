'use client'

import { useState ,useEffect, useRef} from 'react';
import BookingCalendar from '@/components/BookingCalendar';
import TimeSlots     from '@/components/TimeSlots';
import BookingForm   from '@/components/BookingForm';
import { FaArrowLeft } from 'react-icons/fa';
// Only date + time slot of existing bookings; no personal data is ever received.
interface BookedSlot{date:string;time:string}


export default function BookingClient({ initialDate, initialTime }: { initialDate?: string; initialTime?: string }) {
    const fromLink = Boolean(initialDate && initialTime);
    const [step, setStep] = useState<'calendar'|'timeslots'|'form'>(fromLink ? 'form' : 'calendar');
    // Local midnight, same value a calendar click produces
    const [selectedDate, setSelectedDate] = useState<Date | null>(fromLink ? new Date(`${initialDate}T00:00:00`) : null);
    const [selectedTime, setSelectedTime] = useState<string | null>(fromLink ? (initialTime as string) : null);
    const linkChecked = useRef(false);

    // Rezervasyonları tutmak için yeni state
    const [booked, setBooked] = useState<BookedSlot[]>([]);
    const [isLoading, setIsLoading] = useState(true);
// Verileri çekecek fonksiyon
    const fetchBookings = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/booking', { cache: 'no-store' });
            if (!response.ok) throw new Error(`Bookings request failed: ${response.status}`);
            const slots: BookedSlot[] = await response.json();
            setBooked(slots);
        } catch (error) {
            console.error("Error fetching bookings:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Component ilk yüklendiğinde verileri çek
    useEffect(() => {
        fetchBookings();
    }, []);
    // Deep link: if the pre-selected slot turns out to be taken, fall back to the time slot list
    useEffect(() => {
        if (!fromLink || isLoading || linkChecked.current || !selectedDate) return;
        linkChecked.current = true;
        const dayKey = selectedDate.toISOString().slice(0, 10);
        if (booked.some(b => b.date.slice(0, 10) === dayKey && b.time === selectedTime)) {
            setSelectedTime(null);
            setStep('timeslots');
        }
    }, [fromLink, isLoading, booked, selectedDate, selectedTime]);

    const handleDateClick = (info: { date: Date }) => {
        setSelectedDate(info.date);
        setStep('timeslots');
    };

    // Geri gitme fonksiyonu
    const handleGoBack = () => {
        if (step === 'form') {
            setStep('timeslots');
        } else if (step === 'timeslots') {
            setStep('calendar');
        }
    };

    if (isLoading) {
        return <div className="text-center text-ink">Loading Calendar...</div>;
    }

    // Geri butonu
    const BackButton = () => (
        <button onClick={handleGoBack} className="mb-4 flex items-center font-mono text-xs uppercase tracking-wider text-ink hover:text-cobalt">
            <FaArrowLeft className="mr-2" /> Go Back
        </button>
    );

    if (step === 'calendar') {
        return <BookingCalendar events={[]} onDateClick={handleDateClick} />;
    }

    if (step === 'timeslots' && selectedDate) {
        // A booking's stored UTC date matches the clicked day's UTC date (see POST handler)
        const dayKey = selectedDate.toISOString().slice(0, 10);
        const bookedTimes = booked
            .filter(b => b.date.slice(0, 10) === dayKey)
            .map(b => b.time);

        return (
            <div>
                <BackButton />
                <TimeSlots
                    date={selectedDate}
                    bookedTimes={bookedTimes}
                    onSelect={time => {
                        setSelectedTime(time);
                        setStep('form');
                    }}
                />
            </div>
        );
    }

    if (step === 'form' && selectedDate && selectedTime) {
        return (
            <div>
                <BackButton />
                <BookingForm
                    date={selectedDate}
                    time={selectedTime}
                    onSuccess={() => {
                        // Rezervasyon başarılı olduğunda verileri YENİDEN ÇEKİYORUZ!
                        fetchBookings();
                        setStep('calendar'); // Takvim ekranına geri dön
                    }}
                />
            </div>
        );
    }

    return null;
}