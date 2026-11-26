"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CopyLinkButton } from "./AdminInvites";

export type WidgetRow = {
    id: string;
    slug: string;
    businessName: string;
    industry: string;
    assistantName: string;
    primaryColor: string;
    greetingMessage: string;
    services: string;
    serviceArea: string | null;
    businessHours: string | null;
    customInstructions: string | null;
    bookingUrl: string | null;
    notifyEmail: string | null;
    notifyPhone: string | null;
    isActive: boolean;
    leadCount: number;
};

const input =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-blue-600";
const label = "mb-1 block text-xs font-semibold text-slate-600";
const pill = "rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md disabled:opacity-60";

const EMPTY = {
    slug: "",
    businessName: "",
    industry: "general",
    assistantName: "Sam",
    primaryColor: "#0f172a",
    greetingMessage: "Hi! How can I help you today?",
    services: "",
    serviceArea: "",
    businessHours: "",
    customInstructions: "",
    bookingUrl: "",
    notifyEmail: "",
    notifyPhone: "",
    isActive: true,
};

// Canonical host (www) so widget.js never hits an apex->www redirect on its cross-origin fetch()
const SITE = (process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://www.altiqdesign.com").replace(/\/$/, "");
const embedCode = (slug: string) => `<script src="${SITE}/widget.js" data-widget="${slug}" async></script>`;

export default function AdminWidgets({ widgets }: { widgets: WidgetRow[] }) {
    const router = useRouter();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState({ ...EMPTY });
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");
    const [saved, setSaved] = useState("");
    const [importUrl, setImportUrl] = useState("");
    const [rawText, setRawText] = useState("");
    const [showPaste, setShowPaste] = useState(false);
    const [importing, setImporting] = useState(false);
    const [importWarning, setImportWarning] = useState("");
    const [importOk, setImportOk] = useState("");

    const set = (k: keyof typeof EMPTY, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

    // Fills the form from the extracted profile; only overwrites fields the importer actually found
    async function runImport(body: { url?: string; rawText?: string }) {
        setImporting(true);
        setImportWarning("");
        setImportOk("");
        const res = await fetch("/api/admin/widgets/import-url", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        }).catch(() => null);
        const data = await res?.json().catch(() => ({}));
        setImporting(false);
        if (!res?.ok || !data?.profile) {
            setImportWarning(data?.error || "Could not import from that website. Paste the website text manually below or fill in the fields.");
            if (body.url) setShowPaste(true); // fall back to manual paste automatically
            return;
        }
        const p = data.profile as Partial<Record<keyof typeof EMPTY, string | null>>;
        setForm((f) => {
            const next = { ...f };
            for (const k of ["businessName", "industry", "services", "serviceArea", "businessHours", "customInstructions", "notifyEmail", "notifyPhone"] as const) {
                if (p[k]) next[k] = p[k] as string;
            }
            if (!f.slug && p.businessName) {
                next.slug = p.businessName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
            }
            return next;
        });
        setImportOk("Imported. Review every field below before saving.");
    }

    function edit(w: WidgetRow) {
        setEditingId(w.id);
        setError("");
        setSaved("");
        setForm({
            slug: w.slug,
            businessName: w.businessName,
            industry: w.industry,
            assistantName: w.assistantName,
            primaryColor: w.primaryColor,
            greetingMessage: w.greetingMessage,
            services: w.services,
            serviceArea: w.serviceArea ?? "",
            businessHours: w.businessHours ?? "",
            customInstructions: w.customInstructions ?? "",
            bookingUrl: w.bookingUrl ?? "",
            notifyEmail: w.notifyEmail ?? "",
            notifyPhone: w.notifyPhone ?? "",
            isActive: w.isActive,
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function reset() {
        setEditingId(null);
        setForm({ ...EMPTY });
        setError("");
    }

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        setBusy(true);
        setError("");
        setSaved("");
        const res = await fetch(editingId ? `/api/admin/widgets/${editingId}` : "/api/admin/widgets", {
            method: editingId ? "PATCH" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        }).catch(() => null);
        const data = await res?.json().catch(() => ({}));
        setBusy(false);
        if (!res?.ok) return setError(data?.error || "Could not save the widget.");
        setSaved(editingId ? "Widget updated." : "Widget created.");
        reset();
        router.refresh();
    }

    return (
        <div className="space-y-6">
            <form onSubmit={submit} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-slate-900">{editingId ? `Edit widget: ${form.slug}` : "New chat widget"}</h2>
                    {editingId && (
                        <button type="button" onClick={reset} className="text-xs font-semibold text-slate-500 hover:text-slate-900">
                            Cancel edit
                        </button>
                    )}
                </div>
                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <label htmlFor="w-import-url" className={label}>Website URL</label>
                    <div className="flex flex-col gap-2 sm:flex-row">
                        <input
                            id="w-import-url"
                            type="url"
                            placeholder="https://example-plumbing.com.au"
                            value={importUrl}
                            onChange={(e) => setImportUrl(e.target.value)}
                            className={input}
                        />
                        <button
                            type="button"
                            disabled={importing || !importUrl.trim()}
                            onClick={() => runImport({ url: importUrl.trim() })}
                            className={`${pill} shrink-0`}
                        >
                            {importing ? "Importing…" : "Import from URL"}
                        </button>
                    </div>
                    {importWarning && (
                        <p role="alert" className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-900">
                            {importWarning}
                        </p>
                    )}
                    {importOk && (
                        <p role="status" className="mt-3 text-sm text-emerald-700">
                            {importOk}
                        </p>
                    )}
                    <button type="button" onClick={() => setShowPaste((v) => !v)} className="mt-3 text-xs font-semibold text-blue-600 hover:underline">
                        {showPaste ? "Hide manual text paste" : "Manual text paste"}
                    </button>
                    {showPaste && (
                        <div className="mt-2">
                            <label htmlFor="w-raw" className={label}>Paste the website text (about, services, areas, hours, contact…)</label>
                            <textarea id="w-raw" rows={6} maxLength={60000} value={rawText} onChange={(e) => setRawText(e.target.value)} className={input} />
                            <button
                                type="button"
                                disabled={importing || rawText.trim().length < 150}
                                onClick={() => runImport({ rawText: rawText.trim() })}
                                className={`${pill} mt-2`}
                            >
                                {importing ? "Extracting…" : "Extract from Pasted Text"}
                            </button>
                        </div>
                    )}
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div>
                        <label htmlFor="w-business" className={label}>Business name</label>
                        <input id="w-business" required maxLength={120} value={form.businessName} onChange={(e) => set("businessName", e.target.value)} className={input} />
                    </div>
                    <div>
                        <label htmlFor="w-slug" className={label}>Slug (used in the embed URL)</label>
                        <input id="w-slug" required maxLength={60} placeholder="trg-plumbing" value={form.slug} onChange={(e) => set("slug", e.target.value)} className={input} />
                    </div>
                    <div>
                        <label htmlFor="w-assistant" className={label}>Assistant name</label>
                        <input id="w-assistant" required maxLength={30} value={form.assistantName} onChange={(e) => set("assistantName", e.target.value)} className={input} />
                    </div>
                    <div>
                        <label htmlFor="w-industry" className={label}>Industry</label>
                        <input id="w-industry" maxLength={40} placeholder="plumbing, dental, electrical…" value={form.industry} onChange={(e) => set("industry", e.target.value)} className={input} />
                    </div>
                    <div>
                        <label htmlFor="w-color" className={label}>Brand colour</label>
                        <div className="flex gap-2">
                            <input aria-label="Pick colour" type="color" value={form.primaryColor} onChange={(e) => set("primaryColor", e.target.value)} className="h-10 w-14 cursor-pointer rounded-lg border border-slate-200 bg-white p-1" />
                            <input id="w-color" maxLength={7} value={form.primaryColor} onChange={(e) => set("primaryColor", e.target.value)} className={input} />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="w-booking" className={label}>Booking URL (Cal.com / Google Calendar)</label>
                        <input id="w-booking" type="url" maxLength={500} placeholder="https://cal.com/…" value={form.bookingUrl} onChange={(e) => set("bookingUrl", e.target.value)} className={input} />
                    </div>
                    <div className="sm:col-span-2">
                        <label htmlFor="w-greeting" className={label}>Greeting message</label>
                        <input id="w-greeting" required maxLength={300} value={form.greetingMessage} onChange={(e) => set("greetingMessage", e.target.value)} className={input} />
                    </div>
                    <div className="sm:col-span-2">
                        <label htmlFor="w-services" className={label}>Services (plain text or bullet list)</label>
                        <textarea id="w-services" required rows={4} maxLength={4000} value={form.services} onChange={(e) => set("services", e.target.value)} className={input} />
                    </div>
                    <div>
                        <label htmlFor="w-area" className={label}>Service area</label>
                        <textarea id="w-area" rows={2} maxLength={1000} value={form.serviceArea} onChange={(e) => set("serviceArea", e.target.value)} className={input} />
                    </div>
                    <div>
                        <label htmlFor="w-hours" className={label}>Business hours</label>
                        <textarea id="w-hours" rows={2} maxLength={1000} value={form.businessHours} onChange={(e) => set("businessHours", e.target.value)} className={input} />
                    </div>
                    <div className="sm:col-span-2">
                        <label htmlFor="w-custom" className={label}>Custom instructions (tone, pricing notes, suburb rules, FAQs)</label>
                        <textarea id="w-custom" rows={4} maxLength={4000} value={form.customInstructions} onChange={(e) => set("customInstructions", e.target.value)} className={input} />
                    </div>
                    <div>
                        <label htmlFor="w-email" className={label}>Notify email (job summaries)</label>
                        <input id="w-email" type="email" maxLength={254} value={form.notifyEmail} onChange={(e) => set("notifyEmail", e.target.value)} className={input} />
                    </div>
                    <div>
                        <label htmlFor="w-phone" className={label}>Notify phone (stored only, no SMS yet)</label>
                        <input id="w-phone" type="tel" maxLength={30} value={form.notifyPhone} onChange={(e) => set("notifyPhone", e.target.value)} className={input} />
                    </div>
                    <label className="flex items-center gap-2 text-sm text-slate-700 sm:col-span-2">
                        <input type="checkbox" checked={form.isActive} onChange={(e) => set("isActive", e.target.checked)} className="h-4 w-4 rounded border-slate-300" />
                        Active (widget answers visitors)
                    </label>
                </div>
                {error && (
                    <p role="alert" className="mt-4 text-sm text-red-600">
                        {error}
                    </p>
                )}
                {saved && (
                    <p role="status" className="mt-4 text-sm text-emerald-700">
                        {saved}
                    </p>
                )}
                <button type="submit" disabled={busy} className={`${pill} mt-4`}>
                    {busy ? "Saving…" : editingId ? "Save changes" : "Create widget"}
                </button>
            </form>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-sm font-semibold text-slate-900">All widgets ({widgets.length})</h2>
                {widgets.length === 0 ? (
                    <p className="mt-4 text-sm text-slate-500">No widgets yet. Create the first one above.</p>
                ) : (
                    <div className="mt-4 overflow-x-auto">
                        <table className="w-full min-w-[760px] text-left text-sm">
                            <thead className="text-xs uppercase tracking-wider text-slate-500">
                                <tr>
                                    <th className="pb-2 pr-4 font-semibold">Business</th>
                                    <th className="pb-2 pr-4 font-semibold">Status</th>
                                    <th className="pb-2 pr-4 font-semibold">Leads</th>
                                    <th className="pb-2 font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 align-top">
                                {widgets.map((w) => (
                                    <tr key={w.id}>
                                        <td className="py-3 pr-4">
                                            <div className="flex items-center gap-2 font-bold text-slate-900">
                                                <span className="h-3 w-3 rounded-full border border-slate-200" style={{ backgroundColor: w.primaryColor }} aria-hidden="true" />
                                                {w.businessName}
                                            </div>
                                            <div className="mt-0.5 font-mono text-xs text-slate-500">{w.slug} · {w.assistantName}</div>
                                        </td>
                                        <td className="py-3 pr-4">
                                            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${w.isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                                                {w.isActive ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                        <td className="py-3 pr-4 font-mono text-slate-700">{w.leadCount}</td>
                                        <td className="py-3">
                                            <div className="flex flex-wrap gap-2">
                                                <CopyLinkButton link={embedCode(w.slug)} label="Copy Embed Code" />
                                                <a href={`/embed/${w.slug}`} target="_blank" rel="noopener noreferrer" className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:border-slate-400">
                                                    Live Preview
                                                </a>
                                                <button type="button" onClick={() => edit(w)} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:border-slate-400">
                                                    Edit
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
