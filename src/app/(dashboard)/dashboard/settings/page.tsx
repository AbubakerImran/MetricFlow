"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Building, CreditCard, Bell, User, Trash2, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const [orgName, setOrgName] = useState("MetricFlow Demo");
  const [notifications, setNotifications] = useState({
    weeklyDigest: true,
    teamInvites: true,
    billingEvents: true,
    thresholdAlerts: false,
    teamActivity: false,
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-muted-foreground">Manage your organization and preferences</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general"><Building className="mr-2 h-4 w-4" />General</TabsTrigger>
          <TabsTrigger value="billing"><CreditCard className="mr-2 h-4 w-4" />Billing</TabsTrigger>
          <TabsTrigger value="notifications"><Bell className="mr-2 h-4 w-4" />Notifications</TabsTrigger>
          <TabsTrigger value="profile"><User className="mr-2 h-4 w-4" />Profile</TabsTrigger>
        </TabsList>

        {/* General */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Organization</CardTitle>
              <CardDescription>Manage your organization settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Organization Name</Label>
                <Input value={orgName} onChange={(e) => setOrgName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Slug</Label>
                <Input value="metricflow-demo" disabled className="bg-muted" />
                <p className="text-xs text-muted-foreground">This cannot be changed</p>
              </div>
              <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={() => toast.success("Settings saved")}>Save Changes</Button>
            </CardContent>
          </Card>
          <Card className="border-red-500/20">
            <CardHeader>
              <CardTitle className="text-red-500">Danger Zone</CardTitle>
              <CardDescription>Irreversible actions</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="destructive"><Trash2 className="mr-2 h-4 w-4" />Delete Organization</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing */}
        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>You are currently on the Pro plan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold">Pro</h3>
                    <Badge className="bg-indigo-600">Active</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">$29/month • Renews on March 1, 2025</p>
                </div>
                <Button variant="outline"><ExternalLink className="mr-2 h-4 w-4" />Manage Billing</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Usage</CardTitle>
              <CardDescription>Current billing period usage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Events</span>
                  <span className="font-medium">45,230 / 100,000</span>
                </div>
                <Progress value={45.23} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Projects</span>
                  <span className="font-medium">4 / 10</span>
                </div>
                <Progress value={40} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Team Members</span>
                  <span className="font-medium">4 / 10</span>
                </div>
                <Progress value={40} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Invoice History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { date: "Feb 1, 2025", amount: "$29.00", status: "Paid" },
                  { date: "Jan 1, 2025", amount: "$29.00", status: "Paid" },
                  { date: "Dec 1, 2024", amount: "$29.00", status: "Paid" },
                  { date: "Nov 1, 2024", amount: "$29.00", status: "Paid" },
                  { date: "Oct 1, 2024", amount: "$29.00", status: "Paid" },
                  { date: "Sep 1, 2024", amount: "$99.00", status: "Paid" },
                ].map((invoice, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="flex items-center gap-3">
                      <span className="text-sm">{invoice.date}</span>
                      <span className="text-sm font-medium">{invoice.amount}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs text-emerald-500">{invoice.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>Choose what emails you receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { key: "weeklyDigest" as const, label: "Weekly Digest", description: "Receive a weekly summary of your analytics" },
                { key: "teamInvites" as const, label: "Team Invitations", description: "Get notified when you receive a team invite" },
                { key: "billingEvents" as const, label: "Billing Events", description: "Payment confirmations and billing alerts" },
                { key: "thresholdAlerts" as const, label: "Threshold Alerts", description: "Alert when metrics exceed thresholds" },
                { key: "teamActivity" as const, label: "Team Activity", description: "Notifications about team member actions" },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                  <Switch
                    checked={notifications[item.key]}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, [item.key]: checked })}
                  />
                </div>
              ))}
              <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={() => toast.success("Preferences saved")}>Save Preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Profile */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Manage your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input defaultValue="Alex Owner" />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input defaultValue="owner@metricflow.io" disabled className="bg-muted" />
              </div>
              <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={() => toast.success("Profile updated")}>Update Profile</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your password</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Current Password</Label>
                <Input type="password" />
              </div>
              <div className="space-y-2">
                <Label>New Password</Label>
                <Input type="password" />
              </div>
              <div className="space-y-2">
                <Label>Confirm New Password</Label>
                <Input type="password" />
              </div>
              <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={() => toast.success("Password updated")}>Update Password</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Connected Accounts</CardTitle>
              <CardDescription>Manage your OAuth connections</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold">G</div>
                  <div>
                    <p className="text-sm font-medium">Google</p>
                    <p className="text-xs text-muted-foreground">Not connected</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Connect</Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold">GH</div>
                  <div>
                    <p className="text-sm font-medium">GitHub</p>
                    <p className="text-xs text-muted-foreground">Not connected</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Connect</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-500/20">
            <CardHeader>
              <CardTitle className="text-red-500">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="destructive"><Trash2 className="mr-2 h-4 w-4" />Delete Account</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
