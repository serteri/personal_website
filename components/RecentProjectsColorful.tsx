// components/RecentProjectsColorful.tsx  (Swiss / industrial layout)
"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import SwissHeader from "./SwissHeader";

export interface Project {
    id: string;
    title: string;
    description?: string;
    imageUrl?: string; // screenshot in /public/projects/; flat placeholder is used if missing
    link?: string; // live site
    slug?: string; // when set, a case study page exists at /case-studies/[slug]
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
        <section className="bg-[#F4F4F5] border-b border-line py-20 px-4">
            <div className="mx-auto max-w-7xl sm:px-2 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <SwissHeader index="02" label="SELECTED WORK" title="Recent Projects" />
                        {subtitle && <p className="-mt-6 mb-10 text-muted max-w-xl">{subtitle}</p>}
                    </div>

                    {/* Filters: only shown when there is more than one real category */}
                    {categories.length > 2 && (
                        <div className="mb-10 flex flex-wrap gap-2">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setFilter(cat)}
                                    className={`px-3 py-1.5 border font-mono text-xs uppercase tracking-wider transition-colors ${
                                        filter === cat
                                            ? "border-[#0047FF] bg-[#0047FF] text-white"
                                            : "border-line bg-white text-ink hover:border-ink"
                                    }`}
                                    aria-pressed={filter === cat}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-line">
                    {filtered.map((p, idx) => (
                        <article key={p.id} className="group flex flex-col border-r border-b border-line bg-white">
                            <a
                                href={p.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block flex-1"
                                aria-label={`Visit ${p.title} (opens in a new tab)`}
                            >
                                <div className="flex items-center justify-between border-b border-line px-4 py-3 font-mono text-xs uppercase tracking-wider text-muted">
                                    <span>[{String(idx + 1).padStart(2, "0")}]</span>
                                    <span className="flex items-center gap-3">
                                        {p.category ?? "General"}
                                        <ArrowUpRight
                                            className="h-4 w-4 text-ink transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-cobalt"
                                            aria-hidden="true"
                                        />
                                    </span>
                                </div>

                                {/* image stays inside its frame and scales within it */}
                                <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-line bg-[#E4E4E7]">
                                    <Cover p={p} />
                                </div>

                                <div className="p-5">
                                    <h3 className="text-xl font-bold tracking-tight text-ink">{p.title}</h3>
                                    <p className="mt-2 text-sm text-muted">{p.description}</p>
                                    {p.tags && (
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {p.tags.map(t => (
                                                <span key={t} className="border border-line px-2 py-0.5 font-mono text-xs uppercase tracking-wider text-muted">{t}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </a>
                            {p.slug && (
                                <div className="border-t border-line px-5 py-3">
                                    <Link href={`/case-studies/${p.slug}`} className="font-mono text-xs uppercase tracking-wider text-ink transition-colors hover:text-cobalt">
                                        Read case study →
                                    </Link>
                                </div>
                            )}
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* Screenshot cover; falls back to a flat typographic card if the file is missing. */
function Cover({ p }: { p: Project }) {
    const [failed, setFailed] = useState(false);
    if (p.imageUrl && !failed) {
        return (
            <Image
                src={p.imageUrl}
                alt={`${p.title} website screenshot`}
                fill
                className="object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
                sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 33vw"
                onError={() => setFailed(true)}
            />
        );
    }
    return (
        <div className="absolute inset-0 flex items-center justify-center bg-[#E4E4E7]">
            <span className="px-4 text-center font-mono text-sm uppercase tracking-wider text-ink">{p.title}</span>
        </div>
    );
}
