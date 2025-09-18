Angsflow — URD & DRD Pitch Pack v1.0
Paket dokumen User Requirements (URD) + Design Requirements (DRD)
untuk pitching & eksekusi produk awal.
Last updated: 17 Aug 2025 (WIB)

0. Ringkasan Eksekutif
   Masalah: Pencatatan keuangan personal & tim tercecer (Excel, catatan manual, app terpisah), minim analisis, sulit kolaborasi.
   Solusi: Angsflow menyatukan transaksi, budgeting, laporan, dan insight AI untuk individu & organisasi (RBAC), dengan otomatisasi laporan bulanan.
   Target: Individu, keluarga, komunitas, dan tim/organisasi kecil-menengah di Indonesia (multi-bahasa id/en).
   North Star Metric: Monthly Active Ledgers (akun/org yang mencatat ≥20 transaksi & melihat laporan ≥2x/bulan).
   Paket: Free (basic + AI terbatas), Pro (full AI + export), Team/Org Pro (Pro + analisa kolektif).
1. URD — User Requirements Document
   1.1 Tujuan & Sasaran
   Membantu pengguna memahami arus kas (income/expense) dan menjaga budgeting.
   Mempermudah kolaborasi finansial (keluarga/komunitas/tim) dengan role-based access.
   Menyediakan insight AI yang actionable tanpa perlu analisis manual.
   Mengirim laporan otomatis (email) sebagai habit-forming loop.
   KPI awal:
   D1 Retention ≥ 40%, W4 Retention ≥ 20%.
   ≥70% user membuat ≥1 budget dalam 7 hari pertama.
   Email monthly report open-rate ≥ 45%.
   1.2 Cakupan (In‑Scope)
   Auth (email/password), i18n (id/en), tema gelap/terang.
   Ledger personal & organisasi: kategori, transaksi, budgeting, laporan.
   Org switcher & RBAC (Owner/Admin/Member).
   AI Coach: chat, summary bulanan, insight & rekomendasi (tiered by plan).
   Export CSV/PDF (Pro+), email monthly report (Pro+).
   Billing (Stripe/Midtrans), cron jobs.
   Out‑of‑Scope awal:
   Akuntansi double-entry penuh, pajak kompleks, payroll, open banking sinkron otomatis (riset roadmap).
   1.3 Persona Utama
   Individu Pemula — ingin tahu ke mana uang pergi; butuh ringkas & mudah.
   Freelancer/Creator — multi-klien; butuh kategori, tag, dan export.
   Keluarga — berbagi pengeluaran; butuh peran & kategori bersama.
   Tim/Org Kecil — marketing/event/komunitas; butuh RBAC dan analisis kolektif.
   1.4 Use Cases & User Stories (ringkas)
   Auth & Onboarding
   Sebagai user, saya bisa daftar/login agar mengakses aplikasi.
   Sebagai user, saya memilih mode Individu atau Organisasi saat onboarding.
   Sebagai owner, saya dapat membuat organisasi dan mengundang member via email.
   Transaksi & Kategori
   Sebagai user, saya menambah transaksi dengan amount, kategori, tanggal, dan catatan agar catatan rapi.
   Sebagai user, saya mengunggah bukti struk (Pro) agar audit mudah.
   Sebagai admin, saya menyetujui transaksi di atas nominal X (opsional R2).
   Budgeting
   Sebagai user, saya membuat budget per kategori (monthly) agar pengeluaran terkendali.
   Sebagai user, saya menerima notifikasi saat melampaui 80% & 100% budget.
   Laporan & Insight
   Sebagai user, saya melihat grafik income vs expense, top kategori, dan tren MoM.
   Sebagai user Pro, saya menerima email monthly report (PDF/HTML) + insight AI.
   Sebagai org owner/admin, saya melihat analisa kolektif role‑based (Team Pro).
   AI Coach
   Sebagai user Free, saya punya 5 pertanyaan/bulan.
   Sebagai user Pro/Team, saya mendapatkan chat unlimited + insight rekomendasi.
   Billing
   Sebagai user, saya upgrade/downgrade plan dengan pembayaran lokal/internasional.
   1.5 Acceptance Criteria (contoh per‑epic)
   Epic: Transaksi
   Dapat menambah, mengedit, menghapus transaksi dalam scope accountId aktif.
   Pencarian & filter berdasarkan tanggal, kategori, nominal, user (org).
   Attachments (Pro) tersimpan di object storage (S3-compatible) & aman.
   Epic: Budget
   Unik per (accountId, categoryId, month, year).
   Progress bar menampilkan actual vs limit; alert di 80% & 100%.
   Epic: AI Summary
   Ringkasan bulanan berisi total income/expense, 5 kategori terbesar, MoM %, dan 3 rekomendasi tindakan.
   Waktu generasi via cron setiap tanggal 1 jam 07:00 WIB.
   Epic: RBAC
   MEMBER tidak dapat mengubah role atau mengakses Billing.
   ADMIN dapat invite & mengubah role MEMBER.
   OWNER dapat transfer ownership.
   1.6 Non‑Functional Requirements (NFR)
   Reliability: Uptime target 99.9% (tier awal), backup harian, RPO ≤ 24 jam, RTO ≤ 4 jam.
   Performance: p95 TTFB < 500 ms (landing), p95 API < 600 ms, query p95 < 300 ms untuk dataset <100k transaksi.
   Security: Hash password argon2id, session JWT dengan rotasi, RBAC server-side, CSP header, rate-limit AI & auth.
   Privacy: PII minim, enkripsi in-transit (TLS), retensi log 30 hari, patuh UU PDP (best-effort).
   Accessibility: WCAG 2.1 AA, dukungan keyboard & prefers-reduced-motion.
   i18n/l10n: id/en, dukungan number/currency format lokal (IDR default).
   SEO: robots.txt, sitemap.xml, OG tags, favicon, halaman cepat terindeks.
   1.7 Batasan & Asumsi
   Fokus awal Indonesia (IDR), multi-currency di rilis berikutnya.
   Tanpa integrasi bank otomatis pada MVP (import CSV tersedia R2).
   1.8 Keberhasilan & Metrik
   MAU ledger, transaksi per akun/org, jumlah budget aktif, open rate email report, CSAT > 4.3/5.

