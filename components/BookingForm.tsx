'use client'

import {useState} from 'react'

interface BookingFormProps {
    date: Date
    time: string
    onSuccess: () => void
}
export default function BookingForm({date, time, onSuccess}: BookingFormProps) {


    // initialize form state with your slot baked in
    const [form, setForm] = useState({
        firstName: '',
        lastName : '',
        email    : '',
        phone    : '',
    })
    // optional: show the slot to the user
    const dateString = date.toDateString()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const payload = {
            ...form,
            date : date.toISOString(),      // full ISO date
            time : time                     // e.g. "14:00"
        }

        const res = await fetch('/api/bookings', {
            method : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body   : JSON.stringify(payload),
        })

        if (res.ok) {
            onSuccess()
        } else {
            alert('Failed to save booking')
        }
    }

return (
    <form onSubmit={handleSubmit} className="space-y-4">
        <p>You’re booking <strong>{dateString}</strong> at <strong>{time}</strong></p>
        <input type="text" placeholder="First Name" className="w-full p-2 border"
               value={form.firstName} onChange={handleChange}  required/>
        <input name="lastName"
               value={form.lastName}
               onChange={handleChange}
               placeholder="Last Name"
               required
               className="w-full p-2 border"/>
        <input name="email"
               value={form.email}
               onChange={handleChange}
               type="email"
               placeholder="Email"
               required
               className="w-full p-2 border"/>
        <input name="phone"
               value={form.phone}
               onChange={handleChange}
               type="tel"
               placeholder="Phone"
               required
               className="w-full p-2 border"
        />
        {/* Hidden or managed fields for date/time */}
        <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded">
            Book Appointment
        </button>
        
        
    </form>
    
    
    
    
)
    

}