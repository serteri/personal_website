'use client'

import {useState} from 'react'
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';


interface BookingFormProps {
    date: Date
    time: string
    onSuccess: () => void
}

// Zod ile form validasyon şemasını oluşturuyoruz
const BookingFormSchema = z.object({
    firstName: z.string().min(1, "First name is required."),
    lastName: z.string().min(1, "Last name is required."),
    email: z.string().min(1, "Email is required.").email("Invalid email address."),
    phone: z.string().min(5, "A valid phone number is required."),
});
// Zod şemasından TypeScript tipini otomatik olarak türetiyoruz
type FormValues = z.infer<typeof BookingFormSchema>;

export default function BookingForm({date, time, onSuccess}: BookingFormProps) {
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
            date: date.toISOString(), // Prop olarak gelen tarih
            time: time,               // Prop olarak gelen saat
        };

        try {
            const response = await fetch('/api/booking', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to save booking');
            }

            setSubmitMessage('Your appointment has been booked successfully!');

            // Başarılı olunca formu sıfırla ve 2 saniye sonra ana ekrana dön
            reset();
            setTimeout(() => {
                onSuccess();
            }, 2000);

        } catch (error: any) {
            console.error('Submission error:', error);
            setSubmitMessage(error.message || 'An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg mx-auto text-white" noValidate>
        <div className="bg-gray-800 p-4 rounded-lg text-center">
            <p>You are booking an appointment for:</p>
            <p className="font-bold text-lime-300 text-lg">
                {date.toDateString()} at {time}
            </p>
        </div>

        <input
            {...register('firstName')}
            placeholder="First Name"
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md focus:ring-lime-400 focus:border-lime-400"
        />
        {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}

        <input
            {...register('lastName')}
            placeholder="Last Name"
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md focus:ring-lime-400 focus:border-lime-400"
        />
        {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}

        <input
            {...register('email')}
            type="email"
            placeholder="Email"
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md focus:ring-lime-400 focus:border-lime-400"
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}

        <input
            {...register('phone')}
            type="tel"
            placeholder="Phone"
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md focus:ring-lime-400 focus:border-lime-400"
        />
        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}

        <button type="submit" disabled={isSubmitting} className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-black bg-lime-300 hover:bg-lime-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500 disabled:bg-gray-500 disabled:cursor-not-allowed">
            {isSubmitting ? 'Booking...' : 'Book Appointment'}
        </button>

        {submitMessage && <p className={`mt-4 text-center font-semibold ${submitMessage.includes('error') ? 'text-red-500' : 'text-green-500'}`}>{submitMessage}</p>}
        
        
    </form>
    
    
    
    
)
    

}