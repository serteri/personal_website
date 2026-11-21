import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getService, services } from "@/lib/services";

const SITE = "https://www.altiqdesign.com";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
    return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { slug } = await params;
    const s = getService(slug);
    if (!s) return {};
    return {
        title: `${s.title} — ${s.scope}`,
        description: s.summary,
        alternates: { canonical: `${SITE}/services/${s.slug}` },
    };
}

const label = "font-mono text-xs uppercase tracking-wider text-muted";

export default async function ServicePage({ params }: { params: Params }) {
    const { slug } = await params;
    const s = getService(slug);
    if (!s) notFound();

    return (
        <main className="bg-[#F4F4F5] text-ink">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 pt-12 pb-20">
                <Link href="/#services" className={`${label} hover:text-cobalt`}>
                    ← ALL SERVICES
                </Link>

                <div className="mt-10 flex items-center gap-4">
                    <span className={label}>{s.number}</span>
                    <span className="border border-line bg-white px-2 py-0.5 font-mono text-xs uppercase tracking-wider text-ink">
                        {s.scope}
                    </span>
                </div>
                <h1 className="mt-4 text-4xl md:text-6xl font-extrabold tracking-tight">{s.title}</h1>
                <p className="mt-6 max-w-2xl text-lg text-muted">{s.summary}</p>

                <div className="mt-12 border-t border-ink/15">
                    <section className="grid grid-cols-1 gap-4 border-b border-line py-8 md:grid-cols-12">
                        <h2 className={`md:col-span-3 ${label}`}>WHO IT&apos;S FOR</h2>
                        <ul className="md:col-span-9 space-y-3 text-lg">
                            {s.whoFor.map((w) => (
                                <li key={w} className="border-l-2 border-ink pl-4">{w}</li>
                            ))}
                        </ul>
                    </section>

                    <section className="grid grid-cols-1 gap-4 border-b border-line py-8 md:grid-cols-12">
                        <h2 className={`md:col-span-3 ${label}`}>WHAT&apos;S INCLUDED</h2>
                        <ul className="md:col-span-9 border-t border-l border-line">
                            {s.included.map((item, i) => (
                                <li key={item} className="flex gap-4 border-r border-b border-line bg-white px-4 py-3">
                                    <span className={label}>{String(i + 1).padStart(2, "0")}</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </section>

                    {s.relatedProducts && s.relatedProducts.length > 0 && (
                        <section className="grid grid-cols-1 gap-4 border-b border-line py-8 md:grid-cols-12">
                            <h2 className={`md:col-span-3 ${label}`}>BUILT IN-HOUSE / LIVE EXAMPLE</h2>
                            <ul className="md:col-span-9 border-t border-l border-line">
                                {s.relatedProducts.map((prod) => (
                                    <li
                                        key={prod.name}
                                        className="flex flex-col gap-3 border-r border-b border-line bg-white p-5 sm:flex-row sm:items-center sm:justify-between"
                                    >
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <h3 className="text-lg font-bold tracking-tight">{prod.name}</h3>
                                                <span className="border border-cobalt px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-cobalt">
                                                    LIVE
                                                </span>
                                            </div>
                                            <p className="mt-1 text-sm text-muted">{prod.benefit}</p>
                                        </div>
                                        <a
                                            href={prod.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="shrink-0 font-mono text-xs uppercase tracking-wider text-ink transition-colors hover:text-cobalt"
                                        >
                                            VISIT PRODUCT ↗
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    <section className="grid grid-cols-1 gap-4 border-b border-line py-8 md:grid-cols-12">
                        <h2 className={`md:col-span-3 ${label}`}>PROCESS</h2>
                        <ol className="md:col-span-9 grid grid-cols-1 border-t border-l border-line sm:grid-cols-3">
                            {s.process.map((step, i) => (
                                <li key={step.title} className="border-r border-b border-line bg-white p-5">
                                    <span className={label}>{String(i + 1).padStart(2, "0")}</span>
                                    <h3 className="mt-3 text-lg font-bold tracking-tight">{step.title}</h3>
                                    <p className="mt-2 text-sm text-muted">{step.text}</p>
                                </li>
                            ))}
                        </ol>
                    </section>
                </div>

                <div className="mt-12 flex flex-col gap-6 bg-[#18181B] p-8 text-[#FAFAFA] md:flex-row md:items-center md:justify-between">
                    <p className="text-2xl font-extrabold tracking-tight">Want this for your project?</p>
                    <Link
                        href="/booking"
                        className="inline-flex items-center justify-center bg-[#0047FF] px-8 py-4 text-base font-semibold text-white transition hover:bg-[#0038CC]"
                    >
                        Book a Call
                    </Link>
                </div>
            </div>
        </main>
    );
}
