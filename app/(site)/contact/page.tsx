import type { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';

export const metadata: Metadata = {
    title: 'Contact',
    description: 'Talk to Altiq Design in Brisbane about custom software, web design or an AI voice receptionist for your business.',
    alternates: { canonical: '/contact' },
};


export default function ContactPage() {
    return (
        <div className="bg-[#F8FAFC] min-h-screen py-24 px-4">
            <div className="mx-auto max-w-2xl">
                <h1 className="text-5xl font-extrabold tracking-tight text-ink">Contact Us</h1>
                <p className="mt-4 text-lg text-muted">
                    Have a project in mind or just want to say hello? Fill out the form below and we&apos;ll get back to you as soon as possible.
                </p>
            </div>
            <div className="mt-12">
                <ContactForm />
            </div>
        </div>
    );
}