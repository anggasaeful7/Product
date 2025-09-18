# Angsflow — Software Requirements Specification (SRS) v1.0

**Produk:** Angsflow — platform pencatatan keuangan + AI untuk individu & tim/organisasi  
**Tanggal:** 11 Sep 2025 (WIB)  
**Penulis:** Tim Angsflow  
**Status:** Draft untuk eksekusi MVP 90 hari  

---

## 0. Revisi Dokumen
| Versi | Tanggal | Perubahan | Penulis |
|---|---|---|---|
| 1.0 | 11 Sep 2025 | SRS awal, memasukkan Supabase Storage & FCM | Tim |

---

## 1. Pendahuluan
### 1.1 Tujuan
Dokumen ini mendeskripsikan kebutuhan fungsional dan non-fungsional aplikasi Angsflow, termasuk ruang lingkup, persona, fitur, arsitektur tingkat tinggi, integrasi eksternal (Supabase Storage, Firebase Cloud Messaging), dan kriteria penerimaan untuk MVP.

### 1.2 Ruang Lingkup
Aplikasi web (Next.js 15) dengan backend Route Handlers, Postgres (Supabase) via Prisma, autentikasi email+password, pencatatan transaksi, penganggaran (budget), laporan bulanan otomatis dengan ringkasan AI, kolaborasi organisasi (RBAC), ekspor data, billing (Stripe/Midtrans), notifikasi (FCM), dan penyimpanan berkas (Supabase Storage). Fokus awal Indonesia (IDR), bahasa Indonesia & Inggris.

### 1.3 Definisi & Akronim
- **Account**: ruang kerja personal/organisasi.  
- **Ledger**: kumpulan transaksi pada suatu Account.  
- **RBAC**: Role-Based Access Control (OWNER/ADMIN/MEMBER).  
- **NSM**: North Star Metric (*Monthly Active Ledgers*).  
- **FCM**: Firebase Cloud Messaging.  
- **UU PDP**: Undang-Undang Perlindungan Data Pribadi (ID).  

### 1.4 Referensi
- URD/DRD Pitch Pack v1.0 (30 Aug 2025).  
- Auth.js (Next-Auth) docs, Prisma, Supabase, Firebase FCM, Stripe, Midtrans, OpenAI.  

---

## 2. Gambaran Umum Produk
### 2.1 Persona & Kebutuhan
- Individu pemula: pencatatan sederhana, laporan ringkas.  
- Freelancer/creator: multi-klien, tagging, ekspor.  
- Keluarga: berbagi pengeluaran; kontrol akses.  
- Tim kecil/komunitas: kolaborasi, peran, laporan kolektif.  

### 2.2 Nilai Utama
Satu platform keuangan + AI yang membangun kebiasaan review bulanan melalui laporan otomatis dan insight kontekstual.

### 2.3 Asumsi & Ketergantungan
- Storage: Supabase Storage (bukan S3).  
- Notifikasi: Firebase Cloud Messaging (FCM).  
- AI: OpenAI API.  
- Billing: Stripe (awal) + Midtrans (Indonesia).  
- Hosting: Vercel (app + cron).  

---

## 3. Lingkungan Operasional
- **Web**: Browser modern (Chrome, Safari, Firefox, Edge).  
- **Server**: Vercel serverless/edge; Supabase (Postgres, Storage, Auth SMTP opsional), Firebase (FCM).  
- **Zona waktu**: default WIB; perhitungan laporan memakai boundary WIB.  

---

## 4. Batasan Desain
- Next.js 15 (App Router).  
- Prisma ORM.  
- Postgres (Supabase).  
- Supabase Storage untuk file (bucket terpisah per jenis).  
- FCM untuk push (web push via Service Worker; mobile klien di fase lanjutan).  
- Kepatuhan UU PDP (best-effort), HTTPS-only, CSP.  

---

