"use client";

import Image from "next/image";
import { useEffect, useRef, useState,forwardRef } from "react";

type Logo = { src: string; alt: string };

export default function ClientsMarqueePro({
                                              logos,
                                              pps = 40,          // hız: pixels-per-second (daha yavaş için düşür: 20-30 güzel)
                                              itemWidth = 280,   // tek kart genişliği (px)
                                              itemHeight = 140,  // tek kart yüksekliği (px)
                                              gap = 36,          // kartlar arası boşluk (px)
                                              title = "OUR CLIENTS",
                                              pauseOnHover = true,
                                          }: {
    logos: Logo[];
    pps?: number;
    itemWidth?: number;
    itemHeight?: number;
    gap?: number;
    title?: string;
    pauseOnHover?: boolean;
}) {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const seqRef = useRef<HTMLDivElement>(null);    // ilk dizi (A)
    const [offset, setOffset] = useState(0);        // translateX değeri
    const [seqWidth, setSeqWidth] = useState(0);    // A dizisinin gerçek genişliği
    const rafRef = useRef<number | null>(null);
    const lastTsRef = useRef<number | null>(null);
    const pausedRef = useRef(false);

    // Hover pause
    useEffect(() => {
        const el = wrapperRef.current;
        if (!el || !pauseOnHover) return;
        const onEnter = () => { pausedRef.current = true; };
        const onLeave = () => { pausedRef.current = false; };
        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);
        return () => {
            el.removeEventListener("mouseenter", onEnter);
            el.removeEventListener("mouseleave", onLeave);
        };
    }, [pauseOnHover]);

    // Genişlik ölçümü (ve yeniden flow)
    useEffect(() => {
        const measure = () => {
            if (!seqRef.current) return;
            const w = seqRef.current.getBoundingClientRect().width;
            setSeqWidth(w);
            // offset’i güvenli aralığa çek
            setOffset((o) => (w ? ((o % w) + w) % w : 0));
        };
        measure();

        const ro = new ResizeObserver(measure);
        if (seqRef.current) ro.observe(seqRef.current);
        if (wrapperRef.current) ro.observe(wrapperRef.current);
        return () => ro.disconnect();
    }, [logos, itemWidth, itemHeight, gap]);

    // RAF animasyonu (0 → -seqWidth; sonra sıfırla)
    useEffect(() => {
        const tick = (ts: number) => {
            if (lastTsRef.current == null) lastTsRef.current = ts;
            const dt = (ts - lastTsRef.current) / 1000; // saniye
            lastTsRef.current = ts;

            if (!pausedRef.current && seqWidth > 0) {
                setOffset((prev) => {
                    let next = prev - pps * dt;
                    if (next <= -seqWidth) next += seqWidth; // tam döngü; dikiş yok
                    return next;
                });
            }

            rafRef.current = requestAnimationFrame(tick);
        };

        rafRef.current = requestAnimationFrame(tick);
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            lastTsRef.current = null;
        };
    }, [pps, seqWidth]);

    // A ve B dizileri: B aynen A’nın kopyası → kusursuz seam
    return (
        <section className="bg-black text-white py-14 px-4 md:px-8">
            <h2 className="text-center text-3xl md:text-4xl font-extrabold tracking-wide mb-6">
                {title}
            </h2>

            <div className="max-w-7xl mx-auto">
                <div
                    ref={wrapperRef}
                    className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-purple-700 p-6 md:p-8 shadow-2xl shadow-blue-500/20"
                    aria-label="Client logos marquee"
                >
                    {/* Kenar maskeleme */}
                    <div className="pointer-events-none absolute inset-y-0 left-0 w-20 md:w-28 bg-gradient-to-r from-black/60 to-transparent" />
                    <div className="pointer-events-none absolute inset-y-0 right-0 w-20 md:w-28 bg-gradient-to-l from-black/60 to-transparent" />

                    {/* Track */}
                    <div
                        className="flex will-change-transform"
                        style={{
                            transform: `translateX(${offset}px)`,
                        }}
                    >
                        {/* A */}
                        <Row ref={seqRef} logos={logos} itemWidth={itemWidth} itemHeight={itemHeight} gap={gap} />
                        {/* B (aynısı) */}
                        <Row logos={logos} itemWidth={itemWidth} itemHeight={itemHeight} gap={gap} />
                    </div>
                </div>
            </div>
        </section>
    );
}

const Row = forwardRef<HTMLDivElement, {
    logos: Logo[];
    itemWidth: number;
    itemHeight: number;
    gap: number;
}>(({ logos, itemWidth, itemHeight, gap }, ref) => {
    return (
        <div
            ref={ref}
            className="flex items-center"
            style={{ gap: `${gap}px`, paddingInline: `${gap}px` }}
        >
            {logos.map((logo, i) => (
                <div
                    key={`${logo.src}-${i}`}
                    className="flex-none rounded-2xl bg-white shadow-md p-4 md:p-5"
                    style={{ width: `${itemWidth}px`, height: `${itemHeight}px` }}
                >
                    <div className="relative w-full h-full">
                        <Image
                            src={logo.src}
                            alt={logo.alt}
                            fill
                            className="object-contain"
                            sizes={`${itemWidth}px`}
                            priority={i < 6}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
});
Row.displayName = "Row";