import { DashboardPage } from "../dashboard/DashboardPage";
import ReportsView from "./ReportsView";

export const metadata = {
  title: "Angsflow - Laporan",
  description: "Lihat ringkasan finansial bulanan dan insight otomatis."
};

export default async function Page() {
  return (
    <DashboardPage
      title="Laporan"
      subtitle={(context) => `Analisis kinerja finansial ${context.accountName ?? 'akun'}.`}
    >
      <ReportsView />
    </DashboardPage>
  );
}
