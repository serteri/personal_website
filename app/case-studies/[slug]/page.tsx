import type { Metadata } from "next";
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

export default async function CaseStudyPage({ params }: { params: Params }) {
    const { slug } = await params;
    const cs = getCaseStudy(slug);
    if (!cs) notFound();

    return (
        <main className="bg-white text-slate-900 pt-28 pb-20">
            <div className="max-w-3xl mx-auto px-4 sm:px-6">
                <Link href="/#recent-projects-heading" className="text-sm text-slate-500 hover:text-slate-800">
                    ← Back to projects
                </Link>

                <div className={`mt-6 rounded-3xl aspect-[16/9] bg-gradient-to-br ${cs.gradient} flex items-center justify-center`}>
                    {/* TODO(serter): replace with screenshot from /public/projects/ */}
                    <span className="text-white text-4xl sm:text-5xl font-extrabold tracking-tight px-6 text-center">{cs.title}</span>
                </div>

                <p className="mt-8 text-sm font-semibold text-slate-500">
                    {cs.category}
                    {cs.year ? ` · ${cs.year}` : ""}
                </p>
                <h1 className="mt-1 text-4xl font-extrabold">{cs.title}</h1>
                <p className="mt-3 text-lg text-slate-700">{cs.summary}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                    {cs.tags.map((t) => (
                        <span key={t} className="px-3 py-1 rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
                            {t}
                        </span>
                    ))}
                </div>

                <a
                    href={cs.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex mt-6 px-5 py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-indigo-600 text-white text-sm font-semibold shadow"
                >
                    Visit live site ↗
                </a>

                {cs.disclaimer && (
                    <p className="mt-6 text-sm text-slate-600 border-l-4 border-slate-300 pl-3">{cs.disclaimer}</p>
                )}

                <section className="mt-12">
                    <h2 className="text-2xl font-bold">Problem</h2>
                    <p className="mt-3 text-slate-700 leading-relaxed">{cs.problem}</p>
                </section>

                <section className="mt-10">
                    <h2 className="text-2xl font-bold">What we built</h2>
                    <ul className="mt-3 list-disc pl-5 space-y-1 text-slate-700">
                        {cs.built.map((b) => (
                            <li key={b}>{b}</li>
                        ))}
                    </ul>
                </section>

                {cs.stack.length > 0 && (
                    <section className="mt-10">
                        <h2 className="text-2xl font-bold">Stack</h2>
                        <div className="mt-3 flex flex-wrap gap-2">
                            {cs.stack.map((s) => (
                                <span key={s} className="px-3 py-1 rounded-full border border-slate-200 text-sm text-slate-700">
                                    {s}
                                </span>
                            ))}
                        </div>
                    </section>
                )}

                <section className="mt-10">
                    <h2 className="text-2xl font-bold">Outcome</h2>
                    <ul className="mt-3 list-disc pl-5 space-y-1 text-slate-700">
                        {cs.outcome.map((o) => (
                            <li key={o}>{o}</li>
                        ))}
                    </ul>
                    {/* TODO(serter): add real metric — render nothing until a verified number exists */}
                    {cs.metric && (
                        <p className="mt-4 text-slate-900 font-semibold">
                            {cs.metric.label}: {cs.metric.value}
                        </p>
                    )}
                </section>
            </div>
        </main>
    );
}
