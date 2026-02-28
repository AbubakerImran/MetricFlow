"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { KPICard } from "@/components/dashboard/kpi-card";
import { DollarSign, Users, Activity, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const CHART_COLORS = ["#6366F1", "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

const periods = ["7D", "30D", "90D", "Year"] as const;

function generateRevenueData() {
  return Array.from({ length: 30 }, (_, i) => ({
    date: format(new Date(Date.now() - (29 - i) * 86400000), "MMM dd"),
    revenue: Math.floor(300 + Math.random() * 200 + i * 5),
  }));
}

function generateUserData() {
  return Array.from({ length: 30 }, (_, i) => ({
    date: format(new Date(Date.now() - (29 - i) * 86400000), "MMM dd"),
    users: Math.floor(100 + Math.random() * 80 + i * 3),
  }));
}

const eventTypeData = [
  { name: "Page Views", value: 4520 },
  { name: "Sign Ups", value: 1230 },
  { name: "Purchases", value: 890 },
  { name: "Clicks", value: 2340 },
  { name: "Custom", value: 560 },
];

const trafficData = [
  { name: "Direct", value: 35 },
  { name: "Google", value: 25 },
  { name: "Twitter", value: 15 },
  { name: "Facebook", value: 10 },
  { name: "LinkedIn", value: 8 },
  { name: "Other", value: 7 },
];

const recentActivity = [
  { action: "New signup", description: "user@example.com signed up", time: "2 min ago" },
  { action: "Purchase", description: "$49.99 — Pro plan upgrade", time: "15 min ago" },
  { action: "Page view", description: "/pricing visited from Google", time: "23 min ago" },
  { action: "API call", description: "POST /api/v1/events from Production", time: "45 min ago" },
  { action: "Team invite", description: "admin@company.com invited editor@team.io", time: "1 hr ago" },
  { action: "Export", description: "CSV export — 2,340 events", time: "2 hrs ago" },
  { action: "New project", description: "Mobile App project created", time: "3 hrs ago" },
  { action: "Settings", description: "Organization name updated", time: "5 hrs ago" },
];

export default function DashboardPage() {
  const [period, setPeriod] = useState<typeof periods[number]>("30D");
  const [kpis, setKpis] = useState({
    revenue: "48,290",
    revenueChange: 12.5,
    users: "2,847",
    usersChange: 8.2,
    sessions: "1,249",
    sessionsChange: 15.3,
    conversion: "3.24",
    conversionChange: 0.4,
  });
  const [revenueData] = useState(generateRevenueData);
  const [userData] = useState(generateUserData);
  const eventSourceRef = useRef<EventSource | null>(null);

  const connectSSE = useCallback(() => {
    const es = new EventSource("/api/sse/dashboard");
    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setKpis(data);
      } catch {
        // ignore parse errors
      }
    };
    es.onerror = () => {
      es.close();
      setTimeout(connectSSE, 5000);
    };
    eventSourceRef.current = es;
  }, []);

  useEffect(() => {
    connectSSE();
    return () => { eventSourceRef.current?.close(); };
  }, [connectSSE]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Good morning! 👋</h2>
          <p className="text-muted-foreground">{format(new Date(), "EEEE, MMMM d, yyyy")}</p>
        </div>
        <div className="flex items-center gap-2">
          {periods.map((p) => (
            <Button key={p} variant={period === p ? "default" : "outline"} size="sm" onClick={() => setPeriod(p)}
              className={period === p ? "bg-indigo-600 hover:bg-indigo-700" : ""}>
              {p}
            </Button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard title="Total Revenue" value={kpis.revenue} change={kpis.revenueChange} icon={DollarSign} prefix="$" />
        <KPICard title="Total Users" value={kpis.users} change={kpis.usersChange} icon={Users} />
        <KPICard title="Active Sessions" value={kpis.sessions} change={kpis.sessionsChange} icon={Activity} live />
        <KPICard title="Conversion Rate" value={`${kpis.conversion}%`} change={kpis.conversionChange} icon={TrendingUp} />
      </div>

      {/* Charts - 2 columns */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Over Time */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Revenue Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                <Area type="monotone" dataKey="revenue" stroke="#6366F1" fill="url(#revenueGradient)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Users Over Time */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Users Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                <Line type="monotone" dataKey="users" stroke="#3B82F6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Events by Type */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Events by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={eventTypeData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis type="number" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <YAxis dataKey="name" type="category" width={80} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                <Bar dataKey="value" fill="#6366F1" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Traffic Sources */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Traffic Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={trafficData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value" label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}>
                  {trafficData.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="text-xs">{item.action}</Badge>
                  <span className="text-sm">{item.description}</span>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{item.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
