"use client";

import { useState } from "react";

export default function BillingPortalButton({ variant = "primary" }: { variant?: "primary" | "link" }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function open() {
        if (loading) return;
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/billing/portal", { method: "POST" });
            const data = await res.json().catch(() => ({}));
            if (!res.ok || !data.url) throw new Error(data.error || "Could not open billing right now.");
            window.location.href = data.url;
        } catch (err) {
            setError(err instanceof Error ? err.message : "Could not open billing right now.");
            setLoading(false);
        }
    }

    if (variant === "link") {
        return (
            <div>
                <button type="button" onClick={open} disabled={loading} className="text-sm font-semibold text-slate-600 underline-offset-4 hover:text-slate-900 hover:underline disabled:opacity-60">
                    {loading ? "Opening…" : "Cancel or Change Plan"}
                </button>
                {error && (
                    <p role="alert" className="mt-1 text-sm text-red-600">
                        {error}
                    </p>
                )}
            </div>
        );
    }

    return (
        <div>
            <button
                type="button"
                onClick={open}
                disabled={loading}
                className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md disabled:opacity-60"
            >
                {loading ? "Opening…" : "Upgrade / Manage Subscription"}
            </button>
            {error && (
                <p role="alert" className="mt-2 text-sm text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
}
