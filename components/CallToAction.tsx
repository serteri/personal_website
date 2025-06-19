"use client";

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';

export default function CallToAction() {
    const torusRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLDivElement>(null);

    // 1. Mouse ile hareket eden obje (Parallax) animasyonu
    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            const { clientX, clientY } = event;
            const x = clientX / window.innerWidth - 0.5;
            const y = clientY / window.innerHeight - 0.5;

            // Objenin mouse'un tersi yönünde ve limitli hareket etmesi için
            // değeri küçük bir sayıyla çarpıyoruz (örn: 50).
            gsap.to(torusRef.current, {
                x: x * 250,
                y: y * 250,
                duration: 0.5,
                ease: 'power1.out',
            });
        };

        window.addEventListener('mousemove', handleMouseMove);

        // Component kaldırıldığında event listener'ı temizle
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    // 2. "Let's Chat" butonu için sallanma animasyonu
    useEffect(() => {
        if (!buttonRef.current) return;

        const tl = gsap.timeline({
            repeat: -1,
            repeatDelay: 0.8,
        });

        tl.to(buttonRef.current, {
            rotation: 15,
            duration: 0.4,
            ease: "sine.inOut",
            transformOrigin: "center center",
        })
        .to(buttonRef.current, {
            rotation: -15,
            duration: 0.8,
            ease: "sine.inOut",
        })
        .to(buttonRef.current, {
            rotation: 0,
            duration: 0.4,
            ease: "sine.inOut",
        });

        return () => {
            tl.kill(); // Timeline'ı temizle
        };
    }, []);

    return (
        <section className="relative h-screen w-full bg-black flex flex-col items-center justify-center overflow-hidden">
            
            {/* Arka plandaki hareketli mavi halka */}
            <div
                ref={torusRef}
                className="absolute w-80 h-80 md:w-96 md:h-96 border-[60px] border-cyan-400 rounded-full z-10"
                style={{ opacity: 1,
                    boxShadow: 
                        `0 0 60px 10px #22d3ee, 
                         inset 0 0 40px 10px #22d3ee` }}
            ></div>

            {/* Ön plandaki içerik */}
            <div className="relative z-20 text-center text-white px-4">
                <h1 className="text-4xl md:text-6xl font-bold">
                    We are ready to tell <span className="text-lime-300">your story!</span>
                </h1>
                <p className="mt-4 text-lg text-gray-300">
                    Book an appointment and let's make something amazing!
                </p>
                <div className="mt-8">
                    <Link href="/booking" ref={buttonRef} >
                        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 text-[#00ff88] font-bold py-4 px-10 rounded-full transition-colors duration-300 hover:bg-gray-700">
                            Let's chat
                        </div>
                    </Link>
                </div>
            </div>
        </section>
    );
}
