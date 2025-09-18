"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { AccountType } from "@prisma/client";

export type DashboardContextValue = {
  userName: string;
  plan: string | null;
  accountName: string | null;
  accountType: AccountType | null;
  defaultAccountId: string | null;
};

const DashboardContext = createContext<DashboardContextValue | undefined>(undefined);

export function DashboardProvider({ value, children }: { value: DashboardContextValue; children: ReactNode }) {
  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

export function useDashboardContext() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboardContext must be used within a DashboardProvider");
  }
  return context;
}
