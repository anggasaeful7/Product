"use client";

import { useMemo } from "react";
import { Icon } from "./Icon";

type Props = {
  title: string;
  subtitle: string;
  userName: string;
  plan?: string | null;
  onSignOut: () => void;
};

const planLabelMap: Record<string, string> = {
  FREE: "Free Plan",
  PRO: "Pro Plan",
  TEAM: "Team Plan",
};

const planGradientMap: Record<string, string> = {
  FREE: "from-slate-500 to-slate-600",
  PRO: "from-accent to-orange-500",
  TEAM: "from-purple-500 to-indigo-500",
};

export function DashboardTopbar({ title, subtitle, userName, plan, onSignOut }: Props) {
  const normalizedPlan = (plan ?? "FREE").toUpperCase();
  const planLabel = (planLabelMap[normalizedPlan] ?? planLabelMap.FREE) as string;
  const planGradient = planGradientMap[normalizedPlan] ?? planGradientMap.FREE;

  const initials = useMemo(() => {
    const parts = userName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2);
    if (parts.length === 0) return "US";
    return parts.map((part) => part.charAt(0).toUpperCase()).join("");
  }, [userName]);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-slate-900/80 via-blue-900/80 to-indigo-900/80 px-6 py-4 backdrop-blur">
      <div>
        <h1 className="text-2xl font-semibold text-white">{title}</h1>
        <p className="text-sm text-white/60">{subtitle}</p>
      </div>
      <div className="flex items-center gap-4">
        <div className={`hidden items-center gap-2 rounded-full bg-gradient-to-r px-3 py-1 text-xs font-bold text-white shadow-lg md:flex ${planGradient}`}>
          <Icon name="sparkles" className="h-3 w-3" />
          {planLabel.toUpperCase()}
        </div>

        <div className="relative hidden md:block">
          <input
            type="search"
            placeholder="Cari transaksi, laporan, atau anggota..."
            className="w-72 rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none input-focus"
          />
          <Icon name="search" className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
        </div>

        <NotificationMenu />

        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-xs font-bold">
            {initials}
          </div>
          <div className="hidden text-sm leading-tight md:flex md:flex-col">
            <span className="font-medium">{userName}</span>
            <span className="text-xs text-white/60">{planLabel}</span>
          </div>
          <button
            type="button"
            onClick={onSignOut}
            className="rounded-lg border border-white/20 px-3 py-1 text-xs font-semibold text-white transition hover:border-primary hover:text-primary"
          >
            Keluar
          </button>
        </div>
      </div>
    </header>
  );
}

function NotificationMenu() {
  return (
    <div className="relative">
      <button className="relative rounded-xl p-2 text-white/70 transition hover:text-primary">
        <Icon name="bell" className="h-5 w-5" />
        <span className="absolute -top-1 -right-1 inline-flex h-2.5 w-2.5 animate-bounce-slow rounded-full bg-red-500" />
      </button>
    </div>
  );
}
