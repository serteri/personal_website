import React from 'react';
import AdminSessionGuard from '@/components/AdminSessionGuard';
import { isAdmin } from '@/lib/demoInvites';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const active = await isAdmin();
    return (
        <section>
            <AdminSessionGuard active={active}>{children}</AdminSessionGuard>
        </section>
    );
}
