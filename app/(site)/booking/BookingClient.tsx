'use client'

import { useState, useEffect, useRef, useCallback } from 'react';
import { localDateKey } from '@/lib/dateKey';
import BookingCalendar from '@/components/BookingCalendar';
import TimeSlots     from '@/components/TimeSlots';
import BookingForm   from '@/components/BookingForm';
import { FaArrowLeft } from 'react-icons/fa';


export default function BookingClient({ initialDate, initialTime }: { initialDate?: string; initialTime?: string }) {
    const fromLink = Boolean(initialDate && initialTime);
    const [step, setStep] = useState<'calendar'|'timeslots'|'form'>(fromLink ? 'form' : 'calendar');
    // Local midnight, same value a calendar click produces
    const [selectedDate, setSelectedDate] = useState<Date | null>(fromLink ? new Date(`${initialDate}T00:00:00`) : null);
    const [selectedTime, setSelectedTime] = useState<string | null>(fromLink ? (initialTime as string) : null);
    const linkChecked = useRef(false);

    // Free slots for the selected day, computed server-side (Google Calendar + bookings + blocks)
    const [slots, setSlots] = useState<string[]>([]);
    const [slotsLoading, setSlotsLoading] = useState(false);
    const [slotsError, setSlotsError] = useState(false);

    const fetchSlots = useCallback(async (day: Date): Promise<string[] | null> => {
        setSlotsLoading(true);
        setSlotsError(false);
        try {
            const response = await fetch(`/api/availability?date=${localDateKey(day)}`, { cache: 'no-store' });
            if (!response.ok) throw new Error(`Availability request failed: ${response.status}`);
            const data: { slots: string[] } = await response.json();
            setSlots(data.slots);
            return data.slots;
        } catch (error) {
            console.error('Error fetching availability:', error);
            setSlots([]);
            setSlotsError(true);
            return null;
        } finally {
            setSlotsLoading(false);
        }
    }, []);

    // Load free slots whenever the time-slot step is shown for a day
    useEffect(() => {
        if (step === 'timeslots' && selectedDate) void fetchSlots(selectedDate);
    }, [step, selectedDate, fetchSlots]);

    // Deep link: if the pre-selected slot is not free, fall back to the time slot list
    useEffect(() => {
        if (!fromLink || linkChecked.current || !selectedDate) return;
        linkChecked.current = true;
        void fetchSlots(selectedDate).then(free => {
            if (free && !free.includes(selectedTime as string)) {
                setSelectedTime(null);
                setStep('timeslots');
            }
        });
    }, [fromLink, selectedDate, selectedTime, fetchSlots]);

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
        return (
            <div>
                <BackButton />
                <TimeSlots
                    date={selectedDate}
                    slots={slots}
                    loading={slotsLoading}
                    error={slotsError}
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
                        setStep('calendar'); // Takvim ekranına geri dön
                    }}
                />
            </div>
        );
    }

    return null;
}