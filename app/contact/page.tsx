import ContactForm from '@/components/ContactForm';

export default function ContactPage() {
    return (
        <div className="bg-black min-h-screen py-24 px-4">
            <div className="container mx-auto text-center">
                <h1 className="text-5xl font-bold text-white">Contact Us</h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">
                    Have a project in mind or just want to say hello? Fill out the form below and we&apos;ll get back to you as soon as possible.
                </p>
            </div>
            <div className="mt-12">
                <ContactForm />
            </div>
        </div>
    );
}