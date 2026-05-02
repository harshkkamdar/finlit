'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles, Award, RotateCcw, Check, X, ChevronRight, Lightbulb } from 'lucide-react';
import Link from 'next/link';
import LessonCardDeck from '@/components/lesson/LessonCardDeck';
import ExerciseRenderer from '@/components/exercise/ExerciseRenderer';
import ProgressBar from '@/components/gamification/ProgressBar';
import Button from '@/components/ui/Button';
import BadgeToast from '@/components/gamification/BadgeToast';
import { fireConfetti } from '@/lib/confetti';
import type { ContentBlock, Exercise } from '@/types';

interface LessonData {
  _id: string;
  lessonNumber: string;
  title: string;
  content: { blocks: ContentBlock[] };
  exercises: Exercise[];
  estimatedMinutes: number;
  order: number;
  isCompleted: boolean;
}

interface ChapterData {
  _id: string;
  number: number;
  title: string;
  colorAccent: string;
}

interface LessonPageProps {
  lesson: LessonData;
  chapter: ChapterData;
  nextLessonId: string | null;
  lessonIndex: number;
  totalLessons: number;
}

interface SubmitResult {
  score: number;
  maxScore: number;
  xpEarned: number;
  newTotalXP: number;
  league: string;
  badgesEarned: Array<{ id: string; name: string; icon: string }>;
  streakUpdate: { currentStreak: number; longestStreak: number };
}

/* ══════════════════════════════════════════════════════════════════════
   AnimatedXPValue -- count-up animation for XP display
   ══════════════════════════════════════════════════════════════════════ */

function AnimatedXPValue({ target, duration = 1500 }: { target: number; duration?: number }) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return <>{value}</>;
}

/* ══════════════════════════════════════════════════════════════════════
   LessonResultsScreen -- Redesigned with contextual messaging
   ══════════════════════════════════════════════════════════════════════ */

