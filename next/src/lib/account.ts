import { redirect } from "next/navigation";
import type { AccountType, Plan, Role } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export type AccountContext = {
  userId: string;
  userName: string;
  accountId: string;
  accountName: string | null;
  accountType: AccountType | null;
  plan: Plan | null;
};

export async function requireAccountContext() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const userId = session.user.id;
  const userName = session.user.name ?? session.user.email ?? "Pengguna";
  let accountId = session.user.defaultAccountId ?? null;
  let accountType: AccountType | null = session.user.accountType ?? null;
  let plan: Plan | null = session.user.plan ?? null;
  let accountName: string | null = null;

  if (accountId) {
    const account = await prisma.account.findFirst({
      where: {
        id: accountId,
        memberships: { some: { userId, status: "ACTIVE" } }
      },
      select: {
        id: true,
        name: true,
        type: true,
        subscription: { select: { plan: true } }
      }
    });

    if (account) {
      accountName = account.name;
      accountType = account.type;
      plan = account.subscription?.plan ?? plan;
    } else {
      accountId = null;
    }
  }

  if (!accountId) {
    const membership = await prisma.membership.findFirst({
      where: { userId, status: "ACTIVE" },
      orderBy: { createdAt: "asc" },
      select: {
        accountId: true,
        account: {
          select: {
            name: true,
            type: true,
            subscription: { select: { plan: true } }
          }
        }
      }
    });

    if (!membership) {
      throw new Error("ACTIVE_MEMBERSHIP_NOT_FOUND");
    }

    accountId = membership.accountId;
    accountName = membership.account.name;
    accountType = membership.account.type;
    plan = membership.account.subscription?.plan ?? plan;
  }

  return {
    userId,
    userName,
    accountId,
    accountName,
    accountType,
    plan,
    session
  } as const;
}

export async function requireTeamRole(accountId: string, userId: string, allowedRoles: Role[] = ["OWNER", "ADMIN", "MEMBER"]) {
  const membership = await prisma.membership.findFirst({
    where: {
      accountId,
      userId,
      status: "ACTIVE"
    },
    select: { role: true }
  });

  if (!membership || !allowedRoles.includes(membership.role)) {
    throw new Error("FORBIDDEN");
  }

  return membership.role;
}
