"use client";

import { Icon } from "../dashboard/components/Icon";
import { useDashboardContext } from "../dashboard/dashboard-context";

type Member = {
  id: string;
  name: string;
  role: "Owner" | "Admin" | "Member";
  email: string;
  status: "Aktif" | "Menunggu";
  initials: string;
};

const members: Member[] = [
  { id: "m-1", name: "Rani Pratama", role: "Owner", email: "rani@angsflow.com", status: "Aktif", initials: "RP" },
  { id: "m-2", name: "Hendra Wijaya", role: "Admin", email: "hendra@angsflow.com", status: "Aktif", initials: "HW" },
  { id: "m-3", name: "Dewi Santoso", role: "Member", email: "dewi@angsflow.com", status: "Aktif", initials: "DS" },
  { id: "m-4", name: "Fikri Maulana", role: "Member", email: "fikri@angsflow.com", status: "Menunggu", initials: "FM" }
];

const activity = [
  { id: "a-1", actor: "Rani", action: "mengundang", target: "Fikri Maulana", time: "Hari ini 08:45" },
  { id: "a-2", actor: "Dewi", action: "menambahkan budget", target: "Marketing Q4", time: "Kemarin 17:22" },
  { id: "a-3", actor: "Hendra", action: "menyetujui transaksi", target: "Pengadaan perangkat", time: "Kemarin 10:11" }
];

export default function TeamView() {
  const { accountName } = useDashboardContext();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold text-white">Tim & Akses</h1>
        <p className="text-white/60">Kelola anggota, role, dan izin kolaborasi organisasi Anda.</p>
        {accountName ? <p className="text-xs text-white/40">Workspace: {accountName}</p> : null}
        <div className="flex flex-wrap gap-3">
          <button className="rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:border-primary">
            Manajemen Role
          </button>
          <button className="rounded-xl bg-gradient-to-r from-primary to-secondary px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:from-secondary hover:to-primary">
            + Undang Anggota
          </button>
        </div>
      </header>

      <section className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {members.map((member) => (
            <div key={member.id} className="flex items-center justify-between rounded-2xl border border-white/15 bg-white/5 px-4 py-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-sm font-semibold text-white">
                  {member.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{member.name}</p>
                  <p className="text-xs text-white/50">{member.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/70">{member.role}</span>
                <span className={`text-xs font-semibold ${member.status === "Aktif" ? "text-emerald-300" : "text-amber-300"}`}>
                  {member.status}
                </span>
                <button className="rounded-lg border border-white/15 px-3 py-1 text-xs font-semibold text-white/70 transition hover:border-primary hover:text-white">
                  Kelola
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="glass-effect rounded-2xl border border-white/20 p-6">
            <h2 className="text-lg font-semibold text-white">Aktivitas Tim</h2>
            <div className="mt-4 space-y-3 text-sm text-white/70">
              {activity.map((item) => (
                <div key={item.id} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                  <Icon name="rows" className="mt-1 h-4 w-4 text-primary" />
                  <div>
                    <p><span className="font-semibold text-white">{item.actor}</span> {item.action} <span className="font-semibold text-white">{item.target}</span></p>
                    <p className="text-xs text-white/50">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-effect rounded-2xl border border-white/20 p-6">
            <h2 className="text-lg font-semibold text-white">Pengaturan Akses</h2>
            <div className="mt-4 space-y-3 text-sm text-white/70">
              <label className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <div>
                  <p className="font-semibold text-white">Persetujuan Multi Level</p>
                  <p className="text-xs text-white/50">Transaksi di atas Rp 5 juta butuh 2 persetujuan</p>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-white/20 bg-white/10 text-primary focus:ring-primary" />
              </label>
              <label className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <div>
                  <p className="font-semibold text-white">Batasi ekspor data</p>
                  <p className="text-xs text-white/50">Hanya Owner/Admin yang dapat mengekspor laporan</p>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-white/20 bg-white/10 text-primary focus:ring-primary" />
              </label>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
