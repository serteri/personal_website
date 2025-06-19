"use client";

import { useState } from 'react';

// Soru-Cevap verilerini buraya girebilirsiniz.
const faqData = [
    {
        question: "How does your design process work from start to finish?",
        answer: "Our process is collaborative. We start with a discovery call to understand your goals, followed by strategy and design mockups. Once you approve the design, we move to development. We keep you updated at every key milestone before the final launch."
    },
    {
        question: "How long does a typical website project take?",
        answer: "Timelines vary based on complexity. A simple landing page can take 1-2 weeks, while a full custom website with multiple features typically takes between 6 to 12 weeks from kickoff to launch."
    },
    {
        question: "How much will my new website cost?",
        answer: "Every project is unique, so we provide custom quotes based on your specific needs. After our initial discovery call, we'll provide a detailed proposal with a clear breakdown of the costs involved."
    },
    {
        question: "Do I need to provide the text and images for my website?",
        answer: "You can provide your own content, which is often best as you know your business inside-out. However, we also offer professional copywriting and content strategy services if you need help crafting the perfect message."
    },
    {
        question: "Is Search Engine Optimization (SEO) included in your packages?",
        answer: "Yes, all websites we build include foundational on-page SEO best practices to ensure search engines can find and rank your site. We also offer more advanced, ongoing SEO campaigns as a separate service."
    },
    {
        question: "How many rounds of revisions are included?",
        answer: "Our design phase typically includes two full rounds of revisions on the proposed design concept. Our goal is to ensure you are 100% satisfied with the look and feel before we write a single line of code."
    },
    {
        question: "Do you provide support and maintenance after the website is launched?",
        answer: "Absolutely. We offer a range of monthly support plans to handle website updates, security checks, backups, and content changes, ensuring your site remains secure and up-to-date."
    },
    {
        question: "What technology do you use to build websites?",
        answer: "We use modern, robust, and scalable technologies like Next.js and React for most of our projects. This allows us to build extremely fast and flexible websites. We always choose the best technology for the job based on the project's requirements."
    }
];

// Tek bir SSS öğesini yönetecek alt component
const FaqItem = ({ item, isOpen, onClick }: { item: any, isOpen: boolean, onClick: () => void }) => {
    return (
        <div className="border-b border-lime-300/20 py-4">
            <button
                className="w-full flex justify-between items-center text-left"
                onClick={onClick}
            >
                <span className="text-white text-lg">{item.question}</span>
                {/* Ok ikonu ve dönme animasyonu */}
                <svg
                    className={`flex-shrink-0 w-5 h-5 text-lime-300 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            
            {/* Açılır/kapanır cevap bölümü */}
            <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96 mt-4' : 'max-h-0'}`}
            >
                <p className="text-gray-400">
                    {item.answer}
                </p>
            </div>
        </div>
    );
};


export default function FaqAccordion() {
    // Sadece bir sorunun açık olmasını sağlamak için state kullanıyoruz.
    // `null` değeri, hiçbirinin açık olmadığı anlamına gelir.
    const [openIndex, setOpenIndex] = useState<number | null>(null); // Hiçbiri açık değil

    // Bir soruya tıklandığında state'i güncelleyen fonksiyon
    const handleToggle = (index: number) => {
        // Eğer zaten açık olan soruya tekrar tıklanırsa, kapat (null yap).
        // Aksi halde, tıklanan sorunun index'ini ayarla.
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="bg-black text-white py-24 px-4">
            <div className="container mx-auto max-w-4xl">
                <h2 className="text-4xl font-bold mb-8 text-center">Frequently asked questions</h2>
                <div>
                    {faqData.map((item, index) => (
                        <FaqItem
                            key={index}
                            item={item}
                            isOpen={openIndex === index}
                            onClick={() => handleToggle(index)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
