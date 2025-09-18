import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import LoginView from "./LoginView";

export const metadata: Metadata = {
  title: "Angsflow - Login",
  description: "Masuk ke Angsflow untuk mengelola keuangan individu dan tim secara modern.",
};

export default async function Page() {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }
  return <LoginView />;
}

