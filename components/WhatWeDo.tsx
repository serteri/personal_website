import React from "react";
import SwissHeader from "./SwissHeader";

type Service = { title: string; description: string };

const services: Service[] = [
    {
        title: "High-Converting Websites",
        description: "Fast, conversion-focused websites built to turn visitors into leads.",
    },
    {
        title: "AI & Lead Automation",
        description: "24/7 AI assistants, automated booking flows, and instant CRM/SMS follow-ups.",
    },
    {
        title: "Custom Web Apps & SaaS",
        description: "Scalable web applications, client portals, and interactive business tools.",
    },
    {
        title: "Speed & Technical SEO",
        description: "Core Web Vitals optimization, technical SEO audits, and conversion rate improvements.",
    },
];

export default function WhatWeDo() {
    return (
        <section id="services" className="bg-[#F4F4F5] border-b border-line py-20 px-4 scroll-mt-24">
            <div className="mx-auto max-w-7xl sm:px-2 lg:px-8">
                <SwissHeader index="01" label="SERVICES" title="What we do" />
                {/* 2x2 joined grid: shared 1px lines, no gaps */}
                <div className="grid grid-cols-1 md:grid-cols-2 border-t border-l border-line">
                    {services.map(({ title, description }, i) => (
                        <article
                            key={title}
                            className="group relative border-r border-b border-line bg-white p-8 min-h-[220px] transition-colors duration-300 hover:bg-[#FAFAFA]"
                        >
                            <span className="font-mono text-xs uppercase tracking-wider text-muted">
                                {String(i + 1).padStart(2, "0")}
                            </span>
                            <h3 className="mt-10 text-2xl font-bold tracking-tight text-ink transition-colors group-hover:text-cobalt">
                                {title}
                            </h3>
                            <p className="mt-2 max-w-sm text-muted">{description}</p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
