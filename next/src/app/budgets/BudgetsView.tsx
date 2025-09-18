"use client";

import { useMemo } from "react";
import { Icon } from "../dashboard/components/Icon";
import { useDashboardContext } from "../dashboard/dashboard-context";

type BudgetCategory = {
  id: string;
  name: string;
  allocated: number;
  used: number;
  trend: number;
  accent: string;
};

type BudgetAlert = {
  id: string;
  title: string;
  detail: string;
  severity: "warning" | "info" | "positive";
};

type ScenarioPlan = {
  id: string;
  title: string;
  description: string;
  impact: string;
};

const currency = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });

const categories: BudgetCategory[] = [
  { id: "ops", name: "Operasional", allocated: 5000000, used: 3600000, trend: -8, accent: "from-blue-500 to-indigo-500" },
  { id: "marketing", name: "Marketing", allocated: 4200000, used: 3900000, trend: 12, accent: "from-amber-500 to-orange-500" },
  { id: "payroll", name: "Payroll", allocated: 7200000, used: 7100000, trend: 3, accent: "from-emerald-500 to-green-500" },
  { id: "development", name: "R&D", allocated: 2800000, used: 1950000, trend: -4, accent: "from-purple-500 to-fuchsia-500" }
];

const alerts: BudgetAlert[] = [
  {
    id: "marketing-limit",
    title: "Budget marketing tersisa 8%",
    detail: "Pertimbangkan untuk menunda kampanye baru atau alihkan dari pos lain.",
    severity: "warning"
  },
  {
    id: "payroll-stable",
    title: "Pengeluaran payroll stabil",
    detail: "Variansi payroll hanya 2% dari proyeksi tiga bulan terakhir.",
    severity: "positive"
  },
  {
    id: "subscription",
    title: "Langganan software meningkat",
    detail: "Terdapat 3 tool baru dalam 30 hari. Review kembali lisensi yang jarang dipakai.",
    severity: "info"
  }
];

const scenarios: ScenarioPlan[] = [
  {
    id: "growth",
    title: "Skalakan Budget Marketing +10%",
    description: "Proyeksi kenaikan prospek 18% dengan biaya tambahan Rp 450rb.",
    impact: "ROI diprediksi 3.2x"
  },
  {
    id: "efficiency",
    title: "Optimasi Operasional -15%",
    description: "Gabungkan dua vendor logistik dan otomatisasi approval pengadaan.",
    impact: "Penghematan Rp 600rb/bln"
  }
];

export default function BudgetsView() {
  const { accountName, plan } = useDashboardContext();

  const totals = useMemo(() => {
    const allocated = categories.reduce((sum, item) => sum + item.allocated, 0);
    const used = categories.reduce((sum, item) => sum + item.used, 0);
    return {
      allocated,
      used,
      remaining: allocated - used,
      usedPercent: Math.round((used / allocated) * 100)
    };
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="mb-8 space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Budgeting</h1>
            <p className="text-white/70">
              {accountName ? `Rencana anggaran untuk ${accountName}` : "Kelola alokasi dana dan pergerakan budget setiap kategori."}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:border-primary">
              Simulasi Skenario
            </button>
            <button className="rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:from-green-500 hover:to-emerald-500">
              + Tambah Budget
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="glass-effect rounded-2xl border border-white/20 p-6">
            <p className="text-sm text-white/60">Total Anggaran</p>
            <p className="mt-2 text-3xl font-bold text-white">{currency.format(totals.allocated)}</p>
            <p className="mt-4 text-xs uppercase tracking-wide text-white/50">Plan {plan ?? "Free"}</p>
          </div>
          <div className="glass-effect rounded-2xl border border-white/20 p-6">
            <p className="text-sm text-white/60">Terpakai</p>
            <p className="mt-2 text-3xl font-bold text-rose-300">{currency.format(totals.used)}</p>
            <div className="mt-4 h-2 w-full rounded-full bg-white/10">
              <div className="h-full rounded-full bg-gradient-to-r from-rose-500 to-red-500" style={{ width: `${totals.usedPercent}%` }} />
            </div>
            <p className="mt-2 text-xs text-white/50">{totals.usedPercent}% dari total alokasi</p>
          </div>
          <div className="glass-effect rounded-2xl border border-white/20 p-6">
            <p className="text-sm text-white/60">Sisa Budget</p>
            <p className="mt-2 text-3xl font-bold text-emerald-300">{currency.format(totals.remaining)}</p>
            <p className="mt-2 text-xs text-emerald-200">Cukup untuk 19 hari ke depan</p>
          </div>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          <div className="glass-effect rounded-2xl border border-white/20 p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Distribusi Budget per Kategori</h2>
              <button className="text-sm font-medium text-primary transition hover:text-blue-300">Ekspor laporan</button>
            </div>
            <div className="space-y-5">
              {categories.map((category) => {
                const percent = Math.min(100, Math.round((category.used / category.allocated) * 100));
                return (
                  <div key={category.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-white">{category.name}</p>
                        <p className="text-xs text-white/50">
                          {currency.format(category.used)} dari {currency.format(category.allocated)}
                        </p>
                      </div>
                      <span className={`text-xs font-semibold ${category.trend >= 0 ? "text-emerald-300" : "text-white/60"}`}>
                        {category.trend >= 0 ? `+${category.trend}%` : `${category.trend}%`} {category.trend >= 0 ? "vs" : "di bawah"} target
                      </span>
                    </div>
                    <div className="mt-4 h-2 w-full rounded-full bg-white/10">
                      <div className={`h-full rounded-full bg-gradient-to-r ${category.accent}`} style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="glass-effect rounded-2xl border border-white/20 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Skenario Budget</h2>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/60">Simulasi AI</span>
            </div>
            <div className="space-y-4">
              {scenarios.map((scenario) => (
                <div key={scenario.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-white">{scenario.title}</h3>
                    <span className="text-xs font-semibold text-primary">{scenario.impact}</span>
                  </div>
                  <p className="mt-2 text-sm text-white/60">{scenario.description}</p>
                  <button className="mt-3 text-xs font-semibold text-primary transition hover:text-blue-300">
                    Terapkan simulasi
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6 lg:col-span-4">
          <div className="glass-effect rounded-2xl border border-white/20 p-6">
            <h2 className="text-lg font-semibold text-white">Notifikasi Budget</h2>
            <div className="mt-4 space-y-4">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`rounded-xl border px-4 py-4 text-sm transition ${
                    alert.severity === "warning"
                      ? "border-amber-500/30 bg-amber-500/10"
                      : alert.severity === "positive"
                        ? "border-emerald-500/30 bg-emerald-500/10"
                        : "border-white/10 bg-white/5"
                  }`}
                >
                  <p className="font-semibold text-white">{alert.title}</p>
                  <p className="mt-1 text-white/70">{alert.detail}</p>
                  <button className="mt-3 text-xs font-semibold text-primary transition hover:text-blue-300">
                    Tindak lanjuti
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-effect rounded-2xl border border-white/20 p-6">
            <h2 className="text-lg font-semibold text-white">Anggaran Prioritas</h2>
            <div className="mt-4 space-y-3 text-sm text-white/70">
              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <span>Peningkatan kapasitas server</span>
                <span className="font-semibold text-white">Rp 1.200.000</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <span>Program retensi pelanggan</span>
                <span className="font-semibold text-white">Rp 800.000</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <span>Pelatihan tim</span>
                <span className="font-semibold text-white">Rp 450.000</span>
              </div>
            </div>
            <button className="mt-4 w-full rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:border-primary">
              Kelola prioritas
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
