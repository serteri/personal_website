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
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-300">First Name</label>
                <input {...register('firstName')} id="firstName" type="text" placeholder="First Name"
                className="mt-1 block w-full bg-gray-800 border-gray-600 rounded-md shadow-sm p-3 text-white focus:ring-lime-400 focus:border-lime-400"/>
                {errors.firstName && <p className="mt-1 text-red-500 text-sm">{errors.firstName.message}</p>}
            </div>
            <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-300">Last Name</label>
                <input {...register('lastName')} id="lastName" type="text" placeholder="Last Name"
                       className="mt-1 block w-full bg-gray-800 border-gray-600 rounded-md shadow-sm p-3 text-white focus:ring-lime-400 focus:border-lime-400"/>
                {errors.lastName && <p className="mt-1 text-red-500 text-sm">{errors.lastName.message}</p>}
            </div>
        </div>
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
                <input {...register('email')} id="email" type="email" placeholder="Email address"
                       className="mt-1 block w-full bg-gray-800 border-gray-600 rounded-md shadow-sm p-3 text-white focus:ring-lime-400 focus:border-lime-400"/>
                {errors.email && <p className="mt-1 text-red-500 text-sm">{errors.email.message}</p>}
            </div>
            <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-300">Phone Number</label>
                <div className="mt-1 flex flex-col sm:flex-row rounded-md shadow-sm">
                    <select {...register('countryCode')} id="countryCode" className="block bg-gray-800 border-gray-600 rounded-l-md p-3 text-white focus:ring-lime-400 focus:border-lime-400 sm:rounded-r-none mb-2 sm:mb-0">
                        {countryCodes.map(c => <option key={c.code} value={c.dial_code}>{c.name} ({c.dial_code})</option>)}
                    </select>
                    <input {...register('phone')} id="phone" placeholder="Phone Number" type="tel" className="flex-1 block w-full bg-gray-800 border-gray-600  p-3 text-white focus:ring-lime-400 focus:border-lime-400 rounded-md sm:rounded-r-md sm:rounded-l-none" />
                </div>
                {errors.phone && <p className="mt-1 text-red-500 text-sm">{errors.phone.message}</p>}
            </div>

        <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-300">Message</label>
            <textarea {...register('message')} placeholder="Enter your message" id="message" rows={5} className="mt-1 block w-full bg-gray-800 border-gray-600 rounded-md shadow-sm p-3 text-white focus:ring-lime-400 focus:border-lime-400"></textarea>
            {errors.message && <p className="mt-1 text-red-500 text-sm">{errors.message.message}</p>}
        </div>
        <div>
            <button type="submit" disabled={isSubmitting} className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-black bg-lime-300 hover:bg-lime-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500 disabled:bg-gray-500 disabled:cursor-not-allowed">
                {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
        </div>
        {submitMessage && <p className={`mt-4 text-center ${submitMessage.includes('error') ? 'text-red-500' : 'text-green-500'}`}>{submitMessage}</p>}




    </form>




)


}