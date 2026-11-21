"use client";

import { useLayoutEffect, useRef } from "react";

import Link from "next/link";
import { gsap } from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";

import ClientsLogos from "@/components/ClientsLogos";
import WhatWeDo from "@/components/WhatWeDo"; // Yeni component'i import et
import FaqAccordion from "@/components/FaqAccordion";
import CallToAction from "@/components/CallToAction";

import { caseStudies } from "@/lib/caseStudies";
import RecentProjectsColorful, { Project } from "@/components/RecentProjectsColorful";
gsap.registerPlugin(ScrollTrigger);

export default function Home() {

  // const [activeColor, setActiveColor] = useState<string>("#EFEEEA");

  // Referanslar
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLElement>(null);
  const recentProjectsContainerRef = useRef<HTMLDivElement>(null);
  const whatWeDoRef = useRef<HTMLDivElement>(null); // Yeni bölüm için ref

  const faqRef = useRef<HTMLDivElement>(null);


  const clientsRef = useRef<HTMLDivElement>(null); // Clients bölümü için yeni ref

  const projects: Project[] = [
    ...caseStudies.map((c, i) => ({
      id: `own-${c.slug}`,
      title: c.title,
      description: c.summary,
      link: c.liveUrl,
      slug: c.slug,
      imageUrl: c.coverImage,
      tags: c.tags,
      gradient: c.gradient,
      category: c.category,
      index: i,
    })),
  ];


  // 1) Intersection Observer for section‐based background colors
  useLayoutEffect(() => {
    const main = mainContainerRef.current;
    if (!main) return;

    const ctx = gsap.context(() => {
      // 0) Varsayılan arka planı tanımla
      gsap.set(main, { backgroundColor: "#000000" });

      // 1) Açık → Siyah
      gsap.to(main, {
        backgroundColor: "#111111",
        ease: "none",
        immediateRender: false,
        scrollTrigger: {
          trigger: contentRef.current,
          start: "top bottom",
          end: "top center",
          scrub: true,
        },
      });

      // 2) Siyah → #201d3a (projeler)
      gsap.to(main, {
        backgroundColor: "#201d3a",
        ease: "none",
        immediateRender: false,
        scrollTrigger: {
          trigger: recentProjectsContainerRef.current,
          start: "top bottom",
          end: "top center",
          scrub: true,
        },
      });

      // 3) #201d3a → Siyah (whatWeDo)
      gsap.to(main, {
        backgroundColor: "#111111",
        ease: "none",
        immediateRender: false,
        scrollTrigger: {
          trigger: whatWeDoRef.current,
          start: "top bottom",
          end: "top center",
          scrub: true,
        },
      });

      // Başlık rengi örneği
      gsap.to("#recent-projects-heading", {
        color: "#FFFFFF",
        ease: "none",
        immediateRender: false,
        scrollTrigger: {
          trigger: recentProjectsContainerRef.current,
          start: "top bottom",
          end: "top 80%",
          scrub: true,
        },
      });
    }, mainContainerRef);

    // --- ÖNEMLİ: Boyut değişince refresh ---
    // 1) sayfa yüklendiğinde
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);

    // 2) marquee / resimler yüklenince (clientsRef’i izle)
    const ro = new ResizeObserver(() => {
      ScrollTrigger.refresh();
    });
    if (clientsRef.current) ro.observe(clientsRef.current);

    // 3) pencere boyutu değişince GSAP zaten dinliyor ama güvence:
    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);

    // İlk render sonrasında da bir kez:
    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      window.removeEventListener("load", onLoad);
      window.removeEventListener("resize", onResize);
      ro.disconnect();
      ctx.revert(); // tüm triggerları temizle
    };
  }, []);


  return (
    <div ref={mainContainerRef} style={{ backgroundColor: "#000000" }}>


      <main>


        {/* Hero */}
        <section
          ref={heroRef}
          className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black px-4 pt-28 pb-16 text-white"
        >
          {/* radial glow + subtle grid, blended into the black navbar */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 70% 55% at 50% 0%, rgba(99,102,241,0.28), transparent 70%), radial-gradient(ellipse 50% 40% at 80% 90%, rgba(236,72,153,0.14), transparent 70%)",
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
              backgroundSize: "56px 56px",
              maskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, black, transparent 75%)",
              WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, black, transparent 75%)",
            }}
          />

          <div className="relative z-10 max-w-4xl text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1]">
              Websites, AI Workflows &amp; SaaS Products{" "}
              <span className="bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-amber-300 bg-clip-text text-transparent">
                Built to Convert.
              </span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto">
              We don&apos;t just design pages. We build modern web systems that win you customers and take repetitive work off your plate.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/booking"
                className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3.5 text-base font-semibold text-black transition hover:bg-zinc-200"
              >
                Book a Call
              </Link>
              <a
                href="#recent-projects"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("recent-projects")?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="inline-flex items-center justify-center rounded-full border border-white/25 px-8 py-3.5 text-base font-semibold text-white transition hover:border-white/60 hover:bg-white/5"
              >
                View Projects
              </a>
            </div>
          </div>
        </section>

        {/* Açıklama Bölümü */}
        <section ref={contentRef} className="h-screen flex items-center">
          <div className="max-w-3xl mx-auto text-white space-y-6 text-lg px-6">
            <p>
              We design for innovative thought leaders in all industries, and we don&apos;t stop at design: we also develop and run our own digital products.
            </p>
            <p>Building and operating them ourselves keeps our client work grounded in what actually ships.</p>
          </div>
        </section>

        {/* YENİ BÖLÜM BURADA */}
        <section ref={clientsRef} className="py-10">
          <ClientsLogos />
        </section>


        {/* RECENT PROJECTS BÖLÜMÜ */}
        <div ref={recentProjectsContainerRef} id="recent-projects">
          <RecentProjectsColorful projects={projects} subtitle="Colorful, brand-led cases — crafted to convert." />;
        </div>

        <div ref={whatWeDoRef}>
          <WhatWeDo />
        </div>

        <div ref={faqRef}>
          <FaqAccordion />
        </div>
        <CallToAction />
      </main>
    </div>
  )

}