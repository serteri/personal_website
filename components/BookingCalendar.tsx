'use client'
import { useState } from 'react';
import FullCalendar, {
    DateClickArg,
    DayCellContentArg,
    EventContentArg,
} from '@fullcalendar/react';
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import toast from 'react-hot-toast';
import { Dialog } from '@headlessui/react';

export default function BookingCalendar({
                                            events,
                                            onDateClick,
                                        }: {
    events: { title: string; start: string }[];
    onDateClick: (info: { start: Date; end?: Date }) => void;
}) {

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
                'bg-white',          // white bg for header row
                'text-black',        // black text so it pops
                'font-semibold',     // standout font
                'hover:bg-teal-200',      // ← lighter on hover
                'cursor-pointer',         // ← show it’s clickable
                'transition-colors duration-200',
            ]}
            dayCellClassNames={(arg) => {
                const day = arg.date.getDay();
                const base = ['border','border-gray-700','text-gray-200'];
                if (day === 0) {
                    // Sunday → no bookings
                    return [...base, 'bg-gray-800', 'opacity-50', 'pointer-events-none'];
                }
                if (arg.date.toDateString() === new Date().toDateString()) {
                    // Today
                    return [...base, 'bg-red-200'];
                }
                if (day === 6) {
                    // Saturday → slightly different shade
                    return [...base, 'bg-gray-700'];
                }
                // Weekday
                return [...base, 'bg-gray-900'];
            }}

            // ← use dateClick instead of select:
            dateClick={info => {
                if (info.date.getDay() === 0) {
                    setShowModal(true);
                    return;
                }
                onDateClick({ date: info.date })}}
            events={events}
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
                'bg-indigo-500 text-white rounded p-1',
                'hover:bg-indigo-600 hover:scale-105',  // ← color + pop
                'transform transition-all duration-150',
                'cursor-pointer',
            ]}
            validRange={{ start: today }}       // ← no clicks before today

            navLinkClassNames={() => ['text-white']}
            dayCellContent={(arg: DayCellContentArg) => (
                <div
                    className="
            w-full h-full p-2 flex items-start
            bg-gray-900 text-gray-200
            hover:bg-red-800
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
                className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            >
                <Dialog.Panel className="bg-white p-6 rounded-lg max-w-sm mx-auto">
                    <Dialog.Title className="text-xl font-bold mb-2">
                        🚫 Sunday Closed
                    </Dialog.Title>
                    <Dialog.Description className="mb-4">
                        Sorry, we don’t take bookings on Sundays.
                    </Dialog.Description>
                    <button
                        className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                        onClick={() => setShowModal(false)}
                    >
                        Got it
                    </button>
                </Dialog.Panel>
            </Dialog>


        </>
    );
}