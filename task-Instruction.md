# Task Instruction — AngsFlow (End-to-End)

Dokumen ini berisi daftar tugas terurut dan terperinci untuk mewujudkan proyek AngsFlow dari awal hingga rilis produksi. Anda dapat meninjau dan memodifikasi sesuai kebutuhan.

## 0. Persiapan Proyek

1. Tetapkan tujuan rilis MVP, scope final, dan metrik keberhasilan (MAU ledger, open-rate email, dll.)
2. Buat backlog issuable (Epic → Story → Task) berdasarkan URD/DRD.
3. Tentukan environment: Local, Staging, Production (domain, DNS, secrets management).

## 1. Setup Repository & Tooling

1. Inisialisasi repo (GitHub/GitLab), branch protection, PR template.
2. Konfigurasi Node.js + PNPM/NPM, TypeScript, ESLint, Prettier, EditorConfig.
3. Tambahkan Husky + lint-staged, commitlint (konvensi commit).
4. Struktur monorepo opsional (apps/web, packages/ui) atau single app.

## 2. Arsitektur Aplikasi (FE/BE)

1. Framework: Next.js 14 (App Router), Tailwind, next-intl, next-themes.
2. Backend: Next.js Route Handlers (API), Prisma ORM, Zod validation.
3. Definisikan struktur folder (app/, lib/, components/, server/, schemas/).
4. Konfigurasi Tailwind (tema, warna, dark mode) & layout dasar.

## 3. Database & Prisma

1. Siapkan PostgreSQL untuk Staging/Prod (Railway/Render) + DATABASE_URL.
2. Tambahkan Prisma dan schema (sudah di UR.md) lalu jalankan migration init.
3. Buat seed data minimal (user admin, account contoh, kategori default).
4. Setup indeks khusus jika diperlukan (query berat, laporan).

## 4. Autentikasi & Session

1. Implementasi NextAuth (Credentials): login/register, hash argon2id.
2. Verifikasi email (token), reset password (token + expiry).
3. Middleware proteksi route, session JWT + rotasi.

## 5. Multi-tenant & RBAC

1. Model Account (PERSONAL/ORGANIZATION) + Membership (OWNER/ADMIN/MEMBER).
2. Middleware scoping by accountId (query param/header/context).
3. Guard server-side untuk semua endpoint (RBAC checks).

## 6. Fitur Inti Domain

1. Accounts & Invites
   - CRUD Account, switcher, undang member via email (Invitation + token)
   - Kelola Membership (ubah role, remove)
2. Categories
   - CRUD kategori (hierarki opsional), warna/ikon, aktif/non-aktif
3. Transactions
   - CRUD, filter/pagination, lampiran (URL S3), tag, pencarian
   - Dukungan recurring (RecurringTransaction) + scheduler nextRun
4. Budgets
   - CRUD per (accountId, categoryId, month, year)
   - Hitung spent, alert di 80%/100%, notifikasi
5. Reports
   - Aggregasi bulanan (income/expense, top kategori, MoM)
   - Persist ke MonthlyReport, export CSV/PDF

## 7. AI Coach & Summary

1. Chat AI (AIConversation): simpan messages, token usage, rate limit/plan limit.
2. Summary bulanan (cron): generate ringkasan + rekomendasi, simpan ke MonthlyReport.
3. Model & biaya: cache/cutoff, retry & fallback.

## 8. Billing & Subscription

1. Integrasi Stripe/Midtrans: checkout, portal, webhook status (active/past_due/canceled).
2. Gate fitur berdasarkan Subscription (FREE/PRO/TEAM_PRO).
3. UI Billing di Settings.

## 9. Upload & Storage

1. Integrasi S3-compatible (R2/MinIO/S3) untuk attachment struk.
2. Signed URL upload/download, validasi mime/ukuran, antivirus opsional.

## 10. Internationalization & Theme

1. i18n id/en (next-intl), date/number formatter lokal (IDR default).
2. Theme switcher (light/dark/system) dan persist preferensi user.

