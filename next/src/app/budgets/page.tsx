import { DashboardPage } from "../dashboard/DashboardPage";
import BudgetsView from "./BudgetsView";

export const metadata = {
  title: "Angsflow - Budgeting",
  description: "Monitoring alokasi dan penggunaan budget per kategori."
};

export default async function Page() {
  return (
    <DashboardPage
      title="Budgeting"
      subtitle={(context) => `Optimalkan alokasi dana untuk ${context.accountName ?? 'akun Anda'}.`}
    >
      <BudgetsView />
    </DashboardPage>
  );
}
