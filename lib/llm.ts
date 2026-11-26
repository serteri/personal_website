export type LlmMessage = { role: 'user' | 'assistant'; content: string };

export function extractJson(text: string): unknown {
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start === -1 || end <= start) return null;
    try {
        return JSON.parse(text.slice(start, end + 1));
    } catch {
        return null;
    }
}

export function llmConfigured(): boolean {
    return Boolean(process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY);
}

// Same provider setup as /api/receptionist: Anthropic first, OpenAI fallback, same env vars and default models.
export async function callLlm(opts: { system: string; messages: LlmMessage[]; signal: AbortSignal; maxTokens?: number }): Promise<string> {
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    const maxTokens = opts.maxTokens ?? 500;
    if (anthropicKey) {
        const res = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: { 'content-type': 'application/json', 'x-api-key': anthropicKey, 'anthropic-version': '2023-06-01' },
            body: JSON.stringify({
                model: process.env.RECEPTIONIST_ANTHROPIC_MODEL || 'claude-haiku-4-5-20251001',
                max_tokens: maxTokens,
                temperature: 0.3,
                system: opts.system,
                messages: opts.messages,
            }),
            signal: opts.signal,
        });
        if (!res.ok) throw new Error(`Anthropic ${res.status}`);
        const data = await res.json();
        return (data.content ?? []).map((b: { text?: string }) => b.text ?? '').join('');
    }
    const openaiKey = process.env.OPENAI_API_KEY;
    if (!openaiKey) throw new Error('No LLM key configured');
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'content-type': 'application/json', authorization: `Bearer ${openaiKey}` },
        body: JSON.stringify({
            model: process.env.RECEPTIONIST_OPENAI_MODEL || 'gpt-4o-mini',
            max_tokens: maxTokens,
            temperature: 0.3,
            response_format: { type: 'json_object' },
            messages: [{ role: 'system', content: opts.system }, ...opts.messages],
        }),
        signal: opts.signal,
    });
    if (!res.ok) throw new Error(`OpenAI ${res.status}`);
    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? '';
}
