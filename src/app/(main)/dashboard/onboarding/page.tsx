"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Zap, Award, Rocket } from "lucide-react";
import GuidedTour from "@/components/onboarding/GuidedTour";

const tourSteps = [
  {
    title: "This is your learning path",
    description:
      "Your dashboard shows a chapter-by-chapter roadmap. Each chapter covers a key financial topic -- from budgeting basics to investing strategies. Complete lessons and simulations to unlock the next chapter.",
    icon: BookOpen,
  },
  {
    title: "Track your XP and streak",
    description:
      "Earn XP for every lesson, exercise, and simulation you complete. Keep your daily streak alive to climb the leagues -- Bronze, Silver, Gold, and Diamond. Consistency is the key to mastery!",
    icon: Zap,
  },
  {
    title: "Earn badges as you learn",
    description:
      "Unlock achievement badges for milestones like perfect scores, long streaks, and completing chapters. Collect them all to prove your financial literacy expertise!",
    icon: Award,
  },
  {
    title: "Ready to begin?",
    description:
      "Your financial literacy journey starts with Chapter 0 -- the foundations. Let's build your money skills one step at a time. You've got this!",
    icon: Rocket,
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/users/me");
        if (res.ok) {
          const user = await res.json();
          setUserName(user.name || "");
        }
      } catch {
        // Silently handle - we'll just show generic greeting
      }
    }
    fetchUser();
  }, []);

  function handleComplete() {
    router.push("/dashboard?onboarded=true");
  }

  function handleSkip() {
    router.push("/dashboard?onboarded=true");
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center py-12">
      {/* Welcome header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <h1 className="font-display text-4xl font-bold text-dark mb-2">
          Welcome to FinLit
          {userName ? `, ${userName.split(" ")[0]}` : ""}!
        </h1>
        <p className="font-body text-base text-muted">
          Let&apos;s take a quick tour of what awaits you.
        </p>
      </motion.div>

      {/* Guided tour */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full"
      >
        <GuidedTour
          steps={tourSteps}
          onComplete={handleComplete}
          onSkip={handleSkip}
        />
      </motion.div>
    </div>
  );
}
