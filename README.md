# MetricFlow

<div align="center">
  <h3>🚀 Modern SaaS Analytics Platform</h3>
  <p>Track, visualize, and analyze your product metrics in real-time</p>
</div>

---

## 📖 Overview

**MetricFlow** is a comprehensive analytics and metrics tracking platform built for modern SaaS teams. It provides real-time dashboards, event tracking, team collaboration features, and powerful APIs to help you make data-driven decisions.

### ✨ Key Features

- **📊 Real-Time Analytics**: Track your metrics as they happen with live-updating dashboards and instant insights
- **👥 Team Collaboration**: Invite team members with role-based access control (Admin, Editor, Viewer)
- **📈 Custom Dashboards**: Build beautiful dashboards with customizable charts and widgets
- **💾 Data Export**: Export your data to CSV or PDF with one click
- **🔌 REST API**: Full REST API with authentication for tracking events from any platform
- **💳 Stripe Integration**: Seamless subscription management with multiple pricing tiers
- **🔐 Authentication**: Secure auth with NextAuth.js supporting multiple providers (Google, GitHub, email/password)
- **🎯 Event Tracking**: Track custom events with properties, revenue, and user metadata
- **🔑 API Key Management**: Generate and manage API keys for programmatic access
- **📨 Email Notifications**: Automated email notifications using Resend
- **🌍 Multi-Organization**: Support for multiple organizations with team member management
- **🎨 Modern UI**: Built with Tailwind CSS, Radix UI, and shadcn/ui components
- **🌓 Dark Mode**: Full dark mode support with theme switching

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod validation
- **State Management**: Zustand
- **Icons**: Lucide React

### Backend
- **Database**: PostgreSQL
- **ORM**: Prisma 7
- **Authentication**: NextAuth.js
- **Email**: Resend
- **Payments**: Stripe
- **File Generation**: jsPDF, PapaParse

### Development Tools
- **Linting**: ESLint
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
   
   Generate Prisma client and push the schema to your database:
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
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (dashboard)/       # Dashboard pages
│   │   ├── (marketing)/       # Marketing pages
│   │   ├── api/               # API routes
│   │   ├── auth/              # Authentication pages
│   │   └── onboarding/        # Onboarding flow
│   ├── components/
│   │   ├── dashboard/         # Dashboard components
│   │   ├── layout/            # Layout components
│   │   ├── marketing/         # Marketing components
│   │   ├── shared/            # Shared components
│   │   └── ui/                # UI primitives (shadcn/ui)
│   ├── lib/                   # Utility functions
│   ├── store/                 # Zustand stores
│   └── types/                 # TypeScript types
├── .env.example               # Environment variables template
├── package.json               # Dependencies
└── tsconfig.json              # TypeScript config
```

---

## 🔑 API Documentation

MetricFlow provides a REST API for programmatic access to your metrics and events.

### Authentication

API requests require an API key in the `x-api-key` header:
```bash
x-api-key: YOUR_API_KEY
```

### Endpoints

#### Track Events
```bash
POST /api/v1/events
Content-Type: application/json
x-api-key: YOUR_API_KEY

{
  "projectId": "project-id",
  "name": "purchase",
  "type": "PURCHASE",
  "properties": { "item": "subscription" },
  "revenue": 29.99,
  "userId_external": "user-123",
  "country": "US",
  "device": "desktop",
  "browser": "Chrome"
}
```

#### Create Metrics
```bash
POST /api/v1/metrics
Content-Type: application/json
x-api-key: YOUR_API_KEY

{
  "projectId": "project-id",
  "name": "Active Users",
  "value": 1250,
  "previousValue": 1100,
  "unit": "users"
}
```

#### Get Projects
```bash
GET /api/v1/projects
x-api-key: YOUR_API_KEY
```

#### Get Events
```bash
GET /api/v1/events?page=1&limit=50
x-api-key: YOUR_API_KEY
```

#### Get Metrics
```bash
GET /api/v1/metrics
x-api-key: YOUR_API_KEY
```

For full API documentation, visit `/docs` after starting the development server.

---

## 🎯 Key Features Explained

### Organizations & Projects
- Create multiple organizations
- Each organization can have multiple projects
- Projects contain metrics and events
- Role-based access control per organization

### Metrics Tracking
- Track numerical metrics over time
- Compare current vs previous values
- Visualize trends with charts
- Export data to CSV/PDF

### Event Tracking
- Track custom events (page views, sign-ups, purchases, clicks)
- Attach properties, revenue, and user metadata
- Filter by date, country, device, browser
- Real-time event streaming with SSE

### Subscription Plans
- **Free**: 1 project, 1,000 events/month, 7-day retention
- **Pro ($29/mo)**: 10 projects, 100,000 events/month, 90-day retention
- **Enterprise ($299/mo)**: Unlimited projects, 10M events/month, 2-year retention

---

## 🧪 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server

# Build
npm run build        # Build for production
npm run start        # Start production server

# Linting
npm run lint         # Run ESLint

# Database
npx prisma studio    # Open Prisma Studio (database GUI)
npx prisma generate  # Generate Prisma Client
npx prisma db push   # Push schema changes to database
```

### Database Management

View and edit your database with Prisma Studio:
```bash
npx prisma studio
```

Create a new migration:
```bash
npx prisma migrate dev --name your_migration_name
```

---

## 🔒 Security

This project includes several security best practices:

- **Next.js 15.2.9**: Patched known CVEs (DoS vulnerabilities, cache poisoning, middleware auth bypass)
- **Authentication**: Secure session management with NextAuth.js
- **Password Hashing**: bcryptjs for password encryption
- **API Keys**: Unique API keys for programmatic access
- **Input Validation**: Zod schema validation on all forms and API endpoints
- **SQL Injection Prevention**: Prisma ORM with parameterized queries
- **CSRF Protection**: Built-in Next.js CSRF protection

---

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy

### Docker

```bash
# Build
docker build -t metricflow .

# Run
docker run -p 3000:3000 --env-file .env metricflow
```

### Manual Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Set up PostgreSQL database

3. Run database migrations:
   ```bash
   npx prisma migrate deploy
   ```

4. Start the server:
   ```bash
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

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Inspired by modern SaaS analytics platforms

---

## 📧 Support

For support, please [open an issue](https://github.com/AbubakerImran/MetricFlow/issues) on GitHub.

---

<div align="center">
  Made with ❤️ by the MetricFlow Team
</div>
