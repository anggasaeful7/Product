"use client";

import { useMemo, useState } from "react";
import { Icon, type IconName } from "./components/Icon";
import { useDashboardContext } from "./dashboard-context";
import { CategoryChart, IncomeExpenseChart, type IncomeChartType } from "./charts";


type SummaryMetric = {
  id: string;
  title: string;
  value: string;
  delta: string;
  deltaPositive: boolean;
  description: string;
  icon: IconName;
};

const summaryMetrics: SummaryMetric[] = [
  {
    id: "revenue",
    title: "Revenue Bulan Ini",
    value: "Rp 125M",
    delta: "+18.4% vs bulan lalu",
    deltaPositive: true,
    description: "Pertumbuhan revenue ditopang oleh pipeline enterprise.",
    icon: "trending",
  },
  {
    id: "burn",
    title: "Burn Rate",
    value: "Rp 72M",
    delta: "-6.3% vs target",
    deltaPositive: true,
    description: "Optimasi biaya berhasil menekan pengeluaran marketing.",
    icon: "wallet",
  },
  {
    id: "runway",
    title: "Runway",
    value: "13 bulan",
    delta: "+2 bulan",
    deltaPositive: true,
    description: "Dengan burn rate saat ini, runway bertambah 2 bulan.",
    icon: "sparkles",
  },
];

type BudgetProgress = {
  id: string;
  title: string;
  spent: string;
  percent: number;
  accent: string;
};

const budgetProgress: BudgetProgress[] = [
  { id: "marketing", title: "Marketing Campaign", spent: "Rp 28M / Rp 34M", percent: 82, accent: "from-orange-500 to-amber-500" },
  { id: "product", title: "Product Development", spent: "Rp 19M / Rp 26M", percent: 73, accent: "from-sky-500 to-blue-600" },
  { id: "ops", title: "Operasional", spent: "Rp 14M / Rp 18M", percent: 64, accent: "from-emerald-500 to-green-600" },
];

type TeamMetric = {
  member: string;
  role: string;
  closedDeals: number;
  revenue: string;
  efficiency: string;
};

const teamMetrics: TeamMetric[] = [
  { member: "Sarah Putri", role: "Finance Lead", closedDeals: 8, revenue: "Rp 28M", efficiency: "92%" },
  { member: "Julianto", role: "Sales Director", closedDeals: 5, revenue: "Rp 41M", efficiency: "88%" },
  { member: "Angga Saeful", role: "CEO", closedDeals: 3, revenue: "Rp 33M", efficiency: "95%" },
  { member: "Dewi Ayu", role: "Account Manager", closedDeals: 6, revenue: "Rp 23M", efficiency: "85%" },
];

type Alert = {
  id: string;
  title: string;
  detail: string;
  tone: "warning" | "info" | "success";
};

const alerts: Alert[] = [
  {
    id: "budget-marketing",
    title: "Budget Marketing 82%",
    detail: "Perlu approval untuk tambahan Rp 5M agar campaign Q4 tetap berjalan.",
    tone: "warning",
  },
  {
    id: "invoice-overdue",
    title: "Invoice Overdue",
    detail: "3 invoice enterprise overdue 7 hari dengan total Rp 6.7M.",
    tone: "info",
  },
  {
    id: "saving-tip",
    title: "Efisiensi SaaS",
    detail: "Negosiasi ulang kontrak tools desain bisa hemat Rp 1.2M per bulan.",
    tone: "success",
  },
];

type ClientSummary = {
  name: string;
  industry: string;
  revenue: string;
  status: "Active" | "Pending" | "At Risk";
};

const topClients: ClientSummary[] = [
  { name: "Mandiri Digital", industry: "Fintech", revenue: "Rp 19M", status: "Active" },
  { name: "Sagara Foods", industry: "FMCG", revenue: "Rp 14M", status: "Active" },
  { name: "Nusa Ride", industry: "Transport", revenue: "Rp 11M", status: "Pending" },
  { name: "Arunika Group", industry: "Retail", revenue: "Rp 9.5M", status: "At Risk" },
];


