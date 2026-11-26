import React from 'react';
import Link from 'next/link';
import { services } from '@/lib/services';

// Linkleri daha kolay yönetmek için bir veri yapısı oluşturalım
const footerLinks = {
    whatWeDo: services.map((sv) => ({ name: sv.title, href: `/services/${sv.slug}` })),
    about: [
        { name: 'Serter Iyigunlu', href: '/about' },
        { name: 'Case Studies', href: '/#products' },
    ]
};

const Footer = () => {
    return (
        <footer className="bg-white border-t border-slate-200/80 text-slate-600 py-16 px-6 md:px-12">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
                    
                    {/* Sütun 1: What We Do */}
                    <div className="lg:col-span-1">
                        <h3 className="text-sm font-semibold text-slate-900 mb-4">WHAT WE DO</h3>
                        <ul className="space-y-3">
                            {footerLinks.whatWeDo.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="hover:text-blue-600 transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Sütun 2: About */}
                    <div className="lg:col-span-1">
                        <h3 className="text-sm font-semibold text-slate-900 mb-4">ABOUT</h3>
                        <ul className="space-y-3">
                            {footerLinks.about.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="hover:text-blue-600 transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Sütun 3: Contact Us */}
                    <div className="lg:col-span-1">
                        <h3 className="text-sm font-semibold text-slate-900 mb-4">CONTACT US</h3>
                        <ul className="space-y-3">
                            <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">instagram</a></li>
                            <li><a href="tel:+61432672696" className="hover:text-blue-600 transition-colors">0432 672 696</a></li>
                        </ul>
                    </div>
                    
                    {/* Sütun 4: Copyright ve Diğerleri */}
                    <div className="lg:col-span-2 lg:border-l lg:border-slate-200/80 lg:pl-12">
                         <ul className="space-y-3">
                            <li><Link href="/privacy-policy" className="hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
                            <li className="pt-4">© {new Date().getFullYear()} All Rights Reserved by Serter Iyigunlu.</li>

                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;