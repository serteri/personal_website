

import "../globals.css";
import Navbar from "@/components/Navbar";
import React from "react";
import { Providers } from "@/components/Provider";
import { authOptions } from "@/lib/auth";
import { getServerSession } from 'next-auth/next';
import { Toaster } from 'react-hot-toast';
import Footer from "@/components/Footer";
import type { Metadata } from 'next';
import { GoogleAnalytics } from '@next/third-parties/google'
import ChatWidget from '@/components/ChatWidget';

const SITE = 'https://www.altiqdesign.com';
const SITE_TITLE = 'Altiq Design | Software, Web Design & AI Voice Receptionists in Brisbane';
const SITE_DESCRIPTION =
    'Brisbane software and web development studio. We build custom software, conversion-focused websites and 24/7 AI voice receptionists that answer calls and book jobs for local businesses.';

export const metadata: Metadata = {
    metadataBase: new URL(SITE),
    title: {
        template: '%s | Altiq Design', // appended to every page title
        default: SITE_TITLE,
    },
    description: SITE_DESCRIPTION,
    // Each page sets its own canonical via `alternates`; none here so pages never canonicalise to the homepage.
    openGraph: {
        title: SITE_TITLE,
        description: SITE_DESCRIPTION,
        url: SITE,
        siteName: 'Altiq Design',
        locale: 'en_AU',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: SITE_TITLE,
        description: SITE_DESCRIPTION,
    },
};

const localBusinessJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Altiq Design',
    url: SITE,
    telephone: '0432 672 696',
    description:
        'Brisbane studio building custom software, web design and 24/7 AI voice receptionists for local businesses.',
    areaServed: 'Brisbane, QLD, Australia',
    address: { '@type': 'PostalAddress', addressLocality: 'Brisbane', addressRegion: 'QLD', addressCountry: 'AU' },
};
// "<" escaped so the JSON can never close the script tag
const localBusinessJson = JSON.stringify(localBusinessJsonLd).replace(/</g, '\\u003c');

async function safeGetSession() {
    try {
        return await getServerSession(authOptions);
    } catch (e) {
        console.error("[safeGetSession] getServerSession failed", e);
        return null; // hatada boş session ile devam
    }
}

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // This runs on the server.
    const session = await safeGetSession();

    return (
        <html lang="en">
            <head>
                {/* MANUEL OLARAK EKLEYECEĞİNİZ SATIR */}
                <link rel="icon" href="/favicon.ico" type="image/x-icon" sizes="any" />
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: localBusinessJson }} />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body >
                <Navbar />
                <div className="pt-20">
                    <Toaster
                        position="top-center"
                        toastOptions={{
                            success: { className: 'bg-green-500 text-white' },
                            error: { className: 'bg-red-500 text-white' },
                        }}
                    />
                    <Providers session={session}>{children}</Providers>

                </div>
                <Footer />
                <ChatWidget />
            </body>
            <GoogleAnalytics gaId="G-F7R1QT46BJ" />
        </html>
    );
}
