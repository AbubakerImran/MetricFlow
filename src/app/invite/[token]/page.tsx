"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";

export default function AcceptInvitePage() {
  const params = useParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    const accept = async () => {
      try {
        const res = await fetch("/api/team/accept-invite", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: params.token }),
        });
        setStatus(res.ok ? "success" : "error");
        if (res.ok) {
          setTimeout(() => router.push("/dashboard"), 2000);
        }
      } catch {
        setStatus("error");
      }
    };
    accept();
  }, [params.token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex justify-center"><Logo /></div>
        <Card>
          <CardContent className="pt-6 text-center space-y-4">
            {status === "loading" && (
              <>
                <Loader2 className="h-12 w-12 animate-spin text-indigo-500 mx-auto" />
                <p>Accepting invitation...</p>
              </>
            )}
            {status === "success" && (
              <>
                <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto" />
                <h2 className="text-xl font-semibold">Welcome to the team!</h2>
                <p className="text-sm text-muted-foreground">Redirecting to dashboard...</p>
              </>
            )}
            {status === "error" && (
              <>
                <XCircle className="h-12 w-12 text-destructive mx-auto" />
                <h2 className="text-xl font-semibold">Invalid Invitation</h2>
                <p className="text-sm text-muted-foreground">This invitation link is invalid or has expired.</p>
                <Button variant="outline" onClick={() => router.push("/auth/signin")}>Sign In</Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
