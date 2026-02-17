'use client';

import Script from 'next/script';
import { useEffect } from 'react';

export default function ChatWidget() {
    useEffect(() => {
        // Optional: Check if window.pylon exists or log
        console.log('ChatWidget mounted');
    }, []);

    return (
        <Script
            src="https://www.pylonchat.com/widget.js?id=cmlqn0q6x0001jr04p3exaheu"
            strategy="lazyOnload"
            onLoad={() => console.log('Pylon Chat script loaded')}
            onError={(e) => console.error('Pylon Chat script failed to load', e)}
        />
    );
}
