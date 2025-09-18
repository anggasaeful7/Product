"use client";

import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { toast } from "sonner";

const translations = {
  id: {
    subtitle: "Buat akun baru untuk memulai",
    fullName: "Nama Lengkap",
    email: "Email",
    password: "Password",
    confirmPassword: "Konfirmasi Password",
    passwordHint: "Minimal 8 karakter dengan kombinasi huruf dan angka",
    agree: "Saya setuju dengan",
    terms: "Syarat & Ketentuan",
    and: "dan",
    privacy: "Kebijakan Privasi",
    submit: "Daftar Sekarang",
    haveAccount: "Sudah punya akun?",
    login: "Masuk di sini",
    accountChoiceTitle: "Pilih tipe akun",
    personalLabel: "Personal",
    orgLabel: "Organisasi / Tim",
    orgPlaceholder: "Nama organisasi",
    mismatch: "Password tidak cocok!",
    mustAgree: "Anda harus menyetujui syarat dan ketentuan!",
  },
  en: {
    subtitle: "Create a new account to get started",
    fullName: "Full Name",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    passwordHint: "Minimum 8 characters with letters and numbers",
    agree: "I agree to the",
    terms: "Terms & Conditions",
    and: "and",
    privacy: "Privacy Policy",
    submit: "Sign Up Now",
    haveAccount: "Already have an account?",
    login: "Sign in here",
    accountChoiceTitle: "Choose account type",
    personalLabel: "Personal",
    orgLabel: "Organization / Team",
    orgPlaceholder: "Organization name",
    mismatch: "Passwords do not match!",
    mustAgree: "You must accept the terms and conditions!",
  },
} as const;

type Language = keyof typeof translations;

type AccountType = "PERSONAL" | "ORG";

