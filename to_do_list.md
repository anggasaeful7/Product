# Angsflow — Build To‑Do Checklist (Web MVP)

> Stack: Next.js 15 (App Router) • Prisma • Postgres (Supabase) • Auth.js • OpenAI • **Supabase Storage** • **FCM** • Stripe → Midtrans (R2) • Vercel (cron) • Sentry • PostHog • OTel  
> Gunakan daftar ini sebagai sumber tunggal isu GitHub/Linear.

---

## 0) Project Foundation
- [ ] **Repo setup & kode dasar** — Owner: FE Lead  
  DoD: monorepo/SPA siap, TypeScript strict, pnpm, lint+prettier.
- [ ] **CI/CD** — Owner: DevOps  
  DoD: build+lint+test di PR; deploy preview Vercel; main → prod.
- [ ] **Config env** — Owner: BE Lead  
  DoD: `.env.example` lengkap (DB_URL, AUTH_SECRET, OPENAI_KEY, STRIPE, SUPABASE, FCM), Vercel env alias.
- [ ] **Security headers** — Owner: BE  
  DoD: HSTS, CSP (nonce via next/headers), Referrer-Policy, X-Frame-Options.
- [ ] **Error & analytics** — Owner: Platform  
  DoD: Sentry init (server+client), PostHog events dasar, request-id logger.

---

## 1) Database & Prisma
- [ ] **Prisma schema inti** (User, Account, Membership, Invitation, Category, Transaction, Budget, MonthlyReport, AIConversation, AIUsage, Subscription, PaymentIntent, Notification, Device, Attachment, AuditLog, SystemConfig). — Owner: BE  
  DoD: model + index + enum sesuai SRS; migrasi `001_init` berjalan.
- [ ] **Seed dev** — Owner: BE  
  DoD: 1 akun personal & 1 org; kategori contoh; 50 transaksi mock.
- [ ] **Soft delete & idempotency** — Owner: BE  
  DoD: kolom `deletedAt`; middleware cek `Idempotency-Key` untuk create.

---

## 2) Auth & Onboarding
- [ ] **Auth.js email/password (argon2id+pepper)** — Owner: BE  
  DoD: register/login/logout; verifikasi email (token hash+expiry); reset password; throttle.
- [ ] **Onboarding wizard** (Personal/Org) — Owner: FE  
  DoD: buat `Account`, set preferensi (locale, theme), checklist aktivasi.
- [ ] **Session guard & RBAC hook** — Owner: FE  
  DoD: server-side RBAC per route handler; react hook `useRole()`.

---

## 3) Ledger: Categories & Transactions
- [ ] **CRUD Category** — Owner: FE+BE  
  DoD: form, validasi, archive; konsistensi `type`.
- [ ] **List & Filter Transactions** — Owner: FE  
  DoD: tabel + pencarian + filter tanggal/kategori/user; cursor pagination.
- [ ] **Create/Update/Delete Transaction** — Owner: FE+BE  
  DoD: quick-add modal; validasi `Category.type`; soft delete.
- [ ] **Import CSV (R2)** — Owner: FE+BE  
  DoD: upload → preview → mapping kolom → validasi → commit; error log.

---

## 4) Budget
- [ ] **CRUD Budget** — Owner: FE+BE  
  DoD: unique (accountId, categoryId, month, year); progress bar.
- [ ] **Alert 80%/100%** — Owner: BE  
  DoD: recalculation on txn create/update; enqueue Notification + FCM.

---

## 5) Reports & AI Summary
- [ ] **Monthly aggregation** — Owner: BE  
  DoD: hitung income/expense/top categories/MoM (boundary **WIB**); simpan `MonthlyReport` idempoten.
- [ ] **AI Summary service** — Owner: BE  
  DoD: prompt templating, cache key (accountId, month, year, model, version), retry policy.
- [ ] **Cron scheduler (Vercel)** — Owner: DevOps  
  DoD: job **00:00 UTC (07:00 WIB)** memicu generate + email/FCM.
- [ ] **Report UI** — Owner: FE  
  DoD: halaman report bulan berjalan & sebelumnya; badge “New”.

---

## 6) Notifications (In-App + FCM)
- [ ] **Model `Notification` & inbox UI** — Owner: FE+BE  
  DoD: list read/unread; tandai read.
- [ ] **Integrasi FCM client (Web Push)** — Owner: FE  
  DoD: service worker, permission flow, penyimpanan `fcmToken` → `/devices/register`.
- [ ] **FCM server sender** — Owner: BE  
  DoD: kirim ke `user_{id}` & `account_{id}` topik; retry + DLQ sederhana (job table).
- [ ] **Trigger events** — Owner: BE  
  DoD: on invite, monthly report ready, budget 100%.

---

## 7) Storage (Supabase Storage)
- [ ] **Bucket & policy** — Owner: BE  
  DoD: `attachments`, `exports`, `avatars` (private); policy via service role/RLS.
- [ ] **Signed upload URL** — Owner: BE  
  DoD: endpoint signed URL; validasi mime/size/checksum di callback.
