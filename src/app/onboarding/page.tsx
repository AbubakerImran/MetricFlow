"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Logo } from "@/components/shared/logo";
import { Building, FolderPlus, Users, Rocket, ArrowRight, Plus, X } from "lucide-react";
import { toast } from "sonner";

const PROJECT_COLORS = ["#3B82F6", "#10B981", "#8B5CF6", "#F59E0B", "#EF4444", "#EC4899", "#14B8A6", "#6366F1"];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [orgName, setOrgName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectColor, setProjectColor] = useState(PROJECT_COLORS[0]);
  const [emails, setEmails] = useState<string[]>([""]);

  const slug = orgName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const handleNext = () => {
    if (step === 1 && !orgName.trim()) { toast.error("Organization name is required"); return; }
    if (step === 2 && !projectName.trim()) { toast.error("Project name is required"); return; }
    if (step < 4) setStep(step + 1);
  };

  const handleFinish = () => {
    toast.success("Welcome to MetricFlow!");
    router.push("/dashboard");
  };

  const addEmail = () => setEmails([...emails, ""]);
  const removeEmail = (index: number) => setEmails(emails.filter((_, i) => i !== index));
  const updateEmail = (index: number, value: string) => {
    const updated = [...emails];
    updated[index] = value;
    setEmails(updated);
  };

  const stepIcons = [Building, FolderPlus, Users, Rocket];
  const stepTitles = ["Create Organization", "Create Project", "Invite Team", "You're All Set!"];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-muted/30">
      <div className="w-full max-w-lg space-y-6">
        <div className="flex justify-center"><Logo /></div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${s <= step ? "bg-indigo-600 text-white" : "bg-muted text-muted-foreground"}`}>
                {s}
              </div>
              {s < 4 && <div className={`w-12 h-0.5 ${s < step ? "bg-indigo-600" : "bg-muted"}`} />}
            </div>
          ))}
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/10">
              {(() => { const Icon = stepIcons[step - 1]; return <Icon className="h-6 w-6 text-indigo-500" />; })()}
            </div>
            <CardTitle>{stepTitles[step - 1]}</CardTitle>
            <CardDescription>
              {step === 1 && "Let's start by setting up your organization"}
              {step === 2 && "Create your first project to start tracking"}
              {step === 3 && "Invite your team members (optional)"}
              {step === 4 && "Your workspace is ready to go!"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {step === 1 && (
              <>
                <div className="space-y-2">
                  <Label>Organization Name</Label>
                  <Input value={orgName} onChange={(e) => setOrgName(e.target.value)} placeholder="Acme Inc." />
                </div>
                {slug && (
                  <div className="space-y-2">
                    <Label>Slug</Label>
                    <Input value={slug} disabled className="bg-muted" />
                  </div>
                )}
              </>
            )}

            {step === 2 && (
              <>
                <div className="space-y-2">
                  <Label>Project Name</Label>
                  <Input value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="My Website" />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea value={projectDescription} onChange={(e) => setProjectDescription(e.target.value)} placeholder="What are you tracking?" />
                </div>
                <div className="space-y-2">
                  <Label>Color</Label>
                  <div className="flex gap-2">
                    {PROJECT_COLORS.map((color) => (
                      <button key={color} onClick={() => setProjectColor(color)}
                        className={`h-8 w-8 rounded-full border-2 transition-all ${projectColor === color ? "border-foreground scale-110" : "border-transparent"}`}
                        style={{ backgroundColor: color }} />
                    ))}
                  </div>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                {emails.map((email, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Input type="email" value={email} onChange={(e) => updateEmail(i, e.target.value)} placeholder="colleague@company.com" />
                    {emails.length > 1 && (
                      <Button variant="ghost" size="icon" onClick={() => removeEmail(i)}><X className="h-4 w-4" /></Button>
                    )}
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addEmail}><Plus className="mr-2 h-4 w-4" />Add Another</Button>
              </>
            )}

            {step === 4 && (
              <div className="text-center py-4">
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>✅ Organization: <span className="font-medium text-foreground">{orgName}</span></p>
                  <p>✅ Project: <span className="font-medium text-foreground">{projectName}</span></p>
                  <p>✅ Team invites: <span className="font-medium text-foreground">{emails.filter(e => e.trim()).length || "None"}</span></p>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              {step > 1 && step < 4 && (
                <Button variant="outline" className="flex-1" onClick={() => setStep(step - 1)}>Back</Button>
              )}
              {step === 3 && (
                <Button variant="ghost" className="flex-1" onClick={() => setStep(4)}>Skip</Button>
              )}
              {step < 4 ? (
                <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700" onClick={handleNext}>
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700" onClick={handleFinish}>
                  Go to Dashboard <Rocket className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
