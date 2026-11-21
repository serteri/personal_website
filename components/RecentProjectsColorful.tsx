// components/RecentProjectsColorful.tsx
"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export interface Project {
    id: string;
    title: string;
    description?: string;
    imageUrl?: string; // screenshot in /public/projects/; gradient placeholder is used if missing
    link?: string; // live site
    slug?: string; // when set, a case study page exists at /case-studies/[slug]
    gradient?: string;
    category?: string;
    tags?: string[];
    index: number;
}

/* uniq helper */
const uniq = (arr: (string | undefined)[]) => Array.from(new Set(arr.filter(Boolean) as string[]));

interface Props { projects: Project[]; subtitle?: string; }

export default function RecentProjectsColorful({ projects, subtitle }: Props) {
    const [filter, setFilter] = useState<string>("All");
    const categories = useMemo(() => ["All", ...uniq(projects.map(p => p.category))], [projects]);
    const filtered = useMemo(() => filter === "All" ? projects : projects.filter(p => p.category === filter), [projects, filter]);

    return (
        <section className="py-12 bg-gradient-to-b from-white via-rose-50 to-indigo-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Recent Projects</h2>
                        <p className="mt-1 text-sm text-slate-700 max-w-xl">
                            {subtitle ?? "Vibrant, brand-forward projects — click any card to visit the live site."}
                        </p>
                    </div>

                    {/* Filters: only shown when there is more than one real category */}
                    {categories.length > 2 && (
                        <div className="flex flex-wrap gap-3">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setFilter(cat)}
                                    className={`px-3 py-1.5 rounded-full text-sm font-semibold transition focus:outline-none ${
                                        filter === cat
                                            ? "bg-gradient-to-r from-rose-500 via-orange-400 to-amber-400 text-white shadow-xl"
                                            : "bg-white text-slate-700 border border-slate-200 hover:shadow-sm"
                                    }`}
                                    aria-pressed={filter === cat}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filtered.map((p, idx) => (
                        <motion.article
                            key={p.id}
                            layout
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.45, delay: idx * 0.03 }}
                            className="group rounded-2xl overflow-hidden shadow-md bg-white border border-slate-100 flex flex-col transition hover:shadow-xl"
                        >
                            <a
                                href={p.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block flex-1"
                                aria-label={`Visit ${p.title} (opens in a new tab)`}
                            >
                                <div className="relative w-full aspect-[16/10] bg-slate-100 overflow-hidden">
                                    <Cover p={p} />
                                    <div className="absolute left-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-indigo-600 to-rose-500 text-white text-sm font-semibold shadow-md">
                                            Visit site ↗
                                        </span>
                                    </div>
                                </div>

                                <div className="p-4">
                                    <div className="flex items-center justify-between gap-2">
                                        <h3 className="text-base font-semibold text-slate-900">{p.title}</h3>
                                        <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">{p.category ?? "General"}</span>
                                    </div>
                                    <p className="mt-1 text-sm text-slate-600">{p.description}</p>
                                    {p.tags && (
                                        <div className="mt-3 flex flex-wrap gap-1.5">
                                            {p.tags.map(t => (
                                                <span key={t} className="px-2 py-0.5 rounded-full bg-slate-100 text-[11px] font-semibold text-slate-600">{t}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </a>
                            {p.slug && (
                                <div className="px-4 pb-4">
                                    <Link href={`/case-studies/${p.slug}`} className="text-sm font-semibold text-indigo-600 hover:text-indigo-800">
                                        Read case study →
                                    </Link>
                                </div>
                            )}
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* Screenshot cover; falls back to a gradient wordmark card if the file is missing. */
function Cover({ p }: { p: Project }) {
    const [failed, setFailed] = useState(false);
    if (p.imageUrl && !failed) {
        return (
            <Image
                src={p.imageUrl}
                alt={`${p.title} website screenshot`}
                fill
                className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 33vw"
                onError={() => setFailed(true)}
            />
        );
    }
    return (
        <div className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br ${p.gradient ?? "from-slate-700 to-slate-900"}`}>
            <span className="text-white text-2xl font-extrabold tracking-tight px-4 text-center">{p.title}</span>
        </div>
    );
}