function LessonResultsScreen({
  exerciseResult,
  exercises,
  chapterColor,
  nextLessonId,
  chapterId,
}: {
  exerciseResult: SubmitResult;
  exercises: Exercise[];
  chapterColor: string;
  nextLessonId: string | null;
  chapterId: string;
}) {
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);
  const accent = chapterColor || '#F5A623';
  const pct = exerciseResult.maxScore > 0 ? exerciseResult.score / exerciseResult.maxScore : 0;
  const isPerfect = pct === 1;
  const isGood = pct > 0.7;

  const headline = isPerfect
    ? 'Perfect!'
    : isGood
    ? 'Nice work!'
    : "You'll get there";

  const subtitle = isPerfect
    ? "You nailed every single question. That's seriously impressive."
    : isGood
    ? `You scored ${exerciseResult.score}/${exerciseResult.maxScore}. Strong understanding!`
    : `You scored ${exerciseResult.score}/${exerciseResult.maxScore}. Let's review what tripped you up.`;

  return (
    <motion.div
      key="results"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-[720px] mx-auto">
        <div className="flex flex-col items-center text-center py-8">
          {/* Celebratory icon */}
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.2 }}
            className="relative mb-6"
          >
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center"
              style={{
                background: isPerfect
                  ? `linear-gradient(135deg, ${accent}25, ${accent}45)`
                  : isGood
                  ? 'rgba(16, 185, 129, 0.12)'
                  : 'rgba(245, 166, 35, 0.12)',
              }}
            >
              <Sparkles
                className="w-12 h-12"
                style={{ color: isPerfect ? accent : isGood ? '#10B981' : '#F5A623' }}
              />
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: [0, 0.4, 0], scale: [0.8, 1.3, 1.5] }}
              transition={{ duration: 1.5, delay: 0.5 }}
              className="absolute inset-0 rounded-full"
              style={{
                background: isPerfect
                  ? `${accent}30`
                  : isGood
                  ? 'rgba(16, 185, 129, 0.2)'
                  : 'rgba(245, 166, 35, 0.2)',
              }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="font-display text-3xl text-dark mb-2">{headline}</h2>
            <p className="text-muted font-body text-lg mb-3 max-w-sm mx-auto">{subtitle}</p>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.55 }}
            >
              <p className="font-mono text-4xl font-bold mb-8" style={{ color: accent }}>
                +<AnimatedXPValue target={exerciseResult.xpEarned} /> XP
              </p>
            </motion.div>
          </motion.div>

          {/* Badges earned */}
          {exerciseResult.badgesEarned.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mb-8 flex flex-col items-center gap-2"
            >
              <div className="flex items-center gap-2" style={{ color: accent }}>
                <Award className="w-5 h-5" />
                <span className="font-display font-semibold">Badges Earned</span>
              </div>
              <div className="flex gap-3">
                {exerciseResult.badgesEarned.map((badge, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-full text-sm font-body font-medium"
                    style={{ backgroundColor: `${accent}15`, color: accent }}
                  >
                    {badge.name}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Question review list -- expandable */}
          {exercises.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75, duration: 0.5 }}
              className="w-full max-w-md space-y-2 mb-10"
            >
              <p className="text-xs font-mono text-muted uppercase tracking-wider mb-3">
                Question Review
              </p>
              {exercises.map((ex, i) => {
                const maxPerQ = ex.xpValue;
                const totalQuestions = exercises.length;
                const avgScoreRatio = exerciseResult.maxScore > 0
                  ? exerciseResult.score / exerciseResult.maxScore
                  : 0;
                const isQuestionCorrect = i < Math.round(totalQuestions * avgScoreRatio);
                const isExpanded = expandedQuestion === i;

                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.85 + i * 0.06 }}
                  >
                    <button
                      onClick={() => setExpandedQuestion(isExpanded ? null : i)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all duration-200 hover:shadow-sm ${
                        isQuestionCorrect
                          ? 'bg-[#10B981]/5 border-[#10B981]/15 hover:border-[#10B981]/30'
                          : 'bg-[#EF4444]/5 border-[#EF4444]/15 hover:border-[#EF4444]/30'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                          isQuestionCorrect ? 'bg-[#10B981]' : 'bg-[#EF4444]'
                        }`}
                      >
                        {isQuestionCorrect ? (
                          <Check className="w-3.5 h-3.5 text-white" />
                        ) : (
                          <X className="w-3.5 h-3.5 text-white" />
                        )}
                      </div>
                      <span className="text-sm font-body text-dark/80 flex-1 truncate">
                        {ex.prompt}
                      </span>
                      <span className={`font-mono text-xs font-semibold shrink-0 ${
                        isQuestionCorrect ? 'text-[#10B981]' : 'text-muted'
                      }`}>
                        {isQuestionCorrect ? `+${maxPerQ}` : '+0'} XP
                      </span>
                      <ChevronRight
                        className={`w-4 h-4 text-muted transition-transform duration-200 shrink-0 ${
                          isExpanded ? 'rotate-90' : ''
                        }`}
                      />
                    </button>
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
                          className="overflow-hidden"
                        >
                          <div
                            className={`mx-4 mt-1 mb-2 px-4 py-3 rounded-lg text-sm font-body text-dark/70 leading-relaxed ${
                              isQuestionCorrect
                                ? 'border-l-[3px] border-[#10B981] bg-[#10B981]/5'
                                : 'border-l-[3px] border-[#D97706] bg-[#D97706]/5'
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              <Lightbulb className={`w-4 h-4 mt-0.5 shrink-0 ${
                                isQuestionCorrect ? 'text-[#10B981]' : 'text-[#D97706]'
                              }`} />
                              <span>{ex.explanation}</span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 + exercises.length * 0.06 }}
            className="flex gap-3"
          >
            {nextLessonId ? (
              <Link href={`/lesson/${nextLessonId}`}>
                <Button
                  variant="primary"
                  size="lg"
                  className="font-display font-semibold shadow-lg shadow-primary/20"
                >
                  Continue
                </Button>
              </Link>
            ) : (
              <Link href={`/chapter/${chapterId}`}>
                <Button
                  variant="primary"
                  size="lg"
                  className="font-display font-semibold shadow-lg shadow-primary/20"
                >
                  Back to Chapter
                </Button>
              </Link>
            )}
            <Link href={`/chapter/${chapterId}`}>
              <Button
                variant="secondary"
                size="lg"
                className="font-display font-semibold"
              >
                Chapter Overview
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Main LessonPageClient
   ══════════════════════════════════════════════════════════════════════ */

export default function LessonPageClient({
  lesson,
  chapter,
  nextLessonId,
  lessonIndex,
  totalLessons,
}: LessonPageProps) {
  const [showExercise, setShowExercise] = useState(false);
  const [exerciseResult, setExerciseResult] = useState<SubmitResult | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [badgeToast, setBadgeToast] = useState<{
    name: string;
    visible: boolean;
  }>({ name: '', visible: false });
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [cardProgress, setCardProgress] = useState({ current: 0, total: 0 });
  const handleBadgeDismiss = useCallback(() => setBadgeToast({ name: '', visible: false }), []);
  // Stable callback so LessonCardDeck's effect doesn't re-fire infinitely
  const handleCardProgress = useCallback(
    (current: number, total: number) => setCardProgress({ current, total }),
    []
  );

  const progressPercent = totalLessons > 0
    ? Math.round((lessonIndex / totalLessons) * 100)
    : 0;

  // Card-level progress for the mobile sticky top bar (cards phase only)
  const cardPhasePct =
    cardProgress.total > 0
      ? ((cardProgress.current + 1) / cardProgress.total) * 100
      : 0;

  // Scroll to top when transitioning to exercises or results
  useEffect(() => {
    if (showExercise || exerciseResult) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [showExercise, exerciseResult]);

  // Fire confetti only for perfect scores
  useEffect(() => {
    if (exerciseResult && exerciseResult.maxScore > 0 && exerciseResult.score === exerciseResult.maxScore) {
      const timer = setTimeout(() => fireConfetti(), 300);
      return () => clearTimeout(timer);
    }
  }, [exerciseResult]);

  // Called when the card deck reaches the end of content cards
  const handleContentComplete = useCallback(() => {
    if (lesson.exercises.length > 0) {
      setShowExercise(true);
    }
  }, [lesson.exercises.length]);

  const handleExerciseComplete = useCallback(
    async (score: number, maxScore: number, answerSelections?: { questionIndex: number; selectedOptions: number[] }[]) => {
      setSubmitError(null);
      setIsSubmitting(true);

      try {
        // Use real answer selections from ExerciseRenderer, fall back to empty arrays
        const answers = answerSelections ?? lesson.exercises.map((_exercise, questionIndex) => ({
          questionIndex,
          selectedOptions: [] as number[],
        }));

        const res = await fetch('/api/exercises/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lessonId: lesson._id,
            answers,
          }),
        });

        if (res.ok) {
          const data: SubmitResult = await res.json();
          setExerciseResult(data);

          // Show badge toast if earned
          if (data.badgesEarned && data.badgesEarned.length > 0) {
            setBadgeToast({
              name: data.badgesEarned[0].name,
              visible: true,
            });
          }
        } else {
          // Handle non-OK responses
          const errorData = await res.json().catch(() => null);
          setSubmitError(
            errorData?.error || `Something went wrong (${res.status}). Please try again.`
          );
        }
      } catch (error) {
        setSubmitError('Failed to submit. Please check your connection and try again.');
      } finally {
        setIsSubmitting(false);
      }
    },
    [lesson]
  );

  const handleRetrySubmit = useCallback(() => {
    setSubmitError(null);
  }, []);

  const isCardPhase = !showExercise && !exerciseResult;

  return (
    <div
      className="relative flex flex-col"
      style={{ minHeight: 'calc(100dvh - 64px)' }}
    >
      {/* Badge toast */}
      <BadgeToast
        badgeName={badgeToast.name}
        isVisible={badgeToast.visible}
        onDismiss={handleBadgeDismiss}
      />
      {submitError && (
        <div className="mb-4 p-3 rounded-lg bg-error/10 border border-error/20 text-error text-sm font-body flex items-center justify-between">
          <span>{submitError}</span>
          <button
            onClick={handleRetrySubmit}
            className="inline-flex items-center gap-1.5 text-error hover:text-error/80 font-medium ml-3 shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Dismiss
          </button>
        </div>
      )}

      {/* ── Mobile sticky top bar: close X + card progress + counter ─────── */}
      <div className="lg:hidden sticky top-0 z-30 -mx-4 sm:-mx-6 px-4 sm:px-6 safe-top bg-bg/95 backdrop-blur-md border-b border-border">
        <div className="flex items-center gap-3 h-14">
          <Link
            href={`/chapter/${chapter._id}`}
            aria-label="Close lesson"
            className="inline-flex items-center justify-center w-10 h-10 -ml-2 rounded-lg text-muted hover:text-dark transition-colors"
          >
            <X className="w-5 h-5" />
          </Link>

          <div className="flex-1 min-w-0">
            <div className="w-full h-1.5 rounded-full bg-border overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: chapter.colorAccent }}
                animate={{
                  width: `${
                    isCardPhase
                      ? cardPhasePct
                      : exerciseResult
                        ? 100
                        : 80
                  }%`,
                }}
                transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
              />
            </div>
          </div>

          {isCardPhase && cardProgress.total > 0 && (
            <span className="text-xs font-mono text-muted shrink-0 tabular-nums">
              {cardProgress.current + 1}/{cardProgress.total}
            </span>
          )}
        </div>
      </div>

      {/* ── Desktop top bar (back link + lesson-level progress) ─────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="hidden lg:flex items-center gap-4 mb-4"
      >
        <Link
          href={`/chapter/${chapter._id}`}
          className="inline-flex items-center gap-2 text-muted hover:text-dark transition-colors font-body text-sm shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">
            Ch. {chapter.number}: {chapter.title}
          </span>
          <span className="sm:hidden">Back</span>
        </Link>

        <div className="flex-1 max-w-[300px]">
          <ProgressBar
            value={progressPercent}
            color={chapter.colorAccent}
            size="sm"
          />
        </div>

        <span className="text-xs font-mono text-muted shrink-0">
          {lessonIndex}/{totalLessons}
        </span>
      </motion.div>

      {/* Lesson title — desktop only (mobile relies on top bar progress) */}
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="hidden lg:block mb-4 text-center"
      >
        <h1 className="font-display text-xl font-bold text-dark">
          {lesson.title}
        </h1>
      </motion.div>

      {/* Content area */}
      <AnimatePresence mode="wait">
        {!showExercise && !exerciseResult && (
          <motion.div
            key="card-deck"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <LessonCardDeck
              blocks={lesson.content.blocks}
              chapterColor={chapter.colorAccent}
              exerciseCount={lesson.exercises.length}
              onContentComplete={handleContentComplete}
              onProgress={handleCardProgress}
            />
          </motion.div>
        )}

        {showExercise && !exerciseResult && (
          <motion.div
            key="exercise"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex items-center"
          >
            <div className="max-w-[720px] mx-auto w-full">
              <ExerciseRenderer
                exercises={lesson.exercises}
                onComplete={handleExerciseComplete}
                chapterColor={chapter.colorAccent}
              />

              {isSubmitting && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="fixed inset-0 bg-white/60 backdrop-blur-sm z-50 flex items-center justify-center"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="font-body text-muted text-sm">
                      Saving your progress...
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {exerciseResult && (
          <LessonResultsScreen
            exerciseResult={exerciseResult}
            exercises={lesson.exercises}
            chapterColor={chapter.colorAccent}
            nextLessonId={nextLessonId}
            chapterId={chapter._id}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
