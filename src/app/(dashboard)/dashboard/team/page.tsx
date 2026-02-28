"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, MoreHorizontal, Users, Shield, Pencil, Eye, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type MemberRole = "ADMIN" | "EDITOR" | "VIEWER";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: MemberRole;
  status: "active" | "pending";
  joinedAt: string;
  isCurrentUser?: boolean;
}

const roleConfig = {
  ADMIN: { label: "Admin", color: "bg-blue-500/10 text-blue-500", icon: Shield, description: "Full access to all features" },
  EDITOR: { label: "Editor", color: "bg-emerald-500/10 text-emerald-500", icon: Pencil, description: "Can create and manage data" },
  VIEWER: { label: "Viewer", color: "bg-zinc-500/10 text-zinc-400", icon: Eye, description: "Read-only access" },
};

const initialMembers: TeamMember[] = [
  { id: "1", name: "Alex Owner", email: "owner@metricflow.io", role: "ADMIN", status: "active", joinedAt: "2024-01-15", isCurrentUser: true },
  { id: "2", name: "Sarah Admin", email: "admin@metricflow.io", role: "ADMIN", status: "active", joinedAt: "2024-02-01" },
  { id: "3", name: "Mike Editor", email: "editor@metricflow.io", role: "EDITOR", status: "active", joinedAt: "2024-03-10" },
  { id: "4", name: "Jane Viewer", email: "viewer@metricflow.io", role: "VIEWER", status: "active", joinedAt: "2024-04-05" },
  { id: "5", name: "", email: "pending@example.com", role: "VIEWER", status: "pending", joinedAt: "2024-05-20" },
];

export default function TeamPage() {
  const [members, setMembers] = useState(initialMembers);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<MemberRole>("VIEWER");

  const handleInvite = () => {
    if (!inviteEmail.trim()) { toast.error("Email is required"); return; }
    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: "",
      email: inviteEmail,
      role: inviteRole,
      status: "pending",
      joinedAt: new Date().toISOString().split("T")[0],
    };
    setMembers([...members, newMember]);
    setInviteEmail("");
    setInviteRole("VIEWER");
    setDialogOpen(false);
    toast.success(`Invitation sent to ${inviteEmail}`);
  };

  const handleRoleChange = (memberId: string, newRole: MemberRole) => {
    setMembers(members.map(m => m.id === memberId ? { ...m, role: newRole } : m));
    toast.success("Role updated");
  };

  const handleRemove = (memberId: string) => {
    setMembers(members.filter(m => m.id !== memberId));
    toast.success("Member removed");
  };

  const activeCount = members.filter(m => m.status === "active").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Team</h2>
          <p className="text-muted-foreground">{activeCount} of 10 members (Pro plan)</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700"><UserPlus className="mr-2 h-4 w-4" />Invite Member</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Invite Team Member</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Email address</Label>
                <Input type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="colleague@company.com" />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={inviteRole} onValueChange={(v) => setInviteRole(v as MemberRole)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(roleConfig).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center gap-2">
                          <config.icon className="h-4 w-4" />
                          <div>
                            <span className="font-medium">{config.label}</span>
                            <span className="text-xs text-muted-foreground ml-2">{config.description}</span>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={handleInvite}>Send Invitation</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Members</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {members.map((member) => {
              const config = roleConfig[member.role];
              return (
                <div key={member.id} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-indigo-500/10 text-indigo-500 text-xs">
                        {member.name ? member.name.split(" ").map(n => n[0]).join("") : member.email[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">
                        {member.name || member.email}
                        {member.isCurrentUser && <span className="text-muted-foreground ml-1">(You)</span>}
                      </p>
                      <p className="text-xs text-muted-foreground">{member.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={cn("text-xs", config.color)} variant="secondary">{config.label}</Badge>
                    <Badge variant={member.status === "active" ? "secondary" : "outline"} className="text-xs">
                      {member.status === "active" ? "Active" : "Pending"}
                    </Badge>
                    <span className="text-xs text-muted-foreground hidden sm:inline">{member.joinedAt}</span>
                    {!member.isCurrentUser && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>Change Role</DropdownMenuSubTrigger>
                            <DropdownMenuSubContent>
                              {(["ADMIN", "EDITOR", "VIEWER"] as const).map((role) => (
                                <DropdownMenuItem key={role} onClick={() => handleRoleChange(member.id, role)}>
                                  {roleConfig[role].label}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuSubContent>
                          </DropdownMenuSub>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-500" onClick={() => handleRemove(member.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
