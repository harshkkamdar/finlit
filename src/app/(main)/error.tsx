"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import Button from "@/components/ui/Button";

export default function MainError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-6 min-h-[60vh]">
      <div className="w-20 h-20 rounded-2xl bg-red-50 flex items-center justify-center mb-6">
        <AlertTriangle className="w-10 h-10 text-error" />
      </div>

      <h2 className="font-display text-2xl font-bold text-dark mb-2">
        Oops! Something went wrong
      </h2>

      <p className="font-body text-base text-muted max-w-md leading-relaxed mb-8">
        Don&apos;t worry -- even the best financial plans hit a snag sometimes.
        Let&apos;s get you back on track.
      </p>

      <div className="flex items-center gap-3">
        <Button onClick={reset} variant="primary" size="lg">
          <RotateCcw className="w-4 h-4" />
          Try Again
        </Button>

        <a href="/dashboard">
          <Button variant="secondary" size="lg">
            <Home className="w-4 h-4" />
            Dashboard
          </Button>
        </a>
      </div>

      {error.digest && (
        <p className="mt-8 font-mono text-xs text-muted/50">
          Error ID: {error.digest}
        </p>
      )}
    </div>
  );
}
