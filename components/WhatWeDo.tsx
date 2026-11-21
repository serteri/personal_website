import React from "react";
import SwissHeader from "./SwissHeader";

type Service = { title: string; description: string; scope: string };

const services: Service[] = [
    {
        title: "MVP & SaaS Engineering",
        description:
            "From idea to live product in weeks. Full-stack web apps with auth, billing, and scalable databases built to launch fast.",
        scope: "3–5 WEEKS",
    },
    {
        title: "Document & Workflow Automation",
        description:
            "Replace manual PDFs, spreadsheets, and repetitive admin with custom AI pipelines and internal web tools.",
        scope: "CUSTOM PIPELINES",
    },
    {
        title: "AI-App Rescue & Hardening",
        description:
            "Stuck with a half-built Lovable, Bolt, or Cursor prototype? We fix the architecture, security, and database to get it production-ready.",
        scope: "1–2 WEEKS",
    },
    {
        title: "Conversion Websites & Lead Systems",
        description:
            "Fast, no-fluff websites engineered to capture leads—complete with automated booking, forms, and CRM follow-ups.",
        scope: "1–2 WEEKS",
    },
];

export default function WhatWeDo() {
    return (
        <section id="services" className="bg-[#F4F4F5] border-b border-line py-20 px-4 scroll-mt-24">
            <div className="mx-auto max-w-7xl sm:px-2 lg:px-8">
                <SwissHeader index="01" label="SERVICES" title="What we do" />
                {/* 2x2 joined grid: shared 1px lines, no gaps */}
                <div className="grid grid-cols-1 md:grid-cols-2 border-t border-l border-line">
                    {services.map(({ title, description, scope }, i) => (
                        <article
                            key={title}
                            className="group relative flex flex-col border-r border-b border-line bg-white p-8 min-h-[260px] transition-colors duration-300 hover:bg-[#FAFAFA]"
                        >
                            <span className="font-mono text-xs uppercase tracking-wider text-muted">
                                {String(i + 1).padStart(2, "0")}
                            </span>
                            <h3 className="mt-10 text-2xl font-bold tracking-tight text-ink transition-colors group-hover:text-cobalt">
                                {title}
                            </h3>
                            <p className="mt-2 max-w-md text-muted">{description}</p>
                            <p className="mt-auto pt-6 font-mono text-xs uppercase tracking-wider text-ink">{scope}</p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
