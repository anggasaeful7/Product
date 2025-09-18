"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import { DashboardSidebar, type SidebarNavItem } from "./Sidebar";
import { DashboardTopbar } from "./Topbar";
import { Icon } from "./Icon";
import { DashboardProvider, type DashboardContextValue } from "../dashboard-context";

type Props = {
  title: string;
  subtitle: string;
  userName: string;
  plan?: string | null;
  navItems: SidebarNavItem[];
  contextValue: DashboardContextValue;
  children: React.ReactNode;
};

export function DashboardFrame({ title, subtitle, userName, plan, navItems, contextValue, children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut({ redirect: false });
      toast.success("Berhasil logout", { description: "Sampai jumpa lagi!" });
      router.replace("/login");
      router.refresh();
    } catch (error) {
      toast.error("Gagal logout", { description: "Silakan coba lagi." });
    }
  };

  return (
    <DashboardProvider value={contextValue}>
      <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <AnimatedBackdrop />

        <button
          type="button"
          onClick={() => setSidebarOpen((prev) => !prev)}
          className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white shadow-lg backdrop-blur transition hover:bg-white/20 lg:hidden"
          aria-label="Toggle sidebar"
        >
          <Icon name="rows" className="h-6 w-6" />
        </button>

        <DashboardSidebar nav={navItems} open={sidebarOpen} onClose={() => setSidebarOpen(false)} plan={plan} />

        <main className="relative z-30 min-h-screen lg:pl-64">
          <DashboardTopbar title={title} subtitle={subtitle} userName={userName} plan={plan} onSignOut={handleSignOut} />
          {children}
        </main>

        <svg width="0" height="0">
          <defs>
            <linearGradient id="logoGradient-dashboard" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60A5FA" />
              <stop offset="50%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#1E40AF" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </DashboardProvider>
  );
}

function AnimatedBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute -top-40 -right-40 h-80 w-80 animate-float rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute top-1/2 -left-40 h-96 w-96 animate-float rounded-full bg-blue-500/10 blur-3xl" style={{ animationDelay: "-2s" }} />
      <div className="absolute bottom-0 right-1/3 h-64 w-64 animate-float rounded-full bg-indigo-500/15 blur-3xl" style={{ animationDelay: "-4s" }} />
    </div>
  );
}
