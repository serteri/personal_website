import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../lib/auth';  // our NextAuth config
import AdminPanel from '@/components/AdminPanel';

export default async function AdminPage() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.isAdmin) {
        // Redirect to home if not admin
        // (In App Router, you can throw a redirect())
        return <p>Access Denied</p>;
    }
    return <AdminPanel />;
}