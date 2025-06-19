'use client'

import { useState, useEffect, useRef } from 'react';
import Link from "next/link"
import Image from 'next/image'
import { FiMenu, FiX } from "react-icons/fi";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";

// Yeni alt component'leri import ediyoruz
import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav';

export default function Navbar() {
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    // Küçülme ve gizlenme state'leri
    const [isShrunk, setIsShrunk] = useState(false);
    const [isHidden, setIsHidden] = useState(false);
    
    // Scroll durduğunda göstermek için zamanlayıcı
    const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    
    // Framer Motion hook'ları
    const { scrollY } = useScroll();

    // --- TÜM SCROLL MANTIĞINI BİRLEŞTİREN MODERN YÖNTEM ---
    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious() || 0;
        const diff = latest - previous;
        
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

    // Dropdown menü için mouse hover mantığı
    const handleMouseEnter = (menu: string) => {
        if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
        setOpenDropdown(menu);
    };
    const handleMouseLeave = () => {
        dropdownTimeoutRef.current = setTimeout(() => setOpenDropdown(null), 200);
    };

    return (
        <motion.nav
            className={`fixed top-0 left-0 w-full bg-black z-50 transition-height duration-300`}
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
                    <Image
                        src="/ALTIQDESIGN.png"
                        alt="ALTIQDESIGN"
                        width={isShrunk ? 50 : 60}
                        height={isShrunk ? 50 : 60}
                        className="object-contain transition-all duration-300"
                        priority
                    />
                    <span className="ml-3 text-xl font-bold text-purple-500">ALTIQDESIGN</span>
                </Link>

                {/* MASAÜSTÜ NAV COMPONENT'İ */}
                <DesktopNav 
                    openDropdown={openDropdown}
                    handleMouseEnter={handleMouseEnter}
                    handleMouseLeave={handleMouseLeave}
                    setOpenDropdown={setOpenDropdown}
                />

                {/* MOBİL MENÜ BUTONU */}
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="md:hidden text-white p-2 focus:outline-none"
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