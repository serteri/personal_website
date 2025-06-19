

import "./globals.css";
import Navbar from "@/components/Navbar";
import React from "react";
import {Providers} from "@/components/Provider";
import {authOptions} from "@/lib/auth";
import { getServerSession } from 'next-auth/next';
import { Toaster } from 'react-hot-toast';
import Footer from "@/components/Footer";

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
