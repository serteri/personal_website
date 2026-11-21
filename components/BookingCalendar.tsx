'use client'
import { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from "@fullcalendar/daygrid";
import { DayCellContentArg } from '@fullcalendar/core';
import interactionPlugin from "@fullcalendar/interaction";

import { Dialog } from '@headlessui/react';



// Props arayüzünü daha spesifik hale getirelim
interface BookingCalendarProps {
    events: { title: string; start: string }[];
    onDateClick: (info: { date: Date }) => void; // dateClick'ten gelen info objesine göre güncelledik
}

export default function BookingCalendar({
                                            events,
                                            onDateClick,
                                        }:  BookingCalendarProps
) {

    const [showModal, setShowModal] = useState(false);
// Create a local Date at midnight today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return (
        <>
        <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            dayHeaderClassNames={() => [
                'bg-white',          // header row
                'text-ink',
                'font-semibold',     // standout font
                'hover:bg-paper',
                'cursor-pointer',         // ← show it’s clickable
                'transition-colors duration-200',
            ]}
            dayCellClassNames={(arg) => {
                const day = arg.date.getDay();
                const base = ['border','border-line','text-ink'];
                if (day === 0) {
                    // Sunday → no bookings
                    return [...base, 'bg-[#F1F5F9]', 'opacity-50', 'pointer-events-none'];
                }
                if (arg.date.toDateString() === new Date().toDateString()) {
                    // Today
                    return [...base, 'bg-paper'];
                }
                if (day === 6) {
                    // Saturday → slightly different shade
                    return [...base, 'bg-white'];
                }
                // Weekday
                return [...base, 'bg-white'];
            }}

            // ← use dateClick instead of select:
            dateClick={info => {
                if (info.date.getDay() === 0) {
                    setShowModal(true);
                    return;
                }
                onDateClick({ date: info.date })}}
            events={events}
            eventTimeFormat={{
                hour: '2-digit',
                minute: '2-digit',
                hour12: false // 24 saat formatını kullanmak için
            }}
            height="auto"
            headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            buttonText={{
                today: 'Go Live!',
                month: 'Monthly View',
                week: 'Weekly View',
                day: 'Daily View',
            }}
            customButtons={{
                addEventButton: {
                    text: '+ Book Slot',
                    click: () => {
                        /* open your “new booking” modal */
                        alert('Open booking modal!');
                    },
                },
            }}
            eventClassNames={() => [
                'bg-cobalt text-white rounded-md p-1',
                'transition-colors duration-150',
                'cursor-pointer',
            ]}
            validRange={{ start: today }}       // ← no clicks before today
            dayCellContent={(arg: DayCellContentArg) => (
                <div
                    className="
            w-full h-full p-2 flex items-start
            bg-white text-ink
            hover:bg-paper
            transition-colors duration-150
            cursor-pointer
          "
                >
                    {arg.dayNumberText}
                </div>
            )}


        />
            <Dialog
                open={showModal}
                onClose={() => setShowModal(false)}
                className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50"
            >
                <Dialog.Panel className="bg-white border border-line p-6 max-w-sm mx-auto">
                    <Dialog.Title className="text-xl font-bold mb-2">
                        🚫 Sunday Closed
                    </Dialog.Title>
                    <Dialog.Description className="mb-4">
                        Sorry, we don&apos;t take bookings on Sundays.
                    </Dialog.Description>
                    <button
                        className="mt-2 px-4 py-2 bg-cobalt text-white rounded-full hover:bg-[#1D4ED8]"
                        onClick={() => setShowModal(false)}
                    >
                        Got it
                    </button>
                </Dialog.Panel>
            </Dialog>


        </>
    );
}