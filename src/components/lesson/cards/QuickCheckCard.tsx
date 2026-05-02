'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';
import type { QuickCheckOption } from '@/lib/content-to-cards';

// ── Types ─────────────────────────────────────────────────────────────────────

interface QuickCheckCardProps {
  question: string;
  options: QuickCheckOption[];
  chapterColor: string;
  onAutoAdvance?: () => void;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function hexToRgba(hex: string, alpha: number): string {
  const cleaned = hex.replace('#', '');
  const r = parseInt(cleaned.substring(0, 2), 16);
  const g = parseInt(cleaned.substring(2, 4), 16);
  const b = parseInt(cleaned.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function QuickCheckCard({
  question,
  options,
  chapterColor,
  onAutoAdvance,
}: QuickCheckCardProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);

  const isCorrect =
    selectedIndex !== null ? options[selectedIndex]?.isCorrect ?? false : false;

  const correctOption = options.find((o) => o.isCorrect);

  const handleSelect = useCallback(
    (index: number) => {
      if (hasAnswered) return;
      setSelectedIndex(index);
      setHasAnswered(true);
    },
    [hasAnswered]
  );

  // Auto-advance after 2.5s. Tap-to-skip handled by the parent surface.
  useEffect(() => {
    if (!hasAnswered || !onAutoAdvance) return;

    const timer = setTimeout(() => {
      onAutoAdvance();
    }, 2500);

    return () => clearTimeout(timer);
  }, [hasAnswered, onAutoAdvance]);

  return (
    <div
      className="lesson-card relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${hexToRgba(chapterColor, 0.04)}, ${hexToRgba(chapterColor, 0.08)})`,
      }}
    >
      {/* Quick Check label */}
      <div className="flex items-center gap-2 mb-5">
        <span
          className="text-[11px] font-mono font-bold uppercase tracking-[0.15em] px-2.5 py-1 rounded-full"
          style={{
            backgroundColor: hexToRgba(chapterColor, 0.12),
            color: chapterColor,
          }}
        >
          Quick Check
        </span>
      </div>

      {/* Question */}
      <h3 className="font-display text-xl lg:text-2xl font-bold text-dark mb-5 lg:mb-6 leading-snug">
        {question}
      </h3>

      {/* Options */}
      <div className="flex flex-col gap-2.5 lg:gap-3">
        {options.map((option, idx) => {
          const isSelected = selectedIndex === idx;
          const isThisCorrect = option.isCorrect;

          let borderColor = 'var(--color-border)';
          let bgColor = 'white';
          let textColor = 'var(--color-dark)';

          if (hasAnswered) {
            if (isSelected && isThisCorrect) {
              borderColor = 'var(--color-success)';
              bgColor = 'rgba(16, 185, 129, 0.08)';
              textColor = 'var(--color-success)';
            } else if (isSelected && !isThisCorrect) {
              borderColor = 'var(--color-error)';
              bgColor = 'rgba(239, 68, 68, 0.08)';
              textColor = 'var(--color-error)';
            } else if (isThisCorrect) {
              // Show the correct answer when wrong is selected
              borderColor = 'var(--color-success)';
              bgColor = 'rgba(16, 185, 129, 0.06)';
            }
          }

          return (
            <motion.button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={hasAnswered}
              className="w-full text-left px-4 lg:px-5 py-4 lg:py-3.5 rounded-xl border-2 font-body text-[15px] transition-all disabled:cursor-default min-h-[64px] lg:min-h-0"
              style={{
                borderColor,
                backgroundColor: bgColor,
                color: textColor,
              }}
              whileHover={!hasAnswered ? {
                borderColor: chapterColor,
                backgroundColor: hexToRgba(chapterColor, 0.04),
              } : {}}
              whileTap={!hasAnswered ? { scale: 0.98 } : {}}
              animate={
                hasAnswered && isSelected && !isThisCorrect
                  ? {
                      x: [0, -6, 6, -4, 4, 0],
                      transition: { duration: 0.4 },
                    }
                  : {}
              }
            >
              <span className="flex items-center gap-3">
                <span
                  className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-mono font-semibold shrink-0 transition-colors"
                  style={{
                    borderColor: hasAnswered
                      ? isThisCorrect
                        ? 'var(--color-success)'
                        : isSelected
                        ? 'var(--color-error)'
                        : 'var(--color-border)'
                      : hexToRgba(chapterColor, 0.35),
                    color: hasAnswered
                      ? isThisCorrect
                        ? 'var(--color-success)'
                        : isSelected
                        ? 'var(--color-error)'
                        : 'var(--color-muted)'
                      : chapterColor,
                  }}
                >
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="flex-1">{option.text}</span>

                {/* Feedback icons */}
                <AnimatePresence>
                  {hasAnswered && isSelected && isThisCorrect && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                    >
                      <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                    </motion.span>
                  )}
                  {hasAnswered && isSelected && !isThisCorrect && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                    >
                      <XCircle className="w-5 h-5 text-error shrink-0" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Feedback message + auto-advance hint */}
      <AnimatePresence>
        {hasAnswered && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-5"
          >
            {isCorrect ? (
              <p className="text-success font-body font-medium text-sm text-center">
                Correct! Nice recall.
              </p>
            ) : (
              <p className="text-muted font-body text-sm text-center">
                The answer is{' '}
                <span className="font-medium text-dark">
                  {correctOption?.text ?? ''}
                </span>
              </p>
            )}

            {/* Skip-progress bar — visualises the 2.5s auto-advance window */}
            {onAutoAdvance && (
              <div className="mt-4 h-0.5 w-full max-w-[200px] mx-auto rounded-full bg-border overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: chapterColor }}
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2.5, ease: 'linear' }}
                />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
