"use client";

import { useDashboardContext } from "./dashboard-context";
import DashboardView from "./DashboardView";
import OrgDashboardView from "./OrgDashboardView";

export function DashboardRoot() {
  const { accountType } = useDashboardContext();
  if (accountType === "ORG") {
    return <OrgDashboardView />;
  }
  return <DashboardView />;
}
