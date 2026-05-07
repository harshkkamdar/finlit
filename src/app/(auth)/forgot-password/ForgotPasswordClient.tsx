"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const schema = z.object({
  email: z.email("Please enter a valid email address"),
});

type Form = z.infer<typeof schema>;

export default function ForgotPasswordClient() {
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>({ resolver: zodResolver(schema) });

  async function onSubmit(data: Form) {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });
      const body = await res.json();
      setSubmittedMessage(
        body.message ??
          "If an account exists for that email, we've sent a password reset link."
      );
    } catch {
      setSubmittedMessage(
        "If an account exists for that email, we've sent a password reset link."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-surface rounded-xl p-8 shadow-lg shadow-black/5">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold text-primary tracking-tight">
            Fino<span className="text-accent">Lingo</span>
          </h1>
          <p className="font-body text-muted text-sm mt-2">
            Enter your email and we&rsquo;ll send you a reset link
          </p>
        </div>

        {submittedMessage ? (
          <div className="space-y-6">
            <div className="px-4 py-3 rounded-lg bg-green-50 border border-primary/20">
              <p className="text-sm font-body text-primary">
                {submittedMessage}
              </p>
            </div>
            <p className="text-xs text-muted/70 font-body text-center">
              The link expires in 1 hour. Didn&rsquo;t get the email? Check spam,
              or try again in a minute.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              error={errors.email?.message}
              {...register("email")}
            />

            <Button
              type="submit"
              loading={loading}
              disabled={loading}
              className="w-full"
              size="lg"
            >
              Send reset link
            </Button>
          </form>
        )}

        <p className="text-center mt-6 text-sm font-body text-muted">
          Remembered it?{" "}
          <Link
            href="/login"
            className="text-primary font-medium hover:underline"
          >
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
