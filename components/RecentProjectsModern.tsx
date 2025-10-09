// components/RecentProjectsModern.tsx
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
}

/* tiny helper for unique categories (you asked earlier) */
const uniq = (arr: (string | undefined)[]) => Array.from(new Set(arr.filter(Boolean) as string[]));

interface Props { projects: Project[]; initialText?: string; }

export default function RecentProjectsModern({ projects, initialText }: Props) {
    const [filter, setFilter] = useState<string>("All");
    const [modalProject, setModalProject] = useState<Project | null>(null);

    const categories = useMemo(() => ["All", ...uniq(projects.map(p => p.category))], [projects]);

    const filtered = useMemo(() => {
        if (filter === "All") return projects;
        return projects.filter(p => p.category === filter);
    }, [projects, filter]);

    const prefersReduced = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    return (
        <section className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Recent Projects</h2>
                        <p className="mt-1 text-sm text-slate-600 max-w-xl">
                            {initialText ?? "Selected projects — functional, refined, and intentional."}
                        </p>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap gap-3">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`px-3 py-1.5 rounded-full text-sm font-medium transition focus:outline-none ${
                                    filter === cat
                                        ? "bg-slate-900 text-white shadow-md"
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
                                className="w-full text-left rounded-xl overflow-hidden shadow-sm bg-white border border-slate-100"
                                aria-label={`Open project ${p.title}`}
                            >
                                {/* Thumb area (compact size) */}
                                <div className="relative w-full aspect-[4/3] bg-slate-100">
                                    <Image
                                        src={p.imageUrl}
                                        alt={p.title}
                                        fill
                                        sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 33vw"
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        priority={false}
                                    />
                                    {/* overlay and CTA */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="absolute left-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 text-sm font-medium text-slate-900">
                      View Project →
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
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
                        onClick={() => setModalProject(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.98, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.98, y: 20 }}
                            transition={{ duration: 0.22 }}
                            className="max-w-3xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="relative w-full aspect-[16/9] bg-slate-100">
                                <Image
                                    src={modalProject.imageUrl}
                                    alt={modalProject.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="p-5">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900">{modalProject.title}</h3>
                                        {modalProject.category && <p className="text-sm text-slate-500 mt-1">{modalProject.category}</p>}
                                    </div>
                                    <div className="ml-auto flex items-center gap-2">
                                        {modalProject.link && (
                                            <a
                                                href={modalProject.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-slate-900 text-white text-sm"
                                            >Visit</a>
                                        )}
                                        <button onClick={() => setModalProject(null)} className="text-slate-500 hover:text-slate-700 px-3 py-2 rounded">Close</button>
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