2. DRD — Design Requirements Document
   2.1 Arsitektur Sistem (ringkas)
   Frontend: Next.js 14 (App Router), Tailwind, next-intl, next-themes.
   Backend: Next.js Route Handlers (API), Prisma ORM.
   DB: PostgreSQL (Railway/Render). Object storage S3-compatible untuk lampiran.
   Auth: Next-Auth (Email/Password; OAuth opsional).
   AI: OpenAI API untuk chat & summarization/analysis.
   Infra: Vercel (FE + edge/serverless), cron jobs untuk laporan.
   Observability: Logging (pino), error (Sentry), product analytics (PostHog), metrics (OTel).
   2.2 Model Data (inti)
   User, Account (personal/org), Membership (role), Category, Transaction, Budget, Subscription, AIConversation, MonthlyReport, AuditLog. Setiap entitas keuangan selalu scoped oleh accountId untuk multi-tenant isolation.
   2.3 API Design (endpoint utama)
   Prefix: /api
   Accounts/Orgs
   GET /accounts — daftar akun/org yang user miliki aksesnya.
   POST /accounts — buat personal/org.
   GET /accounts/:id, PATCH /accounts/:id
   POST /accounts/:id/invites — kirim undangan.
   PATCH /memberships/:id — ubah role; DELETE /memberships/:id
   Categories
   CRUD pada /:accountId/categories
   Transactions
   CRUD pada /:accountId/transactions (+ bulk import di R2)
   Budgets
   CRUD pada /:accountId/budgets
   Reports
   GET /:accountId/reports/monthly?month=&year= — JSON
   POST /:accountId/reports/monthly/email — kirim email
   GET /:accountId/export.csv|.pdf — Pro
   AI
   POST /:accountId/ai/chat {messages[]}
   POST /:accountId/ai/summary — on-demand
   Billing
   POST /billing/checkout {plan}
   POST /billing/webhook — Stripe/Midtrans webhook
   Semua endpoint memeriksa session + RBAC (scope by accountId).
   2.4 Sequence / Flow Teknis
   2.4.1 Add Transaction (UI → DB → Budget)
   flowchart LR
   A[User UI: Add Transaction] -->|JSON POST| B[/API: POST /:accountId/transactions/]
   B --> C[Service Layer\nzod validate + RBAC]
   C --> D[Prisma ORM: create(Transaction)\nupdate Budget usage]
   D --> E[(PostgreSQL)]
   D -->|overspend?| F[Emit Alert/Notification]
   C --> G[Write AuditLog]
   2.4.2 Monthly Report Cron → AI → Email
   flowchart LR
   A[Cron 1st @07:00 WIB] --> B[Aggregator: income/expense, top categories, MoM]
   B --> C[OpenAI: generate summary & tips]
   B --> D[Persist MonthlyReport]
   C --> D
   D --> E[Email Service (Resend/Mailgun): send PDF/HTML (Pro/Team)]
   D --> F[Dashboard Badge: New report available]
   2.5 Komponen UI & Screen List (untuk desain/pitch)
   Auth & Onboarding
   Login, Register, Forgot Password, Pilih Mode (Individu/Organisasi)
   Global NAV
   Sidebar/Bottom Nav, Topbar dengan Org/Account Switcher, Quick Add Transaction
   Dashboard (Personal/Org)
   Cards: Saldo, Income vs Expense, Tren, Insight AI Card
   Transactions
   Tabel/Daftar, Filter (tanggal, kategori, user), Quick Add Modal, Upload Struk (Pro)
   Budgets
   Daftar budget per kategori, progress bar, buat/edit budget
   Reports
   Timeline bulanan, detail bulan, export CSV/PDF
   Members (Org)
   List member, undang via email, ubah role, remove member
   Settings
   Profil, Bahasa, Tema, Billing/Subscription, Keamanan
   AI Coach
   Chat UI, riwayat percakapan, batasan kuota (Free), rekomendasi
   System Pages
   404/500, Maintenance, Terms/Privacy
   2.6 NFR Teknis (detail)
   Security: CSP, Secure cookies SameSite=Lax, HttpOnly, argon2id, rotate secrets, deny by default, audit log untuk aksi sensitif.
   Perf: Cache insight bulanan per (accountId, month), pagination pada list transaksi, indeks DB pada (accountId, occurredAt) dan (accountId, categoryId).
   Data: Prisma migrations versioned; backup harian; retensi attachment configurable.
   Observability: Trace id per request, dashboard error rate, alerting (Sentry/OTel).
   2.7 Integrasi Eksternal
   Payments: Stripe/Midtrans — checkout link, webhook untuk status active/past_due/canceled.
   Email: Resend/Mailgun — template Monthly Summary, Invite, Budget Alert, Receipt.
   AI: OpenAI — model ekonomis untuk ringkasan (cron), model kuat untuk chat Pro.
   2.8 Rencana Rilis (90 hari / sprint 2 minggu)
   S1–S2 (0–4 minggu): Auth, i18n, tema, data inti, transaksi, kategori, budget, dashboard.
   S3–S4 (4–8 minggu): Org + RBAC, billing dasar, cron report, AI summary basic, export CSV.
   S5–S6 (8–12 minggu): Attachment, recurring, export PDF, insight AI lanjutan, notifikasi.
   2.9 Risiko & Mitigasi
   Biaya AI → rate limit, cache, batching prompt.
   Data Sensitif → RBAC ketat, enkripsi, audit log, backup.
   Scope creep → kunci MVP, MoSCoW, feature flag.
   Churn → edukasi nilai via email report & insight praktis.
   2.10 Testing & QA
   Unit: util & service (Vitest).
   Integration: API + DB (Prisma test db).
   E2E: add txn → budget update → report (Playwright).
   Load: 100 RPS burst pada endpoint transaksi (p95 < 600ms dataset kecil).
   Security: static scan (ESLint, dep audit), pen test ringan.

