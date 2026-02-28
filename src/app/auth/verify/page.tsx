"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Logo } from "@/components/shared/logo";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    if (!token) { setStatus("error"); return; }
    fetch("/api/auth/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    }).then(res => {
      setStatus(res.ok ? "success" : "error");
    }).catch(() => setStatus("error"));
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex justify-center"><Logo /></div>
        <Card>
          <CardContent className="pt-6 text-center space-y-4">
            {status === "loading" && (
              <>
                <Loader2 className="h-12 w-12 animate-spin text-indigo-500 mx-auto" />
                <p>Verifying your email...</p>
              </>
            )}
            {status === "success" && (
              <>
                <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto" />
                <h2 className="text-xl font-semibold">Email Verified!</h2>
                <p className="text-sm text-muted-foreground">Your email has been verified. You can now sign in.</p>
                <Button asChild className="bg-indigo-600 hover:bg-indigo-700"><Link href="/auth/signin">Sign In</Link></Button>
              </>
            )}
            {status === "error" && (
              <>
                <XCircle className="h-12 w-12 text-destructive mx-auto" />
                <h2 className="text-xl font-semibold">Verification Failed</h2>
                <p className="text-sm text-muted-foreground">The verification link is invalid or has expired.</p>
                <Button asChild variant="outline"><Link href="/auth/signin">Back to Sign In</Link></Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
