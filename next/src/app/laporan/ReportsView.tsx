"use client";

import Link from "next/link";
import { Icon } from "../dashboard/components/Icon";
import { useDashboardContext } from "../dashboard/dashboard-context";
import { reports } from "./reports-data";

export default function ReportsView() {
  const { accountName } = useDashboardContext();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="mb-8 space-y-3">
        <h1 className="text-3xl font-bold text-white">Laporan Keuangan</h1>
        <p className="text-white/70">{accountName ? `Analisis periode untuk ${accountName}` : "Ringkasan performa finansial dan insight AI setiap bulan."}</p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button className="rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:border-primary">Download PDF Terbaru</button>
          <button className="rounded-xl bg-gradient-to-r from-primary to-secondary px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:from-secondary hover:to-primary">Buat Laporan Custom</button>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        {reports.map((report) => (
          <div key={report.id} className="glass-effect flex h-full flex-col rounded-2xl border border-white/20 p-6 transition hover:border-white/40">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-white/50">Periode</p>
                <h2 className="mt-1 text-xl font-semibold text-white">{report.title}</h2>
                <p className="text-sm text-white/60">{report.period}</p>
              </div>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/70">Dibuat {report.createdAt}</span>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-white/70">{report.summary}</p>

            <div className="mt-5 grid grid-cols-3 gap-3">
              {report.kpis.map((kpi) => (
                <div key={kpi.id} className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <p className="text-xs text-white/50">{kpi.label}</p>
                  <p className="mt-1 text-lg font-semibold text-white">{kpi.value}</p>
                  <p className={`text-xs font-semibold ${kpi.trend === "up" ? "text-emerald-300" : "text-rose-300"}`}>{kpi.delta}</p>
                </div>
              ))}
            </div>

            <ul className="mt-5 space-y-2 text-sm text-white/70">
              {report.highlights.map((item, index) => (
                <li key={`${report.id}-highlight-${index}`} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex items-center justify-between">
              <Link
                href={`/laporan/${report.id}`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-blue-300"
              >
                Lihat detail
                <Icon name="trending" className="h-4 w-4" />
              </Link>
              <button className="text-xs font-semibold text-white/60 underline underline-offset-4 hover:text-white">
                Bagikan
              </button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