3.2 Feature Matrix (per plan)
Fitur Free (Individu) Pro (Individu) Pro (Team/Org)
Ledger pribadi ✅ ✅ ✅
Organisasi (RBAC, switcher) ❌ ❌ ✅
Export CSV/PDF ❌ ✅ ✅
Budget per kategori ✅ ✅ ✅
Chart & laporan dasar ✅ ✅ ✅
AI Coach (chat) 5 Q/bulan Unlimited Unlimited
AI Summary bulanan Basic Full (detail & insight) Full kolektif
Insight & rekomendasi AI ❌ ✅ ✅ (org & role)
Email monthly report ❌ ✅ ✅
Attachment struk ❌ ✅ ✅
Recurring transaksi ❌ ✅ ✅
3.3 Pitch Notes (1-slide bullets)
Value prop: Satu platform finance + AI, cocok untuk individu dan tim.
Why now: adopsi AI tinggi; SMB/komunitas butuh alat kolaboratif ringan.
Moat: data scoped & insight AI kontekstual; kebiasaan via email report.
Model: SaaS subscription (Free→Pro→Team Pro), ARPU meningkat via Pro Team & add-on.
Go-to-market: konten budgeting, referral kredit, paket tahunan diskon.

## 4) Database Schema (Prisma)

Berikut adalah skema Prisma yang komprehensif untuk mengelola semua data yang dibutuhkan aplikasi AngsFlow:

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================================================
// USER MANAGEMENT & AUTHENTICATION
// ============================================================================

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String   // hashed with argon2id
  name      String?
  avatar    String?
  locale    String   @default("id") // id/en
  theme     String   @default("system") // light/dark/system
  timezone  String   @default("Asia/Jakarta")

  // Verification & Security
  emailVerified    DateTime?
  emailVerifyToken String?
  resetToken       String?
  resetTokenExpiry DateTime?

  // Timestamps
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  lastLoginAt DateTime?

  // Relations
  accounts            Account[]
  memberships         Membership[]
  transactions        Transaction[]
  recurringTransactions RecurringTransaction[]
  aiConversations     AIConversation[]
  aiUsage             AIUsage[]
  auditLogs           AuditLog[]
  notifications       Notification[]

  @@map("users")
}

