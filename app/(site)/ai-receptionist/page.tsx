import type { Metadata } from "next";
import Link from "next/link";
import ReceptionistDemo from "@/components/ReceptionistDemo";
import SectionHeader from "@/components/SectionHeader";
import PlanCheckoutButton from "@/components/PlanCheckoutButton";

export const metadata: Metadata = {
  title: "AI Receptionist for Brisbane Tradies & Clinics | ALTIQDESIGN",
  description:
    "A 24/7 AI voice and chat receptionist for Brisbane tradies and local clinics. Keep your number, forward missed calls, get instant job summaries and bookings.",
};

const steps = [
  { n: "1", title: "Keep your existing business number", text: "No new number, no new phone. Your customers keep calling the number they already know." },
  { n: "2", title: "Forward missed/after-hours calls in 10 seconds", text: "Switch on call forwarding from your phone settings. Calls you can't pick up go to your AI receptionist." },
  { n: "3", title: "Get instant job summaries & bookings", text: "Each call becomes a short summary with urgency, issue and suburb, plus a booking request, sent to you straight away." },
];

const pilotFeatures = ["$0 setup fee", "100 voice minutes", "24/7 Web Chat included", "Cancel anytime"];

const plans = [
  {
    key: "starter" as const,
    name: "Starter",
    price: "$149",
    features: ["150 voice minutes / month", "24/7 Web Chat", "Instant job summaries", "$0.60/min overage"],
  },
  {
    key: "growth" as const,
    name: "Growth",
    price: "$249",
    features: ["400 voice minutes / month", "24/7 Web Chat", "Calendar integration", "Custom suburb rules", "$0.50/min overage"],
  },
];

export default function AiReceptionistPage() {
  return (
    <div className="bg-white text-slate-900">
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-white">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 70% 60% at 50% -10%, rgba(37,99,235,0.10), transparent 70%), radial-gradient(ellipse 40% 40% at 90% 20%, rgba(99,102,241,0.06), transparent 70%)",
            }}
          />
          <div className="relative mx-auto max-w-4xl px-4 py-24 text-center md:py-32">
            <p className="text-sm font-semibold text-blue-600">For Brisbane tradies &amp; local clinics</p>
            <h1 className="mt-3 text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">Never Miss Another Brisbane Job Call</h1>
            <p className="mx-auto mt-8 max-w-2xl text-lg text-slate-600 md:text-xl">
              24/7 AI Voice &amp; Chat Receptionist. It answers every call, qualifies the job, and books it in while you&apos;re on the tools.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="#demo"
                className="inline-flex items-center justify-center rounded-full bg-slate-900 px-8 py-3.5 text-base font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                Test Live Voice Demo
              </a>
              <PlanCheckoutButton
                plan="pilot"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-8 py-3.5 text-base font-semibold text-slate-900 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                Start 30-Day Pilot
              </PlanCheckoutButton>
            </div>
          </div>
        </section>

        {/* Live demo */}
        <ReceptionistDemo defaultTab="voice" />

        {/* How it works */}
        <section className="bg-slate-50 px-4 py-20">
          <div className="mx-auto max-w-6xl">
            <SectionHeader eyebrow="How It Works" title="Live in three simple steps" />
            <div className="grid gap-6 md:grid-cols-3">
              {steps.map((s) => (
                <div key={s.n} className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-sm">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 font-mono text-sm font-bold text-white">{s.n}</span>
                  <h3 className="mt-5 text-lg font-semibold text-slate-900">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="scroll-mt-24 bg-white px-4 py-20">
          <div className="mx-auto max-w-6xl">
            <SectionHeader eyebrow="Pricing" title="Start with a 30-day pilot" description="All prices in AUD. Try it on real calls before you commit." />

            <div className="rounded-3xl border border-slate-900 bg-slate-900 p-8 text-white shadow-sm md:p-10">
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">Most popular way to start</span>
              <div className="mt-5 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                <div>
                  <h3 className="text-2xl font-semibold">30-Day Brisbane Pilot</h3>
                  <p className="mt-2 text-5xl font-bold tracking-tight">
                    $99 <span className="text-lg font-medium text-slate-400">AUD</span>
                  </p>
                  <ul className="mt-6 grid gap-2 text-sm text-slate-200 sm:grid-cols-2">
                    {pilotFeatures.map((f) => (
                      <li key={f} className="flex items-center gap-2">
                        <span className="text-blue-400" aria-hidden="true">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <PlanCheckoutButton
                  plan="pilot"
                  className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3.5 text-base font-semibold text-slate-900 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  Start 30-Day Pilot — $99
                </PlanCheckoutButton>
              </div>
            </div>

            <p className="mb-4 mt-12 text-sm font-semibold text-slate-900">After the pilot, keep going on:</p>
            <div className="grid gap-6 md:grid-cols-2">
              {plans.map((p) => (
                <div key={p.name} className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-900">{p.name}</h3>
                  <p className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
                    {p.price}
                    <span className="text-base font-medium text-slate-500">/mo</span>
                  </p>
                  <ul className="mt-6 space-y-2 text-sm text-slate-700">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-center gap-2">
                        <span className="text-blue-600" aria-hidden="true">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <PlanCheckoutButton
                    plan={p.key}
                    className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                  >
                    Choose {p.name}
                  </PlanCheckoutButton>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="bg-slate-50 px-4 py-20">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Based in Albion, Brisbane — built and configured locally for your business.
            </h2>
            <Link
              href="/booking"
              className="mt-8 inline-flex items-center justify-center rounded-full bg-slate-900 px-8 py-3.5 text-base font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              Book a Call
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
