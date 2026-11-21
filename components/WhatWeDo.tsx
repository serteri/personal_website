import React from "react";
import Link from "next/link";
import SwissHeader from "./SwissHeader";
import { services } from "@/lib/services";

export default function WhatWeDo() {
    return (
        <section id="services" className="bg-[#F4F4F5] border-b border-line py-20 px-4 scroll-mt-24">
            <div className="mx-auto max-w-7xl sm:px-2 lg:px-8">
                <SwissHeader index="01" label="SERVICES" title="What we do" />
                {/* 2x2 joined grid: shared 1px lines, no gaps */}
                <div className="grid grid-cols-1 md:grid-cols-2 border-t border-l border-line">
                    {services.map(({ slug, number, title, description, scope }) => (
                        <Link
                            key={slug}
                            href={`/services/${slug}`}
                            className="group relative flex min-h-[260px] flex-col border-r border-b border-line bg-white p-8 transition-colors duration-300 hover:bg-[#FAFAFA]"
                        >
                            <div className="flex items-start justify-between font-mono text-xs uppercase tracking-wider text-muted">
                                <span>{number}</span>
                                <span className="transition-colors duration-300 group-hover:text-cobalt">
                                    VIEW DETAILS{" "}
                                    <span className="inline-block transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
                                </span>
                            </div>
                            <h3 className="mt-10 text-2xl font-bold tracking-tight text-ink transition-colors group-hover:text-cobalt">
                                {title}
                            </h3>
                            <p className="mt-2 max-w-md text-muted">{description}</p>
                            <p className="mt-auto pt-6 font-mono text-xs uppercase tracking-wider text-ink">{scope}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
