import type { Metadata } from 'next';
import TradeLandingPage from '@/components/TradeLandingPage';
import { getTradeLanding } from '@/lib/tradeLandings';

const t = getTradeLanding('ai-receptionist-brisbane-plumbers')!;

export const metadata: Metadata = {
    title: t.title,
    description: t.description,
    keywords: t.keywords,
    alternates: { canonical: '/' + t.slug },
    openGraph: {
        title: t.title + ' | Altiq Design',
        description: t.description,
        url: '/' + t.slug,
        siteName: 'Altiq Design',
        locale: 'en_AU',
        type: 'website',
    },
};

export default function Page() {
    return <TradeLandingPage t={t} />;
}
