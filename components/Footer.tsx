import React from 'react';
import Link from 'next/link';

// Linkleri daha kolay yönetmek için bir veri yapısı oluşturalım
const footerLinks = {
    whatWeDo: [
        { name: 'Brand Strategy', href: '/whatwedo/branding' },
        { name: 'Content Strategy', href: '/whatwedo/contentstrategy' },
        { name: 'Website Design', href: '/whatwedo/webdesign' },
        { name: 'SEO', href: '/whatwedo/seo' },
    ],
    about: [
        { name: 'Serter Iyigunlu', href: '/about' },
        { name: 'Case Studies', href: '/whatwedo' }, // Örnek link
        { name: 'Insights', href: '/whatwedo' }, // News sayfasına yönlendirilebilir
    ]
};

const Footer = () => {
    return (
        <footer className="bg-black text-gray-400 py-16 px-6 md:px-12">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
                    
                    {/* Sütun 1: What We Do */}
                    <div className="lg:col-span-1">
                        <h3 className="font-bold text-lime-300 mb-4">WHAT WE DO</h3>
                        <ul className="space-y-3">
                            {footerLinks.whatWeDo.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="hover:text-white transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Sütun 2: About */}
                    <div className="lg:col-span-1">
                        <h3 className="font-bold text-lime-300 mb-4">ABOUT</h3>
                        <ul className="space-y-3">
                            {footerLinks.about.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="hover:text-white transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Sütun 3: Contact Us */}
                    <div className="lg:col-span-1">
                        <h3 className="font-bold text-lime-300 mb-4">CONTACT US</h3>
                        <ul className="space-y-3">
                            <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">instagram</a></li>
                            <li><a href="tel:+61405636970" className="hover:text-white transition-colors">+61405086537</a></li>
                        </ul>
                    </div>
                    
                    {/* Sütun 4: Copyright ve Diğerleri */}
                    <div className="lg:col-span-2 lg:border-l lg:border-gray-700 lg:pl-12">
                         <ul className="space-y-3">
                            <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                            <li className="pt-4">© 2024 All Rights Reserved by Olya Black.</li>

                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;