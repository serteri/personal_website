'use client'

import { useState } from 'react';
import BookingCalendar from '@/components/BookingCalendar';
import TimeSlots     from '@/components/TimeSlots';
import BookingForm   from '@/components/BookingForm';

interface Event{title:string;start:string}
interface Props{initialEvents:Event[]}

export default function BookingClient({ initialEvents }: Props) {
    const [step, setStep] = useState<'calendar'|'timeslots'|'form'>('calendar');
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    // 🎯 Define your handler here:
    const handleDateClick = ({ date }: { date: Date }) => {
        console.log('DATE CLICKED:', date);
        setSelectedDate(date);
        setStep('timeslots');

    };

    if (step === 'calendar') {
        return (
            <BookingCalendar
                events={initialEvents}
                onDateClick={handleDateClick}
            />
        )
    }

    if (step === 'timeslots' && selectedDate) {
        const bookedTimes = initialEvents
            .filter(e => new Date(e.start).toDateString() === selectedDate.toDateString())
            .map(e => new Date(e.start).toTimeString().slice(0,5))

        return (
            <TimeSlots
                date={selectedDate}
                bookedTimes={bookedTimes}
                onSelect={time => {
                    setSelectedTime(time)
                    setStep('form')
                }}
            />
        )
    }

    // **Here’s the form rendering**
    if (step === 'form' && selectedDate && selectedTime) {
        return (
            <BookingForm
                date={selectedDate}
                time={selectedTime}
                onSuccess={() => {
                    // reset or show a thank-you
                    setStep('calendar')
                }}
            />
        )
    }

    return null

}