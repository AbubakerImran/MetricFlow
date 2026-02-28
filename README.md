# MetricFlow

<div align="center">
  <h3>🚀 Modern SaaS Analytics Platform</h3>
  <p>Track, visualize, and analyze your product metrics in real-time</p>
</div>

---

## 📖 Overview

**MetricFlow** is a comprehensive analytics and metrics tracking platform built for modern SaaS teams. It provides real-time dashboards, event tracking, team collaboration features, and powerful APIs to help you make data-driven decisions.

### ✨ Key Features

- **📊 Real-Time Analytics** — Live-updating dashboards with Server-Sent Events (SSE) streaming data every 3 seconds
- **👥 Team Collaboration** — Invite team members with role-based access control (Admin, Editor, Viewer)
- **📈 Interactive Dashboards** — KPI cards, 8 chart types powered by Recharts, and customizable views
- **💾 Data Export** — Export events to CSV or PDF with one click
- **🔌 REST API** — Public API (`/api/v1`) with `x-api-key` authentication and rate limiting
- **💳 Stripe Billing** — Subscription management with Free, Pro, and Enterprise tiers via Checkout Sessions and Customer Portal
- **🔐 Multi-Provider Auth** — NextAuth.js with Google, GitHub, and email/password (bcryptjs) providers
- **🎯 Event Tracking** — Track page views, sign-ups, purchases, clicks, and custom events with metadata
- **🔑 API Key Management** — Generate, revoke, and manage API keys from the dashboard
- **📨 Transactional Email** — Verification, password reset, and team invite emails via Resend
- **🌍 Multi-Organization** — Multiple organizations with per-org projects, team members, and billing
- **🎨 Modern UI** — Tailwind CSS, Radix UI, and shadcn/ui components with dark mode support

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod validation
- **State Management**: Zustand
- **Icons**: Lucide React
- **Theming**: next-themes (dark mode)
- **Toasts**: Sonner

### Backend
- **Runtime**: Node.js 20+
- **Database**: PostgreSQL
- **ORM**: Prisma 7 (with `@prisma/adapter-pg` driver adapter)
- **Authentication**: NextAuth.js v4
- **Email**: Resend
- **Payments**: Stripe (Checkout, Portal, Webhooks)
- **Exports**: jsPDF (PDF), PapaParse (CSV)

### Development
- **Linting**: ESLint + eslint-config-next
- **Package Manager**: npm

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ and npm
- PostgreSQL database
- Stripe account (for billing features)
- Resend API key (for emails)
- OAuth credentials (optional, for Google/GitHub login)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AbubakerImran/MetricFlow.git
   cd MetricFlow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

   Update `.env` with your configuration:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/metricflow"

   # NextAuth
   NEXTAUTH_SECRET="your-secret-key-here"  # Generate with: openssl rand -base64 32
   NEXTAUTH_URL="http://localhost:3000"

   # OAuth Providers (Optional)
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   GITHUB_CLIENT_ID="your-github-client-id"
   GITHUB_CLIENT_SECRET="your-github-client-secret"

   # Stripe
   STRIPE_SECRET_KEY="sk_test_..."
   STRIPE_PUBLISHABLE_KEY="pk_test_..."
   STRIPE_WEBHOOK_SECRET="whsec_..."
   STRIPE_PRO_PRICE_ID="price_..."
   STRIPE_ENTERPRISE_PRICE_ID="price_..."

   # Resend
   RESEND_API_KEY="re_..."

   # App
   APP_URL="http://localhost:3000"
   ```

4. **Set up the database**

   Generate the Prisma client and push the schema:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
MetricFlow/
├── prisma/
│   └── schema.prisma              # Database schema (13 models, 5 enums)
├── src/
│   ├── app/
│   │   ├── (dashboard)/
│   │   │   └── dashboard/         # Dashboard, Analytics, Projects, Team,
│   │   │                          #   Activity, Settings, API Keys
│   │   ├── (marketing)/           # Landing page, Pricing, API Docs
│   │   ├── api/
│   │   │   ├── auth/              # NextAuth, register, verify, password reset
│   │   │   ├── billing/           # Stripe checkout, portal, webhooks
│   │   │   ├── events/            # CRUD + CSV/PDF export
│   │   │   ├── v1/               # Public API (events, metrics, projects)
│   │   │   ├── sse/              # Server-Sent Events for real-time updates
│   │   │   └── ...               # Organizations, team, settings, etc.
│   │   ├── auth/                  # Sign in, sign up, verify, password reset
│   │   ├── invite/[token]/        # Team invite acceptance
│   │   └── onboarding/            # New user onboarding wizard
│   ├── components/
│   │   ├── dashboard/             # KPI cards, charts
│   │   ├── layout/                # Sidebar, header
│   │   ├── marketing/             # Hero, pricing, navbar, footer
│   │   ├── providers/             # Auth & theme providers
│   │   ├── shared/                # Logo, shared components
│   │   └── ui/                    # shadcn/ui primitives (25+ components)
│   ├── lib/                       # prisma, auth, stripe, resend, utils
│   ├── store/                     # Zustand UI state
│   └── types/                     # NextAuth type augmentations
├── .env.example
├── package.json
└── tsconfig.json
```

