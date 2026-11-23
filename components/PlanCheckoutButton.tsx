"use client";

import { useState } from "react";

export default function PlanCheckoutButton({
    plan,
    children,
    className,
}: {
    plan: "pilot" | "starter" | "growth";
    children: React.ReactNode;
    className: string;
}) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function go() {
        if (loading) return;
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ plan }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok || !data.url) throw new Error(data.error || "Could not start checkout. Please try again.");
            window.location.href = data.url;
        } catch (err) {
            setError(err instanceof Error ? err.message : "Could not start checkout.");
            setLoading(false);
        }
    }

    return (
        <div>
            <button type="button" onClick={go} disabled={loading} className={`${className} disabled:cursor-not-allowed disabled:opacity-60`}>
                {loading ? "Redirecting…" : children}
            </button>
            {error && (
                <p role="alert" className="mt-2 text-sm text-red-500">
                    {error}
                </p>
            )}
        </div>
    );
}
