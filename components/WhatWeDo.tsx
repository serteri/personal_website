import React from "react";
import Link from "next/link";
import SectionHeader from "./SectionHeader";
import { services } from "@/lib/services";

export default function WhatWeDo() {
    return (
        <section id="services" className="bg-slate-50 py-20 px-4 scroll-mt-24">
            <div className="mx-auto max-w-6xl">
                <SectionHeader eyebrow="Services" title="What we do" />
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {services.map(({ slug, number, title, description, scope }) => (
                        <Link
                            key={slug}
                            href={`/services/${slug}`}
                            className="group flex min-h-[260px] flex-col rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                        >
                            <div className="flex items-start justify-between">
                                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 font-mono text-xs text-slate-600">
                                    {number}
                                </span>
                                <span className="text-sm font-medium text-slate-500 transition-colors group-hover:text-blue-600">
                                    View details{" "}
                                    <span className="inline-block transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
                                </span>
                            </div>
                            <h3 className="mt-8 text-2xl font-bold tracking-tight text-slate-900">{title}</h3>
                            <p className="mt-2 max-w-md text-slate-600">{description}</p>
                            <p className="mt-auto pt-6">
                                <span className="inline-block rounded-full bg-slate-100 px-3 py-1 font-mono text-xs uppercase tracking-wider text-slate-700">
                                    {scope}
                                </span>
                            </p>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
