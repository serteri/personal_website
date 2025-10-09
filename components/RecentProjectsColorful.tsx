// components/RecentProjectsColorful.tsx
"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export interface Project {
    id: string;
    title: string;
    description?: string;
    imageUrl: string;
    link?: string;
    category?: string;
    index: number;
}

/* uniq helper */
const uniq = (arr: (string | undefined)[]) => Array.from(new Set(arr.filter(Boolean) as string[]));

interface Props { projects: Project[]; subtitle?: string; }

export default function RecentProjectsColorful({ projects, subtitle }: Props) {
    const [filter, setFilter] = useState<string>("All");
    const [modalProject, setModalProject] = useState<Project | null>(null);
    const categories = useMemo(() => ["All", ...uniq(projects.map(p => p.category))], [projects]);
    const filtered = useMemo(() => filter === "All" ? projects : projects.filter(p => p.category === filter), [projects, filter]);

    // prefers-reduced-motion
    const prefersReduced = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Palette notes: we use Tailwind built-in utility colors and gradients.
    // If you want brand-specific colors, add them to tailwind.config.js and replace classes.
    return (
        <section className="py-12 bg-gradient-to-b from-white via-rose-50 to-indigo-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Recent Projects</h2>
                        <p className="mt-1 text-sm text-slate-700 max-w-xl">
                            {subtitle ?? "Vibrant, brand-forward projects — click any card to explore the full case."}
                        </p>
                    </div>

                    {/* Filters */}
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
                </div>

                {/* Grid */}
                <div
                    className="grid gap-6"
                    style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}
                >
                    {filtered.map((p, idx) => (
                        <motion.article
                            key={p.id}
                            layout
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 6 }}
                            transition={{ duration: 0.45, delay: idx * 0.03 }}
                            className="relative group"
                        >
                            <motion.button
                                onClick={() => setModalProject(p)}
                                whileHover={prefersReduced ? {} : { scale: 1.02 }}
                                whileTap={prefersReduced ? {} : { scale: 0.995 }}
                                className="w-full text-left rounded-2xl overflow-hidden shadow-md bg-white border border-slate-100"
                                aria-label={`Open project ${p.title}`}
                            >
                                {/* Thumb area */}
                                <div className="relative w-full aspect-[4/3] bg-gradient-to-tr from-purple-100 via-pink-50 to-amber-50">
                                    <Image
                                        src={p.imageUrl}                // örn: /images/guneysan-thumb.jpg (küçük)
                                        alt={p.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 33vw"
                                        priority={false}
                                        // optional: quality, e.g. quality={75}
                                    />

                                    {/* Colorful overlay - appears on hover */}
                                    <div className="absolute inset-0 pointer-events-none">
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                             style={{ background: "linear-gradient(120deg, rgba(99,102,241,0.18), rgba(236,72,153,0.12) 40%, rgba(250,204,21,0.08) 80%)" }} />
                                        {/* neon glow edges */}
                                        <div className="absolute -inset-px rounded-2xl blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-300"
                                             style={{ boxShadow: "0 10px 40px rgba(99,102,241,0.12), inset 0 0 30px rgba(236,72,153,0.06)" }} />
                                    </div>

                                    {/* CTA pill */}
                                    <div className="absolute left-4 bottom-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-indigo-600 to-rose-500 text-white text-sm font-semibold shadow-md">
                      View Case →
                    </span>
                                    </div>
                                </div>

                                {/* meta */}
                                <div className="p-3 md:p-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm md:text-base font-semibold text-slate-900">{p.title}</h3>
                                        <span className="text-xs text-slate-500">{p.category ?? "General"}</span>
                                    </div>
                                    <p className="mt-1 text-xs text-slate-600 line-clamp-3">{p.description}</p>
                                </div>
                            </motion.button>

                            {/* Accent floating corner */}
                            <div className="pointer-events-none absolute -top-3 -right-3 w-14 h-14 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                                 style={{ background: "linear-gradient(135deg, rgba(236,72,153,0.18), rgba(99,102,241,0.16))", filter: "blur(18px)" }} />
                        </motion.article>
                    ))}
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {modalProject && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
                        onClick={() => setModalProject(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.98, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.98, y: 20 }}
                            transition={{ duration: 0.24 }}
                            className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="relative w-full aspect-[16/9] bg-slate-100">
                                <Image
                                    src={modalProject.imageUrl}
                                    alt={modalProject.title}
                                    fill
                                    className="object-cover"
                                />
                                {/* modal overlay accent */}
                                <div className="absolute inset-0 pointer-events-none"
                                     style={{ background: "linear-gradient(180deg, rgba(8,145,178,0.06), rgba(236,72,153,0.03))" }} />
                            </div>

                            <div className="p-6">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h3 className="text-2xl font-bold text-slate-900">{modalProject.title}</h3>
                                        {modalProject.category && <p className="text-sm text-slate-500 mt-1">{modalProject.category}</p>}
                                    </div>
                                    <div className="ml-auto flex items-center gap-3">
                                        {modalProject.link && (
                                            <a
                                                href={modalProject.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-rose-500 to-indigo-600 text-white text-sm font-semibold shadow"
                                            >
                                                Visit Site
                                            </a>
                                        )}
                                        <button onClick={() => setModalProject(null)} className="text-slate-500 hover:text-slate-800 px-3 py-2 rounded">
                                            Close
                                        </button>
                                    </div>
                                </div>

                                <p className="mt-4 text-sm text-slate-700 leading-relaxed">{modalProject.description}</p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
