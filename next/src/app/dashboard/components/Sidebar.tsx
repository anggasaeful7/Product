"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "./Icon";

export type SidebarNavItem = {
  label: string;
  href: string;
  icon: IconName;
};

type Props = {
  nav: SidebarNavItem[];
  open: boolean;
  onClose: () => void;
  plan?: string | null;
};

export function DashboardSidebar({ nav, open, onClose, plan }: Props) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const showUpgrade = !plan || plan.toUpperCase() === "FREE";

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-white/10 bg-white/5 backdrop-blur transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center border-b border-white/10 px-6 py-4">
          <div className="animate-glow mr-3 rounded-2xl bg-primary/20 p-3">
            <svg width="28" height="28" viewBox="0 0 48 48">
              <circle cx="24" cy="24" r="22" fill="url(#logoGradient-dashboard)" stroke="rgba(96,165,250,0.3)" strokeWidth="2" />
              <path d="M16 32 L20 20 L24 32 M18 28 L22 28" stroke="#ffffff" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M28 32 L28 20 M28 20 L34 20 M28 26 L32 26" stroke="#ffffff" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-xl font-bold">
            Angs<span className="gradient-text">Flow</span>
          </span>
        </div>

        <nav className="flex-1 overflow-y-auto space-y-2 px-4 py-6">
          {nav.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 transition ${
                isActive(item.href) ? "bg-primary/20 text-white shadow-lg" : "text-white/70 hover:bg-white/10"
              }`}
            >
              <Icon name={item.icon} className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        {showUpgrade ? (
          <div className="border-t border-white/10 px-4 py-6">
            <div className="glass-effect rounded-2xl border border-white/10 p-4">
              <p className="text-sm text-white/70">Upgrade untuk fitur tim tak terbatas</p>
              <Link
                href="/pricing"
                className="mt-3 block w-full rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-4 py-2 text-center text-sm font-semibold text-white shadow-lg"
              >
                Lihat Paket
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </aside>
  );
}
