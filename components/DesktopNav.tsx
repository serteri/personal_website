'use client';

import Link from 'next/link';

export default function DesktopNav() {
    return (
        <ul className="hidden md:flex items-center space-x-7">
            <li>
                <Link href="/about" className="font-mono text-xs uppercase tracking-wider text-ink hover:text-cobalt transition-colors">
                    About
                </Link>
            </li>
            <li>
                <Link href="/#services" className="font-mono text-xs uppercase tracking-wider text-ink hover:text-cobalt transition-colors">
                    What We Do
                </Link>
            </li>
            <li>
                <Link href="/booking" className="font-mono text-xs uppercase tracking-wider text-ink hover:text-cobalt transition-colors">
                    Contact
                </Link>
            </li>
        </ul>
    );
}
