import { NextResponse } from 'next/server';
import { createRateLimiter, clientIp } from '@/lib/rateLimit';

export const dynamic = 'force-dynamic';

const isLimited = createRateLimiter(2, 10 * 60 * 1000); // 2 calls / 10 min / IP

export async function POST(req: Request) {
    const apiKey = process.env.RETELL_API_KEY?.trim();
    const agentId = process.env.RETELL_PLUMBING_AGENT_ID?.trim();
    if (!apiKey || !agentId) {
        console.error('Voice demo misconfigured: missing Retell env', {
            hasApiKey: Boolean(apiKey),
            hasAgentId: Boolean(agentId),
        });
        return NextResponse.json(
            { error: 'Voice demo is not configured on the server (missing RETELL_API_KEY or RETELL_PLUMBING_AGENT_ID).' },
            { status: 500 }
        );
    }

    if (isLimited(clientIp(req))) {
        return NextResponse.json(
            { error: 'Demo call limit reached. Please try again in about 10 minutes.' },
            { status: 429, headers: { 'Retry-After': '600' } }
        );
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    try {
        const res = await fetch('https://api.retellai.com/v3/create-web-call', {
            method: 'POST',
            headers: { 'content-type': 'application/json', Authorization: `Bearer ${apiKey}` },
            body: JSON.stringify({ agent_id: agentId }),
            signal: controller.signal,
        });
        if (!res.ok) {
            const detail = (await res.text().catch(() => '')).slice(0, 500);
            console.error('Retell create-web-call failed:', { status: res.status, body: detail });
            return NextResponse.json({ error: 'Could not start the voice call right now. Please try again shortly.' }, { status: 502 });
        }
        const data = await res.json();
        if (!data.access_token) {
            console.error('Retell response had no access_token; keys:', Object.keys(data ?? {}));
            throw new Error('No access_token in Retell response');
        }
        // Forward every v3 connection field the client SDK needs (LiveKit/gateway auth + routing)
        return NextResponse.json({
            access_token: data.access_token,
            call_id: data.call_id,
            transport: data.transport,
            url: data.url,
            ice_servers: data.ice_servers,
            expires_at: data.expires_at,
        });
    } catch (error) {
        console.error('Voice token error:', error);
        return NextResponse.json({ error: 'Could not start the voice call right now. Please try again shortly.' }, { status: 502 });
    } finally {
        clearTimeout(timer);
    }
}
