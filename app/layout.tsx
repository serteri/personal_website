

import "./globals.css";
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

export const metadata: Metadata = {
    title: {
        template: '%s | ALTIQDESIGN', // Her sayfa başlığının sonuna bunu ekler
        default: 'ALTIQDESIGN — SaaS, AI Workflows & Conversion Websites', // Ana sayfa başlığı
    },
    description: 'Product & automation studio building MVPs, document workflows, AI-app rescues, and high-converting web systems.',
    // Open Graph etiketleri (Sosyal Medya Paylaşımları İçin)
    openGraph: {
        title: 'ALTIQDESIGN — SaaS, AI Workflows & Conversion Websites',
        description: 'Product & automation studio building MVPs, document workflows, AI-app rescues, and high-converting web systems.',
        url: 'https://sizin-domaininiz.com', // Buraya kendi domaininizi yazın
        siteName: 'ALTIQDESIGN',
        images: [
            {
                url: '/images/og-image.jpg', // /public/images/og-image.jpg altına bir paylaşım resmi koyun
                width: 1200,
                height: 630,
            },
        ],
        locale: 'en_US',
        type: 'website',
        // Vercel cache temizleme denemesi v1
    },
    twitter: {
        card: 'summary_large_image',
        title: 'ALTIQDESIGN — SaaS, AI Workflows & Conversion Websites',
        description: 'Product & automation studio building MVPs, document workflows, AI-app rescues, and high-converting web systems.',
    },
};

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
