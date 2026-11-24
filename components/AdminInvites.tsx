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
                    <label htmlFor="i-phone" className="mb-1 block text-xs font-semibold text-slate-600">Phone (optional)</label>
                    <input id="i-phone" name="phone" type="tel" maxLength={30} placeholder="04XX XXX XXX" className={input} />
                </div>
                <div>
                    <label htmlFor="i-notes" className="mb-1 block text-xs font-semibold text-slate-600">Notes (optional)</label>
                    <input id="i-notes" name="notes" maxLength={500} placeholder="Uses ServiceM8, Hendra — sent SMS" className={input} />
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

async function patchInvite(id: string, body: unknown): Promise<string | null> {
    const res = await fetch(`/api/admin/invites/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    }).catch(() => null);
    if (res?.ok) return null;
    return (await res?.json().catch(() => ({})))?.error || "Request failed.";
}

export function CallsCell({ id, used, max }: { id: string; used: number; max: number }) {
    const router = useRouter();
    const [busy, setBusy] = useState(false);
    return (
        <span className="inline-flex items-center gap-2 whitespace-nowrap">
            <span className="font-mono text-slate-700">
                {used} / {max}
            </span>
            <button
                type="button"
                disabled={busy}
                title="Grant 3 more demo calls"
                onClick={async () => {
                    setBusy(true);
                    const err = await patchInvite(id, { action: "add_calls" });
                    setBusy(false);
                    if (err) window.alert(err);
                    else router.refresh();
                }}
                className="rounded-full border border-slate-200 px-2 py-0.5 text-[11px] font-semibold text-slate-500 transition-colors hover:border-blue-600 hover:text-blue-600 disabled:opacity-50"
            >
                +3
            </button>
        </span>
    );
}

export function InviteActions({
    id,
    link,
    businessName,
    notes,
    phone,
}: {
    id: string;
    link: string;
    businessName: string;
    notes: string | null;
    phone: string | null;
}) {
    const router = useRouter();
    const [editing, setEditing] = useState(false);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");

    async function save(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        setBusy(true);
        setError("");
        const err = await patchInvite(id, { notes: f.get("notes"), phone: f.get("phone") });
        setBusy(false);
        if (err) return setError(err);
        setEditing(false);
        router.refresh();
    }

    async function remove() {
        if (!window.confirm(`Permanently delete the invite for "${businessName}"? This cannot be undone.`)) return;
        setBusy(true);
        const res = await fetch(`/api/admin/invites/${id}`, { method: "DELETE" }).catch(() => null);
        setBusy(false);
        if (res?.ok) router.refresh();
        else window.alert((await res?.json().catch(() => ({})))?.error || "Could not delete the invite.");
    }

    const small = "rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 transition-colors hover:border-slate-400";

    return (
        <div className="flex flex-col items-start gap-2">
            <div className="flex flex-wrap gap-2">
                <CopyLinkButton link={link} label="Copy Link" />
                <button type="button" onClick={() => setEditing((v) => !v)} className={small}>
                    Edit Note
                </button>
                <button type="button" onClick={remove} disabled={busy} className={`${small} hover:border-red-300 hover:text-red-600 disabled:opacity-50`}>
                    Delete
                </button>
            </div>
            {editing && (
                <form onSubmit={save} className="w-64 space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                    <input name="phone" type="tel" maxLength={30} defaultValue={phone ?? ""} placeholder="04XX XXX XXX" aria-label="Phone" className={input} />
                    <textarea name="notes" maxLength={500} rows={3} defaultValue={notes ?? ""} placeholder="Notes" aria-label="Notes" className={input} />
                    {error && (
                        <p role="alert" className="text-xs text-red-600">
                            {error}
                        </p>
                    )}
                    <div className="flex gap-2">
                        <button type="submit" disabled={busy} className="rounded-full bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white disabled:opacity-60">
                            Save
                        </button>
                        <button type="button" onClick={() => setEditing(false)} className={small}>
                            Cancel
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
