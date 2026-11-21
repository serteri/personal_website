'use client';

import {useForm,SubmitHandler} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import { z } from 'zod';
import {useState} from "react";
import countryCodes from "@/lib/countryCodes.json";

//Zod ile form validasyon semasini olusturuyoruz (API deki ile ayni)

const FormSchema = z.object({
    firstName:z.string().min(2,"First name required."),
    lastName:z.string().min(2,"Last name required."),
    email:z.string().min(1,"Email required.").email("Please enter a valid email address."),
    countryCode: z.string(),
    phone:z.string().min(10, "Phone number is required."),
    message:z.string().min(10, "Message must be at least 10 characters long."),
})

type FormValues = z.infer<typeof FormSchema>;

export default function ContactForm(){
    const [isSubmitting,setIsSubmitting]=useState(false);
    const [submitMessage,setSubmitMessage]=useState('');

    const {register,handleSubmit,formState:{errors},reset} = useForm<FormValues>({
        resolver:zodResolver(FormSchema),
        defaultValues:{countryCode: "+61"}
    })

    const onSubmit:SubmitHandler<FormValues>= async (data) => {
        setIsSubmitting(true);
        setSubmitMessage('');

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                // ...sunucudan gelen detaylı hata mesajını JSON olarak okuyoruz.
                const errorData = await response.json();
                // Hatayı ve detaylarını konsola yazdırıyoruz.
                console.error("Server responded with an error:", response.status, errorData);
                // Yakaladığımız bu detaylı mesajla yeni bir hata fırlatıyoruz.
                throw new Error(errorData.message || 'An unknown error occurred on the server.');
            }

            setSubmitMessage('Thank you! Your message has been sent successfully.');
            reset(); // Formu sıfırla

        } catch (error) {
            console.error('Submission error:', error);
            setSubmitMessage('An error occurred. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }


    }
return(
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto " noValidate>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
                <label htmlFor="firstName" className="block text-sm font-medium font-mono text-xs uppercase tracking-wider text-muted">First Name</label>
                <input {...register('firstName')} id="firstName" type="text" placeholder="First Name"
                className="mt-1 block w-full bg-white border border-line rounded-none p-3 text-ink focus:outline-none focus:ring-0 focus:border-cobalt"/>
                {errors.firstName && <p className="mt-1 text-red-500 text-sm">{errors.firstName.message}</p>}
            </div>
            <div>
                <label htmlFor="lastName" className="block text-sm font-medium font-mono text-xs uppercase tracking-wider text-muted">Last Name</label>
                <input {...register('lastName')} id="lastName" type="text" placeholder="Last Name"
                       className="mt-1 block w-full bg-white border border-line rounded-none p-3 text-ink focus:outline-none focus:ring-0 focus:border-cobalt"/>
                {errors.lastName && <p className="mt-1 text-red-500 text-sm">{errors.lastName.message}</p>}
            </div>
        </div>
            <div>
                <label htmlFor="email" className="block text-sm font-medium font-mono text-xs uppercase tracking-wider text-muted">Email</label>
                <input {...register('email')} id="email" type="email" placeholder="Email address"
                       className="mt-1 block w-full bg-white border border-line rounded-none p-3 text-ink focus:outline-none focus:ring-0 focus:border-cobalt"/>
                {errors.email && <p className="mt-1 text-red-500 text-sm">{errors.email.message}</p>}
            </div>
            <div>
                <label htmlFor="phone" className="block text-sm font-medium font-mono text-xs uppercase tracking-wider text-muted">Phone Number</label>
                <div className="mt-1 flex flex-col sm:flex-row">
                    <select {...register('countryCode')} id="countryCode" className="block bg-white border border-line rounded-none p-3 text-ink focus:outline-none focus:ring-0 focus:border-cobalt mb-2 sm:mb-0">
                        {countryCodes.map(c => <option key={c.code} value={c.dial_code}>{c.name} ({c.dial_code})</option>)}
                    </select>
                    <input {...register('phone')} id="phone" placeholder="Phone Number" type="tel" className="flex-1 block w-full bg-white border border-line rounded-none p-3 text-ink focus:outline-none focus:ring-0 focus:border-cobalt" />
                </div>
                {errors.phone && <p className="mt-1 text-red-500 text-sm">{errors.phone.message}</p>}
            </div>

        <div>
            <label htmlFor="message" className="block text-sm font-medium font-mono text-xs uppercase tracking-wider text-muted">Message</label>
            <textarea {...register('message')} placeholder="Enter your message" id="message" rows={5} className="mt-1 block w-full bg-white border border-line rounded-none p-3 text-ink focus:outline-none focus:ring-0 focus:border-cobalt"></textarea>
            {errors.message && <p className="mt-1 text-red-500 text-sm">{errors.message.message}</p>}
        </div>
        <div>
            <button type="submit" disabled={isSubmitting} className="w-full py-3 px-4 text-lg font-semibold text-white bg-[#0047FF] hover:bg-[#0038CC] focus:outline-none disabled:bg-zinc-400 disabled:cursor-not-allowed">
                {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
        </div>
        {submitMessage && <p className={`mt-4 text-center ${submitMessage.includes('error') ? 'text-red-500' : 'text-green-500'}`}>{submitMessage}</p>}




    </form>




)


}