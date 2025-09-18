"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { Icon } from "../dashboard/components/Icon";
import { useDashboardContext } from "../dashboard/dashboard-context";

type SummaryCard = {
  id: string;
  title: string;
  value: string;
  delta: string;
  trend: "up" | "down";
  accent: string;
  icon: ReactNode;
};

type TransactionRecord = {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: string;
  type: "income" | "expense";
  method: string;
  status: "success" | "pending";
};

type InsightCard = {
  id: string;
  title: string;
  description: string;
  tone: "positive" | "warning" | "neutral";
  action?: string;
};

const summaryCards: SummaryCard[] = [
  {
    id: "income",
    title: "Total Pemasukan",
    value: "Rp 15.5M",
    delta: "+12% vs bulan lalu",
    trend: "up",
    accent: "from-emerald-500 to-green-600",
    icon: <Icon name="sparkles" className="h-6 w-6 text-emerald-300" />
  },
  {
    id: "expense",
    title: "Total Pengeluaran",
    value: "Rp 9.2M",
    delta: "-5% dari anggaran",
    trend: "down",
    accent: "from-rose-500 to-red-600",
    icon: <Icon name="wallet" className="h-6 w-6 text-rose-300" />
  },
  {
    id: "cashflow",
    title: "Cashflow Bersih",
    value: "Rp 6.3M",
    delta: "+22% YoY",
    trend: "up",
    accent: "from-sky-500 to-indigo-600",
    icon: <Icon name="chart" className="h-6 w-6 text-sky-300" />
  }
];

const filterTabs = [
  { id: "all", label: "Semua" },
  { id: "income", label: "Pemasukan" },
  { id: "expense", label: "Pengeluaran" },
  { id: "recurring", label: "Recurring" }
];

const transactions: TransactionRecord[] = [
  {
    id: "TXN-2025-0918-001",
    date: "18 Sep 2025",
    description: "Invoice Project Ember",
    category: "Client Revenue",
    amount: "+ Rp 3.500.000",
    type: "income",
    method: "Transfer BCA",
    status: "success"
  },
  {
    id: "TXN-2025-0916-018",
    date: "16 Sep 2025",
    description: "Langganan SaaS Marketing",
    category: "Software",
    amount: "- Rp 1.250.000",
    type: "expense",
    method: "Kartu Kredit",
    status: "success"
  },
  {
    id: "TXN-2025-0915-004",
    date: "15 Sep 2025",
    description: "Bonus Tim Product",
    category: "Payroll",
    amount: "- Rp 2.800.000",
    type: "expense",
    method: "Transfer BCA",
    status: "success"
  },
  {
    id: "TXN-2025-0914-009",
    date: "14 Sep 2025",
    description: "Retainer Agency",
    category: "Client Revenue",
    amount: "+ Rp 4.800.000",
    type: "income",
    method: "Midtrans",
    status: "pending"
  },
  {
    id: "TXN-2025-0913-021",
    date: "13 Sep 2025",
    description: "Kampanye Iklan",
    category: "Marketing",
    amount: "- Rp 1.950.000",
    type: "expense",
    method: "Virtual Account",
    status: "success"
  }
];

const aiInsights: InsightCard[] = [
  {
    id: "overspend",
    title: "Budget Marketing Hampir Habis",
    description: "Pengeluaran marketing sudah mencapai 92% dengan sisa 12 hari di periode berjalan.",
    tone: "warning",
    action: "Set pengingat batas pengeluaran"
  },
  {
    id: "cashflow",
    title: "Cashflow Positif",
    description: "Cashflow bulan ini naik 18% dibandingkan rata-rata 6 bulan terakhir.",
    tone: "positive"
  },
  {
    id: "automation",
    title: "Otomatisasi Rekonsiliasi",
    description: "2 transaksi masuk belum dikategorikan. AngsFlow bisa mengusulkan kategori otomatis.",
    tone: "neutral",
    action: "Tinjau rekomendasi"
  }
];

const upcomingPayments = [
  {
    id: "pay-1",
    label: "Tagihan Vendor Ops",
    amount: "Rp 2.400.000",
    due: "Jatuh tempo 20 Sep"
  },
  {
    id: "pay-2",
    label: "Cicilan Peralatan",
    amount: "Rp 1.150.000",
    due: "Jatuh tempo 22 Sep"
  }
];

