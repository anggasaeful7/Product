'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type MetricAccent = 'emerald' | 'rose' | 'primary';

type HeroMetric = {
  title: string;
  value?: string;
  change?: string;
  description?: string;
  accent: MetricAccent;
  icon: string;
};

type FeatureGroup = {
  title: string;
  color: 'blue' | 'emerald' | 'purple';
  icon: string;
  bullets: string[];
};

type PlanTier = 'free' | 'pro' | 'team';

type Plan = {
  name: string;
  price: string;
  period: string;
  tagline: string;
  cta: string;
  tier: PlanTier;
  featured?: boolean;
  features: Array<{ text: string; available: boolean }>;
};

type Stat = {
  value: string;
  label: string;
  color: 'primary' | 'emerald' | 'purple' | 'yellow';
};

type CompanyValue = {
  title: string;
  description: string;
  color: 'blue' | 'emerald' | 'purple';
  icon: string;
};

type TeamMember = {
  initials: string;
  name: string;
  role: string;
  subtitle: string;
  gradient: 'blue' | 'emerald' | 'purple';
};

type FooterColumn = {
  title: string;
  links: Array<{ label: string; href: string }>;
};

const navLinks = [
  { href: '#features', label: 'Fitur' },
  { href: '#pricing', label: 'Harga' },
  { href: '#about', label: 'Tentang' }
];

const heroMetrics: HeroMetric[] = [
  {
    title: 'Pemasukan',
    value: 'Rp 15.5M',
    change: '+12% dari bulan lalu',
    accent: 'emerald',
    icon: '💰'
  },
  {
    title: 'Pengeluaran',
    value: 'Rp 8.2M',
    change: '-5% dari target',
    accent: 'rose',
    icon: '📉'
  },
  {
    title: 'AI Insight',
    description: 'Biaya makan naik 25%, coba set budget Rp 1jt untuk bulan depan',
    accent: 'primary',
    icon: '🤖'
  }
];

const painPoints = [
  'Alat keuangan tercecer di Excel, catatan manual, dan app terpisah',
  'Analisis keuangan minim dan tidak mendalam',
  'Sulit berkolaborasi dengan tim atau keluarga'
];

const solutionPoints = [
  'Satu platform untuk semua: transaksi, budgeting, laporan',
  'AI Coach memberikan insight dan rekomendasi cerdas',
  'Kolaborasi tim dengan role-based access control'
];

const featureGroups: FeatureGroup[] = [
  {
    title: 'Dashboard Pribadi',
    color: 'blue',
    icon: '📊',
    bullets: [
      'Tracking kategori (Income, Fixed, Variable)',
      'Budgeting per kategori',
      'Reports & Charts real-time',
      'Export PDF/CSV'
    ]
  },
  {
    title: 'Kolaborasi Tim',
    color: 'emerald',
    icon: '🤝',
    bullets: [
      'Buat organisasi & undang member',
      'Role-based access (Owner/Admin/Member)',
      'Shared dashboard & kategori',
      'Org switcher untuk multi-tim'
    ]
  },
  {
    title: 'AI Coach',
    color: 'purple',
    icon: '🤖',
    bullets: [
      'Chat dengan AI untuk insight keuangan',
      'Monthly summary otomatis',
      'Rekomendasi budgeting cerdas',
      'Analisis kolektif untuk tim'
    ]
  }
];
const pricingPlans: Plan[] = [
  {
    name: 'Free',
    price: 'Rp 0',
    period: '/bulan',
    tagline: 'Untuk individu yang baru memulai',
    cta: 'Mulai Gratis',
    tier: 'free',
    features: [
      { text: 'Dashboard pribadi', available: true },
      { text: 'Kategori & budgeting', available: true },
      { text: 'Laporan dasar', available: true },
      { text: '5 pertanyaan AI/bulan', available: true },
      { text: 'Export PDF/CSV', available: false }
    ]
  },
  {
    name: 'Pro Individual',
    price: 'Rp 49K',
    period: '/bulan',
    tagline: 'Untuk profesional & freelancer',
    cta: 'Upgrade ke Pro',
    tier: 'pro',
    featured: true,
    features: [
      { text: 'Semua fitur Free', available: true },
      { text: 'Export PDF/CSV', available: true },
      { text: 'AI Chat unlimited', available: true },
      { text: 'Monthly report otomatis', available: true },
      { text: 'AI insight & rekomendasi', available: true }
    ]
  },
  {
    name: 'Pro Team',
    price: 'Rp 99K',
    period: '/bulan',
    tagline: 'Untuk tim & organisasi',
    cta: 'Mulai Team Plan',
    tier: 'team',
    features: [
      { text: 'Semua fitur Pro', available: true },
      { text: 'Buat organisasi', available: true },
      { text: 'Role-based access', available: true },
      { text: 'Analisis kolektif AI', available: true },
      { text: 'Multi-org switcher', available: true }
    ]
  }
];

