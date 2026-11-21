"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Send, Phone } from "lucide-react";
import SectionHeader from "./SectionHeader";
import { services } from "@/lib/services";

const MAX_USER_MESSAGES = 12;
const SLOTS = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];
const QUICK_PROMPTS = ["I need an MVP built", "My Lovable app is stuck", "Book a 15-min call"];
const BUSINESS_TYPES = ["Clinic", "Tradie", "NDIS", "SaaS", "Other"];

type ChatMessage = {
    role: "user" | "assistant";
    content: string;
    serviceSlug?: string | null;
    showBooking?: boolean;
};

type ApiReply = {
    reply: string;
    suggestedServiceSlug?: string | null;
    showBookingCard?: boolean;
    limitReached?: boolean;
};

const INTRO: ChatMessage = {
    role: "assistant",
    content: "Hi, I'm Alex, the AI receptionist for ALTIQDESIGN. What are you looking to build or fix?",
};

/* ---------- visual components rendered inside the chat ---------- */

function ServiceCard({ slug }: { slug: string }) {
    const s = services.find((x) => x.slug === slug);
    if (!s) return null;
    return (
        <Link
            href={`/services/${s.slug}`}
            className="group mt-2 block max-w-sm rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
        >
            <div className="flex items-center justify-between">
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-wider text-slate-700">
                    {s.scope}
                </span>
                <span className="text-xs font-medium text-slate-500 transition-colors group-hover:text-blue-600">View ↗</span>
            </div>
            <p className="mt-2 text-sm font-semibold text-slate-900">{s.title}</p>
            <p className="mt-1 text-xs text-slate-600">{s.description}</p>
        </Link>
    );
}

type Booked = { date: string; time: string };

function dayKey(d: string) {
    // Same convention as /booking: local midnight -> UTC date string
    return new Date(`${d}T00:00:00`).toISOString().slice(0, 10);
}

function upcomingDays(): { value: string; label: string }[] {
    const out: { value: string; label: string }[] = [];
    const d = new Date();
    while (out.length < 5) {
        d.setDate(d.getDate() + 1);
        if (d.getDay() === 0) continue; // closed on Sundays
        const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        out.push({ value, label: d.toLocaleDateString("en-AU", { weekday: "short", day: "numeric", month: "short" }) });
    }
    return out;
}

