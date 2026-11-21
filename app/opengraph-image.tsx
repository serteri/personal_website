import { ImageResponse } from 'next/og';

export const alt = 'ALTIQDESIGN — SaaS, AI Workflows & Conversion Websites';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Swiss-style social card: concrete grey, cobalt square, heavy wordmark.
export default function OpengraphImage() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    background: '#F4F4F5',
                    color: '#18181B',
                    padding: 72,
                    borderTop: '16px solid #18181B',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ width: 40, height: 40, background: '#0047FF', marginRight: 24 }} />
                    <div style={{ fontSize: 72, fontWeight: 700, letterSpacing: -2 }}>ALTIQDESIGN</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontSize: 28, color: '#52525B', letterSpacing: 4, marginBottom: 20 }}>
                        PRODUCT & AUTOMATION STUDIO
                    </div>
                    <div style={{ fontSize: 60, fontWeight: 700, letterSpacing: -1.5, lineHeight: 1.1 }}>
                        SaaS, AI Workflows & Conversion Websites
                    </div>
                </div>
            </div>
        ),
        { ...size }
    );
}