// ============================================================================
// ACCOUNTS & ORGANIZATIONS
// ============================================================================

model Account {
  id          String      @id @default(cuid())
  name        String
  type        AccountType @default(PERSONAL)
  currency    String      @default("IDR")
  description String?
  avatar      String?

  // Settings
  settings Json @default("{}")

  // Timestamps
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  memberships           Membership[]
  categories            Category[]
  transactions          Transaction[]
  recurringTransactions RecurringTransaction[]
  budgets               Budget[]
  monthlyReports        MonthlyReport[]
  aiConversations       AIConversation[]
  aiUsage               AIUsage[]
  subscriptions         Subscription[]
  invitations           Invitation[]
  auditLogs             AuditLog[]

  @@map("accounts")
}

enum AccountType {
  PERSONAL
  ORGANIZATION
}

model Membership {
  id        String         @id @default(cuid())
  userId    String
  accountId String
  role      MembershipRole @default(MEMBER)

  // Timestamps
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  account Account @relation(fields: [accountId], references: [id], onDelete: Cascade)

  @@unique([userId, accountId])
  @@map("memberships")
}

enum MembershipRole {
  OWNER
  ADMIN
  MEMBER
}

model Invitation {
  id        String           @id @default(cuid())
  email     String
  accountId String
  role      MembershipRole   @default(MEMBER)
  token     String           @unique
  status    InvitationStatus @default(PENDING)

  // Metadata
  invitedBy String?
  message   String?

  // Timestamps
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  expiresAt DateTime

  // Relations
  account Account @relation(fields: [accountId], references: [id], onDelete: Cascade)

  @@unique([email, accountId])
  @@map("invitations")
}

enum InvitationStatus {
  PENDING
  ACCEPTED
  EXPIRED
  REVOKED
}

// ============================================================================
// FINANCIAL DATA
// ============================================================================