## 5. Kelas Pengguna & Hak Akses
- **OWNER**: kontrol penuh; billing; transfer ownership.  
- **ADMIN**: mengelola anggota & kategori; melihat/ekspor laporan.  
- **MEMBER**: membuat/melihat transaksi sesuai scope; tidak mengubah role/billing.  

---

## 6. Fitur Utama (Ikhtisar)
1) **Auth & Onboarding** (email+password, verifikasi email, reset password).  
2) **Transactions & Categories** (CRUD, filter, lampiran).  
3) **Budgets** (target per kategori/bulan, alert 80%/100%).  
4) **Reports** (ringkasan bulanan; MoM; export CSV/PDF).  
5) **AI Coach & AI Summary** (chat kontekstual; ringkasan bulanan otomatis).  
6) **Organization & RBAC** (invite, role).  
7) **Billing** (Stripe awal; Midtrans susulan).  
8) **Notifications** (in-app + push via FCM).  
9) **Storage** (attachments & exports via Supabase Storage).  

---

## 7. Kebutuhan Fungsional (Detail)
> Nomor penanda FR-xxx.

### 7.1 Autentikasi & Akun
- **FR-001** Pengguna dapat mendaftar dengan email & password (argon2id + pepper).  
- **FR-002** Sistem mengirim email verifikasi; token tersimpan sebagai hash + expiry.  
- **FR-003** Lupa password: permintaan reset, token hash + expiry, rate-limit per IP/email.  
- **FR-004** Onboarding: pilih **Personal** atau **Organization** (membuat `Account`).  
- **FR-005** i18n id/en dan tema light/dark tersimpan per user.  

### 7.2 Organization & RBAC
- **FR-010** OWNER mengundang anggota via email; sistem membuat `Invitation` (status, expiry).  
- **FR-011** ADMIN dapat mengubah role MEMBER; OWNER dapat transfer ownership (konfirmasi 2 langkah).  
- **FR-012** Anggota dapat keluar dari Account; pemilik tidak dapat menghapus satu-satunya OWNER.  

### 7.3 Kategori & Transaksi
- **FR-020** CRUD kategori: `name`, `type(INCOME|EXPENSE)`, parent opsional, arsip.  
- **FR-021** CRUD transaksi: `type` harus konsisten dengan `Category.type`, `occurredAt` (timestamptz WIB aware), `amount`, `note`, `attachments`.  
- **FR-022** Filter transaksi berdasarkan tanggal, kategori, nominal, pembuat, teks bebas.  
- **FR-023** Impor CSV (R2) dengan validasi kolom & preview.  
- **FR-024** Soft delete untuk transaksi & kategori.  

### 7.4 Budget
- **FR-030** Buat target budget unik per `(accountId, categoryId, month, year)`.  
- **FR-031** Sistem menampilkan progres & memicu alert saat 80% dan 100%.  

### 7.5 Laporan Bulanan & Ekspor
- **FR-040** Cron **tanggal 1 @ 07:00 WIB** menghasilkan **MonthlyReport** untuk bulan sebelumnya (window WIB).  
- **FR-041** Laporan berisi income, expense, top kategori, MoM; simpan `metrics(JSON)`.  
- **FR-042** AI Summary (3–5 poin + rekomendasi). Caching berdasarkan `(accountId, month, year, model, version)`.  
- **FR-043** Ekspor CSV & PDF (Pro). PDF menyertakan ringkasan & halaman bernomor.  
- **FR-044** Regenerate report manual (admin/dev), idempoten.  

### 7.6 AI Coach & Penggunaan AI
- **FR-050** Chat AI kontekstual berdasar data akun (dengan guardrails & limit token).  
- **FR-051** Rate-limit AI per plan: Free 5 Q/bulan (reset per kalender WIB); Pro/Team fair-use.  
- **FR-052** Log `AIUsage` (prompt tokens, completion tokens, model, latency).  

