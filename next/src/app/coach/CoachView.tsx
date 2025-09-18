"use client";

import { useState } from "react";
import { Icon } from "../dashboard/components/Icon";
import { useDashboardContext } from "../dashboard/dashboard-context";

type ConversationItem = {
  id: string;
  role: "user" | "coach";
  message: string;
  time: string;
};

type Recommendation = {
  id: string;
  title: string;
  description: string;
  icon: "sparkles" | "wallet" | "chart";
  tone: "positive" | "warning" | "info";
};

const conversation: ConversationItem[] = [
  {
    id: "conv-1",
    role: "user",
    message: "Budget marketing kita terasa boros bulan ini. Ada saran buat optimize?",
    time: "09:20"
  },
  {
    id: "conv-2",
    role: "coach",
    message: "Pengeluaran marketing naik 18% karena dua kampanye Facebook Ads dengan CPC 45% lebih tinggi dari rata-rata. Saya sarankan hentikan kampanye tersebut dan alihkan ke retargeting email.",
    time: "09:21"
  },
  {
    id: "conv-3",
    role: "user",
    message: "Kalau kita geser budget ke channel lain, proyeksi lead berubah banyak?",
    time: "09:22"
  },
  {
    id: "conv-4",
    role: "coach",
    message: "Simulasi menunjukkan perpindahan 20% budget ke retargeting meningkatkan lead berkualitas +14% dengan biaya 28% lebih rendah.",
    time: "09:22"
  }
];

const recommendations: Recommendation[] = [
  {
    id: "rec-cashflow",
    title: "Cashflow Aman",
    description: "Runway 9,3 bulan. Pertahankan margin positif dengan menjaga pengeluaran operasional konsisten.",
    icon: "wallet",
    tone: "positive"
  },
  {
    id: "rec-expense",
    title: "Optimasi Biaya SaaS",
    description: "Ada 5 lisensi jarang dipakai. Potensi hemat Rp 820rb per bulan jika dikurangi atau digabung.",
    icon: "chart",
    tone: "info"
  },
  {
    id: "rec-growth",
    title: "Strategi Pertumbuhan",
    description: "Channel partnership memberikan ROI 3.4x. Tingkatkan investasi 12% untuk mengejar target Q4.",
    icon: "sparkles",
    tone: "positive"
  }
];

const quickPrompts = [
  "Analisis cashflow 3 bulan terakhir",
  "Bandingkan biaya operasional tahun ini vs tahun lalu",
  "Buat rekomendasi investasi dengan surplus dana",
  "Tampilkan transaksi mencurigakan minggu ini"
];

export default function CoachView() {
  const { accountName } = useDashboardContext();
  const [prompt, setPrompt] = useState("");

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8 space-y-3">
        <h1 className="text-3xl font-bold text-white">AI Finance Coach</h1>
        <p className="text-white/60">{accountName ? `Insight cerdas khusus ${accountName}` : "Ajukan pertanyaan dan dapatkan rekomendasi otomatis untuk keuangan Anda."}</p>
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            rows={3}
            placeholder="Contoh: Rekomendasikan strategi alokasi budget untuk Q4"
            className="w-full rounded-2xl border border-white/15 bg-white/5 px-5 py-4 text-sm text-white placeholder:text-white/40 focus:outline-none"
          />
          <button className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-secondary px-5 py-2 text-sm font-semibold text-white shadow-lg transition hover:from-secondary hover:to-primary">
            <Icon name="sparkles" className="h-4 w-4" />
            Kirim Pertanyaan
          </button>
        </div>
        <div className="flex flex-wrap gap-2 text-sm">
          {quickPrompts.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setPrompt(item)}
              className="rounded-full border border-white/15 px-4 py-1 text-white/70 transition hover:border-primary hover:text-white"
            >
              {item}
            </button>
          ))}
        </div>
      </header>

      <section className="mb-8 space-y-4">
        {conversation.map((item) => (
          <div
            key={item.id}
            className={`flex gap-3 ${item.role === "user" ? "flex-row-reverse text-right" : "flex-row"}`}
          >
            <div className={`mt-1 flex h-10 w-10 items-center justify-center rounded-full ${item.role === "user" ? "bg-white/10 text-primary" : "bg-gradient-to-br from-primary to-secondary text-white"}`}>
              <Icon name={item.role === "user" ? "users" : "sparkles"} className="h-4 w-4" />
            </div>
            <div className={`max-w-xl rounded-2xl border border-white/15 px-4 py-3 text-sm leading-relaxed ${item.role === "user" ? "bg-white/5" : "glass-effect"}`}>
              <p className="text-white/80">{item.message}</p>
              <p className="mt-1 text-xs text-white/40">{item.role === "user" ? "Anda" : "Coach"} • {item.time}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        {recommendations.map((card) => (
          <div
            key={card.id}
            className={`rounded-2xl border px-5 py-5 transition ${
              card.tone === "positive"
                ? "border-emerald-500/30 bg-emerald-500/10"
                : card.tone === "warning"
                  ? "border-amber-500/30 bg-amber-500/10"
                  : "border-white/10 bg-white/5"
            }`}
          >
            <div className="mb-2 flex items-center gap-2">
              <div className="rounded-xl bg-white/10 p-2">
                <Icon name={card.icon} className="h-4 w-4 text-white" />
              </div>
              <p className="text-sm font-semibold text-white">{card.title}</p>
            </div>
            <p className="text-sm text-white/70">{card.description}</p>
            <button className="mt-4 text-xs font-semibold text-primary transition hover:text-blue-300">Lihat detail rekomendasi</button>
          </div>
        ))}
      </section>
    </div>
  );
}