model Category {
  id          String      @id @default(cuid())
  accountId   String
  name        String
  description String?
  color       String      @default("#3B82F6")
  icon        String      @default("💰")
  type        CategoryType @default(EXPENSE)

  // Hierarchy
  parentId String?
  parent   Category? @relation("CategoryHierarchy", fields: [parentId], references: [id])
  children Category[] @relation("CategoryHierarchy")

  // Settings
  isActive Boolean @default(true)
  order    Int     @default(0)

  // Timestamps
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  account               Account               @relation(fields: [accountId], references: [id], onDelete: Cascade)
  transactions          Transaction[]
  recurringTransactions RecurringTransaction[]
  budgets               Budget[]

  @@unique([accountId, name])
  @@map("categories")
}

enum CategoryType {
  INCOME
  EXPENSE
  TRANSFER
}

model Transaction {
  id          String          @id @default(cuid())
  accountId   String
  userId      String
  categoryId  String

  // Transaction Details
  amount      Decimal         @db.Decimal(15, 2)
  description String
  notes       String?
  type        TransactionType @default(EXPENSE)
  status      TransactionStatus @default(COMPLETED)

  // Timing
  occurredAt DateTime

  // Metadata
  tags        String[] @default([])
  location    String?
  reference   String? // external reference

  // Attachments
  attachments Json @default("[]")

  // Recurring
  recurringId String?
  recurring   RecurringTransaction? @relation(fields: [recurringId], references: [id])

  // Timestamps
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  account  Account  @relation(fields: [accountId], references: [id], onDelete: Cascade)
  user     User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  category Category @relation(fields: [categoryId], references: [id], onDelete: Restrict)

  @@index([accountId, occurredAt])
  @@index([accountId, categoryId])
  @@index([userId])
  @@map("transactions")
}

enum TransactionType {
  INCOME
  EXPENSE
  TRANSFER
}

enum TransactionStatus {
  PENDING
  COMPLETED
  CANCELLED
}

model RecurringTransaction {
  id          String    @id @default(cuid())
  accountId   String
  userId      String
  categoryId  String

  // Template Details
  amount      Decimal   @db.Decimal(15, 2)
  description String
  notes       String?
  type        TransactionType @default(EXPENSE)

  // Recurrence Settings
  frequency   RecurrenceFrequency
  interval    Int       @default(1) // every N periods
  dayOfMonth  Int?      // for monthly (1-31)
  dayOfWeek   Int?      // for weekly (0-6)

  // Schedule
  startDate   DateTime
  endDate     DateTime?
  nextRun     DateTime

  // Status
  isActive    Boolean   @default(true)

  // Timestamps
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  // Relations
  account      Account       @relation(fields: [accountId], references: [id], onDelete: Cascade)
  user         User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  category     Category      @relation(fields: [categoryId], references: [id], onDelete: Restrict)
  transactions Transaction[]

  @@map("recurring_transactions")
}

enum RecurrenceFrequency {
  DAILY
  WEEKLY
  MONTHLY
  YEARLY
}

model Budget {
  id         String @id @default(cuid())
  accountId  String
  categoryId String

  // Budget Details
  amount     Decimal @db.Decimal(15, 2)
  spent      Decimal @db.Decimal(15, 2) @default(0)

  // Period
  month      Int // 1-12
  year       Int

  // Settings
  alertAt80  Boolean @default(true)
  alertAt100 Boolean @default(true)

  // Timestamps
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  // Relations
  account  Account  @relation(fields: [accountId], references: [id], onDelete: Cascade)
  category Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)

  @@unique([accountId, categoryId, month, year])
  @@map("budgets")
}

// ============================================================================
// REPORTING & ANALYTICS
// ============================================================================

model MonthlyReport {
  id        String @id @default(cuid())
  accountId String

  // Period
  month     Int // 1-12
  year      Int

  // Financial Summary
  totalIncome  Decimal @db.Decimal(15, 2)
  totalExpense Decimal @db.Decimal(15, 2)
  netAmount    Decimal @db.Decimal(15, 2)

  // Analytics
  topCategories      Json @default("[]")
  monthOverMonth     Json @default("{}")
  budgetPerformance  Json @default("{}")

  // AI Insights
  aiSummary          String?
  aiRecommendations  Json @default("[]")

  // Status
  status    ReportStatus @default(GENERATING)

  // Timestamps
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  account Account @relation(fields: [accountId], references: [id], onDelete: Cascade)

  @@unique([accountId, month, year])
  @@map("monthly_reports")
}

