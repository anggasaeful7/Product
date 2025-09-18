import { DashboardPage } from "../dashboard/DashboardPage";
import TeamView from "./TeamView";

export const metadata = {
  title: "Angsflow - Tim",
  description: "Kelola anggota tim, role, dan izin organisasi."
};

export default async function Page() {
  return (
    <DashboardPage
      title="Tim"
      requireTeamPlan
      subtitle={(context) => `Manajemen kolaborasi tim untuk ${context.accountName ?? 'organisasi Anda'}.`}
    >
      <TeamView />
    </DashboardPage>
  );
}
