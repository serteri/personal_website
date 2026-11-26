import { lookup } from 'dns/promises';
import { isIP } from 'net';

const UA =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
const MAX_BYTES = 1_500_000;
const TIMEOUT_MS = 10_000;
const PAGE_CHARS = 8000;
export const MIN_READABLE_CHARS = 150;

export class BlockedError extends Error {}

/* ---------- SSRF guard: admin-only, but never fetch internal addresses ---------- */

function privateV4(ip: string): boolean {
    const [a, b] = ip.split('.').map(Number);
    return (
        a === 0 || a === 10 || a === 127 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) ||
        (a === 192 && b === 168) || (a === 100 && b >= 64 && b <= 127) || a >= 224
    );
}
function privateIp(ip: string): boolean {
    if (isIP(ip) === 4) return privateV4(ip);
    const v = ip.toLowerCase();
    if (v === '::1' || v === '::') return true;
    if (v.startsWith('::ffff:')) return privateV4(v.slice(7));
    return v.startsWith('fc') || v.startsWith('fd') || v.startsWith('fe8') || v.startsWith('fe9') || v.startsWith('fea') || v.startsWith('feb');
}
async function assertPublic(url: URL) {
    if (url.protocol !== 'http:' && url.protocol !== 'https:') throw new BlockedError('Only http(s) URLs are allowed.');
    const host = url.hostname.replace(/^\[|\]$/g, '');
    if (host === 'localhost' || host.endsWith('.local') || host.endsWith('.internal')) throw new BlockedError('Internal addresses are not allowed.');
    const addrs = isIP(host) ? [{ address: host }] : await lookup(host, { all: true });
    if (!addrs.length || addrs.some((a) => privateIp(a.address))) throw new BlockedError('Internal addresses are not allowed.');
}

/* ---------- fetching ---------- */

async function readCapped(res: Response): Promise<string> {
    const reader = res.body?.getReader();
    if (!reader) return '';
    const chunks: Uint8Array[] = [];
    let total = 0;
    while (total < MAX_BYTES) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        total += value.length;
    }
    reader.cancel().catch(() => undefined);
    return new TextDecoder('utf-8', { fatal: false }).decode(Buffer.concat(chunks));
}

const CHALLENGE = /just a moment\.\.\.|cf-chl|attention required! \| cloudflare|checking your browser|enable javascript and cookies|captcha|access denied|are you a robot/i;

async function fetchPage(start: string): Promise<{ html: string; finalUrl: URL }> {
    let url = new URL(start);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
        for (let hop = 0; hop < 4; hop++) {
            await assertPublic(url);
            const res = await fetch(url, {
                redirect: 'manual',
                signal: controller.signal,
                headers: { 'user-agent': UA, accept: 'text/html,application/xhtml+xml', 'accept-language': 'en-AU,en;q=0.9' },
            });
            if (res.status >= 300 && res.status < 400 && res.headers.get('location')) {
                url = new URL(res.headers.get('location') as string, url);
                continue;
            }
            const body = await readCapped(res);
            if (res.status === 403 || res.status === 429 || res.status === 401) throw new BlockedError(`HTTP ${res.status}`);
            if (!res.ok && CHALLENGE.test(body)) throw new BlockedError('challenge');
            if (!res.ok) throw new BlockedError(`HTTP ${res.status}`);
            if (CHALLENGE.test(body.slice(0, 6000)) && htmlToText(body).length < 600) throw new BlockedError('challenge');
            return { html: body, finalUrl: url };
        }
        throw new BlockedError('Too many redirects');
    } catch (e) {
        if (e instanceof BlockedError) throw e;
        throw new BlockedError(e instanceof Error ? e.message : 'fetch failed'); // timeouts, DNS, TLS
    } finally {
        clearTimeout(timer);
    }
}

/* ---------- HTML -> text ---------- */

const ENTITIES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', ndash: '-', mdash: '-', rsquo: "'", lsquo: "'", ldquo: '"', rdquo: '"' };

export function htmlToText(html: string): string {
    return html
        .replace(/<(script|style|noscript|svg|template|iframe)[\s\S]*?<\/\1>/gi, ' ')
        .replace(/<!--[\s\S]*?-->/g, ' ')
        .replace(/<\/(p|div|li|h[1-6]|tr|section|article|header|footer|br)\s*>|<br\s*\/?>/gi, '\n')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (m, e: string) => {
            if (e[0] === '#') {
                const code = e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
                return Number.isFinite(code) && code > 0 && code < 0x10ffff ? String.fromCodePoint(code) : ' ';
            }
            return ENTITIES[e.toLowerCase()] ?? m;
        })
        .replace(/[ \t\f\v]+/g, ' ')
        .replace(/ ?\n ?/g, '\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}

function metaOf(html: string): string {
    const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1];
    const desc = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i)?.[1];
    return [title && `Title: ${htmlToText(title)}`, desc && `Description: ${htmlToText(desc)}`].filter(Boolean).join('\n');
}

// tel:/mailto: links are often the only place the phone/email appear
function contactLinks(html: string): string {
    const tel = [...html.matchAll(/href=["']tel:([^"']+)["']/gi)].map((m) => decodeURIComponent(m[1]).trim());
    const mail = [...html.matchAll(/href=["']mailto:([^"'?]+)/gi)].map((m) => decodeURIComponent(m[1]).trim());
    const uniq = (a: string[]) => [...new Set(a)].slice(0, 4);
    return [uniq(tel).length && `Phone links: ${uniq(tel).join(', ')}`, uniq(mail).length && `Email links: ${uniq(mail).join(', ')}`].filter(Boolean).join('\n');
}

function internalLinks(html: string, base: URL): string[] {
    const bare = (h: string) => h.replace(/^www\./, '');
    const found: { url: string; rank: number }[] = [];
    for (const m of html.matchAll(/<a[^>]+href=["']([^"'#]+)["']/gi)) {
        try {
            const u = new URL(m[1], base);
            if (bare(u.hostname) !== bare(base.hostname) || u.pathname === '/' || u.pathname === base.pathname) continue;
            const rank = /about/i.test(u.pathname) ? 0 : /contact/i.test(u.pathname) ? 1 : /service/i.test(u.pathname) ? 2 : -1;
            if (rank >= 0 && !found.some((f) => f.url === u.href)) found.push({ url: u.href, rank });
        } catch {
            /* ignore malformed href */
        }
    }
    return found.sort((a, b) => a.rank - b.rank).slice(0, 2).map((f) => f.url);
}

// Returns readable text for the homepage plus up to 2 about/contact(/services) pages. Throws BlockedError.
export async function fetchSiteText(rawUrl: string): Promise<string> {
    const start = /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`;
    let home;
    try {
        home = await fetchPage(start);
    } catch (e) {
        if (e instanceof BlockedError) throw e;
        throw new BlockedError('invalid url');
    }
    const parts = [`PAGE: ${home.finalUrl.href}\n${metaOf(home.html)}\n${contactLinks(home.html)}\n${htmlToText(home.html).slice(0, PAGE_CHARS)}`];
    for (const link of internalLinks(home.html, home.finalUrl)) {
        try {
            const page = await fetchPage(link);
            parts.push(`PAGE: ${page.finalUrl.href}\n${contactLinks(page.html)}\n${htmlToText(page.html).slice(0, PAGE_CHARS)}`);
        } catch {
            /* optional pages: ignore failures */
        }
    }
    const text = parts.join('\n\n---\n\n');
    if (htmlToText(home.html).length < MIN_READABLE_CHARS) throw new BlockedError('insufficient text'); // JS-rendered or empty
    return text.slice(0, 20000);
}
