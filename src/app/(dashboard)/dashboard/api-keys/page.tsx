"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Key, Copy, Eye, EyeOff, Trash2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ApiKeyItem {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsedAt: string | null;
  expiresAt: string | null;
  status: "active" | "expired";
}

const initialKeys: ApiKeyItem[] = [
  { id: "1", name: "Production", key: "mk_live_a1b2c3d4-e5f6-7890-abcd-ef1234567890", createdAt: "2024-01-15", lastUsedAt: "2025-02-27", expiresAt: null, status: "active" },
  { id: "2", name: "Development", key: "mk_live_f9e8d7c6-b5a4-3210-fedc-ba0987654321", createdAt: "2024-03-01", lastUsedAt: "2025-02-20", expiresAt: "2025-06-01", status: "active" },
];

export default function ApiKeysPage() {
  const [keys, setKeys] = useState(initialKeys);
  const [createOpen, setCreateOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyExpiry, setNewKeyExpiry] = useState("never");
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [revealedKeys, setRevealedKeys] = useState<Set<string>>(new Set());

  const handleCreate = () => {
    if (!newKeyName.trim()) { toast.error("Key name is required"); return; }
    const key = `mk_live_${crypto.randomUUID()}`;
    const expiresAt = newKeyExpiry === "never" ? null
      : newKeyExpiry === "30d" ? new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0]
      : newKeyExpiry === "90d" ? new Date(Date.now() + 90 * 86400000).toISOString().split("T")[0]
      : new Date(Date.now() + 365 * 86400000).toISOString().split("T")[0];

    const newKey: ApiKeyItem = {
      id: Date.now().toString(),
      name: newKeyName,
      key,
      createdAt: new Date().toISOString().split("T")[0],
      lastUsedAt: null,
      expiresAt,
      status: "active",
    };
    setKeys([...keys, newKey]);
    setGeneratedKey(key);
  };

  const handleCopy = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success("API key copied to clipboard");
  };

  const handleRevoke = (keyId: string) => {
    setKeys(keys.filter(k => k.id !== keyId));
    toast.success("API key revoked");
  };

  const toggleReveal = (keyId: string) => {
    const next = new Set(revealedKeys);
    if (next.has(keyId)) next.delete(keyId);
    else next.add(keyId);
    setRevealedKeys(next);
  };

  const maskKey = (key: string) => {
    return key.substring(0, 10) + "****" + key.substring(key.length - 4);
  };

  const resetDialog = () => {
    setCreateOpen(false);
    setNewKeyName("");
    setNewKeyExpiry("never");
    setGeneratedKey(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">API Keys</h2>
          <p className="text-muted-foreground">Manage your API keys for programmatic access</p>
        </div>
        <Dialog open={createOpen} onOpenChange={(open) => { if (!open) resetDialog(); else setCreateOpen(true); }}>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700"><Plus className="mr-2 h-4 w-4" />Create Key</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{generatedKey ? "API Key Created" : "Create API Key"}</DialogTitle>
              {generatedKey && <DialogDescription>Copy your API key now. You won&apos;t be able to see it again.</DialogDescription>}
            </DialogHeader>
            {generatedKey ? (
              <div className="space-y-4 py-4">
                <div className="flex items-center gap-2 rounded-lg border bg-muted p-3">
                  <code className="flex-1 text-sm break-all">{generatedKey}</code>
                  <Button variant="ghost" size="icon" onClick={() => handleCopy(generatedKey)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-yellow-500/10 p-3 text-sm text-yellow-600 dark:text-yellow-400">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>Copy this key now — you won&apos;t see it again!</span>
                </div>
                <Button className="w-full" onClick={resetDialog}>Done</Button>
              </div>
            ) : (
              <>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Key Name</Label>
                    <Input value={newKeyName} onChange={(e) => setNewKeyName(e.target.value)} placeholder="e.g., Production" />
                  </div>
                  <div className="space-y-2">
                    <Label>Expiration</Label>
                    <Select value={newKeyExpiry} onValueChange={setNewKeyExpiry}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="never">Never</SelectItem>
                        <SelectItem value="30d">30 days</SelectItem>
                        <SelectItem value="90d">90 days</SelectItem>
                        <SelectItem value="1y">1 year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={resetDialog}>Cancel</Button>
                  <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={handleCreate}>Generate Key</Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Active Keys</CardTitle></CardHeader>
        <CardContent>
          {keys.length === 0 ? (
            <div className="py-8 text-center">
              <Key className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No API keys</h3>
              <p className="text-muted-foreground mb-4">Create an API key to get started.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {keys.map((apiKey) => (
                <div key={apiKey.id} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                      <Key className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{apiKey.name}</p>
                      <code className="text-xs text-muted-foreground">
                        {revealedKeys.has(apiKey.id) ? apiKey.key : maskKey(apiKey.key)}
                      </code>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-muted-foreground hidden md:inline">
                      {apiKey.lastUsedAt ? `Last used: ${apiKey.lastUsedAt}` : "Never used"}
                    </span>
                    <Badge variant="secondary" className={cn("text-xs", apiKey.status === "active" ? "text-emerald-500" : "text-red-500")}>
                      {apiKey.status}
                    </Badge>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleReveal(apiKey.id)}>
                      {revealedKeys.has(apiKey.id) ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleCopy(apiKey.key)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600" onClick={() => handleRevoke(apiKey.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