const stats: Stat[] = [
  { value: '10K+', label: 'Active Users', color: 'primary' },
  { value: '500+', label: 'Organizations', color: 'emerald' },
  { value: '1M+', label: 'Transactions', color: 'purple' },
  { value: '99.9%', label: 'Uptime', color: 'yellow' }
];

const companyValues: CompanyValue[] = [
  {
    title: 'Simplicity First',
    description:
      'Teknologi canggih harus mudah digunakan. Kami mengutamakan pengalaman yang intuitif dan tidak membingungkan.',
    color: 'blue',
    icon: '✨'
  },
  {
    title: 'Collaboration',
    description:
      'Keuangan bukan tugas satu orang. Kami membangun fitur yang memudahkan kolaborasi lintas tim dan keluarga.',
    color: 'emerald',
    icon: '🤝'
  },
  {
    title: 'Innovation',
    description:
      'Kami terus berinovasi dengan AI dan teknologi terdepan untuk memberikan insight yang tidak bisa didapat di tempat lain.',
    color: 'purple',
    icon: '🚀'
  }
];

const teamMembers: TeamMember[] = [
  { initials: 'AP', name: 'Finding', role: 'CEO & Co-Founder', subtitle: '-', gradient: 'blue' },
  { initials: 'AS', name: 'Angga Saeful', role: 'Dreamer', subtitle: 'Software Engineer', gradient: 'emerald' },
  { initials: 'SP', name: 'Finding', role: 'Head of Product', subtitle: '-', gradient: 'purple' }
];

const footerColumns: FooterColumn[] = [
  {
    title: 'Produk',
    links: [
      { label: 'Fitur', href: '#features' },
      { label: 'Harga', href: '#pricing' },
      { label: 'API', href: '#' },
      { label: 'Integrasi', href: '#' }
    ]
  },
  {
    title: 'Dukungan',
    links: [
      { label: 'Help Center', href: '#' },
      { label: 'Kontak', href: '#' },
      { label: 'Status', href: '#' },
      { label: 'Blog', href: '#' }
    ]
  }
];
const metricStyles: Record<MetricAccent, { card: string; icon: string; change: string }> = {
  emerald: {
    card:
      'bg-gradient-to-br from-emerald-500/20 to-green-600/20 border border-emerald-400/30 hover:border-emerald-400/60',
    icon: 'text-emerald-400',
    change: 'text-emerald-300'
  },
  rose: {
    card: 'bg-gradient-to-br from-rose-500/20 to-red-600/20 border border-rose-400/30 hover:border-rose-400/60',
    icon: 'text-rose-400',
    change: 'text-rose-300'
  },
  primary: {
    card: 'bg-gradient-to-br from-primary/20 to-blue-600/20 border border-primary/30 hover:border-primary/60',
    icon: 'text-primary',
    change: 'text-primary/70'
  }
};