export default function OrgDashboardView() {
  const { userName, accountName } = useDashboardContext();
  const displayName = accountName ?? "Team Dashboard";
  const firstName = userName.split(/\s+/)[0] || "Anda";
  const subtitle = `Ringkasan finansial organisasi untuk ${displayName}.`;
const [chartType, setChartType] = useState<IncomeChartType>("line");

  const incomeExpenseData = useMemo(() => {
    const labels = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    const income = [18, 19.5, 20, 21.4, 22.8, 24, 24.5, 25.1, 26, 27.2, 28.5, 30];
    const expense = [12, 12.6, 13.4, 13.8, 14.5, 15.1, 15.6, 16, 16.4, 16.9, 17.3, 17.8];

    if (chartType === "bar") {
      return {
        labels,
        datasets: [
          {
            label: "Revenue",
            data: income,
            backgroundColor: "#60A5FA",
            borderRadius: 12,
            barThickness: 18,
          },
          {
            label: "Pengeluaran",
            data: expense,
            backgroundColor: "#F43F5E",
            borderRadius: 12,
            barThickness: 18,
          },
        ],
      };
    }

    return {
      labels,
      datasets: [
        {
          label: "Revenue",
          data: income,
          borderColor: "#60A5FA",
          backgroundColor: "rgba(96, 165, 250, 0.15)",
          borderWidth: 3,
          fill: true,
          tension: 0.4,
        },
        {
          label: "Pengeluaran",
          data: expense,
          borderColor: "#F43F5E",
          backgroundColor: "rgba(244, 63, 94, 0.12)",
          borderWidth: 3,
          fill: true,
          tension: 0.4,
        },
      ],
    };
  }, [chartType]);

  const incomeExpenseOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top" as const,
          labels: {
            color: "#e2e8f0",
            usePointStyle: true,
            padding: 20,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: "#ffffff12" },
          ticks: {
            color: "#cbd5f5",
            callback: (value: number | string) => `Rp ${value}M`,
          },
        },
        x: {
          grid: { color: "#ffffff10" },
          ticks: { color: "#cbd5f5" },
        },
      },
      interaction: {
        intersect: false,
        mode: "index" as const,
      },
    }),
    []
  );

  const categoryData = useMemo(
    () => ({
      labels: ["Operasional", "Marketing", "SDM", "Teknologi", "Lainnya"],
      datasets: [
        {
          data: [32, 27, 18, 15, 8],
          backgroundColor: ["#38BDF8", "#F97316", "#22C55E", "#8B5CF6", "#F43F5E"],
          borderWidth: 0,
          hoverOffset: 10,
        },
      ],
    }),
    []
  );

  const categoryOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
      },
      cutout: "62%",
    }),
    []
  );

  return (
  <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <section id="transactions" className="mb-10 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">{displayName}</h1>
          <p className="text-white/70">{subtitle}</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:border-primary">
            Undang Anggota
          </button>
          <button className="rounded-lg bg-gradient-to-r from-primary to-secondary px-4 py-2 text-sm font-semibold text-white shadow-lg transition duration-300 hover:from-secondary hover:to-primary">
            + Catat Transaksi
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {summaryMetrics.map((metric) => (
          <div key={metric.id} className="glass-effect group rounded-2xl border border-white/20 p-6 transition hover:border-white/40">
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-xl bg-white/10 p-3">
                <Icon name={metric.icon} className="h-6 w-6 text-primary" />
              </div>
              <span className={`text-sm font-medium ${metric.deltaPositive ? "text-emerald-400" : "text-rose-300"}`}>
                {metric.delta}
              </span>
            </div>
            <h3 className="text-white/70 text-sm font-medium">{metric.title}</h3>
            <p className="mt-2 text-3xl font-bold text-white">{metric.value}</p>
            <p className="mt-3 text-sm text-white/60">{metric.description}</p>
          </div>
        ))}
      </div>
    </section>

    <section id="budget" className="mb-10 grid grid-cols-1 gap-8 md:grid-cols-3">
      {budgetProgress.map((item) => (
        <div key={item.id} className="glass-effect rounded-2xl border border-white/20 p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-white text-base font-semibold">{item.title}</h3>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/60">{item.spent}</span>
          </div>
          <div className="mt-4 h-2 w-full rounded-full bg-white/10">
            <div className={`h-2 rounded-full bg-gradient-to-r ${item.accent}`} style={{ width: `${item.percent}%` }} />
          </div>
          <p className="mt-3 text-sm text-white/60">{item.percent}% dari budget terserap</p>
        </div>
      ))}
    </section>

    <section id="reports" className="mb-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2 glass-effect rounded-2xl border border-white/20 p-6">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">Revenue vs Pengeluaran (12 bulan)</h3>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setChartType("line")}
              className={`rounded-lg px-3 py-1 text-xs transition ${
                chartType === "line" ? "bg-primary text-white" : "text-white/70 hover:text-primary"
              }`}
            >
              Line
            </button>
            <button
              type="button"
              onClick={() => setChartType("bar")}
              className={`rounded-lg px-3 py-1 text-xs transition ${
                chartType === "bar" ? "bg-primary text-white" : "text-white/70 hover:text-primary"
              }`}
            >
              Bar
            </button>
          </div>
        </div>
        <div className="relative h-80">
          <IncomeExpenseChart type={chartType} data={incomeExpenseData} options={incomeExpenseOptions} />
        </div>
      </div>

      <div className="glass-effect rounded-2xl border border-white/20 p-6">
        <h3 className="text-xl font-bold text-white">Distribusi Pengeluaran</h3>
        <div className="mt-6 h-64">
          <CategoryChart data={categoryData} options={categoryOptions} />
        </div>
        <div className="mt-6 space-y-3 text-sm">
          {categoryData.labels?.map((label, index) => (
            <div key={label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`h-3 w-3 rounded-full`} style={{ backgroundColor: categoryData.datasets[0]?.backgroundColor?.[index] as string }} />
                <span className="text-white/80">{label as string}</span>
              </div>
              <span className="font-semibold text-white">{categoryData.datasets[0]?.data?.[index]}%</span>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section id="team" className="mb-10 grid grid-cols-1 gap-8 xl:grid-cols-3">
      <div className="xl:col-span-2 glass-effect rounded-2xl border border-white/20 p-6">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">Performa Tim</h3>
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/70">30 anggota aktif</span>
        </div>
        <div className="overflow-hidden rounded-2xl border border-white/10">
          <table className="min-w-full divide-y divide-white/10 text-sm">
            <thead className="bg-white/5 text-left text-white/60">
              <tr>
                <th className="px-6 py-3">Anggota</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Deal Closed</th>
                <th className="px-6 py-3">Revenue</th>
                <th className="px-6 py-3">Efficiency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {teamMetrics.map((member) => (
                <tr key={member.member} className="hover:bg-white/5">
                  <td className="px-6 py-4 text-white">{member.member}</td>
                  <td className="px-6 py-4 text-white/70">{member.role}</td>
                  <td className="px-6 py-4 text-white">{member.closedDeals}</td>
                  <td className="px-6 py-4 text-white">{member.revenue}</td>
                  <td className="px-6 py-4"><span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-400">{member.efficiency}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-6">
        <div className="glass-effect rounded-2xl border border-white/20 p-6">
          <h3 className="text-xl font-bold text-white">Top Client</h3>
          <div className="mt-5 space-y-4">
            {topClients.map((client) => (
              <div key={client.name} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-semibold">{client.name}</p>
                    <p className="text-xs text-white/50">{client.industry}</p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      client.status === "Active"
                        ? "bg-emerald-500/20 text-emerald-300"
                        : client.status === "Pending"
                        ? "bg-amber-500/20 text-amber-300"
                        : "bg-rose-500/20 text-rose-300"
                    }`}
                  >
                    {client.status}
                  </span>
                </div>
                <p className="mt-3 text-sm text-white/70">Contribution: {client.revenue}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-effect rounded-2xl border border-white/20 p-6">
          <h3 className="text-xl font-bold text-white">Alert & Approval</h3>
          <div className="mt-4 space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className="rounded-xl border border-white/10 bg-white/5 p-3">
                <p className="text-sm font-semibold text-white">{alert.title}</p>
                <p className="mt-2 text-xs text-white/70">{alert.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    <SectionAI />
  </div>

  );
}

function SectionAI() {
  const recommendations = [
    {
      id: "collections",
      title: "Collection Strategy",
      detail: "Aktifkan auto-reminder multi-channel untuk invoice enterprise. Potensi mempercepat cash-in 5 hari.",
    },
    {
      id: "budget",
      title: "Budget Reallocation",
      detail: "Alihkan 10% budget marketing ke kampanye referral. Proyeksi ROI naik 16%.",
    },
    {
      id: "hiring",
      title: "Hiring Advice",
      detail: "Tambahkan 1 finance analyst untuk monitoring SaaS spend. Estimasi hemat Rp 900jt/tahun.",
    },
  ];

  return (
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
          <p className="text-white/70">Insight strategis untuk menjaga cash flow dan efisiensi tim</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-purple-400/20 bg-gradient-to-br from-purple-500/10 to-indigo-600/10 p-5">
          <h4 className="text-white font-semibold">Ringkasan Bulan Ini</h4>
          <ul className="mt-4 space-y-3 text-sm text-white/80">
            <li>â€¢ Revenue YOY naik 24% dengan margin 41%.</li>
            <li>â€¢ Burn rate turun 6% berkat efisiensi marketing.</li>
            <li>â€¢ Runway bertambah 2 bulan dengan cash reserve Rp 310M.</li>
          </ul>
        </div>

        <div className="rounded-xl border border-blue-400/20 bg-gradient-to-br from-blue-500/10 to-cyan-600/10 p-5">
          <h4 className="text-white font-semibold">Rekomendasi AI</h4>
          <div className="mt-4 space-y-3">
            {recommendations.map((item) => (
              <div key={item.id} className="rounded-lg border border-white/10 bg-white/5 p-3">
                <p className="text-sm font-semibold text-primary">{item.title}</p>
                <p className="mt-2 text-sm text-white/80">{item.detail}</p>
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
            placeholder="Tanya tentang cashflow, budgeting, atau performa tim..."
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
  );
}




