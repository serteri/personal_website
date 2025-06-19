import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';

const services = [
    {
        title: 'Branding',
        description: 'We build memorable brands that stand out, connect with audiences, and drive growth from the ground up.',
        href: '/whatwedo/branding',
    },
    {
        title: 'Web Design',
        description: 'Crafting beautiful, intuitive, and high-performing websites that convert visitors into customers.',
        href: '/whatwedo/webdesign',
    },
    {
        title: 'Content Strategy',
        description: 'Developing a clear narrative and content plan that engages your audience and communicates your value.',
        href: '/whatwedo/contentstrategy',
    },
    {
        title: 'SEO',
        description: 'Implementing proven strategies to increase your visibility on search engines and attract organic traffic.',
        href: '/whatwedo/seo',
    },
];

export default function WhatWeDoPage() {
    return (
        <div className="bg-black min-h-screen text-white py-24 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto">
                <div className="text-center mb-20">
                    <h1 className="text-5xl md:text-7xl font-bold">What We Do</h1>
                    <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
                        We deliver a complete suite of services to transform your digital presence, from brand identity to market visibility.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                    {services.map((service) => (
                        <Link href={service.href} key={service.title} className="group block p-8 bg-gray-900/50 rounded-xl border border-gray-800 hover:border-lime-300/50 transition-all duration-300">
                            <h2 className="text-3xl font-bold text-lime-300">{service.title}</h2>
                            <p className="mt-4 text-gray-300">{service.description}</p>
                            <div className="mt-6 flex items-center text-white font-semibold group-hover:text-lime-300 transition-colors">
                                Learn More
                                <FiArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
