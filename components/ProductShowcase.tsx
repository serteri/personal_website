import Image from "next/image";
import Link from "next/link";
import SectionHeader from "./SectionHeader";
import { getCaseStudy } from "@/lib/caseStudies";

type Product = {
    slug: string; // case study slug
    name: string;
    host: string; // shown in the browser bar
    url: string;
    headline: string;
    cta: string;
    card: string; // pastel card classes
    badge: string;
};

const products: Product[] = [
    {
        slug: "flightagent",
        name: "FlightAgent",
        host: "flightagent.io",
        url: "https://flightagent.io",
        headline: "Delayed or cancelled flight? Check EU261/UK261 compensation eligibility in seconds.",
        cta: "Try FlightAgent",
        card: "bg-sky-50/70 border-sky-200/60",
        badge: "text-sky-700 border-sky-200 bg-white/80",
    },
    {
        slug: "logivisa",
        name: "Logivisa",
        host: "logivisa.com",
        url: "https://logivisa.com",
        headline: "Navigate visa pathways with clarity. Research tools and structured assessments in one place.",
        cta: "Explore Logivisa",
        card: "bg-indigo-50/70 border-indigo-200/60",
        badge: "text-indigo-700 border-indigo-200 bg-white/80",
    },
    {
        slug: "provider-shield",
        name: "ProviderShield",
        host: "providershield.com.au",
        url: "https://providershield.com.au",
        headline: "NDIS participant documentation review that flags missing details and inconsistencies early.",
        cta: "Visit ProviderShield",
        card: "bg-emerald-50/70 border-emerald-200/60",
        badge: "text-emerald-700 border-emerald-200 bg-white/80",
    },
];

export default function ProductShowcase() {
    return (
        <section id="products" className="bg-white py-20 px-4 scroll-mt-24">
            <div className="mx-auto max-w-6xl">
                <SectionHeader
                    eyebrow="Our products"
                    title="Products We Built & Run"
                    description="Live products we design, build and operate ourselves."
                />

                <div className="space-y-8">
                    {products.map((p, i) => {
                        const cs = getCaseStudy(p.slug);
                        return (
                            <article
                                key={p.slug}
                                className={`group grid grid-cols-1 items-center gap-8 rounded-3xl border p-6 shadow-sm transition-all hover:shadow-md md:p-10 lg:grid-cols-12 ${p.card}`}
                            >
                                <div className={`lg:col-span-5 ${i % 2 === 1 ? "lg:order-2" : ""}`}>
                                    <span
                                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold tracking-wide ${p.badge}`}
                                    >
                                        <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
                                        LIVE PRODUCT
                                    </span>
                                    <h3 className="mt-5 text-lg font-semibold text-slate-600">{p.name}</h3>
                                    <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                                        {p.headline}
                                    </p>
                                    <div className="mt-8 flex flex-wrap items-center gap-4">
                                        <a
                                            href={p.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                                        >
                                            {p.cta} ↗
                                        </a>
                                        {cs && (
                                            <Link
                                                href={`/case-studies/${cs.slug}`}
                                                className="text-sm font-semibold text-slate-700 underline-offset-4 transition-colors hover:text-blue-600 hover:underline"
                                            >
                                                Case Study
                                            </Link>
                                        )}
                                    </div>
                                </div>

                                {/* browser mockup */}
                                <div className={`lg:col-span-7 ${i % 2 === 1 ? "lg:order-1" : ""}`}>
                                    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-lg transition-transform duration-300 group-hover:scale-[1.02]">
                                        <div className="flex items-center gap-2 border-b border-slate-200/80 bg-slate-50 px-4 py-2.5">
                                            <span className="h-2.5 w-2.5 rounded-full bg-slate-300" aria-hidden="true" />
                                            <span className="h-2.5 w-2.5 rounded-full bg-slate-300" aria-hidden="true" />
                                            <span className="h-2.5 w-2.5 rounded-full bg-slate-300" aria-hidden="true" />
                                            <span className="ml-3 truncate rounded-md bg-white px-3 py-0.5 text-xs text-slate-500">
                                                {p.host}
                                            </span>
                                        </div>
                                        <div className="relative aspect-[16/10] w-full bg-slate-100">
                                            {cs?.coverImage && (
                                                <Image
                                                    src={cs.coverImage}
                                                    alt={`${p.name} website screenshot`}
                                                    fill
                                                    className="object-cover object-top"
                                                    sizes="(max-width: 1024px) 90vw, 700px"
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
