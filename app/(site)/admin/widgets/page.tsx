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
  const leads = await prisma.widgetLead.findMany({ orderBy: { createdAt: "desc" }, take: 50, include: { widget: { select: { businessName: true } } } });
  const fmt = (d: Date) => d.toLocaleString("en-AU", { timeZone: "Australia/Brisbane", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });
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

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">Recent leads ({leads.length})</h2>
          {leads.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">No leads captured yet.</p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[860px] text-left text-sm">
                <thead className="text-xs uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="pb-2 pr-4 font-semibold">When</th>
                    <th className="pb-2 pr-4 font-semibold">Widget</th>
                    <th className="pb-2 pr-4 font-semibold">Contact</th>
                    <th className="pb-2 pr-4 font-semibold">Issue</th>
                    <th className="pb-2 pr-4 font-semibold">Preferred time</th>
                    <th className="pb-2 font-semibold">Urgency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 align-top">
                  {leads.map((l) => (
                    <tr key={l.id}>
                      <td className="whitespace-nowrap py-3 pr-4 text-slate-700">{fmt(l.createdAt)}</td>
                      <td className="py-3 pr-4 font-medium text-slate-900">{l.widget.businessName}</td>
                      <td className="py-3 pr-4 text-slate-700">
                        {l.callerName && <div>{l.callerName}</div>}
                        {l.phone && (
                          <a href={`tel:${l.phone.replace(/[^\d+]/g, "")}`} className="text-blue-600 hover:underline">
                            {l.phone}
                          </a>
                        )}
                        {l.email && <div className="text-slate-500">{l.email}</div>}
                        {l.suburb && <div className="text-xs text-slate-500">{l.suburb}</div>}
                      </td>
                      <td className="max-w-[260px] py-3 pr-4 text-slate-700">
                        {l.issue ?? "-"}
                        {l.transcript && (
                          <details className="mt-1">
                            <summary className="cursor-pointer text-xs text-slate-500">Transcript</summary>
                            <pre className="mt-1 whitespace-pre-wrap font-sans text-xs text-slate-600">{l.transcript}</pre>
                          </details>
                        )}
                      </td>
                      <td className="py-3 pr-4 text-slate-700">{l.preferredTime ?? "-"}</td>
                      <td className="py-3">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${l.urgency === "emergency" || l.urgency === "urgent" ? "bg-red-50 text-red-600" : "bg-slate-100 text-slate-600"}`}>
                          {l.urgency ?? "routine"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
