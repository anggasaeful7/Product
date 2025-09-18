"use client";

import Link from "next/link";
import { Icon } from "../../dashboard/components/Icon";
import type { ReportDetail } from "../reports-data";

export function ReportDetailView({ report }: { report: ReportDetail }) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8 space-y-2">
        <Link href="/laporan" className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-blue-300">
          <Icon name="trending" className="h-4 w-4 rotate-180" />
          Kembali ke laporan
        </Link>
        <h1 className="text-3xl font-bold text-white">{report.title}</h1>
        <p className="text-white/60">Periode {report.period} • Dibuat {report.createdAt}</p>
        <p className="text-white/70">{report.summary}</p>
      </header>

      <section className="mb-8 grid gap-4 md:grid-cols-3">
        {report.kpis.map((kpi) => (
          <div key={kpi.id} className="glass-effect rounded-2xl border border-white/20 p-5">
            <p className="text-xs uppercase tracking-wider text-white/50">{kpi.label}</p>
            <p className="mt-2 text-2xl font-semibold text-white">{kpi.value}</p>
            <p className={`text-xs font-semibold ${kpi.trend === "up" ? "text-emerald-300" : "text-rose-300"}`}>{kpi.delta}</p>
          </div>
        ))}
      </section>

      <section className="mb-8 grid gap-6 md:grid-cols-2">
        <div className="glass-effect rounded-2xl border border-white/20 p-6">
          <h2 className="text-lg font-semibold text-white">Highlight Utama</h2>
          <ul className="mt-4 space-y-3 text-sm text-white/70">
            {report.highlights.map((item, index) => (
              <li key={`${report.id}-highlight-${index}`} className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="glass-effect rounded-2xl border border-white/20 p-6">
          <h2 className="text-lg font-semibold text-white">Segment Breakdown</h2>
          <div className="mt-4 space-y-3 text-sm text-white/70">
            {report.breakdown.map((row) => (
              <div key={row.category} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <div>
                  <p className="font-semibold text-white">{row.category}</p>
                  <p className="text-xs text-white/50">{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(row.income)} pendapatan</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-white/50">Biaya</p>
                  <p className="font-semibold text-rose-200">{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(row.expense)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        {report.insights.map((insight) => (
          <div
            key={insight.id}
            className={`rounded-2xl border px-5 py-5 transition ${
              insight.tone === "positive"
                ? "border-emerald-500/30 bg-emerald-500/10"
                : insight.tone === "warning"
                  ? "border-amber-500/30 bg-amber-500/10"
                  : "border-white/10 bg-white/5"
            }`}
          >
            <div className="mb-2 flex items-center gap-2">
              <Icon name="sparkles" className="h-4 w-4 text-white" />
              <p className="text-sm font-semibold text-white">{insight.title}</p>
            </div>
            <p className="text-sm text-white/70">{insight.description}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
