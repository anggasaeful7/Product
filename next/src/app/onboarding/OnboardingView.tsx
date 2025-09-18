"use client";

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const translations = {
  id: {
    title: 'Pilih Mode Penggunaan',
    subtitle: 'Bagaimana Anda ingin menggunakan Angsflow?',
    individualTitle: 'Individu',
    individualDesc: 'Kelola keuangan pribadi Anda dengan dashboard personal, budgeting, dan AI insights.',
    perfectFor: 'Cocok untuk freelancer & profesional',
    organizationTitle: 'Organisasi',
    organizationDesc: 'Buat organisasi untuk kolaborasi tim dengan role-based access dan shared dashboard.',
    perfectForTeam: 'Cocok untuk tim & startup',
    organizationName: 'Nama Organisasi',
    organizationHint: 'Nama ini akan terlihat oleh semua anggota tim',
    continue: 'Lanjutkan',
    successTitle: 'Selamat! Akun Berhasil Dibuat',
    successSubtitle: 'Mengalihkan ke dashboard dalam beberapa detik...',
    goDashboard: 'Masuk ke Dashboard'
  },
  en: {
    title: 'Choose Usage Mode',
    subtitle: 'How would you like to use Angsflow?',
    individualTitle: 'Individual',
    individualDesc: 'Manage your personal finances with personal dashboard, budgeting, and AI insights.',
    perfectFor: 'Perfect for freelancers & professionals',
    organizationTitle: 'Organization',
    organizationDesc: 'Create organization for team collaboration with role-based access and shared dashboard.',
    perfectForTeam: 'Perfect for teams & startups',
    organizationName: 'Organization Name',
    organizationHint: 'This name will be visible to all team members',
    continue: 'Continue',
    successTitle: 'Congrats! Your Account Is Ready',
    successSubtitle: 'Redirecting to dashboard in a few seconds...',
    goDashboard: 'Go to Dashboard'
  }
} as const;

type Language = keyof typeof translations;
type Mode = 'individual' | 'organization' | null;

export default function OnboardingView() {
  const [language, setLanguage] = useState<Language>('id');
  const [mode, setMode] = useState<Mode>(null);
  const [orgName, setOrgName] = useState('');
  const [stage, setStage] = useState<'select' | 'success'>('select');
  const router = useRouter();

  const copy = useMemo(() => translations[language], [language]);

  useEffect(() => {
    if (stage !== 'success') return;
    const timeout = window.setTimeout(() => {
      router.push('/dashboard');
    }, 3000);
    return () => window.clearTimeout(timeout);
  }, [stage, router]);

  const handleContinue = () => {
    if (!mode) return;
    if (mode === 'organization' && orgName.trim().length === 0) {
      window.alert(language === 'id' ? 'Nama organisasi harus diisi!' : 'Organization name is required');
      return;
    }
    setStage('success');
  };

  const canContinue = mode !== null && (mode !== 'organization' || orgName.trim().length > 0);

  if (stage === 'success') {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
        <AnimatedBackdrop />
        <div className="relative z-10 mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-6 text-center">
          <div className="glass-effect w-full rounded-3xl border border-emerald-400/40 p-10 shadow-2xl animate-fade-in">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20 animate-pulse-slow">
              <svg className="h-8 w-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold gradient-text">{copy.successTitle}</h1>
            <p className="mt-4 text-white/70">{copy.successSubtitle}</p>
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="mt-8 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-primary to-secondary px-6 py-3 font-semibold text-white shadow-lg transition hover:opacity-90"
            >
              {copy.goDashboard}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
      <AnimatedBackdrop />

      <div className="fixed top-6 right-6 z-50">
        <div className="glass-effect rounded-full p-2 border border-white/20">
          <select
            aria-label="Language selector"
            value={language}
            onChange={(event) => setLanguage(event.target.value as Language)}
            className="bg-transparent text-white text-sm font-medium border-none outline-none cursor-pointer"
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

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-3xl items-center px-4 py-12">
        <div className="glass-effect w-full rounded-3xl border border-white/20 p-8 shadow-2xl animate-slide-up">
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20 animate-glow">
              <Image src="/AngsFlow.png" alt="AngsFlow Logo" width={80} height={80} priority className="h-12 w-auto md:h-20 object-contain" />
            </div>
            <h1 className="text-3xl font-bold gradient-text">{copy.title}</h1>
            <p className="mt-3 text-white/70">{copy.subtitle}</p>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <ModeCard
              variant="individual"
              title={copy.individualTitle}
              description={copy.individualDesc}
              hint={copy.perfectFor}
              selected={mode === 'individual'}
              onClick={() => setMode('individual')}
              accent="from-primary/20 to-blue-600/20"
            />
            <ModeCard
              variant="organization"
              title={copy.organizationTitle}
              description={copy.organizationDesc}
              hint={copy.perfectForTeam}
              selected={mode === 'organization'}
              onClick={() => setMode('organization')}
              accent="from-emerald-500/20 to-green-600/20"
            />
          </div>

          {mode === 'organization' ? (
            <div className="mt-8 space-y-2 animate-slide-in">
              <label htmlFor="org-name" className="text-sm font-medium text-white/80">
                {copy.organizationName}
              </label>
              <input
                id="org-name"
                type="text"
                value={orgName}
                onChange={(event) => setOrgName(event.target.value)}
                placeholder={language === 'id' ? 'Contoh: Tim Keuangan Nusantara' : 'Example: Finance Team Nusantara'}
                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-white/40 focus:outline-none input-focus"
              />
              <p className="text-xs text-white/50">{copy.organizationHint}</p>
            </div>
          ) : null}

          <button
            type="button"
            disabled={!canContinue}
            onClick={handleContinue}
            className="mt-10 flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-primary to-secondary px-6 py-3 font-semibold text-white shadow-lg transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {copy.continue}
          </button>
        </div>
      </div>
    </div>
  );
}

function ModeCard({
  variant,
  title,
  description,
  hint,
  selected,
  onClick,
  accent
}: {
  variant: 'individual' | 'organization';
  title: string;
  description: string;
  hint: string;
  selected: boolean;
  onClick: () => void;
  accent: string;
}) {
  const icon =
    variant === 'individual' ? (
      <svg
        className={selected ? 'w-8 h-8 text-primary' : 'w-8 h-8 text-white/60'}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ) : (
      <svg
        className={selected ? 'w-8 h-8 text-emerald-400' : 'w-8 h-8 text-white/60'}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    );

  return (
    <button
      type="button"
      onClick={onClick}
      className={`glass-effect relative h-full rounded-2xl border p-6 text-left transition hover:border-white/30 focus:outline-none ${
        selected ? 'border-primary bg-primary/10' : 'border-white/20 bg-white/5'
      }`}
    >
      {selected ? (
        <div className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-white shadow-lg">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      ) : null}
      <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${accent} text-white shadow-lg`}>
        {icon}
      </div>
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <p className="mt-2 text-sm text-white/70">{description}</p>
      <p className="mt-4 inline-flex items-center rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-white/60">
        {hint}
      </p>
    </button>
  );
}

function AnimatedBackdrop() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-float" />
      <div className="absolute top-1/2 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '-2s' }} />
      <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-indigo-500/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '-4s' }} />
    </div>
  );
}