### 7.7 Billing
- **FR-060** Checkout Pro/Team melalui Stripe; kembalikan URL pembayaran.  
- **FR-061** Webhook memproses status langganan, verifikasi signature, idempotensi.  
- **FR-062** Seat-based untuk Team: OWNER membayar jumlah MEMBER aktif; undangan membuat "pending seat".  
- **FR-063** Grace period gagal bayar 7 hari; downgrade otomatis tanpa mengunci data.  
- **FR-064** Midtrans integrasi susulan (provider field terabstraksi).  

### 7.8 Notifikasi (FCM) & In-App
- **FR-070** Aplikasi mendaftarkan **FCM device token** per user; token dapat dicabut.  
- **FR-071** Sistem mengirim **push via FCM** untuk: undangan bergabung, laporan bulanan siap, dan alert budget 100%.  
- **FR-072** In-app notification center: `Notification` (read/unread).  
- **FR-073** Topik FCM: `account_{id}` untuk broadcast per akun; *rate-limit* dan retry.  

### 7.9 Penyimpanan Berkas (Supabase Storage)
- **FR-080** Bucket: `attachments`, `exports`, `avatars` (privat).  
- **FR-081** Unggah lampiran transaksi: validasi ukuran/MIME; simpan metadata (`size`, `mime`, `checksum`).  
- **FR-082** Akses file via **signed URL** (expiry), tidak public-read.  
- **FR-083** Kebijakan penghapusan: soft-delete logis, hard-delete periodik oleh job housekeeping.  

### 7.10 Audit & Aktivitas Produk
- **FR-090** `AuditLog` untuk aksi sensitif (billing, role, laporan).  
- **FR-091** Event produk (PostHog): `TRANSACTION_ADD`, `BUDGET_CREATE`, `REPORT_VIEW`, `AI_CHAT_SEND`.  

---

## 8. Kebutuhan Non-Fungsional
### 8.1 Keamanan
- Password argon2id + pepper; min entropy & policy.  
- Token verifikasi/reset **hash + expiry**; attempt throttling; IP rate-limit.  
- Header keamanan: HSTS, CSP (nonce), X-Frame-Options, Referrer-Policy.  
- CSRF proteksi untuk aksi non-idempotent (bila cookie session); atau header anti-CSRF untuk fetch.  
- Webhook signature (Stripe/Midtrans); idempotency keys untuk write endpoints.  

### 8.2 Privasi & Kepatuhan
- UU PDP: minimisasi PII, hak akses, data subject request (export/delete), log retensi 30 hari (awal).  
- Data encryption in-transit (TLS). At-rest mengikuti Supabase default.  

### 8.3 Kinerja & Skalabilitas
- Target **p95 API < 600 ms** (dataset <100k), **p99 < 1.2 s**.  
- Cursor pagination pada listing transaksi.  
- Pooling koneksi DB (Supabase) dan prepared statements untuk query berat.  

### 8.4 Reliabilitas
- Uptime 99.9% (tier awal).  
- Backup harian database; **RPO ≤ 24 jam, RTO ≤ 4 jam**.  
- Job idempoten untuk cron laporan.  

### 8.5 Aksesibilitas & i18n
- WCAG 2.1 AA, keyboard navigable.  
- Bahasa: id/en; format default IDR.  

### 8.6 Observability
- Sentry (error), PostHog (product analytics), OTel tracing untuk endpoint utama & cron.  
- Log terstruktur (Pino); korelasi request-id.  

---

## 9. Model Data (Ringkas)
> Semua entitas memiliki `id`, `createdAt`, `updatedAt`. Scope utama: `accountId`.

