'use client'

import { useState, useRef } from 'react';
import Link from "next/link"
import { FiMenu, FiX } from "react-icons/fi";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";

// Yeni alt component'leri import ediyoruz
import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav';

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    // Küçülme ve gizlenme state'leri
    const [isShrunk, setIsShrunk] = useState(false);
    const [isHidden, setIsHidden] = useState(false);
    
    // Scroll durduğunda göstermek için zamanlayıcı
    const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    
    // Framer Motion hook'ları
    const { scrollY } = useScroll();

    // --- TÜM SCROLL MANTIĞINI BİRLEŞTİREN MODERN YÖNTEM ---
    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious() || 0;

        
        // 1. Navbar'ı küçültme/büyütme mantığı
        setIsShrunk(latest > 50);
        
        // 2. Gizleme/gösterme mantığı
        if (latest > previous && latest > 200) { // Aşağı scroll yaparken gizle
            setIsHidden(true);
        } else { // Yukarı scroll yaparken göster
            setIsHidden(false);
        }

        // 3. Scroll durunca gösterme mantığı
        if (hideTimeoutRef.current) {
            clearTimeout(hideTimeoutRef.current);
        }
        hideTimeoutRef.current = setTimeout(() => {
            setIsHidden(false);
        }, 300); // 300ms scroll edilmezse navbar geri gelsin
    });

    return (
        <motion.nav
            className={`fixed top-0 left-0 w-full bg-white/80 backdrop-blur border-b border-slate-200/80 z-50 transition-height duration-300`}
            // Animasyonu state'lere göre yönetiyoruz
            animate={{ 
                y: isHidden ? -100 : 0,
                height: isShrunk ? '4rem' : '5rem' // 64px veya 80px
            }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        >
            <div className="w-full h-full px-4 flex justify-between items-center">
                {/* Logo */}
                <Link href="/" className="flex items-center">
                    <span aria-hidden="true" className="mr-3 inline-block h-3 w-3 rounded-[3px] bg-[#2563EB]" />
                    <span className="text-lg font-bold uppercase tracking-tight text-slate-900">ALTIQDESIGN</span>
                </Link>

                {/* MASAÜSTÜ NAV COMPONENT'İ */}
                <DesktopNav />

                {/* MOBİL MENÜ BUTONU */}
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="md:hidden text-ink p-2 focus:outline-none"
                    aria-label="Toggle menu"
                >
                    {isMobileMenuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
                </button>
            </div>

            {/* MOBİL NAV COMPONENT'İ */}
            <MobileNav 
                isOpen={isMobileMenuOpen}
                closeMenu={() => setIsMobileMenuOpen(false)}
            />
        </motion.nav>
    );
}