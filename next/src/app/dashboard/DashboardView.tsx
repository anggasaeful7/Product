"use client";

import { useMemo, useState, type ReactNode } from "react";
import { CategoryChart, IncomeChartType, IncomeExpenseChart } from "./charts";
import { Icon } from "./components/Icon";
import { useDashboardContext } from "./dashboard-context";

type StatCardConfig = {
  id: string;
  title: string;
  value: string;
  delta: string;
  accentClass: string;
  valueClass?: string;
  deltaClass: string;
  icon: ReactNode;
};

const statsCards: StatCardConfig[] = [
  {
    id: 'balance',
    title: 'Saldo Total',
    value: 'Rp 47.3M',
    delta: '+15.2% dari bulan lalu',
    accentClass: 'from-primary/20 to-blue-600/20',
    deltaClass: 'text-emerald-400',
    icon: (
      <svg className="h-8 w-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
        />
      </svg>
    )
  },
  {
    id: 'income',
    title: 'Pemasukan Bulan Ini',
    value: 'Rp 15.5M',
    delta: '+12% dari target',
    accentClass: 'from-emerald-500/20 to-green-600/20',
    valueClass: 'text-emerald-400',
    deltaClass: 'text-emerald-400',
    icon: (
      <svg className="h-8 w-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
      </svg>
    )
  },
  {
    id: 'expense',
    title: 'Pengeluaran Bulan Ini',
    value: 'Rp 8.2M',
    delta: '-5% dari budget',
    accentClass: 'from-rose-500/20 to-red-600/20',
    valueClass: 'text-rose-400',
    deltaClass: 'text-rose-400',
    icon: (
      <svg className="h-8 w-8 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
      </svg>
    )
  }
];

type BudgetCardConfig = {
  id: string;
  label: string;
  used: string;
  total: string;
  percent: number;
  barClass: string;
  valueClass: string;
  iconBg: string;
  iconColor: string;
  icon: ReactNode;
};

const budgetCards: BudgetCardConfig[] = [
  {
    id: 'food',
    label: 'Makanan',
    used: 'Rp 3.2M',
    total: 'Rp 4M',
    percent: 80,
    barClass: 'from-rose-500 to-red-600',
    valueClass: 'text-rose-400',
    iconBg: 'bg-rose-500/20',
    iconColor: 'text-rose-400',
    icon: <Icon name="wallet" className="h-4 w-4" />
  },
  {
    id: 'transport',
    label: 'Transportasi',
    used: 'Rp 2.1M',
    total: 'Rp 3M',
    percent: 70,
    barClass: 'from-blue-500 to-blue-600',
    valueClass: 'text-blue-400',
    iconBg: 'bg-blue-500/20',
    iconColor: 'text-blue-400',
    icon: <Icon name="rows" className="h-4 w-4" />
  },
  {
    id: 'entertainment',
    label: 'Hiburan',
    used: 'Rp 1.5M',
    total: 'Rp 2M',
    percent: 75,
    barClass: 'from-emerald-500 to-green-600',
    valueClass: 'text-emerald-400',
    iconBg: 'bg-emerald-500/20',
    iconColor: 'text-emerald-400',
    icon: <Icon name="sparkles" className="h-4 w-4" />
  }
];

const categoryLegend = [
  { id: 'food', label: 'Makanan & Minuman', value: 'Rp 3.2M (39%)', color: 'bg-rose-500' },
  { id: 'transport', label: 'Transportasi', value: 'Rp 2.1M (26%)', color: 'bg-blue-500' },
  { id: 'fun', label: 'Hiburan', value: 'Rp 1.5M (18%)', color: 'bg-emerald-500' },
  { id: 'shopping', label: 'Belanja', value: 'Rp 1.0M (12%)', color: 'bg-amber-500' },
  { id: 'others', label: 'Lainnya', value: 'Rp 0.4M (5%)', color: 'bg-violet-500' }
];

