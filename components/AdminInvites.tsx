"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const input =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-blue-600";
const pill = "rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md disabled:opacity-60";

export function AdminLogin() {
    const router = useRouter();
    const [error, setError] = useState("");
    const [busy, setBusy] = useState(false);

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const secret = new FormData(e.currentTarget).get("secret");
        setBusy(true);
        setError("");
        const res = await fetch("/api/admin/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ secret }),
        }).catch(() => null);
        if (res?.ok) return router.refresh();
        const data = await res?.json().catch(() => ({}));
        setError(data?.error || "Could not log in.");
        setBusy(false);
    }

    return (
        <form onSubmit={onSubmit} className="mx-auto w-full max-w-sm space-y-4 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h1 className="text-xl font-bold text-slate-900">Admin</h1>
            <div>
                <label htmlFor="admin-secret" className="mb-1 block text-xs font-semibold text-slate-600">
                    Admin secret
                </label>
                <input id="admin-secret" name="secret" type="password" required autoComplete="current-password" className={input} />
            </div>
            {error && (
                <p role="alert" className="text-sm text-red-600">
                    {error}
                </p>
            )}
            <button type="submit" disabled={busy} className={`${pill} w-full`}>
                {busy ? "Checking…" : "Log in"}
            </button>
        </form>
    );
}

export function CopyLinkButton({ link, label = "Copy Link" }: { link: string; label?: string }) {
    const [copied, setCopied] = useState(false);
    return (
        <button
            type="button"
            onClick={async () => {
                try {
                    await navigator.clipboard.writeText(link);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1500);
                } catch {
                    window.prompt("Copy this link:", link);
                }
            }}
            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 transition-colors hover:border-slate-400"
        >
            {copied ? "Copied ✓" : label}
        </button>
    );
}

export function CreateInviteForm() {
    const router = useRouter();
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");
    const [link, setLink] = useState("");

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.currentTarget;
        const f = new FormData(form);
        setBusy(true);
        setError("");
        setLink("");
        const res = await fetch("/api/admin/invites", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(Object.fromEntries(f)),
        }).catch(() => null);
        const data = await res?.json().catch(() => ({}));
        setBusy(false);
        if (!res?.ok || !data?.link) {
            setError(data?.error || "Could not create the invite.");
            return;
        }
        setLink(data.link);
        form.reset();
        router.refresh();
    }

    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900">New outbound invite</h2>
            <form onSubmit={onSubmit} className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                    <label htmlFor="i-business" className="mb-1 block text-xs font-semibold text-slate-600">Business name</label>
                    <input id="i-business" name="businessName" required maxLength={120} className={input} />
                </div>
                <div>
                    <label htmlFor="i-contact" className="mb-1 block text-xs font-semibold text-slate-600">Contact name</label>
                    <input id="i-contact" name="contactName" maxLength={100} className={input} />
                </div>
                <div className="sm:col-span-2">
                    <label htmlFor="i-email" className="mb-1 block text-xs font-semibold text-slate-600">Email</label>
                    <input id="i-email" name="email" type="email" required maxLength={254} className={input} />
                </div>
                <div>
                    <label htmlFor="i-max" className="mb-1 block text-xs font-semibold text-slate-600">Max calls</label>
                    <input id="i-max" name="maxCalls" type="number" min={1} max={20} defaultValue={3} className={input} />
                </div>
                <div>
                    <label htmlFor="i-days" className="mb-1 block text-xs font-semibold text-slate-600">Expires in (days)</label>
                    <input id="i-days" name="expiresInDays" type="number" min={1} max={90} defaultValue={14} className={input} />
                </div>
                <div className="sm:col-span-2">
                    <button type="submit" disabled={busy} className={pill}>
                        {busy ? "Creating…" : "Generate invite link"}
                    </button>
                </div>
            </form>
            {error && (
                <p role="alert" className="mt-4 text-sm text-red-600">
                    {error}
                </p>
            )}
            {link && (
                <div className="mt-4 flex flex-col gap-2 rounded-2xl bg-emerald-50 p-4 sm:flex-row sm:items-center">
                    <code className="min-w-0 flex-1 break-all text-xs text-emerald-900">{link}</code>
                    <CopyLinkButton link={link} />
                </div>
            )}
        </div>
    );
}

export function AdminLogout() {
    const router = useRouter();
    return (
        <button
            type="button"
            onClick={async () => {
                await fetch("/api/admin/login", { method: "DELETE" });
                router.refresh();
            }}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-slate-400"
        >
            Log out
        </button>
    );
}
