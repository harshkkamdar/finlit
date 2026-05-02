'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Award, ArrowLeft, RotateCcw } from 'lucide-react';
import SimulationRenderer from '@/components/simulation/SimulationRenderer';
import BadgeToast from '@/components/gamification/BadgeToast';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { fireConfetti } from '@/lib/confetti';
import type { SimulationNode } from '@/types';

/* ── Full simulation data interface ──────────────────────────────────── */
interface SimulationData {
  _id: string;
  title: string;
  description: string;
  startingWallet: number | null;
  optimalWalletOutcome: number | null;
  startNodeId: string;
  badgeThreshold: Record<string, unknown>;
  nodes: SimulationNode[];
  // Ch0
  walletLabel?: string | null;
  startingInventory?: string | null;
  // Ch1
  availableStocks?: Record<string, unknown> | null;
  // Ch3
  biasTracker?: Record<string, unknown> | null;
  // Ch5
  creditLimit?: number | null;
  creditBalance?: number | null;
  monthlyIncome?: number | null;
  // Ch6
  scoringType?: 'wallet' | 'points';
  startingScore?: number | null;
  maxScore?: number | null;
  // Badge
  badgeId?: string | null;
  badgeName?: string | null;
}

interface ChapterData {
  _id: string;
  number: number;
  title: string;
  colorAccent: string;
}

interface SimulationResult {
  score: number;
  walletFinal: number;
  path: string[];
}

interface SubmitResponse {
  xpEarned: number;
  newTotalXP: number;
  league: string;
  badgesEarned: Array<{ name: string; icon: string }>;
  chapterCompleted: boolean;
  earnedSimBadge: boolean;
  streakUpdate: { currentStreak: number; longestStreak: number };
}

interface SimulationPageProps {
  simulation: SimulationData;
  chapter: ChapterData;
}

export default function SimulationPageClient({
  simulation,
  chapter,
}: SimulationPageProps) {
  const [submitResult, setSubmitResult] = useState<SubmitResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [badgeToast, setBadgeToast] = useState<{
    name: string;
    visible: boolean;
  }>({ name: '', visible: false });
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Store the last result for retry
  const lastResultRef = useRef<SimulationResult | null>(null);

  const handleSimulationComplete = useCallback(
    async (result: SimulationResult) => {
      setSubmitError(null);
      setIsSubmitting(true);
      setHasCompleted(true);
      lastResultRef.current = result;

      try {
        const res = await fetch('/api/simulations/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            simulationId: simulation._id,
            walletFinal: result.walletFinal,
            path: result.path,
            score: result.score,
          }),
        });

        if (res.ok) {
          const data: SubmitResponse = await res.json();
          setSubmitResult(data);

          // Show badge toast if earned
          if (data.badgesEarned && data.badgesEarned.length > 0) {
            setBadgeToast({
              name: data.badgesEarned[0].name,
              visible: true,
            });
          }
        } else {
          const errorData = await res.json().catch(() => null);
          setSubmitError(
            errorData?.error || `Something went wrong (${res.status}). Please try again.`
          );
        }
      } catch {
        setSubmitError('Failed to submit. Please check your connection and try again.');
      } finally {
        setIsSubmitting(false);
      }
    },
    [simulation._id]
  );

  const handleRetry = useCallback(() => {
    if (lastResultRef.current) {
      handleSimulationComplete(lastResultRef.current);
    }
  }, [handleSimulationComplete]);

  // Fire confetti when results appear
  useEffect(() => {
    if (submitResult) {
      const timer = setTimeout(() => fireConfetti(), 300);
      return () => clearTimeout(timer);
    }
  }, [submitResult]);

  // If completed and we have results, show the result overlay
  if (hasCompleted && submitResult) {
    return (
      <>
        <BadgeToast
          badgeName={badgeToast.name}
          isVisible={badgeToast.visible}
          onDismiss={() => setBadgeToast({ name: '', visible: false })}
        />
        {submitError && (
          <div className="mb-4 p-3 rounded-lg bg-error/10 border border-error/20 text-error text-sm font-body">
            {submitError}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="min-h-[80vh] flex items-center justify-center"
        >
          <div className="flex flex-col items-center text-center max-w-md mx-auto">
            {/* XP display */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 15,
              }}
              className="w-24 h-24 rounded-full bg-accent/15 flex items-center justify-center mb-6"
            >
              <Sparkles className="w-12 h-12 text-accent" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="font-display text-3xl text-dark mb-2">
                Simulation Complete!
              </h2>
              <p className="font-mono text-4xl text-accent font-bold mb-4">
                +{submitResult.xpEarned} XP
              </p>

              {submitResult.chapterCompleted && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mb-4 bg-primary-light/50 border border-primary/30 rounded-xl px-5 py-3"
                >
                  <p className="font-display text-lg text-primary font-semibold">
                    Chapter {chapter.number} Complete!
                  </p>
                  <p className="text-primary/70 font-body text-sm">
                    You&apos;ve mastered this chapter. Keep going!
                  </p>
                </motion.div>
              )}

              {/* Badges */}
              {submitResult.badgesEarned.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="mb-6 flex flex-col items-center gap-2"
                >
                  <div className="flex items-center gap-2 text-accent">
                    <Award className="w-5 h-5" />
                    <span className="font-display font-semibold">
                      Badges Earned
                    </span>
                  </div>
                  <div className="flex gap-2 flex-wrap justify-center">
                    {submitResult.badgesEarned.map((badge, i) => (
                      <span
                        key={i}
                        className="bg-accent/10 text-accent px-3 py-1.5 rounded-full text-sm font-body font-medium"
                      >
                        {badge.name}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex gap-3 mt-4"
            >
              <Link href={`/chapter/${chapter._id}`}>
                <Button
                  variant="primary"
                  size="lg"
                  className="font-display font-semibold shadow-lg shadow-primary/20"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back to Chapter
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button
                  variant="secondary"
                  size="lg"
                  className="font-display font-semibold"
                >
                  Dashboard
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </>
    );
  }

  // Error state after submission failed (show retry)
  if (hasCompleted && !submitResult && !isSubmitting && submitError) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center text-center max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center mb-4">
            <RotateCcw className="w-8 h-8 text-error" />
          </div>
          <h2 className="font-display text-2xl text-dark mb-2">
            Submission Failed
          </h2>
          <p className="text-muted font-body text-base mb-6">
            {submitError}
          </p>
          <div className="flex gap-3">
            <Button
              variant="primary"
              size="lg"
              onClick={handleRetry}
              className="font-display font-semibold"
            >
              <RotateCcw className="w-4 h-4" />
              Try Again
            </Button>
            <Link href={`/chapter/${chapter._id}`}>
              <Button
                variant="secondary"
                size="lg"
                className="font-display font-semibold"
              >
                Back to Chapter
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Loading overlay while submitting
  if (isSubmitting) {
    return (
      <div className="min-h-[100dvh] bg-dark/95 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-3 border-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-white/60 font-body">
            Saving your simulation results...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="-mx-8 -my-8">
      <SimulationRenderer
        simulation={simulation}
        chapterNumber={chapter.number}
        chapterColor={chapter.colorAccent}
        onComplete={handleSimulationComplete}
      />
    </div>
  );
}
