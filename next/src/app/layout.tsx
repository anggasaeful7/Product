import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { Inter } from 'next/font/google';
import './globals.css';
import { SessionProvider } from 'next-auth/react';
import { PostHogProvider } from '../providers/PostHogProvider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const description =
  'Angsflow: platform modern untuk kelola keuangan individu & tim, dengan budgeting, laporan, dan AI Coach.';

export const metadata: Metadata = {
  metadataBase: new URL('https://angsflow.com'),
  title: {
    default: 'Angsflow - Modern Financial Management Platform',
    template: '%s | Angsflow'
  },
  description,
  alternates: {
    canonical: '/'
  },
  openGraph: {
    title: 'Angsflow - Modern Financial Management',
    description,
    url: '/',
    siteName: 'Angsflow',
    images: [
      {
        url: '/AngsFlow.png',
        width: 1200,
        height: 630,
        alt: 'Angsflow hero illustration'
      }
    ],
    locale: 'id_ID',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Angsflow - Modern Financial Management',
    description,
    images: ['/AngsFlow.png']
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png'
  },
  manifest: '/site.webmanifest'
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const hdrs = await headers();
  const nonce = hdrs.get('x-nonce') || undefined;
  const requestId = hdrs.get('x-request-id') || undefined;

  return (
    <html lang="id" className={inter.variable}>
      <head>
        <meta name="x-request-id" content={requestId} />
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
      </head>
      <body className={`${inter.className} font-inter bg-dark text-white`} data-nonce={nonce}>
        <PostHogProvider>
          <SessionProvider>{children}</SessionProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
