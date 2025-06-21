'use client'

import { useState ,useEffect} from 'react';
import BookingCalendar from '@/components/BookingCalendar';
import TimeSlots     from '@/components/TimeSlots';
import BookingForm   from '@/components/BookingForm';
import { FaArrowLeft } from 'react-icons/fa';
interface Event{title:string;start:string}


export default function BookingClient() {
    const [step, setStep] = useState<'calendar'|'timeslots'|'form'>('calendar');
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    // Rezervasyonları tutmak için yeni state
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);
// Verileri çekecek fonksiyon
    const fetchBookings = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/bookings');
            const bookings = await response.json();

            // API'den gelen veriyi FullCalendar'ın anlayacağı formata çeviriyoruz
            const formattedEvents = bookings.map((b: any) => ({
                title: `${b.firstName} ${b.lastName}`,
                start: b.date,
            }));
            setEvents(formattedEvents);
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
        return <div className="text-center text-white">Loading Calendar...</div>;
    }

    // Geri butonu
    const BackButton = () => (
        <button onClick={handleGoBack} className="mb-4 flex items-center text-lime-300 hover:text-lime-400">
            <FaArrowLeft className="mr-2" /> Go Back
        </button>
    );

    if (step === 'calendar') {
        return <BookingCalendar events={events} onDateClick={handleDateClick} />;
    }

    if (step === 'timeslots' && selectedDate) {
        const bookedTimes = events
            .filter(e => new Date(e.start).toDateString() === selectedDate.toDateString())
            .map(e => new Date(e.start).toTimeString().slice(0, 5));

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