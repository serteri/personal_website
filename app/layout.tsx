

import "./globals.css";
import Navbar from "@/components/Navbar";
import React from "react";
import {Providers} from "@/components/Provider";
import {authOptions} from "@/lib/auth";
import { getServerSession } from 'next-auth/next';
import { Toaster } from 'react-hot-toast';
import Footer from "@/components/Footer";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: {
        template: '%s | ALTIQDESIGN', // Her sayfa başlığının sonuna bunu ekler
        default: 'ALTIQDESIGN - Modern Web & Brand Experiences', // Ana sayfa başlığı
    },
    description: 'ALTIQDESIGN is a creative studio dedicated to building powerful, engaging, and future-proof digital experiences that elevate brands.',
    // Open Graph etiketleri (Sosyal Medya Paylaşımları İçin)
    openGraph: {
        title: 'ALTIQDESIGN',
        description: 'Creative studio for modern digital experiences.',
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
    },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // This runs on the server.
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
    <body >
      <Navbar/>
      <div className="pt-20">
          <Toaster
              position="top-center"
              toastOptions={{
                  success: { className: 'bg-green-500 text-white' },
                  error:   { className: 'bg-red-500 text-white' },
              }}
          />
          <Providers session={session}>{children}</Providers>

      </div>
<Footer />
    </body>
    </html>
  );
}
