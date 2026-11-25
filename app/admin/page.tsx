import type { Metadata } from 'next';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { isAdmin } from '@/lib/demoInvites';
import { AdminLogin, AdminLogout } from '@/components/AdminInvites';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Admin | Dashboard', robots: { index: false, follow: false } };

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ reason?: string }> }) {
    const { reason } = await searchParams;

    if (!(await isAdmin())) {
        return (
            <main className="bg-slate-50 px-4 py-24">
                {reason === 'timeout' && (
                    <p role="status" className="mx-auto mb-4 max-w-sm rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-center text-xs text-amber-800">
                        Session expired after 15 minutes of inactivity. Please log in again.
                    </p>
                )}
                <AdminLogin />
            </main>
        );
    }

    const [total, opened, called, activeClients] = await Promise.all([
        prisma.demoInvite.count(),
        prisma.demoInvite.count({ where: { openedAt: { not: null } } }),
        prisma.demoInvite.count({ where: { callsUsed: { gt: 0 } } }),
        prisma.client.count({ where: { status: 'ACTIVE' } }),
    ]);

    const stats = [
        { label: 'Total Invites', value: total },
        { label: 'Opened', value: opened },
        { label: 'Calls Made', value: called },
        { label: 'Active Clients', value: activeClients },
    ];

    return (
        <main className="bg-slate-50 px-4 py-12">
            <div className="mx-auto max-w-6xl space-y-8">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Admin Dashboard</h1>
                    <AdminLogout />
                </div>

                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    {stats.map((s) => (
                        <div key={s.label} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">{s.label}</div>
                            <div className="mt-2 text-3xl font-bold text-slate-900">{s.value}</div>
                        </div>
                    ))}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <Link href="/admin/invites" className="rounded-3xl border border-slate-900 bg-slate-900 p-6 text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                        <div className="text-lg font-bold">Invitations &amp; Leads</div>
                        <p className="mt-1 text-sm text-slate-300">Create voice demo invites, track opens and calls.</p>
                    </Link>
                    <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-6 shadow-sm">
                        <div className="text-lg font-bold text-slate-900">Clients &amp; Billing</div>
                        <p className="mt-1 text-sm text-slate-500">Coming soon — {activeClients} active client{activeClients === 1 ? '' : 's'}.</p>
                    </div>
                </div>
            </div>
        </main>
    );
}