const featureStyles: Record<FeatureGroup['color'], { card: string; iconBg: string; bullet: string }> = {
  blue: {
    card: 'hover:border-primary/50',
    iconBg: 'from-primary/20 to-blue-600/20',
    bullet: 'bg-primary'
  },
  emerald: {
    card: 'hover:border-emerald-400/50',
    iconBg: 'from-emerald-500/20 to-green-600/20',
    bullet: 'bg-emerald-400'
  },
  purple: {
    card: 'hover:border-purple-400/50',
    iconBg: 'from-purple-500/20 to-indigo-600/20',
    bullet: 'bg-purple-400'
  }
};

const statStyles: Record<Stat['color'], { wrapper: string; value: string }> = {
  primary: { wrapper: 'bg-primary/10 border border-primary/20', value: 'gradient-text' },
  emerald: { wrapper: 'bg-emerald-500/10 border border-emerald-400/20', value: 'text-emerald-400' },
  purple: { wrapper: 'bg-purple-500/10 border border-purple-400/20', value: 'text-purple-400' },
  yellow: { wrapper: 'bg-yellow-500/10 border border-yellow-400/20', value: 'text-yellow-400' }
};

const valueStyles: Record<CompanyValue['color'], { card: string; iconBg: string }> = {
  blue: {
    card: 'hover:border-primary/50',
    iconBg: 'from-primary/20 to-blue-600/20'
  },
  emerald: {
    card: 'hover:border-emerald-400/50',
    iconBg: 'from-emerald-500/20 to-green-600/20'
  },
  purple: {
    card: 'hover:border-purple-400/50',
    iconBg: 'from-purple-500/20 to-indigo-600/20'
  }
};