- **User**: email, passwordHash, name, locale, theme, isVerified, lastLoginAt.  
- **Account**: name, currency (default `IDR`), type (PERSONAL|ORG), ownerId.  
- **Membership**: accountId, userId, role (OWNER|ADMIN|MEMBER), status.  
- **Invitation**: accountId, email, role, tokenHash, expiresAt, status.  
- **Category**: accountId, name, type (INCOME|EXPENSE), parentId, isArchived.  
- **Transaction**: accountId, categoryId, userId, type, amount(DECIMAL18,2), currency, occurredAt (timestamptz), note, attachmentsCount, deletedAt.  
- **Budget**: accountId, categoryId, month, year, amount, alert80, alert100, carriedOverPolicy.  
- **MonthlyReport**: accountId, month, year, metrics(JSON), generatedAt, generatedByCron, aiSummaryId.  
- **AIConversation**: accountId, userId, messages(JSON), model, lastUsedAt.  
- **AIUsage**: accountId, userId, model, promptTokens, completionTokens, latencyMs, costEst.  
- **Subscription**: accountId, plan(FREE|PRO|TEAM), provider(STRIPE|MIDTRANS), status, renewsAt, cancelAtPeriodEnd.  
- **PaymentIntent**: provider, externalId, status, amount, currency, raw(JSON).  
- **Notification**: accountId, userId, type, title, body, data(JSON), readAt.  
- **Device**: userId, fcmToken, platform, lastSeenAt, revokedAt.  
- **Attachment**: accountId, transactionId, bucket, path, size, mime, checksum, scannedAt, isSafe.  
- **AuditLog**: accountId, actorId, action, entity, entityId, before(JSON), after(JSON), ip, userAgent.  
- **SystemConfig**: key unique, value(JSON).  

**Index yang disarankan:**  
- Transaction: `(accountId, occurredAt)`, `(accountId, categoryId)`, `(userId)`.  
- Budget: unique `(accountId, categoryId, month, year)`.  
- MonthlyReport: unique `(accountId, month, year)`.  

---

## 10. Antarmuka Eksternal
### 10.1 Supabase Storage
- **Buckets**: `attachments`, `exports`, `avatars` (private).  
- Upload via signed upload URL atau server handler; akses via signed URL (expiry singkat).  
- Housekeeping job: hard-delete file orphaned; rotasi ekspor lama (mis. 30–90 hari).  

### 10.2 Firebase Cloud Messaging (FCM)
- Registrasi FCM token saat login; simpan di `Device`.  
- Topik: `account_{id}` untuk broadcast per akun; `user_{id}` untuk targeted.  
- Server key disimpan aman; kirim notifikasi via server (bukan langsung dari client).  

### 10.3 AI (OpenAI)
- Model default ditetapkan (mis. gpt-4.x) + fallback.  
- Pembatasan token & caching untuk ringkasan bulanan.  

### 10.4 Billing
- Stripe Checkout → redirect URL; webhook signature verifikasi.  
- Midtrans (R2) dengan penanganan signature & status.  

---

## 11. API (Kontrak Ringkas)
**Prefix**: `/api` — semua cek session & scope `accountId`.

- `POST /auth/register` — daftar; kirim verifikasi email.  
- `POST /auth/login` — masuk; rotasi session/JWT.  
- `POST /auth/verify` — verifikasi email.  
- `POST /auth/forgot` / `POST /auth/reset` — reset password.  

- `GET /accounts` | `POST /accounts`  
- `GET /accounts/:accountId` | `PATCH /accounts/:accountId`  
- `POST /accounts/:accountId/invites`  
- `PATCH /memberships/:id` | `DELETE /memberships/:id`  

- `GET /accounts/:accountId/categories` | `POST`  
- `PATCH /categories/:id` | `DELETE /categories/:id`  

- `GET /accounts/:accountId/transactions?from=&to=&categoryId=&q=&limit=&cursor=`  
- `POST /accounts/:accountId/transactions` *(Idempotency-Key)*  
- `PATCH /transactions/:id` | `DELETE /transactions/:id`  
- `POST /accounts/:accountId/transactions/import` (R2)  

- `GET /accounts/:accountId/budgets?month=&year=` | `POST`  
- `PUT /budgets/:id` | `DELETE /budgets/:id`  

- `GET /accounts/:accountId/reports/monthly?month=&year=`  
- `POST /accounts/:accountId/reports/monthly/generate` (admin/dev)  
- `POST /accounts/:accountId/reports/monthly/email` (Pro)  
- `GET /accounts/:accountId/export.csv` | `GET /accounts/:accountId/export.pdf` (Pro)  