function BookingPicker() {
    const router = useRouter();
    const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");
    const [booked, setBooked] = useState<Booked[]>([]);
    const [days] = useState(upcomingDays);
    const [day, setDay] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        fetch("/api/booking", { cache: "no-store" })
            .then((r) => {
                if (!r.ok) throw new Error("bad status");
                return r.json();
            })
            .then((data: Booked[]) => {
                if (!cancelled) {
                    setBooked(data);
                    setStatus("ok");
                }
            })
            .catch(() => !cancelled && setStatus("error"));
        return () => {
            cancelled = true;
        };
    }, []);

    if (status === "error") {
        return (
            <div className="mt-2 max-w-sm rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
                <p className="text-sm text-slate-700">I can&apos;t load live availability right now. The booking page has the full calendar.</p>
                <Link href="/booking" className="mt-3 inline-flex rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
                    Open booking page
                </Link>
            </div>
        );
    }

    const takenForDay = day ? booked.filter((b) => b.date.slice(0, 10) === dayKey(day)).map((b) => b.time) : [];
    const free = SLOTS.filter((t) => !takenForDay.includes(t));

    return (
        <div className="mt-2 max-w-sm rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Pick a time for a 15-min call</p>
            {status === "loading" ? (
                <p className="mt-3 text-sm text-slate-500">Loading availability…</p>
            ) : (
                <>
                    <div className="mt-3 flex flex-wrap gap-2">
                        {days.map((d) => (
                            <button
                                key={d.value}
                                onClick={() => setDay(d.value)}
                                aria-pressed={day === d.value}
                                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                                    day === d.value
                                        ? "border-slate-900 bg-slate-900 text-white"
                                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
                                }`}
                            >
                                {d.label}
                            </button>
                        ))}
                    </div>
                    {day && (
                        <div className="mt-3 grid grid-cols-5 gap-2">
                            {free.length === 0 && <p className="col-span-5 text-sm text-slate-500">No free slots that day.</p>}
                            {free.map((t) => (
                                <button
                                    key={t}
                                    onClick={() => router.push(`/booking?date=${day}&time=${t}`)}
                                    className="rounded-lg border border-slate-200 bg-white py-1.5 font-mono text-xs text-slate-800 transition-colors hover:border-blue-600 hover:text-blue-600"
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    )}
                    <p className="mt-3 text-[11px] text-slate-500">You&apos;ll confirm your details on the booking page.</p>
                </>
            )}
        </div>
    );
}

/* ---------- Tab 1: chat ---------- */

function ChatTab() {
    const [messages, setMessages] = useState<ChatMessage[]>([INTRO]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [limitReached, setLimitReached] = useState(false);
    const logRef = useRef<HTMLDivElement>(null);

    const userCount = messages.filter((m) => m.role === "user").length;
    const atLimit = limitReached || userCount >= MAX_USER_MESSAGES;

    useEffect(() => {
        logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
    }, [messages, loading]);

    async function send(text: string) {
        const content = text.trim();
        if (!content || loading || atLimit) return;
        const next: ChatMessage[] = [...messages, { role: "user", content }];
        setMessages(next);
        setInput("");
        setLoading(true);
        try {
            // The intro greeting is local only; send the real conversation
            const history = next.slice(1).map((m) => ({ role: m.role, content: m.content }));
            const res = await fetch("/api/receptionist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: history }),
            });
            const data: ApiReply = await res.json();
            if (data.limitReached) setLimitReached(true);
            setMessages((m) => [
                ...m,
                {
                    role: "assistant",
                    content: data.reply || "Sorry, something went wrong.",
                    serviceSlug: data.suggestedServiceSlug,
                    showBooking: data.showBookingCard,
                },
            ]);
        } catch {
            setMessages((m) => [
                ...m,
                { role: "assistant", content: "Sorry, I lost the connection. You can book a 15-minute call instead.", showBooking: true },
            ]);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-4">
                <p className="text-sm font-semibold text-slate-900">Try asking</p>
                <div className="mt-3 flex flex-wrap gap-2 lg:flex-col lg:items-stretch">
                    {QUICK_PROMPTS.map((q) => (
                        <button
                            key={q}
                            onClick={() => send(q)}
                            disabled={loading || atLimit}
                            className="rounded-2xl border border-slate-200/80 bg-white px-4 py-3 text-left text-sm font-medium text-slate-800 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {q}
                        </button>
                    ))}
                </div>
                <p className="mt-4 text-xs text-slate-500">Alex is an AI. It only knows our services and products, and won&apos;t quote prices.</p>
            </div>

            <div className="lg:col-span-8">
                <div className="flex h-[480px] flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
                    <div className="flex items-center gap-3 border-b border-slate-200/80 px-5 py-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">A</span>
                        <div>
                            <p className="text-sm font-semibold text-slate-900">Alex</p>
                            <p className="text-xs text-slate-500">AI receptionist · ALTIQDESIGN</p>
                        </div>
                    </div>

                    <div ref={logRef} role="log" aria-live="polite" aria-label="Conversation with Alex" className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
                        {messages.map((m, i) => (
                            <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                                <div className="max-w-[85%]">
                                    <div
                                        className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                                            m.role === "user" ? "rounded-br-md bg-slate-900 text-white" : "rounded-bl-md bg-slate-100 text-slate-900"
                                        }`}
                                    >
                                        {m.content}
                                    </div>
                                    {m.serviceSlug && <ServiceCard slug={m.serviceSlug} />}
                                    {m.showBooking && <BookingPicker />}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="rounded-2xl rounded-bl-md bg-slate-100 px-4 py-2.5 text-sm text-slate-500">Alex is typing…</div>
                            </div>
                        )}
                        {atLimit && !loading && !messages[messages.length - 1]?.showBooking && (
                            <BookingPicker />
                        )}
                    </div>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            send(input);
                        }}
                        className="flex items-center gap-2 border-t border-slate-200/80 p-3"
                    >
                        <label htmlFor="alex-input" className="sr-only">Message Alex</label>
                        <input
                            id="alex-input"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            maxLength={500}
                            disabled={loading || atLimit}
                            placeholder={atLimit ? "Demo limit reached. Book a call to continue" : "Type a message…"}
                            className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
                        />
                        <button
                            type="submit"
                            disabled={loading || atLimit || !input.trim()}
                            aria-label="Send message"
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <Send className="h-4 w-4" aria-hidden="true" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

/* ---------- Tab 2: voice (lead-gated) ---------- */

