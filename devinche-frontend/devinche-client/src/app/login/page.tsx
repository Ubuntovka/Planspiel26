"use client";

import { Suspense } from "react";
import SignIn from "@/features/auth-feature/ui/singin";

function LoginFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--editor-bg,#f8f9fa)]">
      <div className="text-[var(--editor-text-muted,#6c757d)]">Loading...</div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <SignIn />
    </Suspense>
  );
}