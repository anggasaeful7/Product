"use client";

import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { toast } from "sonner";

const translations = {
  id: {
    title: "Masuk ke akun Anda untuk melanjutkan",
    email: "Email",
    password: "Password",
    remember: "Ingat saya",
    forgot: "Lupa password?",
    submit: "Masuk",
    noAccount: "Belum punya akun?",
    register: "Daftar sekarang",
  },
  en: {
    title: "Sign in to your account to continue",
    email: "Email",
    password: "Password",
    remember: "Remember me",
    forgot: "Forgot password?",
    submit: "Sign In",
    noAccount: "Don't have an account?",
    register: "Sign up now",
  },
} as const;

type Language = keyof typeof translations;

type FormState = {
  email: string;
  password: string;
};

export default function LoginView() {
  const [language, setLanguage] = useState<Language>("id");
  const [showPassword, setShowPassword] = useState(false);
  const [formState, setFormState] = useState<FormState>({ email: "", password: "" });
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
    setLoading(true);

    const result = await signIn("credentials", {
      email: formState.email,
      password: formState.password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      const message = result.error;
      setError(message);
      toast.error("Login gagal", { description: message });
      return;
    }

    toast.success("Login berhasil", { description: "Selamat datang kembali!" });

    router.replace("/dashboard");
    router.refresh();
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
            <p className="text-white/70">{t.title}</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="login-email" className="text-sm font-medium text-white/80">
                {t.email}
              </label>
              <div className="relative">
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={formState.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="input-focus w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-white/40 focus:outline-none"
                />
                <div className="absolute inset-y-0 right-4 flex items-center text-white/40">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14v7" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="login-password" className="text-sm font-medium text-white/80">
                {t.password}
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
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
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2 text-white/70">
                <input type="checkbox" className="h-4 w-4 rounded border-white/20 bg-white/10 text-primary focus:ring-2 focus:ring-primary" />
                <span>{t.remember}</span>
              </label>
              <Link href="#" className="font-medium text-primary transition-colors hover:text-blue-300">
                {t.forgot}
              </Link>
            </div>

            {error ? (
              <div className="rounded-xl border border-rose-400/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full transform rounded-xl bg-gradient-to-r from-primary to-secondary py-3 text-lg font-semibold text-white shadow-lg transition duration-300 hover:from-secondary hover:to-primary hover:scale-105 hover:shadow-primary/25 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Memproses..." : t.submit}
            </button>
          </form>

          <div className="mt-6 text-center text-white/70">
            <span>{t.noAccount}</span>
            <Link href="/register" className="ml-1 font-medium text-primary transition-colors hover:text-blue-300">
              {t.register}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}