enum ReportStatus {
  GENERATING
  COMPLETED
  FAILED
  SENT
}

// ============================================================================
// AI & COACHING
// ============================================================================

model AIConversation {
  id        String @id @default(cuid())
  accountId String
  userId    String

  // Conversation Details
  title     String?
  messages  Json @default("[]")

  // Metadata
  tokenUsed Int @default(0)
  model     String @default("gpt-3.5-turbo")

  // Timestamps
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  account Account @relation(fields: [accountId], references: [id], onDelete: Cascade)
  user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("ai_conversations")
}

model AIUsage {
  id        String @id @default(cuid())
  accountId String
  userId    String

  // Usage Tracking
  month        Int // 1-12
  year         Int
  chatQueries  Int @default(0)
  tokensUsed   Int @default(0)

  // Limits (based on plan)
  chatLimit    Int @default(5)
  tokenLimit   Int @default(10000)

  // Timestamps
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  account Account @relation(fields: [accountId], references: [id], onDelete: Cascade)
  user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([accountId, userId, month, year])
  @@map("ai_usage")
}

// ============================================================================
// BILLING & SUBSCRIPTIONS
// ============================================================================

model Subscription {
  id        String           @id @default(cuid())
  accountId String

  // Plan Details
  plan      SubscriptionPlan @default(FREE)
  status    SubscriptionStatus @default(ACTIVE)

  // Billing
  stripeCustomerId     String?
  stripeSubscriptionId String?
  stripePriceId        String?

  // Period
  currentPeriodStart DateTime?
  currentPeriodEnd   DateTime?

  // Timestamps
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  canceledAt DateTime?

  // Relations
  account Account @relation(fields: [accountId], references: [id], onDelete: Cascade)

  @@unique([accountId])
  @@map("subscriptions")
}

enum SubscriptionPlan {
  FREE
  PRO
  TEAM_PRO
}

enum SubscriptionStatus {
  ACTIVE
  PAST_DUE
  CANCELED
  INCOMPLETE
  INCOMPLETE_EXPIRED
  TRIALING
  UNPAID
}

// ============================================================================
// NOTIFICATIONS & COMMUNICATIONS
// ============================================================================

model Notification {
  id        String           @id @default(cuid())
  userId    String

  // Content
  title     String
  message   String
  type      NotificationType @default(INFO)

  // Metadata
  data      Json @default("{}")

  // Status
  isRead    Boolean @default(false)

  // Timestamps
  createdAt DateTime @default(now())
  readAt    DateTime?

  // Relations
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, isRead])
  @@map("notifications")
}

enum NotificationType {
  INFO
  SUCCESS
  WARNING
  ERROR
  BUDGET_ALERT
  REPORT_READY
  INVITATION
  PAYMENT
}

model EmailTemplate {
  id       String @id @default(cuid())
  name     String @unique
  subject  String
  htmlBody String
  textBody String?

  // Metadata
  variables Json @default("[]")

  // Timestamps
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("email_templates")
}

// ============================================================================
// AUDIT & LOGGING
// ============================================================================

model AuditLog {
  id        String @id @default(cuid())
  accountId String
  userId    String

  // Action Details
  action    String
  resource  String
  resourceId String?

  // Context
  metadata  Json @default("{}")
  ipAddress String?
  userAgent String?

  // Timestamps
  createdAt DateTime @default(now())

  // Relations
  account Account @relation(fields: [accountId], references: [id], onDelete: Cascade)
  user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([accountId, createdAt])
  @@index([userId, createdAt])
  @@map("audit_logs")
}

// ============================================================================
// SYSTEM CONFIGURATION
// ============================================================================

model SystemConfig {
  id    String @id @default(cuid())
  key   String @unique
  value String

  // Metadata
  description String?
  type        String @default("string") // string, number, boolean, json

  // Timestamps
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("system_config")
}
```
