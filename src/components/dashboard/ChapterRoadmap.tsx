'use client';

import { motion } from 'framer-motion';
import { Check, Lock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import ProgressBar from '@/components/gamification/ProgressBar';

interface ChapterStop {
  _id: string;
  number: number;
  title: string;
  subtitle: string;
  colorAccent: string;
  lessonCount: number;
  completedLessonCount: number;
  status: 'completed' | 'current' | 'locked';
}

interface ChapterRoadmapProps {
  chapters: ChapterStop[];
  userName: string;
  hasProgress: boolean;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const itemLeftVariants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 1, 0.5, 1] as const,
    },
  },
};

const itemRightVariants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 1, 0.5, 1] as const,
    },
  },
};

export default function ChapterRoadmap({
  chapters,
  userName,
  hasProgress,
}: ChapterRoadmapProps) {
  return (
    <div className="relative">
      {/* Empty state encouragement */}
      {!hasProgress && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8 bg-accent/10 border border-accent/30 rounded-xl p-5 flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
            <span className="text-2xl">&#x1F44B;</span>
          </div>
          <div>
            <p className="font-display text-lg text-dark">
              Ready to start your money journey, {userName}?
            </p>
            <p className="text-muted font-body text-sm mt-0.5">
              Tap Chapter 0 below to begin your first lesson!
            </p>
          </div>
        </motion.div>
      )}

      {/* Roadmap */}
      <motion.div
        role="list"
        aria-label="Chapter roadmap"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative"
      >
        {/* Connecting line */}
        <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-0.5 border-l-2 border-dashed border-gray-200 z-0 hidden md:block" />

        {chapters.map((chapter, index) => {
          const isLeft = index % 2 === 0;
          const progress =
            chapter.lessonCount > 0
              ? Math.round(
                  (chapter.completedLessonCount / chapter.lessonCount) * 100
                )
              : 0;
          const isCompleted = chapter.status === 'completed';
          const isCurrent = chapter.status === 'current';
          const isLocked = chapter.status === 'locked';

          const chapterAriaLabel = isLocked
            ? `Chapter ${chapter.number}: ${chapter.title} - locked`
            : `Chapter ${chapter.number}: ${chapter.title} - ${chapter.completedLessonCount} of ${chapter.lessonCount} lessons complete`;

          return (
            <motion.div
              key={chapter._id}
              role="listitem"
              variants={isLeft ? itemLeftVariants : itemRightVariants}
              className={`relative flex items-center gap-6 mb-6 md:mb-4 ${
                isLeft
                  ? 'md:flex-row md:pr-[52%]'
                  : 'md:flex-row-reverse md:pl-[52%]'
              }`}
            >
              {/* Center node (circle) - visible on md+ */}
              <div className="absolute left-1/2 -translate-x-1/2 z-10 hidden md:flex items-center justify-center">
                <div className="relative">
                  {/* Pulsing glow for current */}
                  {isCurrent && (
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{ backgroundColor: chapter.colorAccent }}
                      animate={{
                        scale: [1, 1.6, 1],
                        opacity: [0.3, 0, 0.3],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    />
                  )}
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center font-display text-xl font-bold border-4 transition-all duration-300 ${
                      isLocked
                        ? 'bg-gray-100 border-gray-200 text-gray-400'
                        : 'text-white border-white shadow-lg'
                    }`}
                    style={
                      !isLocked
                        ? {
                            backgroundColor: chapter.colorAccent,
                            boxShadow: `0 4px 20px ${chapter.colorAccent}40`,
                          }
                        : undefined
                    }
                  >
                    {isCompleted ? (
                      <Check className="w-7 h-7" strokeWidth={3} />
                    ) : isLocked ? (
                      <Lock className="w-6 h-6" />
                    ) : (
                      chapter.number
                    )}
                  </div>

                  {/* User avatar indicator for current chapter */}
                  {isCurrent && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 20,
                        delay: 0.4,
                      }}
                      className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-display font-bold border-2 border-white shadow-md z-10"
                    >
                      {userName.charAt(0).toUpperCase()}
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Chapter card */}
              <Link
                href={isLocked ? '#' : `/chapter/${chapter._id}`}
                onClick={(e) => {
                  if (isLocked) e.preventDefault();
                }}
                aria-label={chapterAriaLabel}
                className={`flex-1 z-10 focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 outline-none rounded-xl ${isLocked ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <motion.div
                  whileHover={!isLocked ? { scale: 1.02, y: -2 } : undefined}
                  whileTap={!isLocked ? { scale: 0.99 } : undefined}
                  className={`bg-surface rounded-xl p-5 border-2 transition-all duration-200 ${
                    isCurrent
                      ? 'border-current shadow-lg'
                      : isCompleted
                        ? 'border-transparent shadow-sm'
                        : 'border-transparent shadow-sm opacity-60'
                  }`}
                  style={
                    isCurrent
                      ? {
                          borderColor: chapter.colorAccent,
                          boxShadow: `0 4px 24px ${chapter.colorAccent}20`,
                        }
                      : undefined
                  }
                >
                  <div className="flex items-start gap-4">
                    {/* Mobile circle (visible below md) */}
                    <div className="relative md:hidden shrink-0">
                      {isCurrent && (
                        <motion.div
                          className="absolute inset-0 rounded-full"
                          style={{ backgroundColor: chapter.colorAccent }}
                          animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.3, 0, 0.3],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'easeInOut',
                          }}
                        />
                      )}
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center font-display text-lg font-bold ${
                          isLocked
                            ? 'bg-gray-100 text-gray-400'
                            : 'text-white'
                        }`}
                        style={
                          !isLocked
                            ? { backgroundColor: chapter.colorAccent }
                            : undefined
                        }
                      >
                        {isCompleted ? (
                          <Check className="w-5 h-5" strokeWidth={3} />
                        ) : isLocked ? (
                          <Lock className="w-4 h-4" />
                        ) : (
                          chapter.number
                        )}
                      </div>
                    </div>

                    {/* Text content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="text-xs font-mono font-semibold uppercase tracking-wider"
                          style={{ color: isLocked ? '#9ca3af' : chapter.colorAccent }}
                        >
                          Chapter {chapter.number}
                        </span>
                        {isCompleted && (
                          <span className="text-xs font-body text-primary bg-primary-light px-2 py-0.5 rounded-full">
                            Complete
                          </span>
                        )}
                      </div>

                      <h3
                        className={`font-display text-xl font-semibold mb-0.5 ${
                          isLocked ? 'text-gray-400' : 'text-dark'
                        }`}
                      >
                        {chapter.title}
                      </h3>

                      <p
                        className={`text-sm font-body mb-3 ${
                          isLocked ? 'text-gray-300' : 'text-muted'
                        }`}
                      >
                        {chapter.subtitle}
                      </p>

                      {/* Lesson count + progress */}
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-sm font-body ${
                            isLocked ? 'text-gray-300' : 'text-muted'
                          }`}
                        >
                          {chapter.completedLessonCount}/{chapter.lessonCount}{' '}
                          lessons
                        </span>
                        {!isLocked && chapter.lessonCount > 0 && (
                          <div className="flex-1 max-w-[160px]">
                            <ProgressBar
                              value={progress}
                              color={chapter.colorAccent}
                              size="sm"
                            />
                          </div>
                        )}
                      </div>

                      {/* CTA for first chapter in empty state */}
                      {isCurrent && !hasProgress && chapter.number === 0 && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.8 }}
                          className="mt-3 inline-flex items-center gap-1.5 text-sm font-display font-semibold"
                          style={{ color: chapter.colorAccent }}
                        >
                          Start Here
                          <ArrowRight className="w-4 h-4" />
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