function VoiceTab() {
    const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
    const [error, setError] = useState("");

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        setState("sending");
        setError("");
        try {
            const res = await fetch("/api/receptionist/lead", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: f.get("name"),
                    email: f.get("email"),
                    businessType: f.get("businessType"),
                    website: f.get("website"),
                }),
            });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(res.status === 400 ? "Please check your details and try again." : data.message || "Something went wrong.");
            }
            setState("done");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong.");
            setState("error");
        }
    }

    const field =
        "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-blue-600";

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* preview card */}
            <div className="rounded-3xl border border-slate-200/80 bg-slate-900 p-8 text-white shadow-sm">
                <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">90-sec live call demo</span>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">+61 AU Number</span>
                </div>
                <div className="mt-10 flex h-24 items-center justify-center gap-1" aria-hidden="true">
                    {Array.from({ length: 28 }).map((_, i) => (
                        <span
                            key={i}
                            className="wave-bar w-1 rounded-full bg-blue-400"
                            style={{ height: `${28 + ((i * 37) % 60)}%`, animationDelay: `${(i % 9) * 0.12}s` }}
                        />
                    ))}
                </div>
                <div className="mt-10 flex items-start gap-3">
                    <Phone className="mt-1 h-5 w-5 shrink-0 text-blue-300" aria-hidden="true" />
                    <p className="text-lg font-semibold leading-snug">
                        A receptionist that answers your business line 24/7, qualifies the caller, and books the appointment.
                    </p>
                </div>
                <p className="mt-4 text-sm text-slate-400">Phase 2. Test calls are limited, so access is by request.</p>
            </div>

            {/* gated form */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-sm">
                <p className="text-sm font-semibold text-slate-900">Request access to the test line</p>
                {state === "done" ? (
                    <div role="status" className="mt-6 rounded-2xl bg-emerald-50 p-5 text-sm text-emerald-900">
                        Request received. We&apos;ll email you when test calls are available.
                    </div>
                ) : (
                    <form onSubmit={onSubmit} className="mt-5 space-y-4">
                        {/* honeypot */}
                        <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
                            <label>
                                Website <input type="text" name="website" tabIndex={-1} autoComplete="off" />
                            </label>
                        </div>
                        <div>
                            <label htmlFor="v-name" className="mb-1 block text-xs font-semibold text-slate-600">Name</label>
                            <input id="v-name" name="name" required minLength={2} maxLength={80} autoComplete="name" className={field} />
                        </div>
                        <div>
                            <label htmlFor="v-email" className="mb-1 block text-xs font-semibold text-slate-600">Email</label>
                            <input id="v-email" name="email" type="email" required maxLength={254} autoComplete="email" className={field} />
                        </div>
                        <div>
                            <label htmlFor="v-type" className="mb-1 block text-xs font-semibold text-slate-600">Business type</label>
                            <select id="v-type" name="businessType" required defaultValue="" className={field}>
                                <option value="" disabled>Select…</option>
                                {BUSINESS_TYPES.map((t) => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>
                        {state === "error" && <p role="alert" className="text-sm text-red-600">{error}</p>}
                        <button
                            type="submit"
                            disabled={state === "sending"}
                            className="w-full rounded-full bg-slate-900 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md disabled:opacity-60"
                        >
                            {state === "sending" ? "Sending…" : "Request access"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

/* ---------- section ---------- */

export default function ReceptionistDemo() {
    const [tab, setTab] = useState<"chat" | "voice">("chat");

    const tabClass = (active: boolean) =>
        `rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
            active ? "bg-slate-900 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
        }`;

    return (
        <section id="demo" className="bg-white px-4 py-20 scroll-mt-24">
            <div className="mx-auto max-w-6xl">
                <SectionHeader
                    eyebrow="Try Our AI Receptionist"
                    title="Live Demo — AI Front-Desk Receptionist"
                    description="See how our 24/7 receptionist answers questions, qualifies leads, and books appointments without sounding like a robot."
                />

                <div role="tablist" aria-label="Demo type" className="mb-8 inline-flex rounded-full border border-slate-200/80 bg-slate-50 p-1">
                    <button role="tab" aria-selected={tab === "chat"} onClick={() => setTab("chat")} className={tabClass(tab === "chat")}>
                        Chat &amp; Visual
                    </button>
                    <button role="tab" aria-selected={tab === "voice"} onClick={() => setTab("voice")} className={tabClass(tab === "voice")}>
                        Voice &amp; Phone Demo
                    </button>
                </div>

                <div role="tabpanel">{tab === "chat" ? <ChatTab /> : <VoiceTab />}</div>
            </div>
        </section>
    );
}