const summaryHighlights = [
  {
    id: 'target',
    text: 'Pemasukan meningkat 12% dari target',
    icon: (
      <svg className="h-4 w-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
    className: 'text-emerald-400'
  },
  {
    id: 'warning',
    text: 'Budget makanan hampir habis (80%)',
    icon: (
      <svg className="h-4 w-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
        />
      </svg>
    ),
    className: 'text-yellow-400'
  },
  {
    id: 'saving',
    text: 'Saving rate Anda: 47% (Excellent!)',
    icon: (
      <svg className="h-4 w-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
        />
      </svg>
    ),
    className: 'text-blue-400'
  }
];

const aiRecommendations = [
  {
    id: 'budget-alert',
    label: 'Budget Alert',
    text: 'Pengeluaran makanan naik 25% dari bulan lalu. Coba set budget Rp 3.5M untuk bulan depan.'
  },
  {
    id: 'saving-tip',
    label: 'Saving Tip',
    text: 'Dengan pola pengeluaran saat ini, Anda bisa menabung tambahan Rp 2M jika mengurangi hiburan 20%.'
  },
  {
    id: 'investment',
    label: 'Investment',
    text: 'Surplus Rp 7.3M bulan ini cocok untuk investasi jangka panjang atau emergency fund.'
  }
];

export default function DashboardView() {
  const { userName } = useDashboardContext();
  const firstName = userName.split(/\s+/)[0] || "Anda";
  const subtitle = `Selamat datang kembali, ${firstName}! Berikut ringkasan keuangan Anda.`;
const [chartType, setChartType] = useState<IncomeChartType>('line');
  const [selectedRange, setSelectedRange] = useState('thisMonth');

  const incomeExpenseData = useMemo(() => {
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const income = [12, 14, 13, 15, 16, 15, 17, 16, 15, 18, 16, 15.5];
    const expense = [8, 9, 7, 8.5, 9, 8, 9.5, 8.8, 7.5, 9.2, 8.5, 8.2];

    if (chartType === 'line') {
      return {
        labels,
        datasets: [
          {
            label: 'Pemasukan',
            data: income,
            borderColor: '#10B981',
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            borderWidth: 3,
            fill: true,
            tension: 0.4
          },
          {
            label: 'Pengeluaran',
            data: expense,
            borderColor: '#F43F5E',
            backgroundColor: 'rgba(244, 63, 94, 0.15)',
            borderWidth: 3,
            fill: true,
            tension: 0.4
          }
        ]
      };
    }

    return {
      labels,
      datasets: [
        {
          label: 'Pemasukan',
          data: income,
          backgroundColor: '#10B981',
          borderRadius: 12,
          barThickness: 16
        },
        {
          label: 'Pengeluaran',
          data: expense,
          backgroundColor: '#F43F5E',
          borderRadius: 12,
          barThickness: 16
        }
      ]
    };
  }, [chartType]);

  const incomeExpenseOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top' as const,
          labels: {
            color: '#e2e8f0',
            usePointStyle: true,
            padding: 20
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: '#ffffff10' },
          ticks: {
            color: '#cbd5f5',
            callback: (value: number | string) => `Rp ${value}M`
          }
        },
        x: {
          grid: { color: '#ffffff10' },
          ticks: { color: '#cbd5f5' }
        }
      },
      interaction: {
        intersect: false,
        mode: 'index' as const
      }
    }),
    []
  );

  const categoryData = useMemo(
    () => ({
      labels: ['Makanan & Minuman', 'Transportasi', 'Hiburan', 'Belanja', 'Lainnya'],
      datasets: [
        {
          data: [39, 26, 18, 12, 5],
          backgroundColor: ['#F43F5E', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'],
          borderWidth: 0,
          hoverOffset: 10
        }
      ]
    }),
    []
  );

  const categoryOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      cutout: '60%'
    }),
    []
  );

  return (
  <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <section className="mb-8 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard Pribadi</h1>
          <p className="text-white/70">{subtitle}</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedRange}
            onChange={(event) => setSelectedRange(event.target.value)}
            className="glass-effect rounded-lg border border-white/20 bg-transparent px-4 py-2 text-sm text-white focus:border-primary focus:outline-none"
          >
            <option value="thisMonth" className="bg-slate-800">
              Bulan Ini
            </option>
            <option value="lastMonth" className="bg-slate-800">
              Bulan Lalu
            </option>
            <option value="thisYear" className="bg-slate-800">
              Tahun Ini
            </option>
          </select>
          <button className="rounded-lg bg-gradient-to-r from-primary to-secondary px-4 py-2 text-sm font-semibold text-white shadow-lg transition duration-300 hover:from-secondary hover:to-primary hover:scale-105">
            + Tambah Transaksi
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {statsCards.map((card) => (
          <StatCard key={card.id} {...card} />
        ))}
      </div>
    </section>

    <section className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
      <div className="glass-effect rounded-2xl border border-white/20 p-6">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">Pemasukan vs Pengeluaran</h3>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setChartType('line')}
              className={`rounded-lg px-3 py-1 text-xs transition ${
                chartType === 'line' ? 'bg-primary text-white' : 'text-white/70 hover:text-primary'
              }`}
            >
              Line
            </button>
            <button
              type="button"
              onClick={() => setChartType('bar')}
              className={`rounded-lg px-3 py-1 text-xs transition ${
                chartType === 'bar' ? 'bg-primary text-white' : 'text-white/70 hover:text-primary'
              }`}
            >
              Bar
            </button>
          </div>
        </div>
        <div className="relative h-72">
          <IncomeExpenseChart type={chartType} data={incomeExpenseData} options={incomeExpenseOptions} />
        </div>
      </div>

      <div className="glass-effect rounded-2xl border border-white/20 p-6">
        <h3 className="text-xl font-bold text-white">Kategori Pengeluaran Terbesar</h3>
        <div className="mt-6 h-72">
          <CategoryChart data={categoryData} options={categoryOptions} />
        </div>
        <div className="mt-4 space-y-2">
          {categoryLegend.map((item) => (
            <div key={item.id} className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <span className={`mr-2 h-3 w-3 rounded-full ${item.color}`} />
                <span className="text-white/80">{item.label}</span>
              </div>
              <span className="font-semibold text-white">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section id="budget" className="glass-effect mb-8 rounded-2xl border border-white/20 p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-xl font-bold text-white">Progress Budget</h3>
        <button className="text-sm font-medium text-primary transition hover:text-blue-300">Kelola Budget</button>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {budgetCards.map((budget) => (
          <BudgetCard key={budget.id} {...budget} />
        ))}
      </div>
    </section>

    <section id="ai" className="glass-effect relative overflow-hidden rounded-2xl border border-white/20 p-6">
      <div className="absolute right-4 top-4">
        <div className="flex items-center gap-1 rounded-full bg-gradient-to-r from-accent to-orange-500 px-3 py-1 text-xs font-bold text-white shadow">
          <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          PRO
        </div>
      </div>

      <div className="mb-6 flex items-center">
        <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-indigo-600/20">
          <Icon name="sparkles" className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">AI Financial Coach</h3>
          <p className="text-white/70">Insight dan rekomendasi personal untuk Anda</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-purple-400/20 bg-gradient-to-br from-purple-500/10 to-indigo-600/10 p-5">
          <div className="mb-4 flex items-center">
            <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/20">
              <svg className="h-5 w-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h4 className="text-white font-semibold">Ringkasan Bulan Ini</h4>
          </div>
          <div className="space-y-3 text-sm">
            {summaryHighlights.map((highlight) => (
              <div key={highlight.id} className={`flex items-center gap-2 ${highlight.className}`}>
                {highlight.icon}
                <span>{highlight.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-blue-400/20 bg-gradient-to-br from-blue-500/10 to-cyan-600/10 p-5">
          <div className="mb-4 flex items-center">
            <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20">
              <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <h4 className="text-white font-semibold">Rekomendasi AI</h4>
          </div>
          <div className="space-y-4">
            {aiRecommendations.map((item) => (
              <div key={item.id} className="rounded-lg border border-white/10 bg-white/5 p-3">
                <p className="text-sm leading-relaxed text-white/90">
                  <span className="font-semibold text-primary">{item.label}:</span> {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="mb-3 flex items-center">
          <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary">
            <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <h5 className="text-white font-medium">Tanya AI Coach</h5>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Tanya tentang keuangan Anda..."
            className="flex-1 rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white placeholder-white/50 focus:border-primary focus:outline-none"
          />
          <button className="rounded-lg bg-gradient-to-r from-primary to-secondary px-4 py-2 text-white transition hover:from-secondary hover:to-primary">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  </div>

  );
}

function StatCard({ title, value, delta, accentClass, valueClass, deltaClass, icon }: StatCardConfig) {
  return (
    <div className="glass-effect group rounded-2xl border border-white/20 p-6 transition hover:border-white/40">
      <div className="mb-4 flex items-center justify-between">
        <div className={`rounded-xl bg-gradient-to-br ${accentClass} p-3 transition-transform duration-300 group-hover:scale-110`}>
          {icon}
        </div>
        <div className="text-right">
          <p className="text-sm text-white/60">{title}</p>
          <p className={`mt-1 text-3xl font-bold ${valueClass ?? 'text-white'}`}>{value}</p>
          <p className={`mt-1 flex items-center justify-end gap-1 text-sm ${deltaClass}`}>
            {delta}
          </p>
        </div>
      </div>
    </div>
  );
}

function BudgetCard({ label, used, total, percent, barClass, valueClass, iconBg, iconColor, icon }: BudgetCardConfig) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconBg}`}>
            <span className={`${iconColor}`}>{icon}</span>
          </div>
          <div>
            <h4 className="font-semibold text-white">{label}</h4>
            <p className="text-sm text-white/60">
              {used} / {total}
            </p>
          </div>
        </div>
        <span className={`font-bold ${valueClass}`}>{percent}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-white/10">
        <div className={`progress-bar h-full rounded-full bg-gradient-to-r ${barClass}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}







