import { notFound } from "next/navigation";
import { DashboardPage } from "../../dashboard/DashboardPage";
import { reports } from "../reports-data";
import { ReportDetailView } from "./ReportDetailView";

export async function generateMetadata({ params }: { params: Promise<{ reportId: string }> }) {
  const { reportId } = await params;
  const report = reports.find((item) => item.id === reportId);
  if (!report) {
    return {
      title: "Laporan Tidak Ditemukan"
    };
  }
  return {
    title: `Angsflow - ${report.title}`,
    description: report.summary
  };
}

export default async function Page({ params }: { params: Promise<{ reportId: string }> }) {
  const { reportId } = await params;
  const report = reports.find((item) => item.id === reportId);
  if (!report) {
    notFound();
  }

  return (
    <DashboardPage
      title={report.title}
      subtitle={(context) => `Rangkuman periode ${report.period} untuk ${context.accountName ?? 'akun Anda'}.`}
    >
      <ReportDetailView report={report} />
    </DashboardPage>
  );
}