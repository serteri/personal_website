import "../globals.css";
import React from "react";
import type { Metadata } from "next";

// Separate root layout: embeds render inside other people's sites, so no navbar, footer, analytics or site chat script.
export const metadata: Metadata = {
    title: "Chat",
    robots: { index: false, follow: false },
};

export default function EmbedRootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className="m-0 bg-white">{children}</body>
        </html>
    );
}
