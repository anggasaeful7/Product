import Link from 'next/link';

const quickLinks = [
  { label: 'Kembali ke Beranda', href: '/', accent: 'from-primary to-secondary' },
  { label: 'Lihat Pricing', href: '/#pricing', accent: 'from-emerald-500 to-green-600' },
  { label: 'Mulai Login', href: '/login', accent: 'from-purple-500 to-indigo-600' }
];

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '-2s' }} />
        <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-indigo-500/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '-4s' }} />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col items-center px-6 py-16 text-center">
        <div className="glass-effect rounded-3xl border border-white/10 px-8 py-6 text-sm text-white/70 shadow-lg backdrop-blur">
          <span className="font-semibold text-primary">404</span>
          <span className="mx-2">&bull;</span>
          <span>Halaman tidak ditemukan</span>
        </div>

        <div className="mt-12 animate-number-bounce text-[min(18vw,12rem)] font-extrabold leading-none text-white">
          404
        </div>

        <h1 className="mt-10 text-4xl font-bold md:text-5xl">
          Ups! Sepertinya halaman yang kamu cari{' '}
          <span className="gradient-text">hilang di dunia finansial</span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-white/70">
          Kami tidak dapat menemukan halaman yang kamu tuju. Coba gunakan pencarian atau kembali ke beranda untuk melihat fitur-fitur Angsflow lainnya.
        </p>

        <form className="mt-10 w-full max-w-xl">
          <label htmlFor="search" className="sr-only">
            Cari konten Angsflow
          </label>
          <div className="relative">
            <input
              id="search"
              type="search"
              placeholder="Cari fitur, artikel, atau bantuan..."
              className="w-full rounded-2xl border border-white/10 bg-white/10 px-6 py-4 pr-24 text-white placeholder:text-white/40 focus:border-primary focus:outline-none"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl bg-gradient-to-r from-primary to-secondary px-5 py-2 text-sm font-semibold text-white shadow-lg transition hover:opacity-90"
            >
              Cari
            </button>
          </div>
        </form>

        <div className="mt-12 grid w-full max-w-3xl gap-6 md:grid-cols-3">
          {quickLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="glass-effect block rounded-2xl border border-white/10 p-6 text-left transition hover:border-white/30"
            >
              <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${link.accent} text-white shadow-lg`}>
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
              <p className="font-semibold">{link.label}</p>
              <p className="mt-2 text-sm text-white/60">
                Terhubung kembali dengan fitur utama Angsflow hanya dengan sekali klik.
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-16 glass-effect w-full max-w-4xl rounded-3xl border border-white/10 p-10 text-left">
          <h2 className="text-2xl font-semibold">Butuh bantuan cepat?</h2>
          <p className="mt-3 text-white/70">
            Tim Support kami siap membantu kamu menemukan apa yang dibutuhkan. Kirim pesan dan kami akan segera menindaklanjutinya.
          </p>
          <div className="mt-6 flex flex-col gap-4 md:flex-row">
            <a
              href="mailto:hello@angsflow.com"
              className="flex-1 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-3 text-center font-semibold text-white shadow-lg transition hover:opacity-90"
            >
              Kirim Email ke Support
            </a>
            <Link
              href="/"
              className="flex-1 rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-center font-semibold text-white transition hover:border-white/40"
            >
              Lihat Dokumentasi
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
