import type { Metadata } from "next";
import { DashboardPage } from "./DashboardPage";
import { DashboardRoot } from "./DashboardRoot";

export const metadata: Metadata = {
  title: "Angsflow - Dashboard",
  description: "Pantau pemasukan, pengeluaran, dan aktivitas tim dalam satu dashboard Angsflow.",
};

export default async function Page() {
  return (
    <DashboardPage
      title="Dashboard"
      subtitle={(context) => {
        const firstName = context.userName.split(/\s+/)[0] || "Anda";
        return `Selamat datang kembali, ${firstName}! Berikut ringkasan keuangan Anda.`;
      }}
    >
      <DashboardRoot />
    </DashboardPage>
  );
}
