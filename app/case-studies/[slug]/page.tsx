import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { caseStudies, getCaseStudy } from "@/lib/caseStudies";

const SITE = "https://www.altiqdesign.com";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
    return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { slug } = await params;
    const cs = getCaseStudy(slug);
    if (!cs) return {};
    return {
        title: `${cs.title} — Case Study`,
        description: cs.summary,
        alternates: { canonical: `${SITE}/case-studies/${cs.slug}` },
    };
}

const label = "font-mono text-xs uppercase tracking-wider text-muted";

export default async function CaseStudyPage({ params }: { params: Params }) {
    const { slug } = await params;
    const cs = getCaseStudy(slug);
    if (!cs) notFound();

    return (
        <main className="bg-[#F4F4F5] text-ink pt-12 pb-20">
            <div className="mx-auto max-w-4xl px-4 sm:px-6">
                <Link href="/#recent-projects" className={`${label} hover:text-cobalt`}>
                    ← Back to projects
                </Link>

                <div className="relative mt-6 aspect-[16/10] w-full overflow-hidden border border-line bg-[#E4E4E7]">
                    {cs.coverImage ? (
                        <Image
                            src={cs.coverImage}
                            alt={`${cs.title} website screenshot`}
                            fill
                            className="object-cover object-top"
                            sizes="(max-width: 896px) 100vw, 896px"
                            priority
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                            {/* TODO(serter): replace with screenshot from /public/projects/ */}
                            <span className={label}>{cs.title}</span>
                        </div>
                    )}
                </div>

                <p className={`mt-10 ${label}`}>
                    {cs.category}
                    {cs.year ? ` · ${cs.year}` : ""}
                </p>
                <h1 className="mt-2 text-5xl font-extrabold tracking-tight">{cs.title}</h1>
                <p className="mt-4 text-lg text-muted">{cs.summary}</p>

                <div className="mt-5 flex flex-wrap gap-2">
                    {cs.tags.map((t) => (
                        <span key={t} className="border border-line bg-white px-2 py-0.5 font-mono text-xs uppercase tracking-wider text-muted">
                            {t}
                        </span>
                    ))}
                </div>

                <a
                    href={cs.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-8 inline-flex bg-[#0047FF] px-8 py-4 text-base font-semibold text-white transition hover:bg-[#0038CC]"
                >
                    Visit live site ↗
                </a>

                {cs.disclaimer && (
                    <p className="mt-8 border-l-2 border-ink bg-white px-4 py-3 text-sm text-muted">{cs.disclaimer}</p>
                )}

                <div className="mt-12 border-t border-ink/15">
                    <section className="grid grid-cols-1 gap-4 border-b border-line py-8 md:grid-cols-12">
                        <h2 className={`md:col-span-3 ${label}`}>01 / Problem</h2>
                        <p className="md:col-span-9 text-lg leading-relaxed">{cs.problem}</p>
                    </section>

                    <section className="grid grid-cols-1 gap-4 border-b border-line py-8 md:grid-cols-12">
                        <h2 className={`md:col-span-3 ${label}`}>02 / What we built</h2>
                        <ul className="md:col-span-9 list-disc space-y-2 pl-5 text-lg">
                            {cs.built.map((b) => (
                                <li key={b}>{b}</li>
                            ))}
                        </ul>
                    </section>

                    {cs.stack.length > 0 && (
                        <section className="grid grid-cols-1 gap-4 border-b border-line py-8 md:grid-cols-12">
                            <h2 className={`md:col-span-3 ${label}`}>03 / Stack</h2>
                            <div className="md:col-span-9 flex flex-wrap gap-2">
                                {cs.stack.map((s) => (
                                    <span key={s} className="border border-line bg-white px-3 py-1 font-mono text-xs uppercase tracking-wider">
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </section>
                    )}

                    <section className="grid grid-cols-1 gap-4 border-b border-line py-8 md:grid-cols-12">
                        <h2 className={`md:col-span-3 ${label}`}>{cs.stack.length > 0 ? "04" : "03"} / Outcome</h2>
                        <div className="md:col-span-9">
                            <ul className="list-disc space-y-2 pl-5 text-lg">
                                {cs.outcome.map((o) => (
                                    <li key={o}>{o}</li>
                                ))}
                            </ul>
                            {/* TODO(serter): add real metric — render nothing until a verified number exists */}
                            {cs.metric && (
                                <p className="mt-4 font-semibold">
                                    {cs.metric.label}: {cs.metric.value}
                                </p>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}
