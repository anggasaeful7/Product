# AngsFlow - Personal & Business Finance Management

**MVP Release v1.0** - Smart budgeting and expense tracking with AI insights.

## 🎯 MVP Scope

### Core Features

- **User Management**: Registration, login, profile management
- **Multi-tenant**: Personal accounts + Organization workspaces
- **Transaction Management**: CRUD operations, categorization, attachments
- **Budgeting**: Monthly budgets per category with alerts
- **Reports**: Monthly financial summaries with AI insights
- **AI Coach**: Conversational financial advice
- **Billing**: Free/Pro/Team plans with Stripe integration

### Success Metrics

- **User Acquisition**: 100 MAU within 30 days
- **Engagement**: 50% monthly active ledger users
- **Conversion**: 5% free-to-paid conversion rate
- **Performance**: <600ms p95 API response time
- **Reliability**: 99.5% uptime

### Out of Scope (v1)

- Bank account integration
- Investment tracking
- Tax calculations
- Mobile apps (PWA only)

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Setup environment
cp .env.example .env.local
# Fill in your environment variables

# Database setup
pnpm db:push
pnpm db:seed

# Development
pnpm dev
```

## 📋 Tech Stack

- **Frontend**: Next.js 14, Tailwind CSS, TypeScript
- **Backend**: Next.js Route Handlers, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js
- **Payments**: Stripe
- **Storage**: S3-compatible (Cloudflare R2)
- **AI**: OpenAI GPT-4
- **Monitoring**: Sentry, PostHog

## 📁 Project Structure

```
├── app/                 # Next.js App Router
├── components/          # Reusable UI components
├── lib/                # Utilities and helpers
├── server/             # Server-side logic
├── prisma/             # Database schema and migrations
├── public/             # Static assets
└── tests/              # Test files
```

## 🔐 Environment Variables

Required variables in `.env.local`:

- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `STRIPE_SECRET_KEY`
- `OPENAI_API_KEY`
- `S3_ACCESS_KEY_ID`
- `S3_SECRET_ACCESS_KEY`

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run E2E tests
pnpm test:e2e

# Run with coverage
pnpm test:coverage
```

## 📈 Development Workflow

1. Create feature branch from `main`
2. Make changes with tests
3. Run lint and tests locally
4. Create PR with description
5. CI/CD runs automatically
6. Merge after review and tests pass

## 📞 Support

- **Issues**: GitHub Issues
- **Documentation**: [docs.angsflow.com](https://docs.angsflow.com)
- **Email**: support@angsflow.com