## 11. Email & Notifikasi

1. Email service (Resend/Mailgun): template Invite, Budget Alert, Monthly Summary.
2. Kirim email report bulanan (HTML/PDF), tracking open-rate (pixel).
3. In-app Notification model + UI badge/toast.

## 12. UI/UX Implementasi Halaman

1. Auth: login, register, forgot/reset, verifikasi.
2. Onboarding: pilih personal/organisasi, buat akun, kategori default.
3. Dashboard (Personal/Org): ringkasan, grafik, insight AI card.
4. Transactions: list/table, filter, quick add modal, upload struk.
5. Budgets: list, progress bar, create/edit, alert status.
6. Reports: timeline bulanan, detail, export CSV/PDF.
7. Members: undang, ubah role, hapus member.
8. Settings: profil, bahasa, tema, billing, keamanan.
9. AI Coach: chat UI, riwayat percakapan, indikator kuota.
10. System Pages: 404, 500, Maintenance, Terms/Privacy.

## 13. Keamanan & Kepatuhan

1. Validasi input (Zod), sanitasi, anti-XSS, rate limit auth/AI.
2. CSP headers, Secure cookies (HttpOnly, SameSite=Lax), password policy.
3. AuditLog untuk aksi sensitif (role change, billing, delete data).
4. PII minim, retensi log 30 hari, kebijakan penghapusan data.

## 14. Observability & Performa

1. Logging (pino), tracing (OTel), error tracking (Sentry), analytics (PostHog).
2. Cache & pagination pada daftar transaksi, indeks DB kritikal.
3. p95 target: API < 600ms, query < 300ms untuk dataset kecil.

## 15. Testing & QA

1. Unit test (Vitest) untuk util/service, coverage minimal 70%.
2. Integration test untuk API + DB (test db, Prisma migrate reset).
3. E2E (Playwright): alur add transaksi → budget update → generate report.
4. Load test ringan endpoint transaksi (100 RPS burst).

## 16. DevOps, CI/CD, & Infra

1. GitHub Actions: lint, test, build, prisma migrate deploy.
2. Secrets untuk env (DATABASE_URL, STRIPE, MAIL, S3, OPENAI, SENTRY, POSTHOG).
3. Deploy FE/BE ke Vercel; DB ke Railway/Render; Object storage ke S3-compatible.
4. Cron jobs (Vercel Cron/Cloudflare): summary bulanan @07:00 WIB.

## 17. Data Import/Export

1. Import CSV transaksi (R2), validasi, preview, commit bulk insert.
2. Export CSV/PDF untuk reports (Pro+), batching & streaming.

## 18. Aksesibilitas & SEO

1. WCAG 2.1 AA: keyboard navigation, aria-label, prefers-reduced-motion.
2. SEO dasar: robots.txt, sitemap.xml, og/meta tags, perf web vitals.

## 19. UAT, Peluncuran, & Rollback

1. Staging UAT: checklist fitur, regression test, security review.
2. Rencana rilis bertahap (feature flag) + monitoring ketat 48 jam pertama.
3. Rollback plan (migrate revert, feature flag off), status page & komunikasi.

## 20. Post-launch & Iterasi

1. Analisis metrik: MAU ledger, transaksi/akun, open-rate report, CSAT.
2. Iterasi backlog: pain point, performa, stabilitas, biaya AI.
3. Program growth: referral, edukasi budgeting, paket tahunan.

---

Checklist Akhir (Ringkas)

- Semua endpoint terproteksi RBAC & scoped accountId
- Prisma migrate deploy sukses di semua env
- Cron report bulanan berjalan, email terkirim, PDF valid
- Billing webhook menandai status subscription dengan benar
- Lampiran tersimpan aman (S3) dengan akses terkontrol
- E2E utama lulus (transaksi→budget→report)
- Error pages & Terms/Privacy tersedia dan terhubung
- Observability aktif: Sentry, PostHog, logs, alerts
- Dokumen runbook & incident response tersedia