export default function TransactionsView() {
  const { accountName } = useDashboardContext();
  const [activeTab, setActiveTab] = useState<string>(filterTabs[0]?.id ?? 'all');

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="mb-8 space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Transaksi</h1>
            <p className="text-white/70">{accountName ? `Data transaksi untuk ${accountName}` : "Kelola transaksi dan cashflow dalam satu tempat."}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button className="rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:border-primary">
              Export CSV
            </button>
            <button className="rounded-xl bg-gradient-to-r from-primary to-secondary px-4 py-2 text-sm font-semibold text-white shadow-lg transition duration-300 hover:from-secondary hover:to-primary">
              + Transaksi Baru
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {summaryCards.map((card) => (
            <div key={card.id} className="glass-effect group rounded-2xl border border-white/20 p-6 transition hover:border-white/40">
              <div className="mb-4 flex items-center justify-between">
                <div className={`rounded-2xl bg-gradient-to-br ${card.accent} p-3 text-white shadow-inner`}>
                  {card.icon}
                </div>
                <span className={`text-sm font-semibold ${card.trend === "up" ? "text-emerald-400" : "text-rose-300"}`}>{card.delta}</span>
              </div>
              <p className="text-sm text-white/60">{card.title}</p>
              <p className="mt-2 text-3xl font-bold text-white">{card.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-12">
        <div className="space-y-8 lg:col-span-8">
          <div className="glass-effect rounded-2xl border border-white/20 p-6">
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                {filterTabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      activeTab === tab.id ? "bg-primary text-white" : "bg-white/5 text-white/60 hover:bg-white/10"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <input
                    type="search"
                    placeholder="Cari transaksi, vendor, kategori..."
                    className="w-60 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none"
                  />
                  <Icon name="search" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                </div>
                <button className="rounded-xl border border-white/20 px-3 py-2 text-xs font-semibold text-white/70 transition hover:border-primary hover:text-white">
                  Filter Lanjutan
                </button>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/10">
              <table className="min-w-full divide-y divide-white/10 text-sm">
                <thead className="bg-white/5 text-left text-white/60">
                  <tr>
                    <th className="px-6 py-3">Transaksi</th>
                    <th className="px-6 py-3">Kategori</th>
                    <th className="px-6 py-3">Metode</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Jumlah</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {transactions.map((txn) => (
                    <tr key={txn.id} className="bg-white/5 text-white/80">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-white">{txn.description}</span>
                          <span className="text-xs text-white/50">{txn.id} • {txn.date}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-white/70">{txn.category}</td>
                      <td className="px-6 py-4 text-white/70">{txn.method}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                            txn.status === "success"
                              ? "bg-emerald-500/15 text-emerald-300"
                              : "bg-amber-500/15 text-amber-300"
                          }`}
                        >
                          {txn.status === "success" ? "Terkonfirmasi" : "Menunggu"}
                        </span>
                      </td>
                      <td className={`px-6 py-4 text-right font-semibold ${txn.type === "income" ? "text-emerald-300" : "text-rose-300"}`}>
                        {txn.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="glass-effect rounded-2xl border border-white/20 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Aktivitas Terkini</h3>
              <Link href="/laporan" className="text-sm font-medium text-primary transition hover:text-blue-300">
                Lihat laporan
              </Link>
            </div>
            <div className="space-y-4">
              {transactions.slice(0, 4).map((txn) => (
                <div key={`activity-${txn.id}`} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${txn.type === "income" ? "bg-emerald-500/15 text-emerald-300" : "bg-rose-500/15 text-rose-300"}`}>
                      <Icon name={txn.type === "income" ? "trending" : "wallet"} className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{txn.description}</p>
                      <p className="text-xs text-white/50">{txn.date} • {txn.category}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-semibold ${txn.type === "income" ? "text-emerald-300" : "text-rose-300"}`}>
                    {txn.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8 lg:col-span-4">
          <div className="glass-effect rounded-2xl border border-white/20 p-6">
            <h3 className="text-lg font-semibold text-white">AI Insights</h3>
            <p className="text-sm text-white/60">Rekomendasi otomatis berdasarkan pola transaksi terbaru.</p>
            <div className="mt-4 space-y-4">
              {aiInsights.map((insight) => (
                <div
                  key={insight.id}
                  className={`rounded-xl border px-4 py-4 text-sm transition ${
                    insight.tone === "positive"
                      ? "border-emerald-500/30 bg-emerald-500/10"
                      : insight.tone === "warning"
                        ? "border-amber-500/30 bg-amber-500/10"
                        : "border-white/10 bg-white/5"
                  }`}
                >
                  <p className="font-semibold text-white">{insight.title}</p>
                  <p className="mt-1 text-white/70">{insight.description}</p>
                  {insight.action ? (
                    <button className="mt-3 text-xs font-semibold text-primary transition hover:text-blue-300">
                      {insight.action}
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          <div className="glass-effect rounded-2xl border border-white/20 p-6">
            <h3 className="text-lg font-semibold text-white">Pembayaran Mendatang</h3>
            <div className="mt-4 space-y-3">
              {upcomingPayments.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-white">{item.label}</p>
                    <p className="text-xs text-white/50">{item.due}</p>
                  </div>
                  <span className="text-sm font-semibold text-white/80">{item.amount}</span>
                </div>
              ))}
            </div>
            <button className="mt-4 w-full rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:border-primary">
              Kelola jadwal pembayaran
            </button>
          </div>

          <div className="glass-effect rounded-2xl border border-dashed border-white/20 p-6 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-primary">
              <Icon name="upload" className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-white">Upload Bukti Transaksi</h3>
            <p className="mt-2 text-sm text-white/60">Seret dan letakkan file invoice atau bukti pembayaran untuk rekonsiliasi otomatis.</p>
            <button className="mt-4 rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20">
              Pilih File
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
