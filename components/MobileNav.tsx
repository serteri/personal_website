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
                    className="absolute top-full left-0 w-full bg-[#F4F4F5] border-b border-line text-ink z-40 md:hidden"
                >
                    <ul className="flex flex-col items-center py-6 space-y-4">
                        <li><Link href="/about" className="block py-3 font-mono text-sm uppercase tracking-wider hover:text-cobalt" onClick={closeMenu}>About</Link></li>
                        <li><Link href="/#services" className="block py-3 font-mono text-sm uppercase tracking-wider hover:text-cobalt" onClick={closeMenu}>What We Do</Link></li>
                        <li><Link href="/contact" className="block py-3 font-mono text-sm uppercase tracking-wider hover:text-cobalt" onClick={closeMenu}>Contact</Link></li>
                    </ul>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
