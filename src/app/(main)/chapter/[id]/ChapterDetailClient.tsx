'use client';

import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Check,
  Circle,
  Lock,
  Clock,
  BookOpen,
  Gamepad2,
} from 'lucide-react';
import Link from 'next/link';
import ProgressBar from '@/components/gamification/ProgressBar';
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

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: [0.25, 1, 0.5, 1] as const },
  },
};

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
      {/* Back button */}
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

      {/* Chapter header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        {/* Colored accent bar */}
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

        {/* Progress */}
        <div className="flex items-center gap-4 max-w-[400px]">
          <ProgressBar
            value={progress}
            color={chapter.colorAccent}
            size="md"
          />
          <span className="text-sm font-mono text-muted whitespace-nowrap">
            {completedCount}/{totalCount}
          </span>
        </div>
      </motion.div>

      {/* Lesson list */}
      <motion.div
        variants={listVariants}
        initial="hidden"
        animate="visible"
        className="space-y-3 mb-8"
      >
        {lessons.map((lesson) => {
          const isCompleted = lesson.status === 'completed';
          const isInProgress = lesson.status === 'in-progress';
          const isLocked = lesson.status === 'locked';

          return (
            <motion.div key={lesson._id} variants={itemVariants}>
              <Link
                href={isLocked ? '#' : `/lesson/${lesson._id}`}
                onClick={(e) => {
                  if (isLocked) e.preventDefault();
                }}
                className={`rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-offset-2 block ${
                  isLocked
                    ? 'cursor-not-allowed'
                    : 'cursor-pointer focus-visible:ring-primary/40'
                }`}
              >
                <motion.div
                  whileHover={!isLocked ? { scale: 1.01, x: 4 } : undefined}
                  whileTap={!isLocked ? { scale: 0.995 } : undefined}
                  className={`bg-surface rounded-xl p-5 border-2 transition-all duration-200 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                    isInProgress
                      ? 'border-gray-200 shadow-sm hover:shadow-md'
                      : isCompleted
                        ? 'border-transparent shadow-sm hover:shadow-md'
                        : 'border-transparent shadow-sm opacity-50'
                  }`}
                  style={
                    isInProgress
                      ? {
                          borderColor: `${chapter.colorAccent}40`,
                        }
                      : undefined
                  }
                >
                  <div className="flex items-center gap-4">
                    {/* Status icon */}
                    <div className="shrink-0">
                      {isCompleted ? (
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: `${chapter.colorAccent}20` }}
                        >
                          <Check
                            className="w-5 h-5"
                            style={{ color: chapter.colorAccent }}
                            strokeWidth={2.5}
                          />
                        </div>
                      ) : isInProgress ? (
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center border-2"
                          style={{
                            borderColor: chapter.colorAccent,
                            backgroundColor: `${chapter.colorAccent}10`,
                          }}
                        >
                          <Circle
                            className="w-4 h-4"
                            style={{ color: chapter.colorAccent }}
                            strokeWidth={2.5}
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100">
                          <Lock className="w-4 h-4 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <span
                        className="text-xs font-mono font-semibold mb-0.5 block"
                        style={{
                          color: isLocked ? '#9ca3af' : chapter.colorAccent,
                        }}
                      >
                        {lesson.lessonNumber}
                      </span>
                      <h3
                        className={`font-display text-lg font-semibold ${
                          isLocked ? 'text-gray-400' : 'text-dark'
                        }`}
                      >
                        {lesson.title}
                      </h3>
                      {isLocked && (
                        <p className="text-xs text-gray-400 font-body mt-0.5">
                          Complete previous lessons to unlock
                        </p>
                      )}
                    </div>

                    {/* Meta */}
                    <div className="flex items-center gap-3 shrink-0">
                      <div
                        className={`flex items-center gap-1.5 text-sm font-body ${
                          isLocked ? 'text-gray-300' : 'text-muted'
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5" />
                        {lesson.estimatedMinutes} min
                      </div>
                      <div
                        className={`flex items-center gap-1.5 text-sm font-body ${
                          isLocked ? 'text-gray-300' : 'text-muted'
                        }`}
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        {lesson.exerciseCount} exercises
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Simulation card */}
      {simulation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <motion.div
            whileHover={{ y: -2, boxShadow: '0 12px 40px rgba(26,26,46,0.3)' }}
            transition={{ duration: 0.2, ease: [0.25, 1, 0.5, 1] }}
            className="relative overflow-hidden rounded-xl bg-dark p-6 shadow-xl"
          >
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

              <h3 className="font-display text-2xl font-bold text-white mb-2">
                {simulation.title}
              </h3>

              <p className="text-white/60 font-body text-sm leading-relaxed mb-6 max-w-[500px]">
                {simulation.description}
              </p>

              {simulation.isUnlocked ? (
                <Link href={`/simulation/${simulation._id}`}>
                  <Button
                    variant="accent"
                    size="lg"
                    className="font-display font-semibold"
                  >
                    {simulation.isCompleted
                      ? 'Replay Simulation'
                      : 'Enter Simulation'}
                  </Button>
                </Link>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
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
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
