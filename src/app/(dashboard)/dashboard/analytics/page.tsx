"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, FileText } from "lucide-react";
import { format } from "date-fns";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, ComposedChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const COLORS = ["#6366F1", "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#14B8A6"];

const eventsData = Array.from({ length: 30 }, (_, i) => ({
  date: format(new Date(Date.now() - (29 - i) * 86400000), "MMM dd"),
  events: Math.floor(100 + Math.random() * 200 + i * 8),
}));

const revenueData = Array.from({ length: 12 }, (_, i) => ({
  month: format(new Date(2024, i, 1), "MMM"),
  revenue: Math.floor(5000 + Math.random() * 10000 + i * 2000),
  cumulative: 0,
}));
revenueData.forEach((d, i) => { d.cumulative = revenueData.slice(0, i + 1).reduce((sum, r) => sum + r.revenue, 0); });

const topEvents = [
  { name: "Homepage Visit", count: 4520 },
  { name: "Signup Click", count: 2340 },
  { name: "Pricing Page", count: 1890 },
  { name: "Dashboard View", count: 1650 },
  { name: "Settings Open", count: 1230 },
  { name: "Export Click", count: 980 },
  { name: "Profile Update", count: 870 },
  { name: "API Key Create", count: 650 },
];

const funnelData = [
  { stage: "Page Views", value: 10000, rate: "100%" },
  { stage: "Sign Ups", value: 2500, rate: "25%" },
  { stage: "Purchases", value: 500, rate: "5%" },
];

const countryData = [
  { country: "United States", users: 3200 },
  { country: "United Kingdom", users: 1500 },
  { country: "Germany", users: 1100 },
  { country: "France", users: 850 },
  { country: "Canada", users: 720 },
  { country: "Australia", users: 550 },
  { country: "Japan", users: 420 },
  { country: "Brazil", users: 380 },
];

const hourlyData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i.toString().padStart(2, "0")}:00`,
  events: Math.floor(20 + Math.random() * 80 + (i >= 9 && i <= 17 ? 100 : 0)),
}));

const browserData = [
  { name: "Chrome", value: 65 },
  { name: "Safari", value: 20 },
  { name: "Firefox", value: 10 },
  { name: "Edge", value: 5 },
];

const deviceData = [
  { name: "Desktop", value: 55 },
  { name: "Mobile", value: 35 },
  { name: "Tablet", value: 10 },
];

const tooltipStyle = { backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" };

export default function AnalyticsPage() {
  const [period, setPeriod] = useState("30D");
  const periods = ["7D", "30D", "90D", "12M"];

  const handleExportCSV = async () => {
    window.open("/api/events/export/csv", "_blank");
  };

  const handleExportPDF = async () => {
    window.open("/api/events/export/pdf", "_blank");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Analytics</h2>
          <p className="text-muted-foreground">Detailed insights into your data</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {periods.map((p) => (
            <Button key={p} variant={period === p ? "default" : "outline"} size="sm" onClick={() => setPeriod(p)}
              className={period === p ? "bg-indigo-600 hover:bg-indigo-700" : ""}>{p}</Button>
          ))}
          <Button variant="outline" size="sm" onClick={handleExportCSV}><Download className="mr-2 h-4 w-4" />CSV</Button>
          <Button variant="outline" size="sm" onClick={handleExportPDF}><FileText className="mr-2 h-4 w-4" />PDF</Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Events Over Time */}
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Events Over Time</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={eventsData}>
                <defs>
                  <linearGradient id="eventsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="events" stroke="#6366F1" fill="url(#eventsGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Composed */}
        <Card>
          <CardHeader><CardTitle className="text-base">Revenue</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend />
                <Bar dataKey="revenue" fill="#6366F1" radius={[4, 4, 0, 0]} name="Monthly" />
                <Line type="monotone" dataKey="cumulative" stroke="#10B981" strokeWidth={2} name="Cumulative" dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Events */}
        <Card>
          <CardHeader><CardTitle className="text-base">Top Events</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topEvents} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis type="number" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <YAxis dataKey="name" type="category" width={100} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="count" fill="#3B82F6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Conversion Funnel */}
        <Card>
          <CardHeader><CardTitle className="text-base">Conversion Funnel</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {funnelData.map((stage, i) => (
                <div key={stage.stage}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{stage.stage}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold">{stage.value.toLocaleString()}</span>
                      <Badge variant="secondary" className="text-xs">{stage.rate}</Badge>
                    </div>
                  </div>
                  <div className="h-8 rounded-lg bg-muted overflow-hidden">
                    <div className="h-full rounded-lg transition-all duration-500" style={{ width: `${(stage.value / funnelData[0].value) * 100}%`, backgroundColor: COLORS[i] }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Users by Country */}
        <Card>
          <CardHeader><CardTitle className="text-base">Users by Country</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={countryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis type="number" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <YAxis dataKey="country" type="category" width={100} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="users" fill="#10B981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Hourly Distribution */}
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Hourly Distribution</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="hour" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} interval={2} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="events" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Browser */}
        <Card>
          <CardHeader><CardTitle className="text-base">Browser Distribution</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={browserData} cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={5} dataKey="value"
                  label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}>
                  {browserData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Device */}
        <Card>
          <CardHeader><CardTitle className="text-base">Device Breakdown</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={deviceData} cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={5} dataKey="value"
                  label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}>
                  {deviceData.map((_, i) => <Cell key={i} fill={COLORS[i + 3]} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
