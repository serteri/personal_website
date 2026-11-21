'use client';

import Link from 'next/link';

export default function DesktopNav() {
    return (
        <ul className="hidden md:flex items-center space-x-7">
            <li>
                <Link href="/about" className="font-medium text-white hover:text-lime-400 transition-colors">
                    About
                </Link>
            </li>
            <li>
                <Link href="/#services" className="font-medium text-white hover:text-lime-400 transition-colors">
                    What We Do
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
