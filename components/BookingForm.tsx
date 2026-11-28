'use client'

import {useState} from 'react'
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { localDateKey } from '@/lib/dateKey';


interface BookingFormProps {
    date: Date
    time: string
    onSuccess: (email: string) => void
    onConflict?: () => void // slot was taken while the form was open (409)
}

// Zod ile form validasyon şemasını oluşturuyoruz
const BookingFormSchema = z.object({
    firstName: z.string().min(1, "First name is required."),
    lastName: z.string().min(1, "Last name is required."),
    email: z.string().min(1, "Email is required.").email("Invalid email address."),
    phone: z.string().min(5, "A valid phone number is required."),
    notes: z.string().max(1000).optional(),
    website: z.string().optional(), // honeypot
});
// Zod şemasından TypeScript tipini otomatik olarak türetiyoruz
type FormValues = z.infer<typeof BookingFormSchema>;

export default function BookingForm({date, time, onSuccess, onConflict}: BookingFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');

    // React Hook Form kurulumu
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<FormValues>({
        resolver: zodResolver(BookingFormSchema)
    });


    // Form gönderildiğinde çalışacak fonksiyon
    const onSubmit: SubmitHandler<FormValues> = async (formData) => {
        setIsSubmitting(true);
        setSubmitMessage('');

        const payload = {
            ...formData, // Gelen form verileri (firstName, lastName, email, phone)
            date: localDateKey(date), // YYYY-MM-DD, the day the visitor picked (Brisbane day on the server)
            time: time,               // Prop olarak gelen saat
        };

        try {
            const response = await fetch('/api/booking', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                if (response.status === 409 && onConflict) {
                    onConflict();
                    return;
                }
                throw new Error(errorData.message || 'Failed to save booking');
            }

            // Parent shows the confirmation screen
            reset();
            onSuccess(payload.email);

        } catch (error: any) {
            console.error('Submission error:', error);
            setSubmitMessage(error.message || 'An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 text-ink" noValidate>
            {/* Honeypot: hidden from people, bots tend to fill it */}
            <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', width: 1, height: 1, overflow: 'hidden' }}>
                <label>Website <input type="text" tabIndex={-1} autoComplete="off" {...register('website')} /></label>
            </div>
        <input
            {...register('firstName')}
            placeholder="First Name"
            className="w-full p-3 bg-white border border-line rounded-xl text-ink focus:outline-none focus:ring-0 focus:border-cobalt"
        />
        {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}

        <input
            {...register('lastName')}
            placeholder="Last Name"
            className="w-full p-3 bg-white border border-line rounded-xl text-ink focus:outline-none focus:ring-0 focus:border-cobalt"
        />
        {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}

        <input
            {...register('email')}
            type="email"
            placeholder="Email"
            className="w-full p-3 bg-white border border-line rounded-xl text-ink focus:outline-none focus:ring-0 focus:border-cobalt"
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}

        <input
            {...register('phone')}
            type="tel"
            placeholder="Phone"
            className="w-full p-3 bg-white border border-line rounded-xl text-ink focus:outline-none focus:ring-0 focus:border-cobalt"
        />
        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}

        <textarea
            {...register('notes')}
            placeholder="Anything we should know? (optional)"
            rows={3}
            className="w-full p-3 bg-white border border-line rounded-xl text-ink focus:outline-none focus:ring-0 focus:border-cobalt"
        />
        {errors.notes && <p className="text-red-500 text-sm mt-1">{errors.notes.message}</p>}

        <button type="submit" disabled={isSubmitting} className="w-full rounded-full py-3 px-4 text-lg font-semibold text-white bg-slate-900 hover:bg-slate-800 focus:outline-none disabled:bg-zinc-400 disabled:cursor-not-allowed">
            {isSubmitting ? 'Booking...' : 'Book Appointment'}
        </button>

        {submitMessage && <p role="alert" className="text-center text-sm font-semibold text-red-600">{submitMessage}</p>}
        
        
    </form>
    
    
    
    
)
    

}