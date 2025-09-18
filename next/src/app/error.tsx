"use client";

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const [timestamp, setTimestamp] = useState('');
  const errorId = useMemo(() => `AF-500-${new Date().getFullYear()}-${Math.random().toString().slice(2, 8)}`, []);

  useEffect(() => {
    setTimestamp(new Date().toLocaleString('id-ID'));
  }, []);

  return (
    <html lang="id">
      <body className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-float" />
          <div className="absolute top-1/2 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '-2s' }} />
          <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-indigo-500/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '-4s' }} />
        </div>

        <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col items-center px-6 py-16 text-center">
          <div className="glass-effect rounded-3xl border border-white/10 px-8 py-6 text-sm text-white/70 shadow-lg backdrop-blur">
            <span className="font-semibold text-rose-400">500</span>
            <span className="mx-2">&bull;</span>
            <span>Internal Server Error</span>
          </div>

          <div className="mt-12 animate-number-bounce text-[min(18vw,12rem)] font-extrabold leading-none text-white">
            500
          </div>

          <h1 className="mt-10 text-4xl font-bold md:text-5xl">
            Ada yang tidak beres di server kami.{' '}
            <span className="gradient-text">Tim kami sudah bergerak!</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-white/70">
            Kami mendeteksi gangguan tak terduga pada sistem Angsflow. Tenang, data kamu aman dan tim engineering kami sedang melakukan perbaikan.
          </p>

          <div className="mt-10 grid w-full gap-6 md:grid-cols-3">
            <div className="glass-effect rounded-2xl border border-white/10 p-6 text-left">
              <p className="text-sm text-white/50">Timestamp</p>
              <p className="mt-2 text-lg font-semibold">{timestamp}</p>
            </div>
            <div className="glass-effect rounded-2xl border border-white/10 p-6 text-left">
              <p className="text-sm text-white/50">Error ID</p>
              <p className="mt-2 text-lg font-semibold">{errorId}</p>
            </div>
            <div className="glass-effect rounded-2xl border border-white/10 p-6 text-left">
              <p className="text-sm text-white/50">Detail</p>
              <p className="mt-2 break-words text-sm text-white/70">{error.message || 'Terjadi kesalahan tak terduga.'}</p>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-4 md:flex-row">
            <button
              type="button"
              onClick={() => reset()}
              className="flex-1 rounded-xl bg-gradient-to-r from-primary to-secondary px-6 py-3 text-center font-semibold text-white shadow-lg transition hover:opacity-90"
            >
              Coba Muat Ulang Halaman
            </button>
            <Link
              href="/"
              className="flex-1 rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-center font-semibold text-white transition hover:border-white/40"
            >
              Kembali ke Beranda
            </Link>
          </div>

          <div className="mt-10 text-sm text-white/50">
            Jika masalah berlanjut, hubungi{' '}
            <a href="mailto:hello@angsflow.com" className="text-primary hover:text-blue-300 font-medium">
              hello@angsflow.com
            </a>{' '}
            dan sertakan Error ID.
          </div>
        </div>
      </body>
    </html>
  );
}
