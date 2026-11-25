"use client";

import { useEffect } from "react";

const IDLE_MS = 15 * 60 * 1000;
const PING_EVERY_MS = 60 * 1000;
const EVENTS = ["mousemove", "keydown", "click", "scroll"] as const;

export default function AdminSessionGuard({ active, children }: { active: boolean; children: React.ReactNode }) {
    useEffect(() => {
        if (!active) return;
        let idleTimer: ReturnType<typeof setTimeout>;
        let lastPing = Date.now();
        let lastActivity = Date.now();
        let leaving = false;

        const expire = async (reason: "timeout" | "unauthorized") => {
            if (leaving) return;
            leaving = true;
            await fetch("/api/admin/logout", { method: "POST" }).catch(() => null);
            window.location.assign(reason === "timeout" ? "/admin?reason=timeout" : "/admin");
        };

        const arm = () => {
            clearTimeout(idleTimer);
            idleTimer = setTimeout(() => expire("timeout"), IDLE_MS);
        };

        const onActivity = () => {
            const now = Date.now();
            lastActivity = now;
            arm();
            if (now - lastPing >= PING_EVERY_MS) {
                lastPing = now;
                fetch("/api/admin/session/ping", { method: "POST" })
                    .then((r) => {
                        if (r.status === 401) expire("timeout");
                    })
                    .catch(() => null);
            }
        };

        // Throttled timer drift guard (e.g. laptop sleep): check on tab refocus.
        const onVisible = () => {
            if (document.visibilityState === "visible" && Date.now() - lastActivity >= IDLE_MS) expire("timeout");
        };

        // Any admin API call answered with 401 sends the user back to /admin.
        const origFetch = window.fetch;
        window.fetch = async (...args) => {
            const res = await origFetch(...args);
            const url = typeof args[0] === "string" ? args[0] : args[0] instanceof Request ? args[0].url : String(args[0]);
            if (res.status === 401 && url.includes("/api/admin/") && !url.includes("/api/admin/login") && !url.includes("/api/admin/logout")) {
                expire("unauthorized");
            }
            return res;
        };

        arm();
        EVENTS.forEach((e) => window.addEventListener(e, onActivity, { passive: true }));
        document.addEventListener("visibilitychange", onVisible);
        return () => {
            clearTimeout(idleTimer);
            window.fetch = origFetch;
            EVENTS.forEach((e) => window.removeEventListener(e, onActivity));
            document.removeEventListener("visibilitychange", onVisible);
        };
    }, [active]);

    return <>{children}</>;
}
