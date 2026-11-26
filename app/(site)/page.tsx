import Link from "next/link";

import ProductShowcase from "@/components/ProductShowcase";
import WhatWeDo from "@/components/WhatWeDo";
import FaqAccordion from "@/components/FaqAccordion";
import CallToAction from "@/components/CallToAction";

const headline = ["Websites, AI Workflows", "& SaaS Products", "Built to Convert."];

export default function Home() {
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
            <h1 className="text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
              {headline.map((line, i) => (
                <span key={line} className="block overflow-hidden pb-1">
                  <span className="reveal-line block" style={{ animationDelay: `${i * 120}ms` }}>
                    {line}
                  </span>
                </span>
              ))}
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-lg text-slate-600 md:text-xl">
              We build MVPs and SaaS products, document and workflow automations, AI-app rescues, and conversion websites that win you customers and take repetitive work off your plate.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/booking"
                className="inline-flex items-center justify-center rounded-full bg-slate-900 px-8 py-3.5 text-base font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                Book a Call
              </Link>
              <a
                href="#products"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-8 py-3.5 text-base font-semibold text-slate-900 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                Explore Our Products
              </a>
            </div>
          </div>
        </section>

        <ProductShowcase />

        <WhatWeDo />

        {/* AI Receptionist CTA (live demo lives on its own gated page) */}
        <section className="bg-white px-4 py-20">
          <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200/80 bg-slate-50 p-10 text-center shadow-sm">
            <p className="text-sm font-semibold text-blue-600">Try Our AI Receptionist</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">Never miss another customer call</h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600">
              A 24/7 AI voice and chat receptionist for Brisbane tradies and local clinics. See it in action, then start a 30-day pilot.
            </p>
            <Link
              href="/ai-receptionist"
              className="mt-8 inline-flex items-center justify-center rounded-full bg-slate-900 px-8 py-3.5 text-base font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              Explore the AI Receptionist
            </Link>
          </div>
        </section>

        {/* Statement */}
        <section className="bg-white px-4 py-20">
          <div className="mx-auto max-w-3xl space-y-5 text-center">
            <p className="text-2xl font-bold leading-snug tracking-tight md:text-3xl">
              We design for innovative thought leaders in all industries, and we don&apos;t stop at design: we also develop and run our own digital products.
            </p>
            <p className="text-lg text-slate-600">
              Building and operating them ourselves keeps our client work grounded in what actually ships.
            </p>
          </div>
        </section>

        <FaqAccordion />
        <CallToAction />
      </main>
    </div>
  );
}
