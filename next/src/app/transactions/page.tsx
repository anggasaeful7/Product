import { DashboardPage } from "../dashboard/DashboardPage";
import TransactionsView from "./TransactionsView";

export const metadata = {
  title: "Angsflow - Transaksi",
  description: "Kelola pemasukan dan pengeluaran dalam satu tampilan terintegrasi."
};

export default async function Page() {
  return (
    <DashboardPage
      title="Transaksi"
      subtitle={(context) => `Pantau pemasukan dan pengeluaran untuk ${context.accountName ?? 'akun Anda'}.`}
    >
      <TransactionsView />
    </DashboardPage>
  );
}
