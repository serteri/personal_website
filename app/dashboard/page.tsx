import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import { getSessionClient } from "@/lib/clientAuth";
import ClientLoginForm from "@/components/ClientLoginForm";
import BillingPortalButton from "@/components/BillingPortalButton";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Client Dashboard | ALTIQDESIGN", robots: { index: false, follow: false } };

const OVERAGE: Record<string, string> = { STARTER: "$0.60/min", GROWTH: "$0.50/min" };
const statusStyle: Record<string, string> = {
  ACTIVE: "bg-emerald-50 text-emerald-700",
  PAST_DUE: "bg-amber-50 text-amber-700",
  CANCELED: "bg-slate-100 text-slate-600",
};
const TZ = "Australia/Brisbane";
const fmtDateTime = (d: Date) => d.toLocaleString("en-AU", { timeZone: TZ, day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });
const fmtDate = (d: Date) => d.toLocaleDateString("en-AU", { timeZone: TZ, day: "numeric", month: "long", year: "numeric" });

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ checkout?: string; login?: string }> }) {
  const { checkout, login } = await searchParams;
  const client = await getSessionClient();

  if (!client) {
    return (
      <main className="bg-slate-50 px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-md space-y-4">
          {checkout === "success" && (
            <p role="status" className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-900">
              Payment received! Enter your email address below to log in.
            </p>
          )}
          {login === "invalid" && (
            <p role="alert" className="rounded-2xl bg-red-50 p-4 text-sm text-red-700">
              That login link is invalid or has expired. Request a new one below.
            </p>
          )}
          <ClientLoginForm />
        </div>
      </main>
    );
  }

  const calls = await prisma.callLog.findMany({ where: { clientId: client.id }, orderBy: { createdAt: "desc" }, take: 20 });
  const used = client.minutesUsedCurrentPeriod;
  const limit = client.monthlyMinuteLimit;
  const pct = Math.min(100, Math.round((used / limit) * 100));
  const remaining = Math.max(0, limit - used);
  const over = Math.max(0, used - limit);
  const overage = OVERAGE[client.plan];

  return (
    <main className="bg-slate-50 px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-5xl space-y-6">
        {checkout === "success" && (
          <p role="status" className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-900">
            Payment received! Welcome aboard.
          </p>
        )}

        {/* Header */}
        <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">{client.businessName}</h1>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">{client.plan}</span>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle[client.status]}`}>{client.status.replace("_", " ")}</span>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <BillingPortalButton />
            <form method="post" action="/api/auth/logout">
              <button type="submit" className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:border-slate-400">
                Log out
              </button>
            </form>
          </div>
        </div>

        {!client.retellAgentId && (
          <p className="rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-900">
            Your AI receptionist is currently being configured by our Brisbane team. We&apos;ll email you as soon as it&apos;s live.
          </p>
        )}

        {/* Usage */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-baseline justify-between">
            <h2 className="text-sm font-semibold text-slate-900">Minutes this period</h2>
            <p className="font-mono text-sm text-slate-600">
              {used} / {limit} min
            </p>
          </div>
          <div
            role="progressbar"
            aria-valuenow={used}
            aria-valuemin={0}
            aria-valuemax={limit}
            aria-label="Minutes used this period"
            className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100"
          >
            <div className={`h-full rounded-full ${pct >= 100 ? "bg-red-500" : pct >= 80 ? "bg-amber-500" : "bg-blue-600"}`} style={{ width: `${pct}%` }} />
          </div>
          <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-slate-500">Remaining</dt>
              <dd className="font-semibold text-slate-900">{remaining} min</dd>
            </div>
            <div>
              <dt className="text-slate-500">Period ends</dt>
              <dd className="font-semibold text-slate-900">{fmtDate(client.currentPeriodEnd)}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Overage</dt>
              <dd className="font-semibold text-slate-900">
                {overage ? `${overage} after ${limit} min` : "Not available on the pilot"}
                {over > 0 && overage ? ` (${over} min over)` : ""}
              </dd>
            </div>
          </dl>
        </div>

        {/* Calls */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">Recent calls</h2>
          {calls.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">No calls yet. They&apos;ll appear here as your receptionist answers them.</p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="text-xs uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="pb-2 pr-4 font-semibold">When</th>
                    <th className="pb-2 pr-4 font-semibold">Caller</th>
                    <th className="pb-2 pr-4 font-semibold">Duration</th>
                    <th className="pb-2 font-semibold">Summary</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 align-top">
                  {calls.map((c) => (
                    <tr key={c.id}>
                      <td className="whitespace-nowrap py-3 pr-4 text-slate-700">{fmtDateTime(c.createdAt)}</td>
                      <td className="whitespace-nowrap py-3 pr-4 font-mono text-slate-700">{c.callerNumber ?? "Unknown"}</td>
                      <td className="whitespace-nowrap py-3 pr-4 text-slate-700">{c.billedMinutes} min</td>
                      <td className="py-3 text-slate-700">
                        {c.isEmergency && <span className="mr-2 rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">Emergency</span>}
                        {c.summary ?? <span className="text-slate-400">Summary pending</span>}
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
