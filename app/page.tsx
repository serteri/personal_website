import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import ClientsLogos from "@/components/ClientsLogos";
import WhatWeDo from "@/components/WhatWeDo";
import FaqAccordion from "@/components/FaqAccordion";
import CallToAction from "@/components/CallToAction";
import { caseStudies } from "@/lib/caseStudies";
import RecentProjectsColorful, { Project } from "@/components/RecentProjectsColorful";

const projects: Project[] = caseStudies.map((c, i) => ({
  id: `own-${c.slug}`,
  title: c.title,
  description: c.summary,
  link: c.liveUrl,
  slug: c.slug,
  imageUrl: c.coverImage,
  tags: c.tags,
  category: c.category,
  index: i,
}));

const headline = ["Websites, AI Workflows", "& SaaS Products", "Built to Convert."];

const index = [
  { n: "01", label: "Services", href: "#services" },
  { n: "02", label: "Selected Work", href: "#recent-projects" },
  { n: "03", label: "FAQ", href: "#faq" },
];

export default function Home() {
  return (
    <div className="bg-[#F4F4F5] text-[#18181B]">
      <main>
        {/* Hero: left-aligned, asymmetric 8/4 grid */}
        <section className="border-b border-line">
          <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-12 px-4 sm:px-6 lg:px-8">
            <div className="lg:col-span-8 py-16 md:py-24 lg:pr-12">
              <p className="font-mono text-xs uppercase tracking-wider text-muted">ALTIQDESIGN</p>
              <h1 className="mt-6 text-5xl sm:text-6xl font-extrabold tracking-tight leading-[1.02]">
                {headline.map((line, i) => (
                  <span key={line} className="block overflow-hidden pb-1">
                    <span className="reveal-line block" style={{ animationDelay: `${i * 120}ms` }}>
                      {line}
                    </span>
                  </span>
                ))}
              </h1>
              <p className="mt-8 max-w-xl text-lg text-muted">
                We don&apos;t just design pages. We build modern web systems that win you customers and take repetitive work off your plate.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/booking"
                  className="inline-flex items-center justify-center bg-[#0047FF] px-8 py-4 text-base font-semibold text-white transition hover:bg-[#0038CC]"
                >
                  Book a Call
                </Link>
                <a
                  href="#recent-projects"
                  className="inline-flex items-center justify-center border border-[#18181B] bg-transparent px-8 py-4 text-base font-semibold text-[#18181B] transition hover:bg-[#18181B] hover:text-white"
                >
                  View Projects
                </a>
              </div>
            </div>

            <aside className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-line py-10 lg:py-24 lg:pl-8 flex flex-col justify-end">
              <p className="font-mono text-xs uppercase tracking-wider text-muted mb-4">Index</p>
              <ul className="border-t border-line">
                {index.map((item) => (
                  <li key={item.n} className="border-b border-line">
                    <a
                      href={item.href}
                      className="group flex items-center justify-between py-4 font-mono text-xs uppercase tracking-wider transition-colors hover:text-[#0047FF]"
                    >
                      <span>
                        {item.n} / {item.label}
                      </span>
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </section>

        {/* Statement */}
        <section className="border-b border-line bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
            <div className="max-w-3xl space-y-6 text-2xl md:text-3xl font-bold tracking-tight leading-snug">
              <p>
                We design for innovative thought leaders in all industries, and we don&apos;t stop at design: we also develop and run our own digital products.
              </p>
              <p className="text-muted font-normal text-xl md:text-2xl">
                Building and operating them ourselves keeps our client work grounded in what actually ships.
              </p>
            </div>
          </div>
        </section>

        <ClientsLogos />

        <WhatWeDo />

        <div id="recent-projects" className="scroll-mt-24">
          <RecentProjectsColorful projects={projects} />
        </div>

        <FaqAccordion />
        <CallToAction />
      </main>
    </div>
  );
}
