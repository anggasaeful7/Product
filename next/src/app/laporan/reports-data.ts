export type ReportInsight = {
  id: string;
  title: string;
  description: string;
  tone: "positive" | "warning" | "neutral";
};

export type ReportDetail = {
  id: string;
  title: string;
  period: string;
  createdAt: string;
  summary: string;
  highlights: string[];
  kpis: Array<{ id: string; label: string; value: string; delta: string; trend: "up" | "down" }>;
  breakdown: Array<{ category: string; income: number; expense: number }>;
  insights: ReportInsight[];
};

export const reports: ReportDetail[] = [
  {
    id: "2025-08",
    title: "Laporan Keuangan Agustus 2025",
    period: "1 - 31 Agustus 2025",
    createdAt: "02 Sep 2025",
    summary: "Pendapatan melonjak 18% dibandingkan Juli dengan pertumbuhan terbesar dari segmen B2B.",
    highlights: [
      "Gross margin meningkat 6.2%",
      "Burn rate turun menjadi Rp 4.1M",
      "Metrik retensi pelanggan stabil di 78%"
    ],
    kpis: [
      { id: "revenue", label: "Total Revenue", value: "Rp 18.2M", delta: "+18%", trend: "up" },
      { id: "expense", label: "Total Expense", value: "Rp 11.9M", delta: "-6%", trend: "down" },
      { id: "net", label: "Net Profit", value: "Rp 6.3M", delta: "+32%", trend: "up" }
    ],
    breakdown: [
      { category: "B2B", income: 9200000, expense: 3100000 },
      { category: "B2C", income: 5800000, expense: 2600000 },
      { category: "Partnership", income: 3200000, expense: 1900000 }
    ],
    insights: [
      {
        id: "expense-optimization",
        title: "Pengeluaran Operasional Efisien",
        description: "Pengeluaran operasional turun 9% setelah otomatisasi persetujuan vendor.",
        tone: "positive"
      },
      {
        id: "marketing",
        title: "Marketing Hampir Melebihi Batas",
        description: "Budget marketing mencapai 95% dari alokasi. Evaluasi kampanye ber-ROI rendah.",
        tone: "warning"
      },
      {
        id: "cashflow",
        title: "Arus Kas Stabil",
        description: "Saldo kas akhir bulan menghasilkan runway 9.5 bulan.",
        tone: "positive"
      }
    ]
  },
  {
    id: "2025-07",
    title: "Laporan Keuangan Juli 2025",
    period: "1 - 31 Juli 2025",
    createdAt: "02 Agu 2025",
    summary: "Pertumbuhan moderat dengan fokus pada efisiensi biaya langganan dan retensi pelanggan.",
    highlights: [
      "Subsidiary baru menyumbang 12% pendapatan",
      "Langganan software berkurang Rp 480rb",
      "Kepuasan pelanggan naik ke NPS 42"
    ],
    kpis: [
      { id: "revenue", label: "Total Revenue", value: "Rp 15.4M", delta: "+7%", trend: "up" },
      { id: "expense", label: "Total Expense", value: "Rp 12.7M", delta: "-3%", trend: "down" },
      { id: "net", label: "Net Profit", value: "Rp 4.6M", delta: "+14%", trend: "up" }
    ],
    breakdown: [
      { category: "B2B", income: 7600000, expense: 3400000 },
      { category: "B2C", income: 4900000, expense: 3100000 },
      { category: "Partnership", income: 3000000, expense: 2200000 }
    ],
    insights: [
      {
        id: "subscription",
        title: "Optimalisasi Langganan",
        description: "4 lisensi jarang digunakan dihentikan, menghemat Rp 6.2M per tahun.",
        tone: "positive"
      },
      {
        id: "support",
        title: "Tiket Dukungan Naik",
        description: "Jumlah tiket naik 11%. Rekomendasi: tambah agent shift malam.",
        tone: "warning"
      }
    ]
  }
];