- [ ] **Attachment UI** — Owner: FE  
  DoD: unggah, tampilkan thumbnail/ikon; akses via signed URL (expiry).
- [ ] **Housekeeping job** — Owner: BE  
  DoD: hapus file orphan; rotasi export 30–90 hari.

---

## 8) Export & Recurring
- [ ] **Export CSV** — Owner: BE  
  DoD: kolom konsisten (ISO date, amount desimal, kategori id/nama); download.
- [ ] **Export PDF** — Owner: BE  
  DoD: template laporan dengan pagination & ringkasan; cache.
- [ ] **Recurring Transactions** — Owner: BE  
  DoD: definisi template, anchor date **WIB**, policy end-of-month; worker generate instance.

---

## 9) Organization & RBAC
- [ ] **Invitations** — Owner: FE+BE  
  DoD: kirim email undangan; accept/expire; pending seat untuk Team.
- [ ] **Role management** — Owner: FE+BE  
  DoD: ADMIN ubah MEMBER; OWNER transfer ownership (2 langkah).
- [ ] **Switcher Personal/Org** — Owner: FE  
  DoD: quick switch + context-aware breadcrumbs.

---

## 10) Billing (Stripe → Midtrans R2)
- [ ] **Checkout Pro/Team (Stripe)** — Owner: BE  
  DoD: buat sesi checkout; kembali dengan status.
- [ ] **Webhook & idempotensi** — Owner: BE  
  DoD: verifikasi signature; update `Subscription`; audit log.
- [ ] **Seat-based Team** — Owner: BE  
  DoD: hitung kursi dari Membership aktif + undangan pending.
- [ ] **Grace period & downgrade** — Owner: BE  
  DoD: 7 hari gagal bayar; turunkan plan tanpa kunci data.
- [ ] **Midtrans (R2)** — Owner: BE  
  DoD: provider abstraction + signature check.

---

## 11) UX & Growth Loops
- [ ] **Activation checklist** — Owner: FE  
  DoD: progres 0→100% (buat 1 kategori, 5 transaksi, 1 budget, 1 report view).
- [ ] **Empty states edukatif** — Owner: FE  
  DoD: contoh data/ilustrasi; CTA jelas.
- [ ] **Email monthly report (Pro/Team)** — Owner: BE  
  DoD: template transactional, CTA ke dashboard (deep link).

---

## 12) Observability & Perf
- [ ] **OTel tracing** — Owner: Platform  
  DoD: trace untuk transaksi list/create, budget update, cron.
- [ ] **Metrics SLA** — Owner: Platform  
  DoD: p95 < 600ms; p99 < 1.2s; dashboard SLO.
- [ ] **Load test** — Owner: QA  
  DoD: 100 RPS burst; tidak ada error 5xx; DB pool sehat.

---

## 13) Security & Compliance
- [ ] **Password policy & breach check** — Owner: BE  
  DoD: min 10 char; keyboard-walk blacklist; opsi pwned check.
- [ ] **Rate-limit** — Owner: BE  
  DoD: per-IP & per-user; bucket khusus `/ai/*`.
- [ ] **DSR endpoints** — Owner: BE  
  DoD: export/delete account data; proses terlog.
- [ ] **AuditLog** — Owner: BE  
  DoD: catat tindakan sensitif (billing, role, report regen).

---

## 14) Testing & QA
- [ ] **Unit tests** (Vitest) — Owner: QA  
  DoD: util/service kritikal ≥80% coverage.
- [ ] **Integration tests** — Owner: QA  
  DoD: API + Prisma test DB; skenario CRUD & RBAC.
- [ ] **E2E** (Playwright) — Owner: QA  
  DoD: alur transaksi → budget → report; login flows; invitation.
- [ ] **Security checks** — Owner: QA  
  DoD: dep audit, header scan, brute-force simulation.

---

## 15) Go-Live
- [ ] **Feature flags** MVP on — Owner: PM/Tech Lead  
  DoD: hanya fitur S1–S4 aktif di prod.
- [ ] **Runbook incident** — Owner: DevOps  
  DoD: eskalasi, RPO/RTO prosedur, backup/restore drill.
- [ ] **Beta privat** — Owner: PM  
  DoD: cohort 20–50 user; feedback loop; telemetry siap.

---

### Lampiran — Struktur Direktori & Issue Template
**Struktur app (ringkas):**
```
src/
  app/
    (auth)/...
    (dashboard)/...
    api/
      accounts/[accountId]/...
      billing/...
      devices/...
      reports/...
  lib/ (auth, db, ai, billing, storage, fcm)
  components/
  hooks/
  middleware.ts
```

**Issue template (contoh):**
- **Title:** [FE] Transactions — list + filter + pagination  
- **Context:** User butuh melihat transaksi dengan filter efisien.  
- **Acceptance:** tampil data, filter tanggal/kategori/user, cursor, p95 < 600ms.  
- **Test:** e2e case transaksi 1000 baris; filter kombinasi.  
- **Notes:** gunakan server actions + suspense; jangan `SELECT *`.

