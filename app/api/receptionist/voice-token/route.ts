import { NextResponse } from 'next/server';
import { createRateLimiter, clientIp } from '@/lib/rateLimit';

const isLimited = createRateLimiter(3, 10 * 60 * 1000); // 3 calls / 10 min / IP

export async function POST(req: Request) {
    const apiKey = process.env.RETELL_API_KEY;
    const agentId = process.env.RETELL_PLUMBING_AGENT_ID;
    if (!apiKey || !agentId) {
        console.error('Voice demo misconfigured: RETELL_API_KEY or RETELL_PLUMBING_AGENT_ID missing');
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
        const res = await fetch('https://api.retellai.com/v2/create-web-call', {
            method: 'POST',
            headers: { 'content-type': 'application/json', Authorization: `Bearer ${apiKey}` },
            body: JSON.stringify({ agent_id: agentId }),
            signal: controller.signal,
        });
        if (!res.ok) throw new Error(`Retell ${res.status}`);
        const data = await res.json();
        if (!data.access_token) throw new Error('No access_token in Retell response');
        return NextResponse.json({ access_token: data.access_token });
    } catch (error) {
        console.error('Voice token error:', error);
        return NextResponse.json({ error: 'Could not start the voice call right now. Please try again shortly.' }, { status: 502 });
    } finally {
        clearTimeout(timer);
    }
}
