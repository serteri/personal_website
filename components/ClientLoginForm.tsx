"use client";

import { useState } from "react";
import Link from "next/link";

export default function ClientLoginForm() {
    const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
    const [message, setMessage] = useState("");

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const email = new FormData(e.currentTarget).get("email");
        setState("sending");
        setMessage("");
        try {
            const res = await fetch("/api/auth/magic-link", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
            setMessage(data.message);
            setState("sent");
        } catch (err) {
            setMessage(err instanceof Error ? err.message : "Something went wrong.");
            setState("error");
        }
    }

    return (
        <div className="mx-auto w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Client Login</h1>
            <p className="mt-2 text-sm text-slate-600">Enter your email and we&apos;ll send you a one-time login link. No password needed.</p>

            {state === "sent" ? (
                <p role="status" className="mt-6 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-900">
                    {message}
                </p>
            ) : (
                <form onSubmit={onSubmit} className="mt-6 space-y-4">
                    <div>
                        <label htmlFor="login-email" className="mb-1 block text-xs font-semibold text-slate-600">
                            Email
                        </label>
                        <input
                            id="login-email"
                            name="email"
                            type="email"
                            required
                            maxLength={254}
                            autoComplete="email"
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-blue-600"
                        />
                    </div>
                    {state === "error" && (
                        <p role="alert" className="text-sm text-red-600">
                            {message}
                        </p>
                    )}
                    <button
                        type="submit"
                        disabled={state === "sending"}
                        className="w-full rounded-full bg-slate-900 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md disabled:opacity-60"
                    >
                        {state === "sending" ? "Sending…" : "Send Login Link"}
                    </button>
                </form>
            )}

            <p className="mt-6 text-center text-sm text-slate-500">
                Don&apos;t have a plan yet?{" "}
                <Link href="/ai-receptionist#pricing" className="font-semibold text-blue-600 hover:underline">
                    View plans
                </Link>
            </p>
        </div>
    );
}