- `POST /accounts/:accountId/ai/chat`  
- `POST /accounts/:accountId/ai/summary` (cron)  

- `POST /billing/checkout`  
- `POST /billing/webhook`  

- `GET /notifications` | `PATCH /notifications/:id/read`  
- `POST /devices/register` | `POST /devices/revoke`  

---

## 12. Alur Proses Penting
### 12.1 Cron Laporan Bulanan
1) Scheduler menjalankan job **00:00 UTC (07:00 WIB)**.  
2) Ambil transaksi bulan lalu berdasar boundary **WIB**.  
3) Hitung metrik; simpan `MonthlyReport` (idempoten).  
4) Panggil AI summary (cache; retry bila gagal).  
5) Kirim notifikasi: in-app + **FCM** ke `account_{id}`; email untuk Pro/Team.  

### 12.2 Alert Budget 80%/100%
1) Saat transaksi baru dibuat/diperbarui, hitung progres budget terkait.  
2) Jika melewati ambang, buat `Notification` dan kirim push FCM ke `user_{id}` terkait dan/atau `account_{id}` sesuai kebijakan.  

### 12.3 Unggah Attachment (Supabase Storage)
1) Client minta signed URL ke server.  
2) Client unggah file ke bucket `attachments`.  
3) Server verifikasi metadata (mime/size/checksum) → buat `Attachment`.  
4) Tampilan lampiran memakai **signed URL** (expiry pendek).  

---

## 13. Kriteria Penerimaan (MVP)
- CRUD transaksi & kategori berfungsi, filter berjalan, pagination cursor.  
- Budget unik per (account, kategori, bulan/tahun); alert 80% & 100%.  
- Cron tanggal 1 @07:00 WIB menghasilkan MonthlyReport bulan sebelumnya; AI Summary berisi minimal 3 rekomendasi.  
- Ekspor CSV & PDF dapat diunduh (Pro).  
- RBAC: MEMBER terbatas; ADMIN undang & ubah role; OWNER transfer ownership.  
- Notifikasi FCM terkirim untuk undangan, laporan bulanan siap, dan budget 100%.  
- Unggah lampiran ke Supabase Storage berjalan; akses via signed URL.  

---

## 14. Pengujian & QA
- **Unit**: util/service (Vitest).  
- **Integrasi**: API + DB (Prisma test DB).  
- **E2E**: Playwright (alur transaksi → budget → report).  
- **Load**: 100 RPS burst pada endpoint transaksi; p95 < 600 ms.  
- **Keamanan**: linting, dep audit, uji brute-force & token flow.  

---

## 15. Risiko & Mitigasi
- **Biaya AI**: rate-limit, cache, model hemat.  
- **Sensitif data**: RBAC ketat, audit log, backup.  
- **Scope creep**: MoSCoW, feature flag.  
- **Churn**: edukasi lewat email report & insight.  

---

## 16. Rencana Rilis & Roadmap 90 Hari
- **S1–S2 (0–4 mgg)**: Auth, i18n, tema, data inti, transaksi, kategori, budget, dashboard, Supabase Storage.  
- **S3–S4 (4–8 mgg)**: Org + RBAC, Stripe billing, cron report WIB, AI summary basic, FCM notifikasi, export CSV.  
- **S5–S6 (8–12 mgg)**: Attachment lanjutan (preview), recurring, export PDF, insight AI lanjutan, notifikasi tambahan, Midtrans (opsional).  

---

## 17. Lampiran Teknis
- **Kebijakan Password**: min 10 char, kombinasi; password blacklist umum.  
- **Idempotensi**: header `Idempotency-Key` untuk POST yang membuat resource.  
- **Rate-limit**: per-IP & per-user; bucket terpisah untuk `/ai/*`.  
- **Service Worker**: diperlukan untuk push FCM & caching ringan.  
- **Housekeeping**: job untuk hapus file yatim & ekspor lama.  