---

## 🔑 API Documentation

MetricFlow provides a public REST API for programmatic access to your events, metrics, and projects.

### Authentication

All API requests require an API key passed in the `x-api-key` header:
```bash
x-api-key: YOUR_API_KEY
```

Generate API keys from the **API Keys** page in the dashboard.

### Endpoints

#### Track an Event
```bash
curl -X POST http://localhost:3000/api/v1/events \
  -H "x-api-key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "purchase",
    "type": "PURCHASE",
    "projectId": "your-project-id",
    "properties": { "item": "subscription" },
    "revenue": 29.99,
    "userId_external": "user-123",
    "country": "US",
    "device": "desktop",
    "browser": "Chrome"
  }'
```

**Event types**: `PAGE_VIEW`, `SIGN_UP`, `PURCHASE`, `CLICK`, `CUSTOM`

#### List Events
```bash
curl "http://localhost:3000/api/v1/events?page=1&limit=50" \
  -H "x-api-key: YOUR_API_KEY"
```

#### Get Metrics
```bash
curl http://localhost:3000/api/v1/metrics \
  -H "x-api-key: YOUR_API_KEY"
```

#### List Projects
```bash
curl http://localhost:3000/api/v1/projects \
  -H "x-api-key: YOUR_API_KEY"
```

For interactive API documentation with example responses, visit `/docs` after starting the development server.

---

## 🎯 Key Features in Detail

### Organizations & Projects
- Create multiple organizations, each with its own billing and team
- Each organization can have multiple projects
- Projects contain their own metrics and events
- Role-based access: **Admin** (full access), **Editor** (read/write), **Viewer** (read-only)

### Real-Time Dashboard
- 4 KPI cards with trend indicators
- 8 chart types (area, bar, line, pie, etc.) via Recharts
- SSE endpoint pushes live data every 3 seconds
- Activity log with pagination

### Event Tracking
- Track page views, sign-ups, purchases, clicks, and custom events
- Attach JSON properties, revenue amounts, and user metadata
- Filter by date range, country, device, browser
- Export to CSV (up to 10,000 events) or PDF report

### Subscription Plans
| | Free | Pro ($29/mo) | Enterprise ($99/mo) |
|---|---|---|---|
| Projects | 1 | 10 | Unlimited |
| Events/month | 1,000 | 100,000 | Unlimited |
| Team members | 1 | 10 | Unlimited |
| Data retention | 7 days | 1 year | Unlimited |
| API access | — | ✓ | ✓ |
| CSV/PDF export | — | ✓ | ✓ |

---

## 🧪 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Database Management

```bash
npx prisma studio               # Open Prisma Studio (database GUI)
npx prisma generate              # Generate Prisma Client
npx prisma db push               # Push schema changes to database
npx prisma migrate dev --name x  # Create a migration
```

---

## 🔒 Security

- **Next.js 15.2.9** — Patched known CVEs: HTTP request deserialization DoS, cache poisoning DoS, middleware auth bypass
- **Authentication** — Secure session management with NextAuth.js (JWT strategy)
- **Password Hashing** — bcryptjs for credential-based authentication
- **API Keys** — Unique keys with expiration and last-used tracking
- **Rate Limiting** — Per-organization API rate limits
- **Input Validation** — Zod schema validation on all API endpoints and forms
- **SQL Injection Prevention** — Prisma ORM with parameterized queries
- **Null Safety** — Defensive coding with optional chaining across all API routes

---

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add environment variables in the Vercel dashboard
4. Deploy

### Manual Deployment

```bash
npm run build
npx prisma migrate deploy
npm run start
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) — React framework
- [shadcn/ui](https://ui.shadcn.com/) — UI components
- [Prisma](https://www.prisma.io/) — Database ORM
- [Recharts](https://recharts.org/) — Chart library
- [Lucide](https://lucide.dev/) — Icons

---

## 📧 Support

For support, please [open an issue](https://github.com/AbubakerImran/MetricFlow/issues) on GitHub.

---

<div align="center">
  Made with ❤️ by the MetricFlow Team
</div>
