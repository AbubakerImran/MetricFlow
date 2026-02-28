"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, CreditCard, FolderPlus, Settings, Key, Download, LogIn, Pencil } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const actionIcons: Record<string, typeof UserPlus> = {
  "team.invite": UserPlus,
  "billing.upgrade": CreditCard,
  "project.create": FolderPlus,
  "settings.update": Settings,
  "api-key.create": Key,
  "export.csv": Download,
  "auth.login": LogIn,
  "project.update": Pencil,
};

const activities = Array.from({ length: 50 }, (_, i) => {
  const actions = [
    { action: "team.invite", description: "Invited editor@team.io to the team", user: "Alex Owner" },
    { action: "billing.upgrade", description: "Upgraded plan from Free to Pro", user: "Alex Owner" },
    { action: "project.create", description: "Created project 'Marketing Website'", user: "Sarah Admin" },
    { action: "settings.update", description: "Updated organization name", user: "Alex Owner" },
    { action: "api-key.create", description: "Created API key 'Production'", user: "Sarah Admin" },
    { action: "export.csv", description: "Exported 2,340 events as CSV", user: "Mike Editor" },
    { action: "auth.login", description: "Signed in from 192.168.1.1", user: "Jane Viewer" },
    { action: "project.update", description: "Updated project 'Mobile App'", user: "Mike Editor" },
  ];
  const activity = actions[i % actions.length];
  return {
    id: `activity-${i}`,
    ...activity,
    timestamp: new Date(Date.now() - i * 3600000 * (1 + Math.random() * 5)),
  };
});

export default function ActivityPage() {
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const perPage = 15;

  const filtered = filter === "all" ? activities : activities.filter(a => a.action === filter);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Activity</h2>
          <p className="text-muted-foreground">{filtered.length} activities</p>
        </div>
        <Select value={filter} onValueChange={(v) => { setFilter(v); setPage(1); }}>
          <SelectTrigger className="w-[200px]"><SelectValue placeholder="Filter by type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Activities</SelectItem>
            <SelectItem value="team.invite">Team Invites</SelectItem>
            <SelectItem value="billing.upgrade">Billing</SelectItem>
            <SelectItem value="project.create">Project Created</SelectItem>
            <SelectItem value="settings.update">Settings</SelectItem>
            <SelectItem value="api-key.create">API Keys</SelectItem>
            <SelectItem value="export.csv">Exports</SelectItem>
            <SelectItem value="auth.login">Auth</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-1">
            {paginated.map((activity) => {
              const Icon = actionIcons[activity.action] || Settings;
              return (
                <div key={activity.id} className="flex items-center gap-4 py-3 border-b last:border-0">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">{activity.user}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                  </span>
                </div>
              );
            })}
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Previous</Button>
              <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
              <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
