'use client';


import Link from 'next/link';

export default function PromotionalBanner() {

    return (
        
            <div className="
                fixed z-[9999]
                bottom-5 
                right-5  
            
                inline-flex items-center space-x-5
                bg-blue-600 text-white 
                px-6 py-3
                rounded-xl
                shadow-2xl
                animate-pulse
                text-base sm:text-lg">
        <span className="font-bold">
          Basic landing page is <span className="text-lime-400">FREE</span>
        </span>
                <Link
                    href="/contact"
                    className="bg-white text-blue-600 font-semibold px-4 py-1.5 rounded-md hover:bg-gray-200 transition-all duration-300
                    transform hover:scale-105"
                >
                    Contact Us
                </Link>
            </div>
       
    );
}