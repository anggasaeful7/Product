import type { DefaultSession } from "next-auth";
import type { AccountType, Plan } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      defaultAccountId: string | null;
      accountType: AccountType | null;
      plan: Plan | null;
    };
  }

  interface User {
    defaultAccountId?: string | null;
    accountType?: AccountType | null;
    plan?: Plan | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accountId?: string | null;
    accountType?: AccountType | null;
    plan?: Plan | null;
  }
}
