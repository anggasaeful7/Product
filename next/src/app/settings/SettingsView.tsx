"use client";

import { useState } from "react";
import { Icon } from "../dashboard/components/Icon";
import { useDashboardContext } from "../dashboard/dashboard-context";

const languages = [
  { value: "id", label: "Bahasa Indonesia" },
  { value: "en", label: "English" }
];

const currencies = [
  { value: "IDR", label: "Rupiah (IDR)" },
  { value: "USD", label: "Dollar (USD)" }
];

export default function SettingsView() {
  const { userName, accountName, plan } = useDashboardContext();
  const [selectedLanguage, setSelectedLanguage] = useState("id");
  const [selectedCurrency, setSelectedCurrency] = useState("IDR");

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold text-white">Pengaturan</h1>
        <p className="text-white/60">Atur profil, keamanan, dan preferensi workspace Anda.</p>
        <div className="flex flex-wrap items-center gap-2 text-xs text-white/50">
          <span className="rounded-full bg-white/10 px-3 py-1">{userName}</span>
          {accountName ? <span className="rounded-full bg-white/10 px-3 py-1">{accountName}</span> : null}
          {plan ? <span className="rounded-full bg-white/10 px-3 py-1">Plan {plan}</span> : null}
        </div>
      </header>

      <section className="space-y-6">
        <div className="glass-effect rounded-2xl border border-white/20 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Profil Akun</h2>
            <button className="rounded-lg border border-white/20 px-4 py-2 text-xs font-semibold text-white transition hover:border-primary">
              Simpan Perubahan
            </button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm text-white/70">
              Nama Lengkap
              <input
                defaultValue={userName}
                className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none"
              />
            </label>
            <label className="text-sm text-white/70">
              Email
              <input
                defaultValue="finance@angsflow.com"
                type="email"
                className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none"
              />
            </label>
            <label className="text-sm text-white/70">
              Bahasa
              <select
                value={selectedLanguage}
                onChange={(event) => setSelectedLanguage(event.target.value)}
                className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-white focus:outline-none"
              >
                {languages.map((option) => (
                  <option key={option.value} value={option.value} className="bg-slate-900">
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm text-white/70">
              Mata Uang Default
              <select
                value={selectedCurrency}
                onChange={(event) => setSelectedCurrency(event.target.value)}
                className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-white focus:outline-none"
              >
                {currencies.map((option) => (
                  <option key={option.value} value={option.value} className="bg-slate-900">
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="glass-effect rounded-2xl border border-white/20 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Keamanan</h2>
            <span className="text-xs font-semibold text-emerald-300">Status: Aman</span>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-white">Autentikasi Dua Faktor</p>
                <p className="text-xs text-white/50">Gunakan aplikasi Authenticator untuk login yang lebih aman.</p>
              </div>
              <button className="rounded-lg border border-white/20 px-3 py-2 text-xs font-semibold text-white/70 transition hover:border-primary hover:text-white">
                Kelola 2FA
              </button>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-white">Sesi Aktif</p>
                <p className="text-xs text-white/50">3 perangkat login. Terakhir dari Jakarta, 18 Sep 2025 09:12.</p>
              </div>
              <button className="rounded-lg border border-white/20 px-3 py-2 text-xs font-semibold text-white/70 transition hover:border-primary hover:text-white">
                Kelola Sesi
              </button>
            </div>
          </div>
        </div>

        <div className="glass-effect rounded-2xl border border-white/20 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Integrasi & Notifikasi</h2>
            <button className="rounded-lg border border-white/20 px-4 py-2 text-xs font-semibold text-white transition hover:border-primary">
              Tambah Integrasi
            </button>
          </div>
          <div className="space-y-4 text-sm text-white/70">
            <label className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <input type="checkbox" defaultChecked className="mt-1 h-4 w-4 rounded border-white/20 bg-white/10 text-primary focus:ring-primary" />
              <span>
                Email harian berisi ringkasan cashflow dan transaksi penting.
              </span>
            </label>
            <label className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <input type="checkbox" defaultChecked className="mt-1 h-4 w-4 rounded border-white/20 bg-white/10 text-primary focus:ring-primary" />
              <span>Notifikasi Slack ketika terjadi pengeluaran di atas Rp 5 juta.</span>
            </label>
            <label className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <input type="checkbox" className="mt-1 h-4 w-4 rounded border-white/20 bg-white/10 text-primary focus:ring-primary" />
              <span>Laporan otomatis ke Google Sheets setiap akhir pekan.</span>
            </label>
          </div>
        </div>
      </section>
    </div>
  );
}
