"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import OnboardingCard from "@/components/onboarding/OnboardingCard";

const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  age: z
    .string()
    .min(1, "Age is required")
    .refine(
      (val) => !isNaN(parseInt(val, 10)) && parseInt(val, 10) > 0,
      "Please enter a valid age"
    ),
});

type SignupFormValues = z.infer<typeof signupSchema>;

type SignupPhase = "form" | "flip" | "flyaway";

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState<SignupPhase>("form");
  const [avatarSeed, setAvatarSeed] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      age: "",
    },
  });

  const watchName = watch("name");
  const watchEmail = watch("email");
  const watchAge = watch("age");

  async function onSubmit(data: SignupFormValues) {
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          age: parseInt(data.age, 10),
        }),
      });

      const body = await res.json();

      if (!res.ok) {
        setError(body.error || "Signup failed. Please try again.");
        setLoading(false);
        return;
      }

      // Store the avatar seed from the response
      if (body.avatarSeed) {
        setAvatarSeed(body.avatarSeed);
      }

      // Auto-login after successful signup
      const signInResult = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (signInResult?.error) {
        setError(
          "Account created, but auto-login failed. Please sign in."
        );
        setLoading(false);
        router.push("/login");
        return;
      }

      // Trigger card flip animation
      setPhase("flip");
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  const handleFlipComplete = useCallback(() => {
    // After flip completes, wait a moment then trigger fly away
    setTimeout(() => {
      setPhase("flyaway");
    }, 1200);
  }, []);

  const handleFlyAwayComplete = useCallback(() => {
    router.push("/dashboard/onboarding");
  }, [router]);

  // Show the animated card phase
  if (phase === "flip" || phase === "flyaway") {
    const values = getValues();
    return (
      <div className="flex flex-col items-center justify-center gap-6">
        <AnimatePresence>
          {phase === "flip" && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.3 }}
              className="font-display text-xl font-bold text-dark text-center"
            >
              Welcome aboard, {values.name.split(" ")[0]}!
            </motion.p>
          )}
        </AnimatePresence>

        <OnboardingCard
          name={values.name}
          email={values.email}
          age={values.age}
          avatarSeed={avatarSeed || values.name}
          triggerFlip={phase === "flip" || phase === "flyaway"}
          triggerFlyAway={phase === "flyaway"}
          onFlipComplete={handleFlipComplete}
          onFlyAwayComplete={handleFlyAwayComplete}
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-[400px]">
      <div className="bg-surface rounded-xl shadow-lg shadow-black/5 overflow-hidden">
        {/* Green stripe header */}
        <div className="bg-primary px-8 py-5">
          <h1 className="font-display text-xl font-bold text-white tracking-tight">
            FINANCIAL ID
          </h1>
          <p className="font-body text-white/70 text-xs mt-0.5">
            Fino<span className="text-accent font-semibold">Lingo</span> Member
            Card
          </p>
        </div>

        <div className="px-8 py-6">
          {/* Live Preview Card */}
          <div className="mb-6 p-4 rounded-lg bg-bg border border-gray-100">
            <div className="flex items-start gap-4">
              {/* Avatar placeholder */}
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="font-display text-lg font-bold text-primary">
                  {watchName
                    ? watchName
                        .split(" ")
                        .map((w) => w[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)
                    : "?"}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-display text-base font-semibold text-dark truncate">
                  {watchName || "Your Name"}
                </p>
                <p className="font-body text-xs text-muted truncate mt-0.5">
                  {watchEmail || "email@example.com"}
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="font-mono text-xs text-muted">
                    Age: {watchAge || "--"}
                  </span>
                  <span className="font-mono text-xs text-accent font-semibold">
                    0 XP
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Error banner */}
          {error && (
            <div className="mb-5 px-4 py-3 rounded-lg bg-red-50 border border-error/20">
              <p className="text-sm font-body text-error">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              placeholder="John Doe"
              autoComplete="name"
              error={errors.name?.message}
              {...register("name")}
            />

            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              error={errors.email?.message}
              {...register("email")}
            />

            <Input
              label="Password"
              type="password"
              placeholder="Min. 8 characters"
              autoComplete="new-password"
              error={errors.password?.message}
              {...register("password")}
            />

            <Input
              label="Age"
              type="number"
              placeholder="18"
              error={errors.age?.message}
              {...register("age")}
            />

            <Button
              type="submit"
              loading={loading}
              disabled={loading}
              className="w-full"
              size="lg"
            >
              Create Account
            </Button>
          </form>

          {/* Disclaimer */}
          <p className="text-[11px] text-muted/60 font-body text-center mt-4 leading-relaxed">
            By creating an account, you acknowledge that FinoLingo is for
            educational purposes only and does not constitute financial
            advice. We are not SEBI-registered advisors. Any financial
            decisions you make are your own responsibility. Information
            may be simplified for learning and may not reflect current
            market conditions.
          </p>

          {/* Footer link */}
          <p className="text-center mt-5 text-sm font-body text-muted">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
