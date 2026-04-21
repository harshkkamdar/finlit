"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface OnboardingCardProps {
  name: string;
  email: string;
  age: string;
  avatarSeed?: string;
  onFlipComplete?: () => void;
  onFlyAwayComplete?: () => void;
  triggerFlip?: boolean;
  triggerFlyAway?: boolean;
}

export default function OnboardingCard({
  name,
  email,
  age,
  avatarSeed,
  onFlipComplete,
  onFlyAwayComplete,
  triggerFlip = false,
  triggerFlyAway = false,
}: OnboardingCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFlyingAway, setIsFlyingAway] = useState(false);

  useEffect(() => {
    if (triggerFlip && !isFlipped) {
      setIsFlipped(true);
    }
  }, [triggerFlip, isFlipped]);

  useEffect(() => {
    if (triggerFlyAway && !isFlyingAway) {
      setIsFlyingAway(true);
    }
  }, [triggerFlyAway, isFlyingAway]);

  const initials = name
    ? name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  const seed = avatarSeed || name || "default";
  const avatarUrl = `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(seed)}`;

  const memberDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  // Barcode pattern - decorative
  const barcodeLines = Array.from({ length: 28 }, (_, i) => ({
    width: [1, 2, 3, 1, 2, 1, 3, 2][i % 8],
    gap: [2, 1, 2, 3, 1, 2, 1, 2][i % 8],
  }));

  return (
    <motion.div
      animate={
        isFlyingAway
          ? { scale: 0.3, y: -400, opacity: 0 }
          : { scale: 1, y: 0, opacity: 1 }
      }
      transition={
        isFlyingAway
          ? { duration: 0.8, ease: [0.4, 0, 0.2, 1] }
          : { duration: 0.3 }
      }
      onAnimationComplete={() => {
        if (isFlyingAway && onFlyAwayComplete) {
          onFlyAwayComplete();
        }
      }}
      style={{ perspective: 1000 }}
      className="w-[350px] h-[480px]"
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        onAnimationComplete={() => {
          if (isFlipped && onFlipComplete) {
            onFlipComplete();
          }
        }}
        style={{ transformStyle: "preserve-3d" }}
        className="relative w-full h-full"
      >
        {/* Front Face */}
        <div
          className="absolute inset-0 rounded-2xl bg-surface shadow-xl overflow-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          {/* Green header stripe */}
          <div className="bg-primary px-6 py-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-lg font-bold text-white tracking-tight">
                  FINANCIAL ID
                </h2>
                <p className="font-body text-white/60 text-xs mt-0.5">
                  Fino<span className="text-accent font-semibold">Lingo</span>{" "}
                  Member Card
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center">
                <span className="font-display text-sm font-bold text-white">
                  {initials}
                </span>
              </div>
            </div>
          </div>

          {/* Accent line */}
          <div className="h-1 bg-gradient-to-r from-accent via-accent/60 to-transparent" />

          {/* Body */}
          <div className="px-6 py-6 flex flex-col gap-5">
            {/* Name field */}
            <div>
              <p className="font-mono text-[10px] text-muted uppercase tracking-wider mb-1">
                Full Name
              </p>
              <p className="font-display text-xl font-semibold text-dark">
                {name || "Your Name"}
              </p>
            </div>

            {/* Email field */}
            <div>
              <p className="font-mono text-[10px] text-muted uppercase tracking-wider mb-1">
                Email
              </p>
              <p className="font-body text-sm text-dark/80">
                {email || "email@example.com"}
              </p>
            </div>

            {/* Age + XP row */}
            <div className="flex gap-8">
              <div>
                <p className="font-mono text-[10px] text-muted uppercase tracking-wider mb-1">
                  Age
                </p>
                <p className="font-display text-lg font-semibold text-dark">
                  {age || "--"}
                </p>
              </div>
              <div>
                <p className="font-mono text-[10px] text-muted uppercase tracking-wider mb-1">
                  Starting XP
                </p>
                <p className="font-mono text-lg font-semibold text-accent">
                  0 XP
                </p>
              </div>
            </div>

            {/* League */}
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 rounded-full bg-league-bronze" />
              <span className="font-mono text-xs text-muted">
                Bronze League
              </span>
            </div>
          </div>

          {/* Barcode at bottom */}
          <div className="absolute bottom-0 left-0 right-0 px-6 pb-5">
            <div className="flex items-end gap-[1px] h-8 opacity-20">
              {barcodeLines.map((line, i) => (
                <div
                  key={i}
                  className="bg-dark"
                  style={{
                    width: line.width,
                    height: `${40 + ((i * 17) % 60)}%`,
                    marginRight: line.gap,
                  }}
                />
              ))}
            </div>
            <p className="font-mono text-[9px] text-muted/40 mt-1 tracking-[0.2em]">
              FINOLINGO-2026-MEMBER
            </p>
          </div>
        </div>

        {/* Back Face */}
        <div
          className="absolute inset-0 rounded-2xl bg-surface shadow-xl overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          {/* Green header */}
          <div className="bg-primary px-6 py-4">
            <h2 className="font-display text-lg font-bold text-white tracking-tight text-center">
              Fino<span className="text-accent">Lingo</span>
            </h2>
          </div>

          {/* Accent line */}
          <div className="h-1 bg-gradient-to-r from-transparent via-accent to-transparent" />

          {/* Avatar section */}
          <div className="flex flex-col items-center justify-center px-6 pt-8 pb-6">
            <div className="w-40 h-40 rounded-full bg-primary-light border-4 border-primary/20 overflow-hidden shadow-lg shadow-primary/10 mb-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={avatarUrl}
                alt="Your avatar"
                className="w-full h-full object-cover"
              />
            </div>

            <p className="font-display text-xl font-bold text-dark mb-1">
              {name || "Explorer"}
            </p>

            <p className="font-body text-sm text-muted mb-4">
              Member since {memberDate}
            </p>

            {/* Status badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-light">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="font-body text-sm font-medium text-primary">
                Active Learner
              </span>
            </div>
          </div>

          {/* Bottom logo */}
          <div className="absolute bottom-0 left-0 right-0 px-6 pb-5 text-center">
            <div className="border-t border-gray-100 pt-4">
              <p className="font-display text-sm font-bold text-dark/20">
                Fino<span className="text-accent/30">Lingo</span>
              </p>
              <p className="font-mono text-[9px] text-muted/30 mt-0.5">
                Gamified Financial Literacy
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
