import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import { inviteLink, isAdmin } from "@/lib/demoInvites";
import { AdminLogin, AdminLogout, CopyLinkButton, CreateInviteForm } from "@/components/AdminInvites";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Demo Invites | Admin", robots: { index: false, follow: false } };

const fmt = (d: Date) => d.toLocaleString("en-AU", { timeZone: "Australia/Brisbane", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });

export default async function InvitesPage() {
  if (!(await isAdmin())) {
    return (
      <main className="bg-slate-50 px-4 py-24">
        <AdminLogin />
      </main>
    );
  }

  const invites = await prisma.demoInvite.findMany({ orderBy: { createdAt: "desc" }, take: 500 });

  return (
    <main className="bg-slate-50 px-4 py-12">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Voice demo invites</h1>
          <AdminLogout />
        </div>

        <CreateInviteForm />

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">All invites ({invites.length})</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="pb-2 pr-4 font-semibold">Business</th>
                  <th className="pb-2 pr-4 font-semibold">Contact / Email</th>
                  <th className="pb-2 pr-4 font-semibold">Source</th>
                  <th className="pb-2 pr-4 font-semibold">Status</th>
                  <th className="pb-2 pr-4 font-semibold">Calls</th>
                  <th className="pb-2 pr-4 font-semibold">Last activity</th>
                  <th className="pb-2 font-semibold" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 align-top">
                {invites.map((i) => {
                  const status = i.callsUsed > 0 ? "Called" : i.openedAt ? "Opened" : "Not Opened";
                  const last = [i.lastCalledAt, i.openedAt, i.createdAt].filter((d): d is Date => Boolean(d)).sort((a, b) => b.getTime() - a.getTime())[0];
                  const expired = i.expiresAt && i.expiresAt.getTime() <= Date.now();
                  return (
                    <tr key={i.id}>
                      <td className="py-3 pr-4 font-medium text-slate-900">{i.businessName}</td>
                      <td className="py-3 pr-4 text-slate-700">
                        {i.contactName && <div>{i.contactName}</div>}
                        <div className="text-slate-500">{i.email}</div>
                      </td>
                      <td className="py-3 pr-4 text-slate-700">{i.source === "inbound_form" ? "Inbound" : "Outbound"}</td>
                      <td className="py-3 pr-4">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            status === "Called" ? "bg-emerald-50 text-emerald-700" : status === "Opened" ? "bg-blue-50 text-blue-700" : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {status}
                        </span>
                        {expired && <span className="ml-2 text-xs text-slate-400">expired</span>}
                      </td>
                      <td className="whitespace-nowrap py-3 pr-4 font-mono text-slate-700">
                        {i.callsUsed} / {i.maxCalls}
                      </td>
                      <td className="whitespace-nowrap py-3 pr-4 text-slate-700">{fmt(last)}</td>
                      <td className="py-3">
                        <CopyLinkButton link={inviteLink(i.token)} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
