"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Settings, Trash2 } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const COLORS = ["#6366F1", "#3B82F6", "#10B981", "#F59E0B", "#EF4444"];

const projectMap: Record<string, { name: string; color: string; description: string }> = {
  "1": { name: "Marketing Website", color: "#3B82F6", description: "Main marketing site analytics" },
  "2": { name: "Mobile App", color: "#10B981", description: "iOS and Android app tracking" },
  "3": { name: "E-Commerce Store", color: "#8B5CF6", description: "Online store conversion tracking" },
  "4": { name: "SaaS Platform", color: "#F59E0B", description: "Product usage analytics" },
};

const eventsData = Array.from({ length: 30 }, (_, i) => ({
  date: format(new Date(Date.now() - (29 - i) * 86400000), "MMM dd"),
  events: Math.floor(50 + Math.random() * 150),
}));

const eventTypes = [
  { name: "Page Views", value: 2450 },
  { name: "Clicks", value: 1230 },
  { name: "Sign Ups", value: 560 },
  { name: "Purchases", value: 340 },
  { name: "Custom", value: 180 },
];

const tooltipStyle = { backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" };

export default function ProjectDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const project = projectMap[id] || { name: "Project", color: "#6366F1", description: "Project details" };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild><Link href="/dashboard/projects"><ArrowLeft className="h-4 w-4" /></Link></Button>
          <div className="flex items-center gap-3">
            <div className="h-4 w-4 rounded-full" style={{ backgroundColor: project.color }} />
            <div>
              <h2 className="text-2xl font-bold">{project.name}</h2>
              <p className="text-muted-foreground">{project.description}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm"><Settings className="mr-2 h-4 w-4" />Settings</Button>
          <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600"><Trash2 className="mr-2 h-4 w-4" />Delete</Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Events</p>
            <p className="text-2xl font-bold mt-1">4,760</p>
            <Badge variant="secondary" className="mt-2 text-xs text-emerald-500">+12.3%</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Revenue</p>
            <p className="text-2xl font-bold mt-1">$12,450</p>
            <Badge variant="secondary" className="mt-2 text-xs text-emerald-500">+8.7%</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Conversion Rate</p>
            <p className="text-2xl font-bold mt-1">3.2%</p>
            <Badge variant="secondary" className="mt-2 text-xs text-emerald-500">+0.5%</Badge>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Events Over Time</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={eventsData}>
                <defs>
                  <linearGradient id="projectGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={project.color} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={project.color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="events" stroke={project.color} fill="url(#projectGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Event Types</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={eventTypes} cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={5} dataKey="value"
                  label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}>
                  {eventTypes.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Top Events</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={eventTypes} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis type="number" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <YAxis dataKey="name" type="category" width={80} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="value" fill={project.color} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
