"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Send, Phone, Mic } from "lucide-react";
import type { RetellWebClient } from "retell-client-js-sdk";
import SectionHeader from "./SectionHeader";
import { services } from "@/lib/services";
import DemoFollowUp from "./DemoFollowUp";

const MAX_USER_MESSAGES = 12;
const SLOTS = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];
const QUICK_PROMPTS = ["I need an MVP built", "My Lovable app is stuck", "Book a 15-min call"];

type ApiReply = {
    reply: string;
    suggestedServiceSlug?: string | null;
    showBookingCard?: boolean;
    leadSummary?: { urgency: string; issue: string; nextStep: string } | null;
    limitReached?: boolean;
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

/* ---------- industry demo configs ---------- */

type Industry = "altiqdesign" | "dental" | "plumbing";
type LeadSummary = { urgency: string; issue: string; nextStep: string };

const INDUSTRIES: Record<
    Industry,
    { tab: string; business: string; agent: string; demo: boolean; intro: string; prompts: string[] }
> = {
    altiqdesign: {
        tab: "ALTIQDESIGN (Studio)",
        business: "ALTIQDESIGN",
        agent: "Alex",
        demo: false,
        intro: "Hi, I'm Alex, the AI receptionist for ALTIQDESIGN. What are you looking to build or fix?",
        prompts: QUICK_PROMPTS,
    },
    dental: {
        tab: "Dental Clinic (Demo)",
        business: "Albion Dental Care",
        agent: "Mia",
        demo: true,
        intro: "Hi, I'm Mia, the AI receptionist for Albion Dental Care. How can I help you today?",
        prompts: ["I have a sharp toothache", "Do you accept Bupa/Medibank?", "Book a check-up"],
    },
    plumbing: {
        tab: "Plumbing / Tradie (Demo)",
        business: "Brisbane Flow Plumbing",
        agent: "Sam",
        demo: true,
        intro: "G'day, I'm Sam, the AI receptionist for Brisbane Flow Plumbing. What's going on?",
        prompts: ["Burst pipe under my sink!", "Do you service 4010 Albion?", "Need a hot water quote"],
    },
};

type Handoff = { when: string; summary: LeadSummary | null };

/* Demo-only slot picker: never touches /api/booking or the database. */
function DemoSlotPicker({ summary, onPick }: { summary: LeadSummary | null; onPick: (h: Handoff) => void }) {
    const [days] = useState(upcomingDays);
    const [day, setDay] = useState<string | null>(null);
    const [picked, setPicked] = useState(false);

    const slotsFor = (value: string) => {
        const n = Number(value.slice(-2));
        return SLOTS.filter((_, i) => (i + n) % 3 !== 0).slice(0, 6);
    };

    return (
        <div className="mt-2 max-w-md rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Pick a time</p>
                <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-700">
                    Demo slot picker
                </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
                {days.map((d) => (
                    <button
                        key={d.value}
                        disabled={picked}
                        onClick={() => setDay(d.value)}
                        aria-pressed={day === d.value}
                        className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
                            day === d.value ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
                        }`}
                    >
                        {d.label}
                    </button>
                ))}
            </div>
            {day && (
                <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
                    {slotsFor(day).map((t) => (
                        <button
                            key={t}
                            disabled={picked}
                            onClick={() => {
                                setPicked(true);
                                const label = days.find((d) => d.value === day)?.label ?? day;
                                onPick({ when: `${label} · ${t}`, summary });
                            }}
                            className="rounded-lg border border-slate-200 bg-white py-1.5 font-mono text-xs text-slate-800 transition-colors hover:border-blue-600 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {t}
                        </button>
                    ))}
                </div>
            )}
            <p className="mt-3 text-[11px] text-slate-500">Demo only. Nothing is saved or booked.</p>
        </div>
    );
}

function HandoffCard({ h }: { h: Handoff }) {
    const rows: [string, string][] = [
        ["Urgency", h.summary?.urgency || "Routine"],
        ["Request summary", h.summary?.issue || "General enquiry"],
        ["Selected time", h.when],
    ];
    return (
        <div className="mt-2 max-w-md rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-800">What the Business Owner Receives (Auto-Handoff)</p>
            <dl className="mt-3 space-y-2">
                {rows.map(([k, v]) => (
                    <div key={k} className="flex gap-3 text-sm">
                        <dt className="w-28 shrink-0 text-slate-500">{k}</dt>
                        <dd className="font-medium text-slate-900">{v}</dd>
                    </div>
                ))}
                {h.summary?.nextStep && (
                    <div className="flex gap-3 text-sm">
                        <dt className="w-28 shrink-0 text-slate-500">Next step</dt>
                        <dd className="font-medium text-slate-900">{h.summary.nextStep}</dd>
                    </div>
                )}
            </dl>
            <span className="mt-3 inline-flex items-center rounded-full bg-emerald-600 px-2.5 py-1 text-[11px] font-semibold text-white">
                ✓ SMS / Email sent
            </span>
        </div>
    );
}

/* ---------- Tab 1: chat ---------- */

type ChatMessage = {
    role: "user" | "assistant";
    content: string;
    serviceSlug?: string | null;
    showBooking?: boolean;
    leadSummary?: LeadSummary | null;
    handoff?: Handoff;
};

function ChatTab({ industry }: { industry: Industry }) {
    const cfg = INDUSTRIES[industry];
    const [messages, setMessages] = useState<ChatMessage[]>([{ role: "assistant", content: cfg.intro }]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [limitReached, setLimitReached] = useState(false);
    const messagesContainerRef = useRef<HTMLDivElement>(null);

    const userCount = messages.filter((m) => m.role === "user").length;
    const atLimit = limitReached || userCount >= MAX_USER_MESSAGES;

    useEffect(() => {
        const el = messagesContainerRef.current;
        if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }, [messages, loading]);

    async function send(text: string) {
        const content = text.trim();
        if (!content || loading || atLimit) return;
        const next: ChatMessage[] = [...messages, { role: "user", content }];
        setMessages(next);
        setInput("");
        setLoading(true);
        try {
            // The intro greeting and local handoff cards are not sent to the model
            const history = next
                .slice(1)
                .filter((m) => !m.handoff)
                .map((m) => ({ role: m.role, content: m.content }));
            const res = await fetch("/api/receptionist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: history, industry }),
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
                    leadSummary: data.leadSummary,
                },
            ]);
        } catch {
            setMessages((m) => [
                ...m,
                { role: "assistant", content: "Sorry, I lost the connection. Please try again in a moment.", showBooking: !cfg.demo },
            ]);
        } finally {
            setLoading(false);
        }
    }

    function onHandoff(h: Handoff) {
        setMessages((m) => [
            ...m,
            { role: "assistant", content: `Done, I've locked in ${h.when} and passed the details to the team.`, handoff: h },
        ]);
    }

    const showChips = userCount === 0 && !loading;

    return (
        <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-3 sm:px-6">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">{cfg.agent[0]}</span>
                <div>
                    <p className="text-sm font-semibold text-slate-900">{cfg.agent}</p>
                    <p className="text-xs text-slate-500">
                        AI receptionist · {cfg.business}
                        {cfg.demo && " (fictional demo business)"}
                    </p>
                </div>
            </div>

            <div
                ref={messagesContainerRef}
                role="log"
                aria-live="polite"
                aria-label={`Conversation with ${cfg.agent}`}
                className="h-[440px] space-y-4 overflow-y-auto px-5 py-5 sm:h-[480px] sm:px-6"
            >
                {messages.map((m, i) => (
                    <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                        <div className="max-w-[88%] sm:max-w-[80%]">
                            <div
                                className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                                    m.role === "user" ? "rounded-br-md bg-slate-900 text-white" : "rounded-bl-md bg-slate-100 text-slate-900"
                                }`}
                            >
                                {m.content}
                            </div>
                            {m.serviceSlug && !cfg.demo && <ServiceCard slug={m.serviceSlug} />}
                            {m.showBooking && (cfg.demo ? <DemoSlotPicker summary={m.leadSummary ?? null} onPick={onHandoff} /> : <BookingPicker />)}
                            {m.handoff && <HandoffCard h={m.handoff} />}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="rounded-2xl rounded-bl-md bg-slate-100 px-4 py-2.5 text-sm text-slate-500">{cfg.agent} is typing…</div>
                    </div>
                )}
                {atLimit && !loading && !cfg.demo && !messages[messages.length - 1]?.showBooking && <BookingPicker />}
            </div>

            <div className="border-t border-slate-200 px-4 pb-4 pt-3 sm:px-6">
                {/* fixed-height slot so hiding the chips never changes the card height */}
                <div className="mb-3 h-9">
                    {showChips && (
                    <div className="flex flex-nowrap gap-2 overflow-x-auto pb-1">
                        {cfg.prompts.map((q) => (
                            <button
                                key={q}
                                onClick={() => send(q)}
                                disabled={atLimit}
                                className="shrink-0 whitespace-nowrap rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:border-slate-900 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {q}
                            </button>
                        ))}
                    </div>
                    )}
                </div>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        send(input);
                    }}
                    className="flex items-center gap-2"
                >
                    <label htmlFor="alex-input" className="sr-only">Message {cfg.agent}</label>
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
                <p className="mt-2 text-center text-[11px] text-slate-500">
                    {cfg.agent} is an AI and won&apos;t quote prices.
                    {cfg.demo ? " Demo mode: no real bookings or messages are created." : " It only knows our services and products."}
                </p>
            </div>
        </div>
    );
}

/* ---------- Tab 2: live voice demo (Retell WebRTC) ---------- */

const MAX_CALL_SECONDS = 180;
function voiceErrorMessage(err: unknown): string {
    const e = (err ?? {}) as { name?: unknown; message?: unknown };
    const name = typeof e.name === "string" ? e.name : "";
    const msg = typeof e.message === "string" ? e.message : typeof err === "string" ? err : "";
    if (name === "NotFoundError" || /NotFoundError|device not found|requested device/i.test(msg)) {
        return "No microphone detected on this PC — plug in a headset, or open this link on your phone to test.";
    }
    if (name === "NotAllowedError" || /permission|denied|notallowed/i.test(msg)) {
        return "Microphone access was blocked — allow mic permission in your browser bar and try again.";
    }
    if (/429|rate|limit/i.test(msg)) return "Demo call limit reached. Please try again in a few minutes.";
    return "Could not start the call. Please try again.";
}

/* Australian ringback (400Hz + 425Hz; 0.4s on, 0.2s off, 0.4s on, 2s off) generated with Web Audio, no audio files. */
function startRingback(): () => void {
    try {
        const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!Ctx) return () => undefined;
        const ctx = new Ctx();
        void ctx.resume(); // created inside the click handler, so the browser allows it
        const gain = ctx.createGain();
        gain.gain.value = 0;
        gain.connect(ctx.destination);
        const oscs = [400, 425].map((f) => {
            const o = ctx.createOscillator();
            o.type = "sine";
            o.frequency.value = f;
            o.connect(gain);
            o.start();
            return o;
        });
        const LEVEL = 0.04;
        const t0 = ctx.currentTime + 0.02;
        const CYCLE = 3; // seconds
        for (let c = 0; c < Math.ceil(MAX_CALL_SECONDS / CYCLE) + 1; c++) {
            const t = t0 + c * CYCLE;
            for (const [on, off] of [[0, 0.4], [0.6, 1.0]]) {
                gain.gain.setValueAtTime(LEVEL, t + on);
                gain.gain.setValueAtTime(0, t + off);
            }
        }
        let stopped = false;
        return () => {
            if (stopped) return;
            stopped = true;
            try {
                gain.gain.cancelScheduledValues(ctx.currentTime);
                gain.gain.setValueAtTime(0, ctx.currentTime);
                oscs.forEach((o) => o.stop());
                void ctx.close();
            } catch {
                /* already closed */
            }
        };
    } catch {
        return () => undefined;
    }
}

type CallState = "idle" | "connecting" | "listening" | "speaking";

class DemoApiError extends Error {}

type InviteInfo =
    | { status: "checking" }
    | { status: "none" }
    | { status: "invalid" }
    | { status: "exhausted"; contactName: string | null }
    | { status: "valid"; businessName: string; contactName: string | null; remaining: number; max: number };

function DemoRequestForm({ invalid }: { invalid: boolean }) {
    const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
    const [error, setError] = useState("");

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        setState("sending");
        setError("");
        try {
            const res = await fetch("/api/demo-invite/request", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(Object.fromEntries(f)),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
            setState("done");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong.");
            setState("error");
        }
    }

    const field =
        "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-blue-600";

    if (state === "done") {
        return (
            <div role="status" className="mt-8 rounded-2xl bg-emerald-50 p-6 text-sm text-emerald-900">
                <p className="font-semibold">Check your inbox.</p>
                <p className="mt-1">We&apos;ve emailed you a personal link to your live voice demo. It includes 3 calls and is valid for 7 days.</p>
            </div>
        );
    }

    return (
        <div className="mt-8">
            {invalid && (
                <p role="alert" className="mb-4 rounded-2xl bg-amber-50 p-4 text-sm text-amber-900">
                    This demo link is invalid, expired, or has no calls left. Request a fresh one below.
                </p>
            )}
            <h4 className="text-lg font-semibold text-slate-900">Request Live Voice Demo</h4>
            <p className="mt-1 text-sm text-slate-600">Tell us where to send your personal demo link. You&apos;ll get 3 live calls with Sam.</p>
            <form onSubmit={onSubmit} className="mt-5 grid gap-4 sm:grid-cols-2">
                {/* honeypot */}
                <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
                    <label>
                        Website <input type="text" name="website" tabIndex={-1} autoComplete="off" />
                    </label>
                </div>
                <div>
                    <label htmlFor="d-name" className="mb-1 block text-xs font-semibold text-slate-600">Full name</label>
                    <input id="d-name" name="contactName" required minLength={2} maxLength={100} autoComplete="name" className={field} />
                </div>
                <div>
                    <label htmlFor="d-biz" className="mb-1 block text-xs font-semibold text-slate-600">Business name</label>
                    <input id="d-biz" name="businessName" required minLength={2} maxLength={120} autoComplete="organization" className={field} />
                </div>
                <div>
                    <label htmlFor="d-email" className="mb-1 block text-xs font-semibold text-slate-600">Work email</label>
                    <input id="d-email" name="email" type="email" required maxLength={254} autoComplete="email" className={field} />
                </div>
                <div>
                    <label htmlFor="d-phone" className="mb-1 block text-xs font-semibold text-slate-600">Phone (optional)</label>
                    <input id="d-phone" name="phone" type="tel" maxLength={30} autoComplete="tel" className={field} />
                </div>
                {state === "error" && (
                    <p role="alert" className="text-sm text-red-600 sm:col-span-2">
                        {error}
                    </p>
                )}
                <div className="sm:col-span-2">
                    <button
                        type="submit"
                        disabled={state === "sending"}
                        className="w-full rounded-full bg-slate-900 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md disabled:opacity-60 sm:w-auto sm:px-8"
                    >
                        {state === "sending" ? "Sending…" : "Email me my demo link"}
                    </button>
                </div>
            </form>
        </div>
    );
}

function VoiceTab() {
    const [state, setState] = useState<CallState>("idle");
    const [error, setError] = useState("");
    const [seconds, setSeconds] = useState(0);
    const [invite, setInvite] = useState<InviteInfo>({ status: "checking" });
    const [completedCall, setCompletedCall] = useState(false); // a call connected and has now ended
    const connectedRef = useRef(false);
    const tokenRef = useRef<string | null>(null);
    const clientRef = useRef<RetellWebClient | null>(null);
    const callIdRef = useRef(0);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const stopRingRef = useRef<(() => void) | null>(null);
    const ringFallbackRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Validate ?invite=TOKEN once (server marks first open + notifies us)
    useEffect(() => {
        const token = new URLSearchParams(window.location.search).get("invite");
        if (!token) {
            setInvite({ status: "none" });
            return;
        }
        tokenRef.current = token;
        let cancelled = false;
        fetch("/api/demo-invite/validate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
        })
            .then((r) => r.json())
            .then((d) => {
                if (cancelled) return;
                setInvite(
                    d.valid && d.callsRemaining > 0
                        ? { status: "valid", businessName: d.businessName, contactName: d.contactName ?? null, remaining: d.callsRemaining, max: d.maxCalls }
                        : d.exhausted
                          ? { status: "exhausted", contactName: d.contactName ?? null }
                          : { status: "invalid" }
                );
            })
            .catch(() => !cancelled && setInvite({ status: "invalid" }));
        return () => {
            cancelled = true;
        };
    }, []);

    function stopRing() {
        if (ringFallbackRef.current) clearTimeout(ringFallbackRef.current);
        ringFallbackRef.current = null;
        stopRingRef.current?.();
        stopRingRef.current = null;
    }

    function clearTimer() {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = null;
    }

    function teardown() {
        clearTimer();
        stopRing();
        const client = clientRef.current;
        clientRef.current = null;
        callIdRef.current++; // ignore late events from the old call
        if (client) {
            try {
                client.stopCall();
            } catch {
                /* already stopped */
            }
            client.removeAllListeners();
        }
    }

    function endCall() {
        teardown();
        setState("idle");
        if (connectedRef.current) {
            connectedRef.current = false;
            setCompletedCall(true); // reveal the post-demo conversion card
        }
    }

    // Close any active call when leaving the tab / unmounting
    useEffect(() => teardown, []);

    async function startCall() {
        if (state !== "idle" || invite.status !== "valid" || !tokenRef.current) return;
        setError("");
        setSeconds(0);
        setCompletedCall(false);
        setState("connecting"); // instant UI feedback
        stopRing();
        stopRingRef.current = startRingback(); // AudioContext is unlocked by this click
        ringFallbackRef.current = setTimeout(stopRing, 8000); // safety: never ring longer than 8s
        const id = ++callIdRef.current;
        try {
            const res = await fetch("/api/retell/create-web-call", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ inviteToken: tokenRef.current }),
            });
            const data = await res.json().catch(() => ({}));
            if (callIdRef.current !== id) return; // cancelled while waiting
            if (res.status === 403) {
                setInvite({ status: "invalid" });
                throw new DemoApiError(data.error || "This demo link has no calls left.");
            }
            if (!res.ok || !data.access_token) throw new DemoApiError(data.error || "Could not start the call. Please try again.");
            setInvite((cur) => (cur.status === "valid" ? { ...cur, remaining: Math.max(0, data.callsRemaining ?? cur.remaining - 1) } : cur));

            const { RetellWebClient } = await import("retell-client-js-sdk");
            if (callIdRef.current !== id) return;
            const client = new RetellWebClient();
            clientRef.current = client;
            client.on("call_started", () => {
                if (callIdRef.current !== id) return;
                connectedRef.current = true;
                setState("listening");
                clearTimer();
                const started = Date.now();
                timerRef.current = setInterval(() => {
                    const s = Math.floor((Date.now() - started) / 1000);
                    setSeconds(s);
                    if (s >= MAX_CALL_SECONDS) endCall();
                }, 500);
            });
            client.on("agent_start_talking", () => {
                if (callIdRef.current !== id) return;
                stopRing(); // ringback ends exactly when Sam starts talking
                setState("speaking");
            });
            client.on("agent_stop_talking", () => callIdRef.current === id && setState("listening"));
            client.on("call_ended", () => callIdRef.current === id && endCall());
            client.on("error", (err: unknown) => {
                if (callIdRef.current !== id) return;
                setError(voiceErrorMessage(err));
                endCall();
            });

            await client.startCall({
                accessToken: data.access_token,
                callId: data.call_id,
                transport: data.transport,
                url: data.url,
                iceServers: data.ice_servers,
            });
        } catch (err) {
            if (callIdRef.current === id) {
                endCall();
                setError(err instanceof DemoApiError ? err.message : voiceErrorMessage(err));
            }
        }
    }

    const active = state !== "idle";
    const statusLabel =
        state === "connecting" ? "Connecting to Sam..." : state === "listening" ? "Listening..." : state === "speaking" ? "Sam is speaking..." : "";
    const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
    const ss = String(seconds % 60).padStart(2, "0");
    const canCall = invite.status === "valid" && (invite.remaining > 0 || active);
    const token = tokenRef.current;
    const contactName = invite.status === "valid" || invite.status === "exhausted" ? invite.contactName : null;
    const remaining = invite.status === "valid" ? invite.remaining : 0;
    // Post-demo conversion: after a call ends, or when a used-up link is opened
    const showFollowUp = !!token && !active && (completedCall || invite.status === "exhausted");

    return (
        <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
            <div className="flex flex-wrap justify-center gap-2">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">Live voice demo</span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">Fictional business</span>
            </div>
            <h3 className="mt-4 text-center text-xl font-semibold text-slate-900 sm:text-2xl">Live Voice Demo — Brisbane Flow Plumbing (Sam)</h3>
            <p className="mx-auto mt-2 max-w-xl text-center text-sm leading-relaxed text-slate-600">
                Talk live with Sam (max 3 min). Try reporting a burst pipe in Newstead or asking about after-hours availability.
            </p>

            {invite.status === "checking" && <p className="mt-8 text-center text-sm text-slate-500">Checking your demo link…</p>}

            {!showFollowUp && (invite.status === "none" || invite.status === "invalid" || (invite.status === "valid" && !canCall)) && (
                <DemoRequestForm invalid={invite.status === "invalid" || invite.status === "valid"} />
            )}

            {canCall && invite.status === "valid" && (
                <>
                    <div className="mt-5 flex justify-center">
                        <p
                            className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-semibold text-emerald-800"
                            aria-label={`${invite.remaining} of ${invite.max} demo calls remaining`}
                        >
                            <span className="flex gap-1" aria-hidden="true">
                                {Array.from({ length: invite.max }).map((_, i) => (
                                    <span key={i} className={`h-2.5 w-2.5 rounded-full ${i < invite.remaining ? "bg-emerald-500" : "bg-emerald-200"}`} />
                                ))}
                            </span>
                            {invite.remaining} of {invite.max} demo calls remaining
                        </p>
                    </div>
                    <div className="mt-4 flex min-h-[7rem] flex-col items-center justify-center gap-4 rounded-2xl bg-slate-50 p-6">
                        {active ? (
                            <>
                                <div className="flex h-12 items-center justify-center gap-1" aria-hidden="true">
                                    {Array.from({ length: 20 }).map((_, i) => (
                                        <span
                                            key={i}
                                            className={`w-1 rounded-full ${state === "speaking" ? "wave-bar bg-blue-500" : "bg-slate-300"}`}
                                            style={{ height: `${28 + ((i * 37) % 60)}%`, animationDelay: `${(i % 9) * 0.12}s` }}
                                        />
                                    ))}
                                </div>
                                <p role="status" className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                                    <span className={`h-2.5 w-2.5 rounded-full ${state === "connecting" ? "bg-amber-400" : "animate-pulse bg-emerald-500"}`} />
                                    {statusLabel}
                                    <span className="font-mono text-slate-500">
                                        {mm}:{ss} / 03:00
                                    </span>
                                </p>
                                <button
                                    onClick={endCall}
                                    className="inline-flex items-center gap-2 rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-red-700"
                                >
                                    <Phone className="h-4 w-4 rotate-[135deg]" aria-hidden="true" />
                                    End Call
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={startCall}
                                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                            >
                                <Phone className="h-4 w-4" aria-hidden="true" />
                                {completedCall ? "Call Sam Again" : "Start Voice Call"}
                            </button>
                        )}
                    </div>
                    {!active && (
                        <>
                            <p className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-blue-50 px-4 py-2.5 text-sm text-blue-900 md:hidden">
                                <Mic className="h-4 w-4 shrink-0" aria-hidden="true" />
                                Tap Allow when asked for microphone access.
                            </p>
                            <p className="mt-3 hidden items-center justify-center gap-2 rounded-xl bg-blue-50 px-4 py-2.5 text-sm text-blue-900 md:flex">
                                <Mic className="h-4 w-4 shrink-0" aria-hidden="true" />
                                <span>
                                    <strong>On a desktop PC?</strong> Make sure a mic or headset is connected — or open this link on your phone.
                                </span>
                            </p>
                        </>
                    )}
                </>
            )}

            {showFollowUp && token && (
                <DemoFollowUp
                    token={token}
                    contactName={contactName}
                    remaining={remaining}
                    onCallAgain={remaining > 0 ? () => setCompletedCall(false) : undefined}
                />
            )}

            {error && (
                <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-center text-sm text-red-700">
                    {error}
                </p>
            )}
            <p className="mt-4 text-center text-xs text-slate-500">Sam is an AI. Calls use your browser microphone and aren&apos;t connected to a real phone line.</p>
        </div>
    );
}

/* ---------- section ---------- */

export default function ReceptionistDemo({ defaultTab = "chat" }: { defaultTab?: "chat" | "voice" }) {
    const [tab, setTab] = useState<"chat" | "voice">(defaultTab);
    const [industry, setIndustry] = useState<Industry>("altiqdesign");

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

                <div role="tabpanel">{tab === "chat" ? (
                        <div>
                            <div
                                role="tablist"
                                aria-label="Industry demo"
                                className="mx-auto mb-5 flex max-w-4xl flex-wrap justify-center gap-1 rounded-2xl border border-slate-200 bg-slate-50 p-1 sm:rounded-full"
                            >
                                {(Object.keys(INDUSTRIES) as Industry[]).map((k) => (
                                    <button
                                        key={k}
                                        role="tab"
                                        aria-selected={industry === k}
                                        onClick={() => setIndustry(k)}
                                        className={`${tabClass(industry === k)} flex-1 whitespace-nowrap`}
                                    >
                                        {INDUSTRIES[k].tab}
                                    </button>
                                ))}
                            </div>
                            <ChatTab key={industry} industry={industry} />
                        </div>
                    ) : (
                        <VoiceTab />
                    )}</div>
            </div>
        </section>
    );
}
