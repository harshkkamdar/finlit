"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const forgotPasswordSchema = z
  .object({
    email: z.email("Please enter a valid email address"),
    age: z
      .string()
      .min(1, "Age is required")
      .refine(
        (val) => !isNaN(parseInt(val, 10)) && parseInt(val, 10) > 0,
        "Please enter a valid age"
      ),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordClient() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  async function onSubmit(data: ForgotPasswordForm) {
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          age: parseInt(data.age, 10),
          password: data.password,
        }),
      });

      const body = await res.json();

      if (!res.ok) {
        setError(body.error || "Something went wrong. Please try again.");
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
            Reset your password by verifying your details
          </p>
        </div>

        {error && (
          <div className="mb-6 px-4 py-3 rounded-lg bg-red-50 border border-error/20">
            <p className="text-sm font-body text-error">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            error={errors.email?.message}
            {...register("email")}
          />

          <Input
            label="Age (as on signup)"
            type="number"
            placeholder="18"
            error={errors.age?.message}
            {...register("age")}
          />

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
            Update Password
          </Button>
        </form>

        <p className="text-xs text-muted/70 font-body text-center mt-4">
          For your security, we verify the age you provided at signup before
          updating your password.
        </p>

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
