import Link from 'next/link'
import SectionHeader from '@/components/SectionHeader'
import { tradeLandings, type TradeLanding } from '@/lib/tradeLandings'

const SITE = 'https://www.altiqdesign.com'

// "<" escaped so the JSON can never close the script tag
const jsonLd = (data: object) => JSON.stringify(data).replace(/</g, '\\u003c')

export default function TradeLandingPage({ t }: { t: TradeLanding }) {
    const url = `${SITE}/${t.slug}`
    const service = {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: t.serviceName,
        serviceType: 'AI receptionist and after-hours call answering',
        description: t.serviceDescription,
        url,
        areaServed: { '@type': 'AdministrativeArea', name: 'Brisbane, QLD, Australia' },
        provider: { '@type': 'ProfessionalService', name: 'Altiq Design', url: SITE, telephone: '0432 672 696' },
        audience: { '@type': 'Audience', audienceType: `Brisbane ${t.trade}` },
    }
    const faq = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: t.faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    }
    const others = tradeLandings.filter((o) => o.slug !== t.slug)

    return (
        <div className="bg-white text-slate-900">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(service) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(faq) }} />
            <main>
                {/* Hero */}
                <section className="relative overflow-hidden bg-white">
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0"
                        style={{ background: 'radial-gradient(ellipse 70% 60% at 50% -10%, rgba(37,99,235,0.10), transparent 70%)' }}
                    />
                    <div className="relative mx-auto max-w-4xl px-4 py-20 text-center md:py-28">
                        <p className="text-sm font-semibold text-blue-600">{t.eyebrow}</p>
                        <h1 className="mt-3 text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl">{t.h1}</h1>
                        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 md:text-xl">{t.subhead}</p>
                        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                            <Link
                                href="/ai-receptionist#demo"
                                className="inline-flex items-center justify-center rounded-full bg-slate-900 px-8 py-3.5 text-base font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                            >
                                Try the Live Voice Demo
                            </Link>
                            <Link
                                href="/booking"
                                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-8 py-3.5 text-base font-semibold text-slate-900 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                            >
                                Book a 20-min Setup Call
                            </Link>
                        </div>
                        <p className="mt-4 text-sm text-slate-500">$99 AUD 30-day pilot · $0 setup fee · keep your existing number · cancel anytime</p>
                    </div>
                </section>

                {/* Scenarios */}
                <section className="bg-slate-50 px-4 py-20">
                    <div className="mx-auto max-w-6xl">
                        <SectionHeader eyebrow="Real jobs, real calls" title={t.scenariosTitle} description={t.scenariosIntro} />
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {t.scenarios.map((s) => (
                                <div key={s.title} className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-sm">
                                    <h3 className="text-lg font-semibold text-slate-900">{s.title}</h3>
                                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Triage + what's captured */}
                <section className="px-4 py-20">
                    <div className="mx-auto max-w-6xl">
                        <SectionHeader eyebrow="Triage" title={t.triageTitle} description="You set the rules. Sam follows them on every call, at 2pm or 2am." />
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="rounded-3xl border border-red-200 bg-red-50/60 p-8">
                                <h3 className="text-lg font-semibold text-slate-900">Treated as urgent</h3>
                                <ul className="mt-4 space-y-2 text-sm text-slate-700">
                                    {t.urgent.map((u) => (
                                        <li key={u} className="flex gap-2"><span className="text-red-600" aria-hidden="true">●</span>{u}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-sm">
                                <h3 className="text-lg font-semibold text-slate-900">Can wait until you’re free</h3>
                                <ul className="mt-4 space-y-2 text-sm text-slate-700">
                                    {t.routine.map((r) => (
                                        <li key={r} className="flex gap-2"><span className="text-blue-600" aria-hidden="true">●</span>{r}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className="mt-6 rounded-3xl bg-slate-900 p-8 text-white">
                            <h3 className="text-lg font-semibold">Every call, captured for you</h3>
                            <ul className="mt-4 grid gap-2 text-sm text-slate-200 sm:grid-cols-2">
                                {t.captured.map((c) => (
                                    <li key={c} className="flex gap-2"><span className="text-blue-400" aria-hidden="true">✓</span>{c}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                {/* How it works */}
                <section className="bg-slate-50 px-4 py-20">
                    <div className="mx-auto max-w-6xl">
                        <SectionHeader eyebrow="How it works" title="Live in three simple steps" />
                        <div className="grid gap-6 md:grid-cols-3">
                            {t.steps.map((s, i) => (
                                <div key={s.title} className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-sm">
                                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 font-mono text-sm font-bold text-white">{i + 1}</span>
                                    <h3 className="mt-5 text-lg font-semibold text-slate-900">{s.title}</h3>
                                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FAQ */}
                <section className="px-4 py-20">
                    <div className="mx-auto max-w-3xl">
                        <SectionHeader eyebrow="FAQ" title={`Questions from Brisbane ${t.trade}`} />
                        <div className="divide-y divide-slate-200 rounded-3xl border border-slate-200/80 bg-white shadow-sm">
                            {t.faqs.map((f) => (
                                <details key={f.q} className="group p-6">
                                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-slate-900">
                                        {f.q}
                                        <span aria-hidden="true" className="text-slate-400 transition-transform group-open:rotate-45">+</span>
                                    </summary>
                                    <p className="mt-3 text-sm leading-relaxed text-slate-600">{f.a}</p>
                                </details>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Bottom CTA + internal links */}
                <section className="bg-slate-50 px-4 py-20">
                    <div className="mx-auto max-w-3xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">Hear it handle a {t.tradeSingular} call before you decide.</h2>
                        <p className="mt-4 text-slate-600">Based in Albion, Brisbane. Built and configured locally for your business.</p>
                        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                            <Link href="/ai-receptionist#demo" className="inline-flex items-center justify-center rounded-full bg-slate-900 px-8 py-3.5 text-base font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                                Try the Live Voice Demo
                            </Link>
                            <Link href="/booking" className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-8 py-3.5 text-base font-semibold text-slate-900 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                                Book a 20-min Setup Call
                            </Link>
                        </div>
                        <p className="mt-8 text-sm text-slate-500">
                            See{' '}
                            <Link href="/ai-receptionist#pricing" className="font-semibold text-blue-600 hover:underline">pricing</Link>
                            {' · '}
                            <Link href="/ai-receptionist" className="font-semibold text-blue-600 hover:underline">AI receptionist overview</Link>
                            {others.map((o) => (
                                <span key={o.slug}>
                                    {' · '}
                                    <Link href={`/${o.slug}`} className="font-semibold text-blue-600 hover:underline">For Brisbane {o.trade}</Link>
                                </span>
                            ))}
                        </p>
                    </div>
                </section>
            </main>
        </div>
    )
}
