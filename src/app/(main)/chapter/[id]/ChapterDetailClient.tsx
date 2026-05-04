'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Check, Lock, Gamepad2 } from 'lucide-react';
import Link from 'next/link';
import LessonPath from '@/components/dashboard/LessonPath';
import Button from '@/components/ui/Button';

interface LessonItem {
  _id: string;
  lessonNumber: string;
  title: string;
  estimatedMinutes: number;
  order: number;
  exerciseCount: number;
  status: 'completed' | 'in-progress' | 'locked';
}

interface SimulationItem {
  _id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  isUnlocked: boolean;
}

interface ChapterData {
  _id: string;
  number: number;
  title: string;
  subtitle: string;
  description: string;
  colorAccent: string;
}

interface ChapterDetailClientProps {
  chapter: ChapterData;
  lessons: LessonItem[];
  simulation: SimulationItem | null;
  progress: number;
  completedCount: number;
  totalCount: number;
}

export default function ChapterDetailClient({
  chapter,
  lessons,
  simulation,
  progress,
  completedCount,
  totalCount,
}: ChapterDetailClientProps) {
  return (
    <div>
      {/* ── Compact header (mobile) ────────────────────────────────────── */}
      <div className="lg:hidden sticky top-14 z-30 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 bg-bg/90 backdrop-blur-md border-b border-border">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center w-10 h-10 -ml-2 rounded-lg text-muted hover:text-dark transition-colors"
            aria-label="Back to Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex-1 min-w-0">
            <p
              className="text-[10px] font-mono font-semibold uppercase tracking-widest"
              style={{ color: chapter.colorAccent }}
            >
              Chapter {chapter.number}
            </p>
            <p className="font-display font-bold text-dark text-sm truncate">
              {chapter.title}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-20 h-1.5 rounded-full bg-border overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: chapter.colorAccent }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
              />
            </div>
            <span className="font-mono text-xs text-muted whitespace-nowrap tabular-nums">
              {completedCount}/{totalCount}
            </span>
          </div>
        </div>
      </div>

      {/* ── Full header (desktop) ──────────────────────────────────────── */}
      <div className="hidden lg:block">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-muted hover:text-dark transition-colors font-body text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          <div
            className="h-1.5 w-24 rounded-full mb-4"
            style={{ backgroundColor: chapter.colorAccent }}
          />

          <div className="flex items-center gap-3 mb-2">
            <span
              className="text-sm font-mono font-semibold uppercase tracking-wider"
              style={{ color: chapter.colorAccent }}
            >
              Chapter {chapter.number}
            </span>
          </div>

          <h1 className="font-display text-3xl font-bold text-dark mb-2">
            {chapter.title}
          </h1>

          <p className="text-muted font-body text-base leading-relaxed max-w-[640px] mb-5">
            {chapter.description}
          </p>

          <div className="flex items-center gap-4 max-w-[400px]">
            <div className="flex-1 h-2 rounded-full bg-border overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: chapter.colorAccent }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
              />
            </div>
            <span className="text-sm font-mono text-muted whitespace-nowrap tabular-nums">
              {completedCount}/{totalCount}
            </span>
          </div>
        </motion.div>
      </div>

      {/* ── Description (mobile only — below sticky header) ─────────────── */}
      <div className="lg:hidden mt-4 mb-6">
        <p className="text-muted font-body text-sm leading-relaxed">
          {chapter.description}
        </p>
      </div>

      {/* ── Lesson Path ─────────────────────────────────────────────────── */}
      <div className="mt-8 lg:mt-4 mb-12 lg:mb-16">
        <LessonPath lessons={lessons} chapterColor={chapter.colorAccent} />
      </div>

      {/* ── Simulation finale card ─────────────────────────────────────── */}
      {simulation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="-mx-4 sm:-mx-6 lg:mx-0"
        >
          <div className="relative overflow-hidden rounded-none lg:rounded-xl bg-dark p-6 lg:p-8 shadow-xl">
            {/* Background gradient overlay */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                background: `radial-gradient(circle at 80% 20%, ${chapter.colorAccent}, transparent 60%)`,
              }}
            />

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <Gamepad2 className="w-5 h-5 text-accent" />
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-accent">
                  Chapter Simulation
                </span>
              </div>

              <h3 className="font-display text-xl lg:text-2xl font-bold text-white mb-2">
                {simulation.title}
              </h3>

              <p className="text-white/60 font-body text-sm leading-relaxed mb-6 max-w-[500px]">
                {simulation.description}
              </p>

              {simulation.isUnlocked ? (
                <Link href={`/simulation/${simulation._id}`} className="block sm:inline-block">
                  <Button
                    variant="accent"
                    size="lg"
                    className="font-display font-semibold w-full sm:w-auto"
                  >
                    {simulation.isCompleted
                      ? 'Replay Simulation'
                      : 'Enter Simulation'}
                  </Button>
                </Link>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <Lock className="w-5 h-5 text-white/40" />
                  </div>
                  <p className="text-white/40 font-body text-sm">
                    Complete all lessons to unlock the simulation
                  </p>
                </div>
              )}

              {simulation.isCompleted && (
                <div className="mt-3 inline-flex items-center gap-1.5 text-sm font-body text-primary">
                  <Check className="w-4 h-4" />
                  Completed
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
