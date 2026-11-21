// Best-effort in-memory, per-IP rate limiter (per server instance).
export function createRateLimiter(limit: number, windowMs: number) {
    const hits = new Map<string, number[]>();

    return function isLimited(key: string): boolean {
        const now = Date.now();
        const recent = (hits.get(key) ?? []).filter(t => now - t < windowMs);
        if (recent.length >= limit) {
            hits.set(key, recent);
            return true;
        }
        recent.push(now);
        hits.set(key, recent);
        if (hits.size > 5000) {
            for (const [k, times] of hits) {
                if (times.every(t => now - t >= windowMs)) hits.delete(k);
            }
        }
        return false;
    };
}

export function clientIp(req: Request): string {
    return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
        || req.headers.get('x-real-ip')
        || 'unknown';
}