type FormState = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function RegisterPage() {
  const [language, setLanguage] = useState<Language>("id");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [accountType, setAccountType] = useState<AccountType>("PERSONAL");
  const [organizationName, setOrganizationName] = useState("");
  const [agree, setAgree] = useState(false);
  const [formState, setFormState] = useState<FormState>({ name: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const t = translations[language];

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (formState.password !== formState.confirmPassword) {
      const message = t.mismatch;
      setError(message);
      toast.error("Registrasi gagal", { description: message });
      return;
    }

    if (!agree) {
      const message = t.mustAgree;
      setError(message);
      toast.error("Registrasi gagal", { description: message });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formState.name.trim(),
          email: formState.email.trim(),
          password: formState.password,
          accountType,
          organizationName: accountType === "ORG" ? organizationName.trim() : undefined,
        }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        const message = data.error ?? "Gagal mendaftarkan akun";
        setError(message);
        toast.error("Registrasi gagal", { description: message });
        setLoading(false);
        return;
      }

      const signInResult = await signIn("credentials", {
        email: formState.email,
        password: formState.password,
        redirect: false,
      });

      setLoading(false);

      if (signInResult?.error) {
        setError(signInResult.error);
        toast.error("Registrasi gagal", { description: signInResult.error });
        return;
      }

      toast.success("Registrasi berhasil", {
        description: accountType === "ORG" ? "Akun organisasi siap digunakan" : "Akun personal siap digunakan",
      });

      router.replace("/dashboard");
      router.refresh();
    } catch (err) {
      console.error("Register error", err);
      const message = "Terjadi kesalahan. Silakan coba lagi.";
      setError(message);
      toast.error("Registrasi gagal", { description: message });
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-40 -right-40 h-80 w-80 animate-float rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute top-1/2 -left-40 h-96 w-96 animate-float rounded-full bg-blue-500/10 blur-3xl" style={{ animationDelay: "-2s" }} />
        <div className="absolute bottom-0 right-1/3 h-64 w-64 animate-float rounded-full bg-indigo-500/15 blur-3xl" style={{ animationDelay: "-4s" }} />
      </div>

      <div className="fixed right-6 top-6 z-50">
        <div className="glass-effect rounded-full border border-white/20 p-2">
          <select
            aria-label="Language selector"
            value={language}
            onChange={(event) => setLanguage(event.target.value as Language)}
            className="cursor-pointer border-none bg-transparent text-sm font-medium text-white outline-none"
          >
            <option value="id" className="bg-slate-800 text-white">
              ID
            </option>
            <option value="en" className="bg-slate-800 text-white">
              EN
            </option>
          </select>
        </div>
      </div>

      <div className="relative flex min-h-screen items-center justify-center px-4 py-8">
        <div className="w-full max-w-md animate-slide-up border border-white/20 p-8 shadow-2xl glass-effect rounded-3xl">
          <div className="mb-8 text-center">
            <div className="mb-4 flex justify-center">
              <Image src="/AngsFlow.png" alt="AngsFlow Logo" width={80} height={80} priority className="h-12 w-auto object-contain md:h-20" />
            </div>
            <h1 className="gradient-text mb-2 text-3xl font-bold">Angsflow</h1>
            <p className="text-white/70">{t.subtitle}</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <label htmlFor="register-name" className="text-sm font-medium text-white/80">
                {t.fullName}
              </label>
              <input
                id="register-name"
                name="name"
                type="text"
                required
                value={formState.name}
                onChange={handleChange}
                placeholder="Nama Lengkap"
                className="input-focus w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-white/40 focus:outline-none"
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="register-email" className="text-sm font-medium text-white/80">
                {t.email}
              </label>
              <input
                id="register-email"
                name="email"
                type="email"
                required
                value={formState.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="input-focus w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-white/40 focus:outline-none"
              />
            </div>

            <div className="grid gap-2">
              <span className="text-sm font-medium text-white/80">{t.accountChoiceTitle}</span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAccountType("PERSONAL")}
                  className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                    accountType === "PERSONAL"
                      ? "border-primary bg-primary/20 text-white shadow-lg"
                      : "border-white/20 bg-white/5 text-white/70 hover:text-white"
                  }`}
                >
                  {t.personalLabel}
                </button>
                <button
                  type="button"
                  onClick={() => setAccountType("ORG")}
                  className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                    accountType === "ORG"
                      ? "border-secondary bg-secondary/20 text-white shadow-lg"
                      : "border-white/20 bg-white/5 text-white/70 hover:text-white"
                  }`}
                >
                  {t.orgLabel}
                </button>
              </div>
              {accountType === "ORG" ? (
                <input
                  id="register-organization"
                  name="organization"
                  type="text"
                  value={organizationName}
                  onChange={(event) => setOrganizationName(event.target.value)}
                  placeholder={t.orgPlaceholder}
                  className="input-focus mt-2 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-white/40 focus:outline-none"
                  required
                />
              ) : null}
            </div>

            <div className="grid gap-2">
              <label htmlFor="register-password" className="text-sm font-medium text-white/80">
                {t.password}
              </label>
              <div className="relative">
                <input
                  id="register-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formState.password}
                  onChange={handleChange}
                  placeholder="********"
                  className="input-focus w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-white/40 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 transition-colors hover:text-white"
                  aria-label="Toggle password visibility"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S3.732 16.057 2.458 12z" />
                  </svg>
                </button>
              </div>
              <p className="text-xs text-white/50">{t.passwordHint}</p>
            </div>

            <div className="grid gap-2">
              <label htmlFor="register-confirm" className="text-sm font-medium text-white/80">
                {t.confirmPassword}
              </label>
              <div className="relative">
                <input
                  id="register-confirm"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={formState.confirmPassword}
                  onChange={handleChange}
                  placeholder="********"
                  className="input-focus w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-white/40 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 transition-colors hover:text-white"
                  aria-label="Toggle confirm password visibility"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S3.732 16.057 2.458 12z" />
                  </svg>
                </button>
              </div>
            </div>

            <label className="flex items-start space-x-3 text-sm text-white/70">
              <input
                type="checkbox"
                checked={agree}
                onChange={(event) => setAgree(event.target.checked)}
                className="mt-1 h-4 w-4 rounded border-white/20 bg-white/10 text-primary focus:ring-2 focus:ring-primary"
              />
              <span>
                {t.agree}{" "}
                <Link href="#" className="text-primary transition-colors hover:text-blue-300">
                  {t.terms}
                </Link>{" "}
                {t.and}{" "}
                <Link href="#" className="text-primary transition-colors hover:text-blue-300">
                  {t.privacy}
                </Link>
              </span>
            </label>

            {error ? (
              <div className="rounded-xl border border-rose-400/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full transform rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 py-3 text-lg font-semibold text-white shadow-lg transition duration-300 hover:from-green-600 hover:to-emerald-500 hover:scale-105 hover:shadow-emerald-500/25 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Memproses..." : t.submit}
            </button>
          </form>

          <div className="mt-6 text-center text-white/70">
            <span>{t.haveAccount}</span>
            <Link href="/login" className="ml-1 font-medium text-primary transition-colors hover:text-blue-300">
              {t.login}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


