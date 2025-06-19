'use client';

import Link from 'next/link';
import { FiChevronDown } from 'react-icons/fi';

// Navbar'dan gönderilecek props'ların tipleri
interface DesktopNavProps {
    openDropdown: string | null;
    handleMouseEnter: (menu: string) => void;
    handleMouseLeave: () => void;
    setOpenDropdown: (dropdown: string | null) => void;
}

export default function DesktopNav({ openDropdown, handleMouseEnter, handleMouseLeave, setOpenDropdown }: DesktopNavProps) {
    return (
        <ul className="hidden md:flex items-center space-x-7">
            <li>
                <Link href="/about" className="font-medium text-white hover:text-lime-400 transition-colors">
                    About
                </Link>
            </li>
            <li
                className="relative"
                onMouseEnter={() => handleMouseEnter("whatwedogroup")}
                onMouseLeave={handleMouseLeave}
            >
                <Link
                    href="/whatwedo"
                    onClick={() => setOpenDropdown(null)}
                    className="flex items-center font-medium text-white hover:text-lime-400 transition-colors"
                >
                    What We Do <FiChevronDown className={`ml-1 transition-transform ${openDropdown === "whatwedogroup" ? "rotate-180" : ""}`} />
                </Link>
                {openDropdown === "whatwedogroup" && (
                    <ul className="absolute left-0 mt-2 w-48 bg-black shadow-xl rounded-lg py-2 text-white">
                        {/* Dropdown içeriği... */}
                         <li><Link href="/whatwedo/branding" className="block px-4 py-2 hover:text-lime-400">Branding</Link></li>
                         <li><Link href="/whatwedo/webdesign" className="block px-4 py-2 hover:text-lime-400">Web Design</Link></li>
                         <li><Link href="/whatwedo/contentstrategy" className="block px-4 py-2 hover:text-lime-400">Content Strategy</Link></li>
                         <li><Link href="/whatwedo/seo" className="block px-4 py-2 hover:text-lime-400">SEO</Link></li>
                    </ul>
                )}
            </li>
            <li>
                <Link href="/news" className="font-medium text-white hover:text-lime-400 transition-colors">
                    News
                </Link>
            </li>
            <li>
                <Link href="/booking" className="font-medium text-white hover:text-lime-400 transition-colors">
                    Contact
                </Link>
            </li>
        </ul>
    );
}