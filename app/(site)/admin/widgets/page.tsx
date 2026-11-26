import type { Metadata } from "next";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { isAdmin } from "@/lib/demoInvites";
import { AdminLogout } from "@/components/AdminInvites";
import AdminWidgets from "@/components/AdminWidgets";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Chat Widgets | Admin", robots: { index: false, follow: false } };

export default async function WidgetsPage() {
  if (!(await isAdmin())) redirect("/admin");

  const rows = await prisma.chatWidget.findMany({ orderBy: { createdAt: "desc" }, include: { _count: { select: { leads: true } } } });
  const widgets = rows.map((w) => ({
    id: w.id,
    slug: w.slug,
    businessName: w.businessName,
    industry: w.industry,
    assistantName: w.assistantName,
    primaryColor: w.primaryColor,
    greetingMessage: w.greetingMessage,
    services: w.services,
    serviceArea: w.serviceArea,
    businessHours: w.businessHours,
    customInstructions: w.customInstructions,
    bookingUrl: w.bookingUrl,
    notifyEmail: w.notifyEmail,
    notifyPhone: w.notifyPhone,
    isActive: w.isActive,
    leadCount: w._count.leads,
  }));

  return (
    <main className="bg-slate-50 px-4 py-12">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Chat widgets</h1>
          <div className="flex items-center gap-2">
            <a href="/admin" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-slate-400">Dashboard</a>
            <AdminLogout />
          </div>
        </div>
        <AdminWidgets widgets={widgets} />
      </div>
    </main>
  );
}
