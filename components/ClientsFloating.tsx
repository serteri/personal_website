"use client"

import { useEffect, useRef } from "react";
import Image from 'next/image';
import { gsap } from "gsap";


interface Logo{
    src: string;
    alt: string;
}

interface ClientsFloatingProps {
    logos: Logo[];
}

export default function ClientsFloating({ logos }: ClientsFloatingProps) {

const containerRef = useRef<HTMLDivElement>(null);

const tweensRef = useRef<gsap.core.Tween[]>([]);
 useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Logoları bir dizi olarak alalım
        const logoElements = gsap.utils.toArray<HTMLDivElement>('.client-logo');
        
        // Konteynırın boyutlarını alalım
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;

        // Her logoyu hareket ettirecek fonksiyon
        const moveLogo = (logo: HTMLDivElement) => {
            const logoWidth = logo.offsetWidth;
            const logoHeight = logo.offsetHeight;
            
            // Yeni bir GSAP animasyonu oluştur ve ref'e ekle
            const tween = gsap.to(logo, {
                x: gsap.utils.random(0, containerWidth - logoWidth),
                y: gsap.utils.random(0, containerHeight - logoHeight),
                duration: gsap.utils.random(8, 15), // 8-15 saniye arası rastgele süre
                ease: 'sine.inOut',
                autoAlpha: gsap.utils.random(0.7, 1), // Rastgele opaklık
                onComplete: () => moveLogo(logo) // Animasyon bitince kendini tekrar çağır (sonsuz döngü)
            });
            tweensRef.current.push(tween);
        };

        // Her logo için başlangıç pozisyonunu ayarla ve animasyonu başlat
        logoElements.forEach(logo => {
            const logoWidth = logo.offsetWidth;
            const logoHeight = logo.offsetHeight;
            
            // Başlangıçta rastgele bir yere konumlandır
            gsap.set(logo, {
                x: gsap.utils.random(0, containerWidth - logoWidth),
                y: gsap.utils.random(0, containerHeight - logoHeight),
                autoAlpha: 0 // Başlangıçta görünmez olsun
            });
            
            // Kısa bir gecikmeyle görünür yap ve animasyonu başlat
            const showTween = gsap.to(logo, { 
                autoAlpha: gsap.utils.random(0.5, 1), 
                duration: 1.5,
                delay: Math.random(), // Her biri farklı zamanda başlasın
                onComplete: () => moveLogo(logo) // Görünür olduktan sonra hareket etmeye başlasın
            });
            tweensRef.current.push(showTween);
        });

        // Component unmount olduğunda tüm animasyonları durdur (hafıza sızıntısını önler)
        return () => {
            tweensRef.current.forEach(tween => tween.kill());
            tweensRef.current = [];
        };
    }, [logos]);

return (
        <section className="bg-black text-white py-20 px-4 md:px-8">
            <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                
                {/* Sol Taraf: Hareketli Logolar */}
                <div 
                    ref={containerRef} 
                    className="relative w-full h-96 md:h-[500px] bg-gradient-to-br from-blue-600 to-purple-700 rounded-3xl overflow-hidden shadow-2xl shadow-blue-500/20 "
                >
                    {logos.map((logo, index) => (
                        <div key={index} className="client-logo absolute w-32 h-16">
                            <Image src={logo.src} alt={logo.alt}  fill className="object-contain p-2" />
                        </div>
                    ))}
                </div>

                {/* Sağ Taraf: Metin */}
                <div className="text-left">
                    <h3 className="text-lime-300 font-semibold mb-4">OUR CLIENTS</h3>
                    <p className="text-2xl md:text-3xl leading-relaxed">
                        We work with innovative thought leaders in all industries. Our clients value <span className="text-lime-300">design as a potent business tool,</span> and trust us to bring their stories to life. This alignment is crucial, you do great work for great clients.
                    </p>
                </div>

            </div>
        </section>
    );




}