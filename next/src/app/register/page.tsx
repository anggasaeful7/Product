import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import RegisterView from "./RegisterView";

export const metadata: Metadata = {
  title: "Angsflow - Register",
  description: "Daftar ke Angsflow untuk mulai mengelola keuangan individu dan tim.",
};

export default async function Page() {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }
  return <RegisterView />;
}

