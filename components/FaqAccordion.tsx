"use client";

import { useState } from 'react';
import SectionHeader from './SectionHeader';

// ÇÖZÜM: 'any' yerine kullanılacak olan tip arayüzünü tanımlıyoruz.
interface FaqItemData {
    question: string;
    answer: string;
}
// Soru-Cevap verilerini buraya girebilirsiniz.
const faqData: FaqItemData[] = [
    {
        question: "How does your design process work from start to finish?",
        answer: "Our process is collaborative. We start with a discovery call to understand your goals, followed by strategy and design mockups. Once you approve the design, we move to development. We keep you updated at every key milestone before the final launch."
    },
    {
        question: "How long does a typical website project take?",
        answer: "Timelines depend on the service, from kickoff to launch: conversion websites and AI-app rescues take 1–2 weeks, MVP & SaaS builds take 3–5 weeks, and custom document & workflow automations are scoped based on complexity (typically 2–4 weeks). We confirm the timeline in writing after the scoping call."
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
        answer: "We pick technology for what it does for you: speed (pages that load fast and hold up under Core Web Vitals), security (modern, well-maintained tooling and managed hosting), and scalability (a foundation that grows from a landing page to a full web app without a rebuild). For most projects that means Next.js and React, but we choose what fits the job."
    }
];

// Tek bir SSS öğesini yönetecek alt component
const FaqItem = ({ item, isOpen, onClick }: { item: FaqItemData, isOpen: boolean, onClick: () => void }) => {
    return (
        <div className="border-b border-slate-200/80 last:border-b-0">
            <button
                className="w-full flex justify-between items-center text-left py-5 hover:text-cobalt transition-colors"
                aria-expanded={isOpen}
                onClick={onClick}
            >
                <span className="text-ink text-lg font-semibold tracking-tight pr-6">{item.question}</span>
                {/* Ok ikonu ve dönme animasyonu */}
                <svg
                    className={`flex-shrink-0 w-5 h-5 text-ink transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`}
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
                className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96 pb-6' : 'max-h-0'}`}
            >
                <p className="text-muted max-w-3xl">
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
        <section id="faq" className="bg-white py-20 px-4 scroll-mt-24">
            <div className="mx-auto max-w-4xl">
                <SectionHeader eyebrow="FAQ" title="Frequently asked questions" />
                <div className="rounded-2xl border border-slate-200/80 bg-white px-6 shadow-sm">
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
