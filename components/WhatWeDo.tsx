import React from "react";
import { Globe, Bot, LayoutDashboard, Gauge, type LucideIcon } from "lucide-react";

type Service = { title: string; description: string; Icon: LucideIcon };

const services: Service[] = [
    {
        title: "High-Converting Websites",
        description: "Fast, conversion-focused websites built to turn visitors into leads.",
        Icon: Globe,
    },
    {
        title: "AI & Lead Automation",
        description: "24/7 AI assistants, automated booking flows, and instant CRM/SMS follow-ups.",
        Icon: Bot,
    },
    {
        title: "Custom Web Apps & SaaS",
        description: "Scalable web applications, client portals, and interactive business tools.",
        Icon: LayoutDashboard,
    },
    {
        title: "Speed & Technical SEO",
        description: "Core Web Vitals optimization, technical SEO audits, and conversion rate improvements.",
        Icon: Gauge,
    },
];

export default function WhatWeDo() {
    return (
        <section id="services" className="bg-black py-16 px-4 scroll-mt-24">
            <div className="container mx-auto max-w-5xl">
                <h2 className="text-3xl md:text-4xl font-extrabold text-white text-center mb-10">What we do</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {services.map(({ title, description, Icon }) => (
                        <article
                            key={title}
                            className="rounded-2xl border border-white/10 bg-zinc-900/60 p-7 transition hover:border-white/25"
                        >
                            <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 text-indigo-300">
                                <Icon className="h-5 w-5" aria-hidden="true" />
                            </div>
                            <h3 className="text-xl font-bold text-white">{title}</h3>
                            <p className="mt-2 text-zinc-400">{description}</p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
