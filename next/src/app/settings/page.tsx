import { DashboardPage } from "../dashboard/DashboardPage";
import SettingsView from "./SettingsView";

export const metadata = {
  title: "Angsflow - Pengaturan",
  description: "Konfigurasi profil, keamanan, dan preferensi workspace."
};

export default async function Page() {
  return (
    <DashboardPage
      title="Pengaturan"
      subtitle={() => "Kelola preferensi akun, keamanan, dan integrasi dalam satu tempat."}
    >
      <SettingsView />
    </DashboardPage>
  );
}
