import { DashboardPage } from "../dashboard/DashboardPage";
import CoachView from "./CoachView";

export const metadata = {
  title: "Angsflow - AI Coach",
  description: "Bertanya dan dapatkan rekomendasi finansial cerdas secara instan."
};

export default async function Page() {
  return (
    <DashboardPage
      title="AI Coach"
      subtitle={() => "Insight real-time dari AngsFlow AI untuk keputusan finansial yang lebih cepat."}
    >
      <CoachView />
    </DashboardPage>
  );
}
