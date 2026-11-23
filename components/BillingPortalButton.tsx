"use client";

import { useState } from "react";

export default function BillingPortalButton() {
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

    return (
        <div>
            <button
                type="button"
                onClick={open}
                disabled={loading}
                className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md disabled:opacity-60"
            >
                {loading ? "Opening…" : "Manage Billing & Invoices"}
            </button>
            {error && (
                <p role="alert" className="mt-2 text-sm text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
}
