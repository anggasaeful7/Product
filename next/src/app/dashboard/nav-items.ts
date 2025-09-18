import type { IconName } from "./components/Icon";

export type DashboardNavItem = {
  label: string;
  href: string;
  icon: IconName;
};

export function getNavItems(plan?: string | null): DashboardNavItem[] {
  const normalizedPlan = (plan ?? "").toUpperCase();

  const base: DashboardNavItem[] = [
    { label: "Dashboard", href: "/dashboard", icon: "home" },
    { label: "Transaksi", href: "/transactions", icon: "rows" },
    { label: "Budgeting", href: "/budgets", icon: "wallet" },
    { label: "Laporan", href: "/laporan", icon: "chart" },
    { label: "AI Coach", href: "/coach", icon: "sparkles" },
    { label: "Settings", href: "/settings", icon: "settings" },
  ];

  if (normalizedPlan === "TEAM") {
    return [
      ...base.slice(0, 5),
      { label: "Tim", href: "/team", icon: "users" },
      ...base.slice(5)
    ];
  }

  return base;
}
