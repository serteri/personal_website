import type { Metadata } from 'next';
import ManageClient from './ManageClient';

// Private link: keep it out of search results and don't leak it via the Referer header.
export const metadata: Metadata = {
    title: 'Manage your appointment',
    robots: { index: false, follow: false },
    referrer: 'no-referrer',
};

export default async function ManageBookingPage({ params }: { params: Promise<{ token: string }> }) {
    const { token } = await params;
    return (
        <main className="pt-40 px-4 md:ml-20 max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-4 text-ink">Manage your appointment</h1>
            <ManageClient token={token} />
        </main>
    );
}
