AngsFlow Next App — Foundation

What’s set up
- Next.js 15 (App Router) with TS strict, ESLint, Prettier
- Security headers (HSTS, XFO, XCTO, Referrer-Policy) + CSP with nonce via middleware
- Request ID propagation via `x-request-id` header
- Sentry SDK (client/server/edge)
- PostHog client provider
- Basic `/api/health` endpoint

Getting started
1. Copy `.env.example` to `.env.local` and fill values
2. Install deps with pnpm
   pnpm install
3. Run dev server
   pnpm dev

Database & Prisma
- Generate client: `pnpm db:generate`
- Create migration locally without DB (for review):
  npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > prisma/migrations/001_init/migration.sql
- Apply migration to your DB and seed:
  pnpm db:migrate
  pnpm db:seed

Notes
- CSP nonce is exposed as `x-nonce`; use it for any inline scripts.
- `vercel.json` at repo root maps the project root to `next/` for Vercel.