const teamGradients: Record<TeamMember['gradient'], string> = {
  blue: 'from-primary to-secondary',
  emerald: 'from-emerald-500 to-green-600',
  purple: 'from-purple-500 to-indigo-600'
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}
export default function HomePage() {
  const [navShadow, setNavShadow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setNavShadow(window.scrollY > 100);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '-2s' }} />
        <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-indigo-500/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '-4s' }} />
      </div>

      <nav
        className={cn(
          'fixed top-0 w-full z-50 transition-all duration-300',
          navShadow ? 'glass-effect shadow-2xl backdrop-blur-xl bg-slate-900/80 border-b border-white/10' : 'glass-effect'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <div className="relative mr-4">
                <Image src="/AngsFlow.png" alt="AngsFlow Logo" width={80} height={80} priority className="h-12 w-auto md:h-20 object-contain" />
              </div>
              <span className="text-3xl font-bold tracking-tight">
                Angs<span className="gradient-text">Flow</span>
              </span>
            </div>
            <div className="hidden md:flex space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-white/80 hover:text-primary transition-all duration-300 font-medium relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </div>
            <div className="flex space-x-4">
              <Link href="/login" className="text-white/80 hover:text-primary transition-all duration-300 font-medium px-4 py-2">
                Masuk
              </Link>
              <Link
                href="/register"
                className="bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white px-6 py-2.5 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-primary/25 transform hover:scale-105"
              >
                Daftar Gratis
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="animate-slide-up">
            <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
              Kelola Keuangan <br />
              <span className="gradient-text">Modern</span> & <span className="gradient-text">Kolaboratif</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-4xl mx-auto leading-relaxed">
              Satukan pencatatan transaksi, budgeting, dan laporan AI untuk individu maupun tim.
              <br className="hidden md:block" />
              Tidak lagi tercecer di Excel atau catatan manual!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Link
              href="/register"
              className="group bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white px-10 py-5 rounded-full text-xl font-bold transition-all duration-300 shadow-2xl hover:shadow-primary/50 transform hover:scale-105 hover:-translate-y-1"
            >
              <span className="flex items-center justify-center">
                Mulai Gratis Sekarang
                <svg className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
            <a
              href="#features"
              className="glass-effect text-white hover:bg-white/20 px-10 py-5 rounded-full text-xl font-bold transition-all duration-300 border border-white/30 hover:border-primary/50 transform hover:scale-105"
            >
              Lihat Demo
            </a>
          </div>

          <div className="relative animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="glass-effect rounded-3xl p-8 max-w-6xl mx-auto shadow-2xl border border-white/20">
              <div className="grid md:grid-cols-3 gap-8">
                {heroMetrics.map((metric) => {
                  const styles = metricStyles[metric.accent];
                  return (
                    <div
                      key={metric.title}
                      className={cn(
                        'group rounded-2xl p-8 transition-all duration-300 hover:transform hover:scale-105',
                        styles.card
                      )}
                    >
                      <div className={cn('text-4xl mb-4 transition-transform group-hover:scale-110', styles.icon)}>{metric.icon}</div>
                      <h3 className="font-bold text-white text-lg mb-3">{metric.title}</h3>
                      {metric.value ? (
                        <>
                          <p className="text-3xl font-bold text-white mb-2">{metric.value}</p>
                          {metric.change ? <div className={cn('text-sm', styles.change)}>{metric.change}</div> : null}
                        </>
                      ) : (
                        <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                          <p className="text-white/90 text-sm leading-relaxed">{metric.description}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-primary/30 rounded-full animate-float" />
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-emerald-400/30 rounded-full animate-float" style={{ animationDelay: '-1s' }} />
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-indigo-900" />
        <div className="relative max-w-7xl mx-auto px-4 z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="animate-slide-up">
                <h2 className="text-4xl md:text-5xl font-bold mb-8">
                  Masalah yang <span className="gradient-text">Sering Dialami</span>
                </h2>
                <div className="space-y-6">
                  {painPoints.map((item) => (
                    <div
                      key={item}
                      className="group flex items-start space-x-4 p-6 rounded-2xl bg-red-500/10 border border-red-500/20 hover:border-red-400/40 transition-all duration-300"
                    >
                      <div className="bg-red-500/20 text-red-400 rounded-full p-3 group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <p className="text-white/90 text-lg leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <h2 className="text-4xl md:text-5xl font-bold mb-8">
                  Solusi <span className="gradient-text">Angsflow</span>
                </h2>
                <div className="space-y-6">
                  {solutionPoints.map((item) => (
                    <div
                      key={item}
                      className="group flex items-start space-x-4 p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 hover:border-emerald-400/40 transition-all duration-300"
                    >
                      <div className="bg-emerald-500/20 text-emerald-400 rounded-full p-3 group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 011.414 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <p className="text-white/90 text-lg leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900" />
        <div className="relative max-w-7xl mx-auto px-4 z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Fitur <span className="gradient-text">Unggulan</span>
            </h2>
            <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto">
              Semua yang Anda butuhkan untuk mengelola keuangan modern
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {featureGroups.map((group) => {
              const styles = featureStyles[group.color];
              return (
                <div
                  key={group.title}
                  className={cn(
                    'group glass-effect rounded-3xl p-8 border border-white/20 transition-all duration-500 hover:transform hover:scale-105 hover:-translate-y-2',
                    styles.card
                  )}
                >
                  <div
                    className={cn(
                      'bg-gradient-to-br rounded-2xl w-20 h-20 flex items-center justify-center text-4xl mb-8 mx-auto md:mx-0 group-hover:scale-110 transition-transform',
                      styles.iconBg
                    )}
                  >
                    {group.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-6">{group.title}</h3>
                  <ul className="space-y-4 text-white/80">
                    {group.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-center">
                        <div className={cn('w-2 h-2 rounded-full mr-3', styles.bullet)} />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <section id="pricing" className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-900 to-blue-900" />
        <div className="relative max-w-7xl mx-auto px-4 z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Pilih Plan yang <span className="gradient-text">Tepat</span>
            </h2>
            <p className="text-xl md:text-2xl text-white/80">Mulai gratis, upgrade kapan saja</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={cn('relative group', plan.featured ? '' : 'glass-effect rounded-3xl p-8 border border-white/20 transition-all duration-500 hover:transform hover:scale-105')}
              >
                {plan.featured ? (
                  <div className="relative glass-effect rounded-3xl p-8 border border-primary/50 transform scale-105">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-glow" />
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <div className="bg-gradient-to-r from-accent to-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                        POPULER
                      </div>
                    </div>
                    <PlanCard plan={plan} />
                  </div>
                ) : (
                  <PlanCard plan={plan} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-gray-900 to-indigo-900" />
        <div className="relative max-w-7xl mx-auto px-4 z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Tentang <span className="gradient-text">Angsflow</span>
            </h2>
            <p className="text-xl md:text-2xl text-white/80 max-w-4xl mx-auto">
              Kami percaya bahwa mengelola keuangan seharusnya mudah, cerdas, dan kolaboratif
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            <div className="space-y-8">
              <div className="animate-slide-up">
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Misi Kami: <span className="gradient-text">Democratize Financial Intelligence</span>
                </h3>
                <p className="text-lg text-white/80 leading-relaxed mb-6">
                  Angsflow lahir dari frustrasi tim kami yang sering kesulitan mengelola keuangan bisnis dan pribadi. Spreadsheet yang berantakan, aplikasi terpisah-pisah, dan tidak ada insight yang actionable.
                </p>
                <p className="text-lg text-white/80 leading-relaxed">
                  Kami membangun platform yang menggabungkan kemudahan penggunaan, kekuatan AI, dan kolaborasi tim dalam satu tempat. Karena setiap orang berhak mendapat financial intelligence yang powerful.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="glass-effect rounded-3xl p-8 border border-white/20">
                <div className="grid grid-cols-2 gap-6">
                  {stats.map((stat) => {
                    const styles = statStyles[stat.color];
                    return (
                      <div key={stat.label} className={cn('text-center p-6 rounded-2xl', styles.wrapper)}>
                        <div className={cn('text-4xl font-bold mb-2', styles.value)}>{stat.value}</div>
                        <p className="text-white/80">{stat.label}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-20">
            <h3 className="text-4xl font-bold text-white text-center mb-12">Nilai-Nilai Kami</h3>
            <div className="grid md:grid-cols-3 gap-8">
              {companyValues.map((value) => {
                const styles = valueStyles[value.color];
                return (
                  <div
                    key={value.title}
                    className={cn('group glass-effect rounded-3xl p-8 border border-white/20 transition-all duration-500 text-center', styles.card)}
                  >
                    <div
                      className={cn(
                        'bg-gradient-to-br rounded-2xl w-20 h-20 flex items-center justify-center text-4xl mb-6 mx-auto group-hover:scale-110 transition-transform',
                        styles.iconBg
                      )}
                    >
                      {value.icon}
                    </div>
                    <h4 className="text-2xl font-bold text-white mb-4">{value.title}</h4>
                    <p className="text-white/80 leading-relaxed">{value.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-4xl font-bold text-white mb-12">Tim Kami</h3>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {teamMembers.map((member) => (
                <div key={member.initials} className="group text-center">
                  <div className="relative mb-6">
                    <div
                      className={cn(
                        'w-32 h-32 rounded-full mx-auto flex items-center justify-center text-4xl text-white font-bold group-hover:scale-110 transition-transform bg-gradient-to-br',
                        teamGradients[member.gradient]
                      )}
                    >
                      {member.initials}
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-400 rounded-full border-4 border-slate-900" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">{member.name}</h4>
                  <p className={cn('font-semibold mb-2', member.gradient === 'emerald' ? 'text-emerald-400' : member.gradient === 'purple' ? 'text-purple-400' : 'text-primary')}>
                    {member.role}
                  </p>
                  <p className="text-white/70 text-sm">{member.subtitle}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 glass-effect rounded-2xl p-8 border border-white/20 max-w-3xl mx-auto">
              <p className="text-lg text-white/90 leading-relaxed italic">
                &ldquo;Kami membangun Angsflow bukan hanya sebagai produk, tapi sebagai solusi yang benar-benar kami butuhkan sendiri. Setiap fitur lahir dari pengalaman nyata mengelola keuangan tim dan bisnis.&rdquo;
              </p>
              <p className="text-primary font-semibold mt-4">- Tim Angsflow</p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-indigo-600" />
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-6xl mx-auto text-center px-4 z-10">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight">
            Siap Mengelola Keuangan dengan <span className="text-yellow-300">Lebih Cerdas?</span>
          </h2>
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto">
            Bergabung dengan ribuan pengguna yang sudah merasakan kemudahan Angsflow
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/register"
              className="group bg-white text-primary hover:bg-gray-100 px-10 py-5 rounded-full text-xl font-bold transition-all duration-300 shadow-2xl hover:shadow-white/25 transform hover:scale-105 hover:-translate-y-1"
            >
              <span className="flex items-center justify-center">
                Daftar Gratis Sekarang
                <svg className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
            <a
              href="mailto:hello@angsflow.com"
              className="glass-effect text-white hover:bg-white/20 px-10 py-5 rounded-full text-xl font-bold transition-all duration-300 border border-white/30 hover:border-white/60 transform hover:scale-105"
            >
              Hubungi Sales
            </a>
          </div>
        </div>
      </section>

      <footer className="relative bg-slate-900 text-white py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-gray-900 to-black" />
        <div className="relative max-w-7xl mx-auto px-4 z-10">
          <div className="grid lg:grid-cols-4 gap-12">
            <div className="lg:col-span-2">
              <div className="flex items-center mb-6">
                <div className="relative mr-4">
                  <Image src="/AngsFlow.png" alt="AngsFlow Logo" width={80} height={80} priority className="h-12 w-auto md:h-20 object-contain" />
                </div>
                <span className="text-3xl font-bold">
                  Angs<span className="gradient-text">Flow</span>
                </span>
              </div>
              <p className="text-white/70 text-lg leading-relaxed max-w-md">
                Modern financial management platform untuk individu dan tim. Kelola keuangan dengan cerdas, kolaboratif, dan didukung AI.
              </p>
            </div>

            {footerColumns.map((column) => (
              <div key={column.title}>
                <h4 className="font-bold text-xl mb-6 text-white">{column.title}</h4>
                <ul className="space-y-3">
                  {column.links.map((item) => (
                    <li key={item.label}>
                      <a href={item.href} className="text-white/70 hover:text-primary transition-colors text-lg">
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-white/20 mt-12 pt-8 text-center">
            <p className="text-white/60 text-lg">&copy; 2025 Angsflow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
type PlanCardProps = {
  plan: Plan;
};

function PlanCard({ plan }: PlanCardProps) {
  return (
    <div className="relative glass-effect rounded-3xl p-8 border border-white/20 transition-all duration-500 hover:transform hover:scale-105">
      {!plan.featured && <div className="absolute inset-0 rounded-3xl pointer-events-none" />}
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-white mb-4">{plan.name}</h3>
        <p className="text-white/70 mb-6">{plan.tagline}</p>
        <div className={cn('text-5xl font-bold mb-2', plan.featured ? 'gradient-text' : 'text-white')}>{plan.price}</div>
        <p className="text-white/60">{plan.period}</p>
      </div>
      <ul className="space-y-4 mb-8">
        {plan.features.map((feature) => (
          <li key={feature.text} className={cn('flex items-center', feature.available ? 'text-white/90' : 'text-white/50')}>
            <svg className={cn('w-5 h-5 mr-3', feature.available ? 'text-emerald-400' : 'text-gray-500')} fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d={
                  feature.available
                    ? 'M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                    : 'M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                }
                clipRule="evenodd"
              />
            </svg>
            {feature.text}
          </li>
        ))}
      </ul>
      <button
        type="button"
        className={cn(
          'w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 group-hover:scale-105',
          plan.tier === 'free' && 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
          plan.tier === 'pro' && 'bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white shadow-lg hover:shadow-primary/50',
          plan.tier === 'team' && 'border-2 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white'
        )}
      >
        {plan.cta}
      </button>
    </div>
  );
}






