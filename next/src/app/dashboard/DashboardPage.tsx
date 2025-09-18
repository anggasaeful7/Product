import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import type { AccountType, Plan } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { DashboardFrame } from "./components/DashboardFrame";
import { getNavItems } from "./nav-items";
import type { DashboardContextValue } from "./dashboard-context";

export type DashboardPageProps = {
  title: string;
  subtitle?: string | ((context: DashboardContextValue) => string);
  requireTeamPlan?: boolean;
  children: ReactNode;
};

export async function DashboardPage({ title, subtitle, requireTeamPlan = false, children }: DashboardPageProps) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const userId = session.user.id;
  const userName = session.user.name ?? session.user.email ?? "Pengguna";
  let defaultAccountId = session.user.defaultAccountId ?? null;
  let accountType: AccountType | null = session.user.accountType ?? null;
  let plan: Plan | null = session.user.plan ?? null;
  let accountName: string | null = null;

  if (defaultAccountId) {
    const account = await prisma.account.findUnique({
      where: { id: defaultAccountId },
      select: {
        name: true,
        type: true,
        subscription: {
          select: { plan: true }
        }
      }
    });

    if (account) {
      accountName = account.name;
      accountType = account.type;
      plan = account.subscription?.plan ?? plan;
    }
  } else {
    const membership = await prisma.membership.findFirst({
      where: { userId, status: "ACTIVE" },
      orderBy: { createdAt: "asc" },
      select: {
        accountId: true,
        account: {
          select: {
            name: true,
            type: true,
            subscription: {
              select: { plan: true }
            }
          }
        }
      }
    });

    if (membership) {
      defaultAccountId = membership.accountId;
      accountName = membership.account.name;
      accountType = membership.account.type;
      plan = membership.account.subscription?.plan ?? plan;
    }
  }

  const normalizedPlan = plan ? plan.toUpperCase() : null;

  if (requireTeamPlan && normalizedPlan !== "TEAM") {
    redirect("/dashboard");
  }

  const contextValue: DashboardContextValue = {
    userName,
    plan: normalizedPlan,
    accountName,
    accountType,
    defaultAccountId
  };

  const computedSubtitle = typeof subtitle === "function"
    ? subtitle(contextValue)
    : subtitle ?? (accountName ? accountName : "Kelola keuangan dengan Angsflow");

  const navItems = getNavItems(normalizedPlan);

  return (
    <DashboardFrame
      title={title}
      subtitle={computedSubtitle}
      userName={userName}
      plan={normalizedPlan}
      navItems={navItems}
      contextValue={contextValue}
    >
      {children}
    </DashboardFrame>
  );
}
