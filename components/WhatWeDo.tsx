"use client";

import React from 'react';
import { gsap } from 'gsap';
import Link from 'next/link'; // Link component'ini import ediyoruz

// Servis verilerini bir dizi olarak tutmak, kodu temiz ve ölçeklenebilir yapar.
const services = [
    {
        title: "BRANDING",
        description: "Let's discover the story behind your brand and capture it in visual identity.",
        path: "/whatwedo/branding"
       
    },
    {
        title: "CONTENT STRATEGY",
        description: "We aim to create an engaging user experience with clarity and consistency.",
        path: "/whatwedo/content-strategy"
    },
    {
        title: "WEBSITE DESIGN",
        description: "You will get a stylish, functional website that will serve as a high-value referral and sales asset.",
        path: "/whatwedo/website-design"
    },
    {
        title: "SEO & SMM",
        description: "Our tested SEO strategy to improve the quality of ranking factors across your website.",
        path: "/whatwedo/seo"
    }
];

export default function WhatWeDo() {

    // Mouse ile bir sütunun üzerine gelindiğinde çalışacak fonksiyon
    const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
        const column = e.currentTarget;
        const blueShape = column.querySelector('.blue-swoosh') as HTMLDivElement;
        const title = column.querySelector('.service-title') as HTMLHeadingElement;
        const description = column.querySelector('.service-description') as HTMLParagraphElement;

        // Animasyonları bir timeline'a bağlayarak senkronize çalışmasını sağlıyoruz
        const tl = gsap.timeline();
        tl.to(blueShape, { y: '0%', duration: 0.5, ease: 'power3.out' })
          .to(title, { color: '#000000', duration: 0.4, ease: 'power2.out' }, "<0.1") // <0.1 saniye sonra başla
          .to(description, { color: '#000000', duration: 0.4, ease: 'power2.out' }, "<"); // öncekiyle aynı anda başla
    };

    // Mouse sütundan ayrıldığında çalışacak fonksiyon
    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
        const column = e.currentTarget;
        const blueShape = column.querySelector('.blue-swoosh') as HTMLDivElement;
        const title = column.querySelector('.service-title') as HTMLHeadingElement;
        const description = column.querySelector('.service-description') as HTMLParagraphElement;

        const tl = gsap.timeline();
        tl.to(title, { color: '#A3E635', duration: 0.4, ease: 'power2.out' })
          .to(description, { color: '#FFFFFF', duration: 0.4, ease: 'power2.out' }, "<")
          .to(blueShape, { y: '101%', duration: 0.5, ease: 'power3.in' }, "<0.1");
    };

    return (
        <section className="bg-black py-24 px-4">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-l border-gray-700">
                    {/* Adım 2: map fonksiyonunu Link ile sarmalıyoruz */}
                    {services.map((service, index) => (
                        <Link
                            key={index}
                            href={service.path}
                            passHref
                            className="service-column-link"
                        >
                            <div
                                className="service-column relative p-8 border-r border-gray-700 h-80 flex flex-col justify-end overflow-hidden cursor-pointer"
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                            >
                                {/* Başlık ve Açıklama */}
                                <div className="relative z-10">
                                    <h3 className="service-title text-lime-300 font-bold mb-4">{service.title}</h3>
                                    <p className="service-description text-white">{service.description}</p>
                                </div>

                                {/* Alttan Gelen Mavi Şekil */}
                                <div
                                    className="blue-swoosh absolute top-0 left-0 w-full h-full bg-blue-600 rounded-t-[50%] z-0"
                                    style={{ transform: 'translateY(101%)' }}
                                ></div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}