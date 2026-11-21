'use client';

import Link from 'next/link';

export default function DesktopNav() {
    return (
        <ul className="hidden md:flex items-center space-x-7">
            <li>
                <Link href="/about" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                    About
                </Link>
            </li>
            <li>
                <Link href="/#services" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                    What We Do
                </Link>
            </li>
            <li>
                <Link href="/ai-receptionist" className="rounded-full bg-blue-50 px-3.5 py-1.5 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-100">
                    AI Receptionist
                </Link>
            </li>
            <li>
                <Link href="/booking" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                    Contact
                </Link>
            </li>
        </ul>
    );
}
