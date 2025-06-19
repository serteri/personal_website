"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import ScrollTrigger     from "gsap/dist/ScrollTrigger";
import PromotionalBanner from "@/components/PromotionalBanner";
import RecentProjects, { Project } from "@/components/RecentProjects"; // Yeni component'i import et
import ClientsFloating from "@/components/ClientsFloating"; // Yeni component'i import et
import WhatWeDo from "@/components/WhatWeDo"; // Yeni component'i import et
import FaqAccordion from "@/components/FaqAccordion";
import CallToAction from "@/components/CallToAction";


export default function Home( ){

    // const [activeColor, setActiveColor] = useState<string>("#EFEEEA");
    
    // Referanslar
     const mainContainerRef = useRef<HTMLDivElement>(null);
    const hiRef = useRef<HTMLDivElement>(null);
    const heroRef = useRef<HTMLElement>(null);
    const contentRef = useRef<HTMLElement>(null);
    const recentProjectsContainerRef = useRef<HTMLDivElement>(null);
    const whatWeDoRef = useRef<HTMLDivElement>(null); // Yeni bölüm için ref

    const faqRef = useRef<HTMLDivElement>(null);


const clientsRef = useRef<HTMLDivElement>(null); // Clients bölümü için yeni ref

    const projects : Project[] = [
        { id: '1', title: 'Project Alkon', description: 'Alkon Energy',  imageUrl: '/alkon_logo.jpeg', link: 'https://alkonenerji.com/', category: 'Web Design'  ,index: 0},
        { id: '2', title: 'Project Guneysan', description: 'Guneysan',  imageUrl: '/guneysan_logo.jpeg', link: '', category: 'Branding' ,index: 1},
        { id: '3', title: 'Project Petek Bal', description: 'Petek Bal',  imageUrl: '/balpetek_logo.jpeg', link: 'https://www.balpetek.com.tr/', category: 'Mobile App',index: 2 },
        // ... more projects
    ];

    const logos=[
    { src: "/alkon_logo.jpeg", alt: "Alkon" },
    { src: "/bal_logo.png", alt: "Bal" },
    { src: "/cw_logo.png", alt: "CW" },
    { src: "/guneysan_logo.jpeg", alt: "Guneysan" },
    { src: "/termo_logo.png", alt: "Termo" },
    { src: "/balpetek_logo.jpeg", alt: "Bal Petek" },

    { src: "/resim_logo.png", alt: "Resim" },
    { src: "/fizik_logo.png", alt: "Fizik" },
    { src: "/kimya_logo.png", alt: "Kimya" },
  

    ]

    // 1) Intersection Observer for section‐based background colors
  useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);
        const main = mainContainerRef.current;

        if (!main) return;
         // 1. Geçiş: Açıktan Siyaha
        gsap.to(main, {
            backgroundColor: "#111111",
            ease: "none",
            scrollTrigger: {
                trigger: contentRef.current, // Siyah bölüm tetikler
                scrub: true,
                start: "top bottom", // Siyah bölümün tepesi ekranın altına değince başla
                end: "top center",   // Siyah bölümün tepesi ekranın ortasına gelince bitir
            }
        });

        // 2. Geçiş: Siyahtan Yeni Renginize (#273F4F)
        gsap.to(main, {
            backgroundColor: "#201d3a", // Yeni renginiz
            ease: "none",
            scrollTrigger: {
                trigger: recentProjectsContainerRef.current, // Projeler bölümü tetikler
                scrub: true,
                start: "top bottom",
                end: "top center",
            },
             immediateRender: false, 
        });

        // YENİ Geçiş 3: Projeler Renginden (#273F4F) Siyaha (WhatWeDo bölümü için)
        gsap.to(main, {
            backgroundColor: "#111111",
            ease: "none",
            immediateRender: false,
            scrollTrigger: {
                trigger: whatWeDoRef.current, // Yeni bölüm tetikliyor
                scrub: true,
                start: "top bottom",
                end: "top center",
            }
        });

        // RECENT PROJECTS BAŞLIĞININ RENGİNİ DE GSAP İLE YÖNETİYORUZ
        // Projeler bölümüne girerken başlık rengini beyaza çevir.
        gsap.to("#recent-projects-heading", { // ID ile hedef alıyoruz
            color: "#FFFFFF",
            ease: "none",
            scrollTrigger: {
                trigger: recentProjectsContainerRef.current,
                scrub: true,
                start: "top bottom",
                end: "top 80%", // Renk biraz daha hızlı değişsin
            },
             immediateRender: false, 
        });

        
        
 return () => {
            ScrollTrigger.getAll().forEach(st => st.kill());
        };
    }, []);


    // 2️⃣ GSAP rotation for the `.hi-text` element inside the Navbar
   useEffect(() => {
    if (!hiRef.current) return;

    // 1️⃣ Timeline’ı oluştur, sonsuz tekrar ve durakta bekleme
    const tl = gsap.timeline({
      repeat: -1,       // sonsuz döngü
      repeatDelay: 0.8, // her tam turdan sonra 0.8 saniye ortada bekle
    });

    // 2️⃣ Sağ kısma hızlı yönel → sola geçiş → ortaya dönüş
    tl
      .to(hiRef.current, {
        rotation: 15,
        duration: 0.4,
        ease: "sine.inOut",
        transformOrigin: "center center",
      })
      .to(hiRef.current, {
        rotation: -15,
        duration: 0.8,
        ease: "sine.inOut",
      })
      .to(hiRef.current, {
        rotation: 0,
        duration: 0.4,
        ease: "sine.inOut",
      });
  }, []);


    return (
      <div ref={mainContainerRef} style={{ backgroundColor: "#EFEEEA" }}>
           
           <PromotionalBanner />
            <main>
            

        {/* Hero Bölümü */}
        <section ref={heroRef}  className="h-screen flex flex-col items-center justify-center text-gray-800">
          <h1 className="text-4xl text-center font-bold px-4">
            Your branding and website<br />
            deserves a specialist who’s 100% invested in making them stand out.
          </h1>
          <div
            ref={hiRef}
            className="mt-8 border-2 rounded-full px-12 py-6 border-[#c9ff30]"
            style={{ boxShadow: '0 0 30px rgba(0,255,136,0.6)' }}
          >
            <h2 className="text-[#00ff88] text-5xl font-semibold">Hi</h2>
          </div>
        </section>

        {/* Açıklama Bölümü */}
        <section ref={contentRef} className="h-screen flex items-center">
          <div className="max-w-3xl mx-auto text-white space-y-6 text-lg px-6">
            <p>
              We work with innovative thought leaders in all industries. Our clients value design as a potent business tool, and trust us to bring their stories to life.
            </p>
            <p>This alignment is crucial — we do great work for great clients.</p>
          </div>
        </section>

{/* YENİ BÖLÜM BURADA */}
                <div ref={clientsRef}>
                    <ClientsFloating logos={logos} />
                </div>


   {/* RECENT PROJECTS BÖLÜMÜ */}
                <div ref={recentProjectsContainerRef}>
                    <RecentProjects projects={projects} />
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