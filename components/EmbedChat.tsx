"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Send } from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string; bookingUrl?: string | null };

// Pick readable text colour for the brand colour (WCAG relative luminance)
function textOn(hex: string): string {
    const n = parseInt(hex.slice(1), 16);
    const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
        const c = v / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.45 ? "#0f172a" : "#ffffff";
}

export default function EmbedChat({
    slug,
    businessName,
    assistantName,
    primaryColor,
    greeting,
}: {
    slug: string;
    businessName: string;
    assistantName: string;
    primaryColor: string;
    greeting: string;
}) {
    const color = /^#[0-9a-fA-F]{6}$/.test(primaryColor) ? primaryColor : "#0f172a";
    const onColor = useMemo(() => textOn(color), [color]);
    const [messages, setMessages] = useState<Msg[]>([{ role: "assistant", content: greeting }]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [conversationId] = useState(() => crypto.randomUUID());
    const logRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = logRef.current;
        if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }, [messages, loading]);

    async function send(e: React.FormEvent) {
        e.preventDefault();
        const content = input.trim();
        if (!content || loading) return;
        const next: Msg[] = [...messages, { role: "user", content }];
        setMessages(next);
        setInput("");
        setLoading(true);
        try {
            // The greeting is local only
            const history = next.slice(1).map((m) => ({ role: m.role, content: m.content }));
            const res = await fetch(`/api/widget/${encodeURIComponent(slug)}/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ conversationId, messages: history }),
            });
            const data = await res.json().catch(() => ({}));
            setMessages((m) => [...m, { role: "assistant", content: data.reply || "Sorry, something went wrong.", bookingUrl: data.bookingUrl }]);
        } catch {
            setMessages((m) => [...m, { role: "assistant", content: "Sorry, I lost the connection. Please try again." }]);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex h-dvh flex-col bg-white text-slate-900">
            <header className="flex items-center gap-3 px-4 py-3" style={{ backgroundColor: color, color: onColor }}>
                <span
                    className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold"
                    style={{ backgroundColor: onColor, color }}
                    aria-hidden="true"
                >
                    {assistantName.slice(0, 1).toUpperCase()}
                </span>
                <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{assistantName}</p>
                    <p className="truncate text-xs opacity-80">{businessName} · AI assistant</p>
                </div>
            </header>

            <div ref={logRef} role="log" aria-live="polite" aria-label={`Conversation with ${assistantName}`} className="flex-1 space-y-3 overflow-y-auto bg-slate-50 px-4 py-4">
                {messages.map((m, i) => (
                    <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                        <div className="max-w-[85%]">
                            <div
                                className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${m.role === "user" ? "rounded-br-md" : "rounded-bl-md bg-white text-slate-900 shadow-sm"}`}
                                style={m.role === "user" ? { backgroundColor: color, color: onColor } : undefined}
                            >
                                {m.content}
                            </div>
                            {m.bookingUrl && (
                                <a
                                    href={m.bookingUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-2 inline-flex rounded-full px-4 py-2 text-sm font-semibold shadow-sm"
                                    style={{ backgroundColor: color, color: onColor }}
                                >
                                    Book online
                                </a>
                            )}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="rounded-2xl rounded-bl-md bg-white px-4 py-2.5 text-sm text-slate-500 shadow-sm">{assistantName} is typing…</div>
                    </div>
                )}
            </div>

            <form onSubmit={send} className="flex items-center gap-2 border-t border-slate-200 bg-white p-3">
                <label htmlFor="embed-input" className="sr-only">
                    Message {assistantName}
                </label>
                <input
                    id="embed-input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    maxLength={500}
                    disabled={loading}
                    placeholder="Type a message…"
                    className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-400 disabled:opacity-60"
                />
                <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    aria-label="Send message"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full disabled:cursor-not-allowed disabled:opacity-40"
                    style={{ backgroundColor: color, color: onColor }}
                >
                    <Send className="h-4 w-4" aria-hidden="true" />
                </button>
            </form>
            <p className="bg-white pb-2 text-center text-[10px] text-slate-400">
                AI assistant · Powered by{" "}
                <a href="https://www.altiqdesign.com" target="_blank" rel="noopener noreferrer" className="underline">
                    ALTIQDESIGN
                </a>
            </p>
        </div>
    );
}
