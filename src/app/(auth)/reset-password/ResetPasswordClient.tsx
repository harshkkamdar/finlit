"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const schema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type Form = z.infer<typeof schema>;

export default function ResetPasswordClient({ token }: { token: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>({ resolver: zodResolver(schema) });

  if (!token) {
    return (
      <div className="w-full max-w-md">
        <div className="bg-surface rounded-xl p-8 shadow-lg shadow-black/5">
          <div className="text-center mb-6">
            <h1 className="font-display text-3xl font-bold text-primary tracking-tight">
              Fino<span className="text-accent">Lingo</span>
            </h1>
          </div>
          <p className="font-body text-sm text-ink mb-6">
            This reset link is missing its token. Please request a new one.
          </p>
          <Link
            href="/forgot-password"
            className="block text-center text-primary font-medium hover:underline text-sm"
          >
            Request a new reset link
          </Link>
        </div>
      </div>
    );
  }

  async function onSubmit(data: Form) {
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: data.password }),
      });

      const body = await res.json();

      if (!res.ok) {
        setError(body.error ?? "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      router.push("/login?reset=1");
    } catch {
      setError("Something went wrong. Please try again.");
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
            Set a new password
          </p>
        </div>

        {error && (
          <div className="mb-6 px-4 py-3 rounded-lg bg-red-50 border border-error/20">
            <p className="text-sm font-body text-error">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            label="New password"
            type="password"
            placeholder="Min. 8 characters"
            autoComplete="new-password"
            error={errors.password?.message}
            {...register("password")}
          />

          <Input
            label="Confirm new password"
            type="password"
            placeholder="Re-enter new password"
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />

          <Button
            type="submit"
            loading={loading}
            disabled={loading}
            className="w-full"
            size="lg"
          >
            Update password
          </Button>
        </form>

        <p className="text-center mt-6 text-sm font-body text-muted">
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
