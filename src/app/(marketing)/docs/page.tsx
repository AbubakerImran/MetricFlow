import { Badge } from "@/components/ui/badge";

const endpoints = [
  {
    method: "POST",
    path: "/api/v1/events",
    description: "Track a new event. Send event data from your application to MetricFlow for real-time processing and analytics.",
    curl: `curl -X POST https://api.metricflow.io/api/v1/events \\
  -H "x-api-key: YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "page_view",
    "properties": {
      "page": "/dashboard",
      "user_id": "usr_123",
      "duration": 4500
    }
  }'`,
    response: `{
  "id": "evt_abc123",
  "name": "page_view",
  "properties": {
    "page": "/dashboard",
    "user_id": "usr_123",
    "duration": 4500
  },
  "timestamp": "2024-01-15T10:30:00Z",
  "status": "accepted"
}`,
  },
  {
    method: "GET",
    path: "/api/v1/events",
    description: "Retrieve a list of tracked events. Supports filtering by name, date range, and pagination.",
    curl: `curl https://api.metricflow.io/api/v1/events?name=page_view&limit=10 \\
  -H "x-api-key: YOUR_API_KEY"`,
    response: `{
  "data": [
    {
      "id": "evt_abc123",
      "name": "page_view",
      "properties": { "page": "/dashboard" },
      "timestamp": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 1243,
    "limit": 10,
    "offset": 0,
    "has_more": true
  }
}`,
  },
  {
    method: "GET",
    path: "/api/v1/metrics",
    description: "Retrieve aggregated metrics for your project. Includes revenue, user counts, session data, and custom metrics.",
    curl: `curl https://api.metricflow.io/api/v1/metrics?period=30d \\
  -H "x-api-key: YOUR_API_KEY"`,
    response: `{
  "period": "30d",
  "metrics": {
    "total_revenue": 48290,
    "active_users": 2847,
    "total_sessions": 12493,
    "conversion_rate": 3.24,
    "avg_session_duration": 245
  },
  "comparison": {
    "revenue_change": 12.5,
    "users_change": 8.2
  }
}`,
  },
  {
    method: "GET",
    path: "/api/v1/projects",
    description: "List all projects associated with your account. Each project has its own set of events, metrics, and team members.",
    curl: `curl https://api.metricflow.io/api/v1/projects \\
  -H "x-api-key: YOUR_API_KEY"`,
    response: `{
  "data": [
    {
      "id": "prj_xyz789",
      "name": "My SaaS App",
      "created_at": "2024-01-01T00:00:00Z",
      "events_count": 15420,
      "team_members": 5
    }
  ],
  "pagination": {
    "total": 3,
    "limit": 10,
    "offset": 0,
    "has_more": false
  }
}`,
  },
];

const sidebarLinks = [
  { label: "Getting Started", href: "#getting-started" },
  { label: "Authentication", href: "#authentication" },
  { label: "POST /api/v1/events", href: "#post-events" },
  { label: "GET /api/v1/events", href: "#get-events" },
  { label: "GET /api/v1/metrics", href: "#get-metrics" },
  { label: "GET /api/v1/projects", href: "#get-projects" },
  { label: "Rate Limits", href: "#rate-limits" },
];

function MethodBadge({ method }: { method: string }) {
  const color = method === "POST"
    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
    : "bg-blue-500/10 text-blue-600 border-blue-500/20";
  return <Badge variant="outline" className={color}>{method}</Badge>;
}

export default function DocsPage() {
  return (
    <div className="py-20">
      <div className="container">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold md:text-5xl">API Documentation</h1>
          <p className="mt-4 text-lg text-muted-foreground">Everything you need to integrate MetricFlow into your application.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-10 max-w-6xl mx-auto">
          {/* Sidebar */}
          <aside className="hidden lg:block">
            <nav className="sticky top-24 space-y-1">
              {sidebarLinks.map((link) => (
                <a key={link.href} href={link.href} className="block rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                  {link.label}
                </a>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <div className="space-y-16">
            {/* Getting Started */}
            <section id="getting-started">
              <h2 className="text-2xl font-bold mb-4">Getting Started</h2>
              <p className="text-muted-foreground mb-4">
                The MetricFlow API allows you to programmatically track events, retrieve metrics, and manage projects. All API requests require authentication via an API key.
              </p>
              <div className="rounded-lg bg-zinc-900 p-4 text-sm text-zinc-100 overflow-x-auto">
                <code>Base URL: https://api.metricflow.io</code>
              </div>
            </section>

            {/* Authentication */}
            <section id="authentication">
              <h2 className="text-2xl font-bold mb-4">Authentication</h2>
              <p className="text-muted-foreground mb-4">
                All API requests must include an <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono">x-api-key</code> header with your API key. You can generate API keys from your project settings.
              </p>
              <div className="rounded-lg bg-zinc-900 p-4 text-sm text-zinc-100 overflow-x-auto">
                <pre><code>{`x-api-key: YOUR_API_KEY`}</code></pre>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Keep your API keys secure. Do not expose them in client-side code. Use environment variables to store keys in your application.
              </p>
            </section>

            {/* Endpoints */}
            {endpoints.map((ep, i) => {
              const anchorId = `${ep.method.toLowerCase()}-${ep.path.split("/").pop()}`;
              return (
                <section key={i} id={anchorId}>
                  <div className="flex items-center gap-3 mb-4">
                    <MethodBadge method={ep.method} />
                    <h2 className="text-xl font-bold font-mono">{ep.path}</h2>
                  </div>
                  <p className="text-muted-foreground mb-6">{ep.description}</p>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-semibold mb-2">Example Request</h3>
                      <div className="rounded-lg bg-zinc-900 p-4 text-sm text-zinc-100 overflow-x-auto">
                        <pre><code>{ep.curl}</code></pre>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold mb-2">Example Response</h3>
                      <div className="rounded-lg bg-zinc-900 p-4 text-sm text-zinc-100 overflow-x-auto">
                        <pre><code>{ep.response}</code></pre>
                      </div>
                    </div>
                  </div>
                </section>
              );
            })}

            {/* Rate Limits */}
            <section id="rate-limits">
              <h2 className="text-2xl font-bold mb-4">Rate Limits</h2>
              <p className="text-muted-foreground mb-4">API requests are rate limited based on your plan:</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 pr-4 font-medium">Plan</th>
                      <th className="text-left py-3 px-4 font-medium">Requests/min</th>
                      <th className="text-left py-3 px-4 font-medium">Requests/day</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3 pr-4">Free</td>
                      <td className="py-3 px-4">60</td>
                      <td className="py-3 px-4">1,000</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 pr-4">Pro</td>
                      <td className="py-3 px-4">600</td>
                      <td className="py-3 px-4">50,000</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 pr-4">Enterprise</td>
                      <td className="py-3 px-4">6,000</td>
                      <td className="py-3 px-4">Unlimited</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Rate limit headers are included in every response: <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono">X-RateLimit-Limit</code>, <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono">X-RateLimit-Remaining</code>, and <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono">X-RateLimit-Reset</code>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
