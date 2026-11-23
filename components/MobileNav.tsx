'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface MobileNavProps {
    isOpen: boolean;
    closeMenu: () => void;
}

const mobileMenuAnim = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3, ease: "easeInOut" }
};

export default function MobileNav({ isOpen, closeMenu }: MobileNavProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    key="mobile-menu"
                    variants={mobileMenuAnim}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="absolute top-full left-0 w-full bg-white border-b border-slate-200/80 text-slate-900 z-40 md:hidden"
                >
                    <ul className="flex flex-col items-center py-6 space-y-4">
                        <li><Link href="/about" className="block py-3 text-base font-medium hover:text-blue-600" onClick={closeMenu}>About</Link></li>
                        <li><Link href="/#services" className="block py-3 text-base font-medium hover:text-blue-600" onClick={closeMenu}>What We Do</Link></li>
                        <li><Link href="/ai-receptionist" className="block py-3 text-base font-semibold text-blue-600" onClick={closeMenu}>AI Receptionist</Link></li>
                        <li><Link href="/dashboard" className="block py-3 text-base font-medium hover:text-blue-600" onClick={closeMenu}>Client Login</Link></li>
                        <li><Link href="/contact" className="block py-3 text-base font-medium hover:text-blue-600" onClick={closeMenu}>Contact</Link></li>
                    </ul>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
