"use client";

import { useEffect, useRef } from "react";
import Image from 'next/image';
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

// Project interface tanımı
export interface Project {
    id: string; title: string; description: string; imageUrl: string; link: string; category: string; index: number;
}
interface RecentProjectsProps { projects: Project[]  }

export default function RecentProjects({ projects }: RecentProjectsProps) {
    const sectionRef = useRef<HTMLElement>(null);
    const headingRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);
        
        const projectItems = gsap.utils.toArray<HTMLDivElement>('.project-item');
        
        gsap.set(headingRef.current, { autoAlpha: 0, scale: 0.5, y: 50 });
        gsap.set(projectItems, { autoAlpha: 0 }); // Resimlerin başlangıçta gizli olmasını sağlar

        const timeline = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top top",
                end: () => "+=" + (projectItems.length * window.innerHeight),
                scrub: 1,
                pin: true,
                anticipatePin: 1,
            },
        });

        timeline.to(headingRef.current, { autoAlpha: 1, scale: 1, y: 0, ease: "power2.out" });

        projectItems.forEach((item, index) => {
            timeline.fromTo(item,
                { yPercent: 100, xPercent: index % 2 === 0 ? -20 : 20, scale: 0.8 },
                { autoAlpha: 1, yPercent: -100, xPercent: 0, scale: 1, ease: "power1.inOut", duration: 2 },
                "<0.8"
            );
        });
        
        timeline.to(headingRef.current, { autoAlpha: 0, filter: 'blur(10px)', scale: 1.2, ease: "power2.in" }, "-=0.5");

        return () => { ScrollTrigger.getAll().forEach(st => st.kill()); };
    }, [projects]);

   
    return (
        
        <section ref={sectionRef} className="relative h-screen w-full bg-transparent ">
            <h2  id="recent-projects-heading" ref={headingRef} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl md:text-8xl font-bold z-10 text-center"
                style={{ color: '#000000' }}  >
                RECENT PROJECTS
            </h2>
            <div className="w-full h-full">
                {projects.map((project) => (
                    <div key={project.id} className="project-item absolute top-0 left-0 w-full h-full flex items-center justify-center z-20">
                        <div className="relative w-3/4 md:w-1/3 h-1/2 rounded-lg overflow-hidden shadow-2xl ">
                           <Link href={project.link || "#"} target="_blank" passHref>
                               
                                    <Image
                                        src={project.imageUrl}
                                        alt={project.title}
                                        fill

                                        className="transition-transform duration-300 hover:scale-105 object-cover"
                                    />
                                
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}