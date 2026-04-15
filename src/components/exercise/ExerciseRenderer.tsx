'use client';

import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  X,
  ChevronRight,
  Lightbulb,
  Calculator,
  BookOpen,
  GripVertical,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import type { Exercise } from '@/types';
import { fireConfetti } from '@/lib/confetti';
import { isFormulaSafe } from '@/lib/formula-sanitizer';

/* ══════════════════════════════════════════════════════════════════════
   Types
   ══════════════════════════════════════════════════════════════════════ */

interface ExerciseRendererProps {
  exercises: Exercise[];
  onComplete: (score: number, maxScore: number, answerSelections?: { questionIndex: number; selectedOptions: number[] }[]) => void;
  chapterColor?: string;
}

interface AnswerState {
  selected: number[];
  isCorrect: boolean | null;
  submitted: boolean;
}

/** Typed helpers for exercise data that arrives as Record<string, unknown> */
interface SortingItem {
  text: string;
  correctCategory: string;
}

interface CalculatorInput {
  label: string;
  key: string;
  default: number;
}

interface FollowUpQuestion {
  prompt: string;
  options: { text: string; isCorrect: boolean }[];
  explanation: string;
}

/* ══════════════════════════════════════════════════════════════════════
   AnimatedXPCounter
   ══════════════════════════════════════════════════════════════════════ */

function AnimatedXPCounter({
  target,
  duration = 1500,
}: {
  target: number;
  duration?: number;
}) {
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

  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.3 }}
      className="flex flex-col items-center"
    >
      <span className="font-mono text-6xl text-accent font-bold tabular-nums tracking-tight">
        +{value}
      </span>
      <span className="font-display text-sm text-accent/70 uppercase tracking-widest mt-1">
        Experience Points
      </span>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Animated SVG Checkmark
   ══════════════════════════════════════════════════════════════════════ */

function AnimatedCheckmark({ className }: { className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      fill="none"
      className={className ?? 'w-5 h-5'}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <motion.path
        d="M5 13l4 4L19 7"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut', delay: 0.1 }}
      />
    </motion.svg>
  );
}

function AnimatedCross({ className }: { className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      fill="none"
      className={className ?? 'w-5 h-5'}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <motion.path
        d="M6 6l12 12"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut', delay: 0.05 }}
      />
      <motion.path
        d="M18 6l-12 12"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut', delay: 0.15 }}
      />
    </motion.svg>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   SegmentedProgressBar — replaces ProgressDots
   ══════════════════════════════════════════════════════════════════════ */

function SegmentedProgressBar({
  total,
  current,
  answers,
  chapterColor,
}: {
  total: number;
  current: number;
  answers: AnswerState[];
  chapterColor?: string;
}) {
  return (
    <div className="flex items-center gap-1.5 mb-5">
      {Array.from({ length: total }).map((_, i) => {
        const answered = answers[i]?.submitted;
        const correct = answers[i]?.isCorrect;
        const isCurrent = i === current;

        let bgColor = '#E5E5E0'; // gray upcoming
        if (answered && correct) bgColor = '#10B981'; // success green
        if (answered && !correct) bgColor = '#EF4444'; // error red
        if (isCurrent && !answered) bgColor = chapterColor || '#F5A623'; // accent / chapter color

        return (
          <motion.div
            key={i}
            className="rounded-full overflow-hidden"
            animate={{
              height: isCurrent ? 8 : 6,
              flex: isCurrent ? 2 : 1,
              opacity: isCurrent || answered ? 1 : 0.5,
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            style={{ backgroundColor: bgColor }}
          />
        );
      })}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   OptionCard — Redesigned: no letter badges, full-width cards
   ══════════════════════════════════════════════════════════════════════ */

function OptionCard({
  text,
  isSelected,
  isCorrect,
  isSubmitted,
  isMulti,
  onSelect,
  disabled,
  chapterColor,
  isCorrectAnswer,
}: {
  text: string;
  isSelected: boolean;
  isCorrect: boolean;
  isSubmitted: boolean;
  isMulti: boolean;
  onSelect: () => void;
  disabled: boolean;
  chapterColor?: string;
  /** Whether this option IS the correct answer (for highlighting after wrong submission) */
  isCorrectAnswer: boolean;
}) {
  const accent = chapterColor || '#F5A623';

  // Determine visual state
  const isWrongSelection = isSubmitted && isSelected && !isCorrect;
  const isRightSelection = isSubmitted && isSelected && isCorrect;
  const isRevealedCorrect = isSubmitted && !isSelected && isCorrectAnswer;

  // Build inline styles for accent-colored states
  const borderColor = isRightSelection || isRevealedCorrect
    ? '#10B981'
    : isWrongSelection
    ? '#EF4444'
    : isSelected && !isSubmitted
    ? accent
    : undefined;

  const backgroundColor = isRightSelection || isRevealedCorrect
    ? 'rgba(16, 185, 129, 0.10)'
    : isWrongSelection
    ? 'rgba(239, 68, 68, 0.10)'
    : isSelected && !isSubmitted
    ? `${accent}14` // ~8% opacity
    : undefined;

  const shakeAnimation =
    isWrongSelection
      ? { x: [0, -8, 8, -6, 6, -3, 3, 0], transition: { duration: 0.5 } }
      : {};

  const pulseAnimation =
    isRightSelection
      ? { scale: [1, 1.02, 1], transition: { duration: 0.35 } }
      : {};

  return (
    <motion.button
      onClick={onSelect}
      disabled={disabled}
      animate={{ ...shakeAnimation, ...pulseAnimation }}
      whileHover={!disabled ? { y: -2, boxShadow: '0 4px 16px rgba(26,26,46,0.07), 0 2px 6px rgba(26,26,46,0.04)' } : undefined}
      whileTap={!disabled ? { scale: 0.99 } : undefined}
      className={`
        w-full px-4 py-3 rounded-xl border text-left relative
        flex items-center gap-3 transition-all duration-200 ease-[cubic-bezier(0.25,1,0.5,1)]
        disabled:cursor-default
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
        ${!borderColor ? 'border-[#E5E5E0]' : ''}
        ${!backgroundColor ? 'bg-white' : ''}
        ${!disabled ? 'cursor-pointer' : ''}
      `}
      style={{
        borderColor: borderColor || undefined,
        backgroundColor: backgroundColor || undefined,
        boxShadow: !disabled ? '0 1px 3px rgba(26,26,46,0.04), 0 2px 8px rgba(26,26,46,0.03)' : undefined,
      }}
    >
      {/* Text */}
      <span className="font-body text-dark text-[15px] flex-1 leading-snug">{text}</span>

      {/* Right-side indicator */}
      <div className="shrink-0 w-6 h-6 flex items-center justify-center">
        {isRightSelection && (
          <AnimatedCheckmark className="w-5 h-5 text-[#10B981]" />
        )}
        {isWrongSelection && (
          <AnimatedCross className="w-5 h-5 text-[#EF4444]" />
        )}
        {isRevealedCorrect && (
          <AnimatedCheckmark className="w-5 h-5 text-[#10B981]" />
        )}
        {isSelected && !isSubmitted && !isMulti && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: accent }}
          />
        )}
        {isSelected && !isSubmitted && isMulti && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            className="w-5 h-5 rounded-md flex items-center justify-center"
            style={{ backgroundColor: accent }}
          >
            <Check className="w-3 h-3 text-white" />
          </motion.div>
        )}
      </div>
    </motion.button>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   ExplanationBox — Redesigned with smooth expand
   ══════════════════════════════════════════════════════════════════════ */

function ExplanationBox({
  explanation,
  isCorrect,
}: {
  explanation: string;
  isCorrect: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
      className="overflow-hidden mt-4"
    >
      <div
        className={`
          px-4 py-3 rounded-xl border-l-4
          ${isCorrect ? 'border-[#10B981] bg-[#10B981]/5' : 'border-[#D97706] bg-[#D97706]/5'}
        `}
      >
        <div className="flex items-start gap-2.5">
          <Lightbulb
            className={`w-4 h-4 mt-0.5 shrink-0 ${
              isCorrect ? 'text-[#10B981]' : 'text-[#D97706]'
            }`}
          />
          <div>
            <p
              className={`font-display font-semibold text-xs mb-1 ${
                isCorrect ? 'text-[#10B981]' : 'text-[#D97706]'
              }`}
            >
              {isCorrect ? 'Correct!' : 'Not quite right'}
            </p>
            <p className="text-dark/80 font-body text-sm leading-relaxed">
              {explanation}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   SortingExercise — Redesigned with drag-and-drop + click-to-sort
   ══════════════════════════════════════════════════════════════════════ */

function SortingExercise({
  exercise,
  onSubmit,
  chapterColor,
}: {
  exercise: Exercise;
  onSubmit: (isCorrect: boolean, pct: number) => void;
  chapterColor?: string;
}) {
  const accent = chapterColor || '#F5A623';
  const categories = exercise.categories ?? [];
  const items: SortingItem[] = useMemo(
    () =>
      ((exercise.items ?? []) as unknown as SortingItem[]).map((item) => ({
        text: String(item.text),
        correctCategory: String(item.correctCategory),
      })),
    [exercise.items]
  );

  const shuffledIndices = useMemo(() => {
    const indices = items.map((_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return indices;
  }, [items]);

  const [placements, setPlacements] = useState<Record<number, string>>({});
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<Record<number, boolean>>({});
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [dragOverCategory, setDragOverCategory] = useState<string | null>(null);

  const unplacedIndices = shuffledIndices.filter(
    (idx) => placements[idx] === undefined
  );
  const allPlaced = unplacedIndices.length === 0 && items.length > 0;

  const getItemsInCategory = (cat: string) =>
    shuffledIndices.filter((idx) => placements[idx] === cat);

  // Select an unplaced item, then click a category to place it
  const handleItemSelect = (idx: number) => {
    if (submitted) return;
    setSelectedItem((prev) => (prev === idx ? null : idx));
  };

  // Explicitly remove a placed item (via X button)
  const handleRemoveItem = (idx: number) => {
    if (submitted) return;
    setPlacements((prev) => {
      const next = { ...prev };
      delete next[idx];
      return next;
    });
  };

  const handleCategoryClick = (cat: string) => {
    if (submitted || selectedItem === null) return;
    setPlacements((prev) => ({ ...prev, [selectedItem]: cat }));
    setSelectedItem(null);
  };

  // HTML5 Drag and Drop — works for both unplaced items AND placed items (re-sort)
  const handleDragStart = (e: React.DragEvent, idx: number) => {
    if (submitted) return;
    setDraggedItem(idx);
    e.dataTransfer.effectAllowed = 'move';
    // Set minimal drag image data so browser shows the drag
    e.dataTransfer.setData('text/plain', String(idx));
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverCategory(null);
  };

  const handleDragOver = (e: React.DragEvent, cat: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverCategory(cat);
  };

  const handleDragLeave = () => {
    setDragOverCategory(null);
  };

  const handleDrop = (e: React.DragEvent, cat: string) => {
    e.preventDefault();
    if (draggedItem !== null && !submitted) {
      setPlacements((prev) => ({ ...prev, [draggedItem]: cat }));
    }
    setDraggedItem(null);
    setDragOverCategory(null);
    setSelectedItem(null);
  };

  // Drop back to unplaced pool
  const handlePoolDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handlePoolDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedItem !== null && !submitted) {
      handleRemoveItem(draggedItem);
    }
    setDraggedItem(null);
    setDragOverCategory(null);
  };

  const handleSubmit = () => {
    const itemResults: Record<number, boolean> = {};
    let correctCount = 0;
    items.forEach((item, idx) => {
      const correct = placements[idx] === item.correctCategory;
      itemResults[idx] = correct;
      if (correct) correctCount++;
    });
    setResults(itemResults);
    setSubmitted(true);
    const pct = items.length > 0 ? correctCount / items.length : 0;
    onSubmit(pct === 1, pct);
  };

  return (
    <div className="space-y-4">
      {/* Category drop zones */}
      <div
        className={`grid gap-3 ${
          categories.length === 2
            ? 'grid-cols-2'
            : categories.length === 3
            ? 'grid-cols-3'
            : 'grid-cols-2'
        }`}
      >
        {categories.map((cat) => {
          const itemsHere = getItemsInCategory(cat);
          const isTarget = (selectedItem !== null || draggedItem !== null) && !submitted;
          const isDragOver = dragOverCategory === cat;

          return (
            <div
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              onDragOver={(e) => handleDragOver(e, cat)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, cat)}
              className="rounded-xl border-2 border-dashed p-3 min-h-[120px] text-left flex flex-col transition-all duration-200"
              style={{
                backgroundColor: isDragOver
                  ? `${accent}25`
                  : `${accent}0D`,
                borderColor: isDragOver
                  ? accent
                  : isTarget
                  ? `${accent}80`
                  : `${accent}35`,
                borderStyle: isDragOver || itemsHere.length > 0 ? 'solid' : 'dashed',
                cursor: isTarget ? 'pointer' : 'default',
              }}
            >
              <span
                className="font-display text-[11px] font-bold mb-2 block uppercase tracking-wider"
                style={{ color: accent }}
              >
                {cat}
              </span>
              <div className="flex flex-wrap gap-1.5 flex-1 content-start">
                <AnimatePresence mode="popLayout">
                  {itemsHere.map((idx) => (
                    <motion.span
                      key={idx}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      draggable={!submitted}
                      onDragStart={(e) => handleDragStart(e as unknown as React.DragEvent, idx)}
                      onDragEnd={handleDragEnd}
                      className={`
                        inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[13px] font-body leading-tight
                        ${
                          submitted
                            ? results[idx]
                              ? 'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/30'
                              : 'bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/30'
                            : 'bg-white text-dark border border-[#E5E5E0] cursor-grab active:cursor-grabbing'
                        }
                      `}
                    >
                      {submitted && (results[idx] ? (
                        <Check className="w-3 h-3 shrink-0" />
                      ) : (
                        <X className="w-3 h-3 shrink-0" />
                      ))}
                      {items[idx].text}
                      {!submitted && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveItem(idx);
                          }}
                          className="ml-0.5 w-4 h-4 rounded-full flex items-center justify-center text-muted hover:text-dark hover:bg-dark/10 transition-colors shrink-0"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </motion.span>
                  ))}
                </AnimatePresence>
                {itemsHere.length === 0 && !submitted && (
                  <span className="text-[11px] text-muted/40 font-body italic">
                    {isTarget ? 'Drop here' : 'Drag items here'}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Unplaced items pool */}
      {unplacedIndices.length > 0 && (
        <div
          className="bg-[#F7F7F4] rounded-xl border border-[#E5E5E0] px-4 py-3"
          onDragOver={handlePoolDragOver}
          onDrop={handlePoolDrop}
        >
          <span className="text-[11px] font-mono text-muted uppercase tracking-wider mb-2 block">
            Drag to a category
          </span>
          <div className="flex flex-wrap gap-2">
            <AnimatePresence mode="popLayout">
              {unplacedIndices.map((idx) => (
                <motion.button
                  key={idx}
                  layout
                  draggable={!submitted}
                  onDragStart={(e) => handleDragStart(e as unknown as React.DragEvent, idx)}
                  onDragEnd={handleDragEnd}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{
                    opacity: draggedItem === idx ? 0.5 : 1,
                    y: 0,
                  }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.04, y: -1 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleItemSelect(idx)}
                  className={`
                    px-3 py-2 rounded-lg text-sm font-body border-2 transition-all duration-150
                    ${
                      selectedItem === idx
                        ? 'text-dark shadow-md'
                        : 'border-[#E5E5E0] bg-white text-dark hover:shadow-sm'
                    }
                    ${!submitted ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}
                  `}
                  style={
                    selectedItem === idx
                      ? {
                          borderColor: accent,
                          backgroundColor: `${accent}14`,
                          boxShadow: `0 2px 8px ${accent}20`,
                        }
                      : undefined
                  }
                >
                  {items[idx].text}
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Incorrect items: show correct category */}
      {submitted && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-1"
        >
          {items.map((item, idx) =>
            !results[idx] ? (
              <div
                key={idx}
                className="flex items-center gap-1.5 text-[13px] font-body text-[#EF4444]/80 bg-[#EF4444]/5 px-3 py-1.5 rounded-lg"
              >
                <X className="w-3 h-3 shrink-0" />
                <span className="truncate">&ldquo;{item.text}&rdquo;</span>
                <ArrowRight className="w-3 h-3 shrink-0 text-muted" />
                <span className="font-semibold text-dark/70 shrink-0">
                  {item.correctCategory}
                </span>
              </div>
            ) : null
          )}
        </motion.div>
      )}

      {/* Check Answers button */}
      {!submitted && (
        <motion.button
          whileHover={allPlaced ? { scale: 1.02, y: -1 } : undefined}
          whileTap={allPlaced ? { scale: 0.98 } : undefined}
          onClick={handleSubmit}
          disabled={!allPlaced}
          className="w-full py-3 rounded-xl font-display font-semibold text-sm text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            backgroundColor: allPlaced ? accent : '#9CA3AF',
            boxShadow: allPlaced ? `0 4px 16px ${accent}30` : undefined,
          }}
        >
          {allPlaced
            ? 'Check Answers'
            : `Place all items first (${items.length - unplacedIndices.length}/${items.length})`}
        </motion.button>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   CalculatorExercise — Redesigned with dark header bar
   ══════════════════════════════════════════════════════════════════════ */

function CalculatorExercise({
  exercise,
  onSubmit,
  chapterColor,
}: {
  exercise: Exercise;
  onSubmit: (isCorrect: boolean) => void;
  chapterColor?: string;
}) {
  const title = exercise.title ?? 'Calculator';
  const inputs: CalculatorInput[] = useMemo(
    () =>
      ((exercise.inputs ?? []) as unknown as CalculatorInput[]).map((inp) => ({
        label: String(inp.label),
        key: String(inp.key),
        default: Number(inp.default) || 0,
      })),
    [exercise.inputs]
  );
  const formula = exercise.formula ?? '';
  const outputLabel = exercise.outputLabel ?? 'Result';
  const followUp = exercise.followUpQuestion as FollowUpQuestion | null;
  const accent = chapterColor || '#1B6B4A';

  // Part 1: Calculator state
  const [inputValues, setInputValues] = useState<Record<string, number>>(() => {
    const defaults: Record<string, number> = {};
    inputs.forEach((inp) => {
      defaults[inp.key] = inp.default;
    });
    return defaults;
  });
  const [calculated, setCalculated] = useState(false);
  const [calcResult, setCalcResult] = useState<
    number | Record<string, number> | null
  >(null);
  const [calcError, setCalcError] = useState<string | null>(null);

  // Part 2: Follow-up MCQ state
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [followUpSelected, setFollowUpSelected] = useState<number | null>(null);
  const [followUpSubmitted, setFollowUpSubmitted] = useState(false);
  const [followUpCorrect, setFollowUpCorrect] = useState<boolean | null>(null);

  const handleInputChange = (key: string, value: string) => {
    const parsed = parseFloat(value);
    setInputValues((prev) => ({
      ...prev,
      [key]: isNaN(parsed) ? 0 : parsed,
    }));
    if (calculated) {
      setCalculated(false);
      setCalcResult(null);
      setCalcError(null);
    }
  };

  const evaluateFormula = useCallback(() => {
    try {
      const keys = inputs.map((inp) => inp.key);
      const values = keys.map((k) => inputValues[k] ?? 0);

      let fnBody = formula.trim();

      if (fnBody.startsWith('{') && !fnBody.startsWith('{(') && !fnBody.includes('return')) {
        fnBody = `return (${fnBody})`;
      } else if (
        !fnBody.includes('return') &&
        !fnBody.startsWith('(')
      ) {
        fnBody = `return (${fnBody})`;
      }

      if (!isFormulaSafe(fnBody, keys)) {
        setCalcError('Formula contains invalid operations.');
        setCalculated(false);
        return;
      }
      // eslint-disable-next-line no-new-func
      const fn = new Function(...keys, fnBody);
      const result = fn(...values);
      setCalcResult(result);
      setCalcError(null);
      setCalculated(true);
    } catch {
      setCalcError('Could not compute. Check your inputs.');
      setCalculated(false);
    }
  }, [formula, inputs, inputValues]);

  const handleCalculate = () => {
    evaluateFormula();
  };

  const handleShowFollowUp = () => {
    setShowFollowUp(true);
  };

  const handleFollowUpSelect = (idx: number) => {
    if (followUpSubmitted || !followUp) return;
    setFollowUpSelected(idx);
    const isCorrect = followUp.options[idx]?.isCorrect ?? false;
    setFollowUpCorrect(isCorrect);
    setFollowUpSubmitted(true);
    onSubmit(isCorrect);
  };

  const formatNumber = (n: number) => {
    return new Intl.NumberFormat('en-IN').format(Math.round(n * 100) / 100);
  };

  // Animated counter for single result
  const [displayValue, setDisplayValue] = useState(0);
  const countUpRef = useRef<number>(0);

  useEffect(() => {
    if (calculated && typeof calcResult === 'number') {
      const target = Math.round(calcResult * 100) / 100;
      const startTime = performance.now();
      const duration = 1000;
      const animate = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplayValue(Math.round(eased * target));
        if (progress < 1) {
          countUpRef.current = requestAnimationFrame(animate);
        }
      };
      countUpRef.current = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(countUpRef.current);
    }
  }, [calculated, calcResult]);

  return (
    <div className="space-y-6">
      {/* Calculator card with dark header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl overflow-hidden border border-[#E5E5E0]"
        style={{ boxShadow: '0 8px 32px rgba(26,26,46,0.1), 0 2px 8px rgba(26,26,46,0.04)' }}
      >
        {/* Dark header bar */}
        <div
          className="px-6 py-4 flex items-center gap-3"
          style={{ backgroundColor: '#1A1A2E' }}
        >
          <Calculator className="w-5 h-5 text-white/80" />
          <h4 className="font-display text-lg font-semibold text-white">
            {title}
          </h4>
        </div>

        {/* Inputs */}
        <div className="px-6 py-5 space-y-4 bg-white">
          {inputs.map((inp) => (
            <div key={inp.key}>
              <label className="block text-sm font-body font-medium text-dark/80 mb-1.5">
                {inp.label}
              </label>
              <input
                type="number"
                value={inputValues[inp.key] ?? ''}
                onChange={(e) => handleInputChange(inp.key, e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border-2 border-[#E5E5E0] bg-[#F7F7F4] font-mono text-lg text-dark focus:outline-none focus:border-opacity-50 focus:ring-2 focus:ring-opacity-10 transition-all"
                style={{
                  // @ts-expect-error -- CSS custom focus styles via inline
                  '--tw-ring-color': `${accent}1A`,
                }}
              />
            </div>
          ))}

          {/* Calculate button */}
          <motion.button
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCalculate}
            className="w-full py-3.5 rounded-xl font-display font-semibold text-white transition-all"
            style={{
              backgroundColor: accent,
              boxShadow: `0 4px 16px ${accent}30`,
            }}
          >
            <span className="flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              Calculate
            </span>
          </motion.button>
        </div>

        {/* Output */}
        <AnimatePresence>
          {calculated && calcResult !== null && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="overflow-hidden"
            >
              <div
                className="px-6 py-6 border-t border-[#E5E5E0]"
                style={{ backgroundColor: `${accent}08` }}
              >
                <p className="text-xs font-mono text-muted uppercase tracking-wider mb-3">
                  {outputLabel}
                </p>
                {typeof calcResult === 'object' && calcResult !== null ? (
                  <div className="grid grid-cols-1 gap-3">
                    {Object.entries(calcResult).map(([key, val], i) => (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + i * 0.1 }}
                        className="flex items-center justify-between bg-white rounded-lg px-4 py-3 border border-[#E5E5E0]"
                      >
                        <span className="font-body text-sm text-dark/70 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <span className="font-mono text-xl font-bold text-dark tabular-nums">
                          <span style={{ color: accent }}>&#8377;</span>
                          {typeof val === 'number'
                            ? formatNumber(val)
                            : String(val)}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                  >
                    <span className="font-mono text-4xl font-bold text-dark tabular-nums">
                      <span style={{ color: accent }}>&#8377;</span>
                      {typeof calcResult === 'number'
                        ? formatNumber(displayValue)
                        : String(calcResult)}
                    </span>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        {calcError && (
          <div className="px-6 py-3 bg-[#EF4444]/5 border-t border-[#EF4444]/20">
            <p className="text-sm font-body text-[#EF4444]">{calcError}</p>
          </div>
        )}
      </motion.div>

      {/* Transition to follow-up question */}
      {calculated && !showFollowUp && followUp && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <p className="text-sm font-body text-muted mb-3">
            Done exploring? Test your understanding!
          </p>
          <motion.button
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleShowFollowUp}
            className="px-8 py-3 rounded-xl text-white font-display font-semibold transition-colors"
            style={{
              backgroundColor: accent,
              boxShadow: `0 4px 16px ${accent}25`,
            }}
          >
            <span className="flex items-center gap-2">
              Answer Question
              <ChevronRight className="w-5 h-5" />
            </span>
          </motion.button>
        </motion.div>
      )}

      {/* Part 2: Follow-up MCQ */}
      <AnimatePresence>
        {showFollowUp && followUp && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            <div className="border-t border-[#E5E5E0] pt-6">
              <h4 className="font-display text-lg text-dark leading-snug mb-4">
                {followUp.prompt}
              </h4>
              <div className="space-y-3">
                {followUp.options.map((opt, i) => (
                  <OptionCard
                    key={i}
                    text={opt.text}
                    isSelected={followUpSelected === i}
                    isCorrect={followUpSubmitted ? (followUpSelected === i && opt.isCorrect) : false}
                    isSubmitted={followUpSubmitted}
                    isMulti={false}
                    onSelect={() => handleFollowUpSelect(i)}
                    disabled={followUpSubmitted}
                    chapterColor={chapterColor}
                    isCorrectAnswer={opt.isCorrect}
                  />
                ))}
              </div>
            </div>

            {/* Follow-up explanation */}
            {followUpSubmitted && followUpCorrect !== null && (
              <ExplanationBox
                explanation={followUp.explanation}
                isCorrect={followUpCorrect}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* If there is no follow-up question, auto-complete after calculation */}
      {calculated && !followUp && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <ExplanationBox
            explanation={exercise.explanation}
            isCorrect={true}
          />
        </motion.div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   ResultsScreen — Redesigned with contextual messaging
   ══════════════════════════════════════════════════════════════════════ */

function ResultsScreen({
  answers,
  exercises,
  totalXP,
  onContinue,
  chapterColor,
}: {
  answers: AnswerState[];
  exercises: Exercise[];
  totalXP: number;
  onContinue: () => void;
  chapterColor?: string;
}) {
  const accent = chapterColor || '#F5A623';
  const correctCount = answers.filter((a) => a.isCorrect).length;
  const total = exercises.length;
  const pct = total > 0 ? correctCount / total : 0;
  const hasFired = useRef(false);
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);

  useEffect(() => {
    if (!hasFired.current && pct === 1) {
      hasFired.current = true;
      const timer = setTimeout(fireConfetti, 400);
      return () => clearTimeout(timer);
    }
  }, [pct]);

  // Contextual messaging based on score
  const headline =
    pct === 1
      ? 'Perfect!'
      : pct > 0.7
      ? 'Nice work!'
      : "You'll get there";

  const subtitle =
    pct === 1
      ? "You nailed every single question. That's seriously impressive."
      : pct > 0.7
      ? `You got ${correctCount} out of ${total} right. Strong understanding!`
      : `${correctCount} out of ${total} correct. Let's review what tripped you up.`;

  const iconBg =
    pct === 1
      ? `linear-gradient(135deg, ${accent}20, ${accent}40)`
      : pct > 0.7
      ? 'rgba(16, 185, 129, 0.12)'
      : 'rgba(245, 166, 35, 0.12)';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center text-center py-10"
    >
      {/* Celebratory icon */}
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.2 }}
        className="relative mb-8"
      >
        <div
          className="w-28 h-28 rounded-full flex items-center justify-center"
          style={{ background: iconBg }}
        >
          <Sparkles
            className="w-14 h-14"
            style={{
              color: pct === 1
                ? accent
                : pct > 0.7
                ? '#10B981'
                : '#F5A623',
            }}
          />
        </div>
        {/* Glow ring */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: [0, 0.4, 0], scale: [0.8, 1.3, 1.5] }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="absolute inset-0 rounded-full"
          style={{
            background: pct === 1
              ? `${accent}30`
              : pct > 0.7
              ? 'rgba(16, 185, 129, 0.2)'
              : 'rgba(245, 166, 35, 0.2)',
          }}
        />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="font-display text-4xl text-dark mb-2"
      >
        {headline}
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.5 }}
        className="text-muted font-body text-lg mb-10 max-w-sm"
      >
        {subtitle}
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mb-10"
      >
        <AnimatedXPCounter target={totalXP} />
      </motion.div>

      {/* Per-question breakdown — tappable to expand */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        className="w-full max-w-md space-y-2 mb-10"
      >
        {exercises.map((ex, i) => {
          const isCorrectAnswer = !!answers[i]?.isCorrect;
          const isExpanded = expandedQuestion === i;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0 + i * 0.08 }}
            >
              <button
                onClick={() => setExpandedQuestion(isExpanded ? null : i)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all duration-200 hover:shadow-sm ${
                  isCorrectAnswer
                    ? 'bg-[#10B981]/5 border-[#10B981]/15 hover:border-[#10B981]/30'
                    : 'bg-[#EF4444]/5 border-[#EF4444]/15 hover:border-[#EF4444]/30'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                    isCorrectAnswer ? 'bg-[#10B981]' : 'bg-[#EF4444]'
                  }`}
                >
                  {isCorrectAnswer ? (
                    <Check className="w-3.5 h-3.5 text-white" />
                  ) : (
                    <X className="w-3.5 h-3.5 text-white" />
                  )}
                </div>
                <span className="text-sm font-body text-dark/80 flex-1 truncate">
                  {ex.prompt}
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
                      className={`mx-4 mt-1 mb-2 px-4 py-3 rounded-lg border-l-3 text-sm font-body text-dark/70 leading-relaxed ${
                        isCorrectAnswer
                          ? 'border-[#10B981] bg-[#10B981]/5'
                          : 'border-[#D97706] bg-[#D97706]/5'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <Lightbulb className={`w-4 h-4 mt-0.5 shrink-0 ${
                          isCorrectAnswer ? 'text-[#10B981]' : 'text-[#D97706]'
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

      <motion.button
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 + exercises.length * 0.08 }}
        whileHover={{ scale: 1.03, y: -1 }}
        whileTap={{ scale: 0.97 }}
        onClick={onContinue}
        className="px-12 py-4 rounded-xl text-white font-display font-semibold text-lg transition-all duration-200"
        style={{
          backgroundColor: accent,
          boxShadow: `0 8px 32px ${accent}30`,
        }}
      >
        Continue
      </motion.button>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Main ExerciseRenderer
   ══════════════════════════════════════════════════════════════════════ */

export default function ExerciseRenderer({
  exercises,
  onComplete,
  chapterColor,
}: ExerciseRendererProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerState[]>(() =>
    exercises.map(() => ({ selected: [], isCorrect: null, submitted: false }))
  );
  const [isComplete, setIsComplete] = useState(false);
  const [direction, setDirection] = useState(1);
  const hasCompleted = useRef(false);

  const current = exercises[currentIndex];

  /* -- MCQ / True-False / Scenario -- option selection */

  const handleSelect = useCallback(
    (optionIndex: number) => {
      if (answers[currentIndex].submitted) return;

      setAnswers((prev) => {
        const updated = [...prev];
        const answer = { ...updated[currentIndex] };

        if (
          current.type === 'mcq-single' ||
          current.type === 'true-false' ||
          current.type === 'scenario'
        ) {
          answer.selected = [optionIndex];
          const opts = current.options ?? [];
          const isCorrect = opts[optionIndex]?.isCorrect ?? false;
          answer.isCorrect = isCorrect;
          answer.submitted = true;
        } else {
          // mcq-multi toggle
          const existing = answer.selected.includes(optionIndex)
            ? answer.selected.filter((i) => i !== optionIndex)
            : [...answer.selected, optionIndex];
          answer.selected = existing;
        }

        updated[currentIndex] = answer;
        return updated;
      });
    },
    [currentIndex, current, answers]
  );

  /* -- MCQ-Multi submit */

  const handleMultiSubmit = useCallback(() => {
    setAnswers((prev) => {
      const updated = [...prev];
      const answer = { ...updated[currentIndex] };
      const opts = current.options ?? [];
      const correctIndices = opts
        .map((o, i) => (o.isCorrect ? i : -1))
        .filter((i) => i !== -1);
      const selectedSet = new Set(answer.selected);
      const correctSet = new Set(correctIndices);

      answer.isCorrect =
        selectedSet.size === correctSet.size &&
        [...selectedSet].every((s) => correctSet.has(s));
      answer.submitted = true;
      updated[currentIndex] = answer;
      return updated;
    });
  }, [currentIndex, current]);

  /* -- Sorting submit */

  const handleSortSubmit = useCallback(
    (isCorrect: boolean, _pct: number) => {
      setAnswers((prev) => {
        const updated = [...prev];
        updated[currentIndex] = {
          selected: [],
          isCorrect,
          submitted: true,
        };
        return updated;
      });
    },
    [currentIndex]
  );

  /* -- Calculator submit (from follow-up MCQ) */

  const handleCalcSubmit = useCallback(
    (isCorrect: boolean) => {
      setAnswers((prev) => {
        const updated = [...prev];
        updated[currentIndex] = {
          selected: [],
          isCorrect,
          submitted: true,
        };
        return updated;
      });
    },
    [currentIndex]
  );

  /* -- Calculator with no follow-up: mark as completed (exploration) */

  const handleCalcNoFollowUp = useCallback(() => {
    setAnswers((prev) => {
      const updated = [...prev];
      if (!updated[currentIndex].submitted) {
        updated[currentIndex] = {
          selected: [],
          isCorrect: true, // Exploration counts as correct
          submitted: true,
        };
      }
      return updated;
    });
  }, [currentIndex]);

  /* -- Navigation */

  const handleNext = useCallback(() => {
    if (currentIndex < exercises.length - 1) {
      setDirection(1);
      setCurrentIndex((prev) => prev + 1);
    } else {
      if (hasCompleted.current) return;
      hasCompleted.current = true;
      const totalXP = answers.reduce((sum, a, i) => {
        return sum + (a.isCorrect ? exercises[i].xpValue : 0);
      }, 0);
      const maxXP = exercises.reduce((sum, e) => sum + e.xpValue, 0);
      const answerSelections = answers.map((a, i) => ({
        questionIndex: i,
        selectedOptions: a.selected,
      }));
      setIsComplete(true);
      onComplete(totalXP, maxXP, answerSelections);
    }
  }, [currentIndex, exercises, answers, onComplete]);

  const handleContinue = useCallback(() => {
    if (hasCompleted.current) return;
    hasCompleted.current = true;
    const totalXP = answers.reduce((sum, a, i) => {
      return sum + (a.isCorrect ? exercises[i].xpValue : 0);
    }, 0);
    const maxXP = exercises.reduce((sum, e) => sum + e.xpValue, 0);
    const answerSelections = answers.map((a, i) => ({
      questionIndex: i,
      selectedOptions: a.selected,
    }));
    onComplete(totalXP, maxXP, answerSelections);
  }, [answers, exercises, onComplete]);

  /* -- Results screen */

  if (isComplete) {
    const totalXP = answers.reduce((sum, a, i) => {
      return sum + (a.isCorrect ? exercises[i].xpValue : 0);
    }, 0);
    return (
      <ResultsScreen
        answers={answers}
        exercises={exercises}
        totalXP={totalXP}
        onContinue={handleContinue}
        chapterColor={chapterColor}
      />
    );
  }

  /* -- Slide animation */

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 200 : -200,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -200 : 200,
      opacity: 0,
    }),
  };

  const isMultiSelect = current.type === 'mcq-multi';
  const currentAnswer = answers[currentIndex];
  const opts = current.options ?? [];
  const accent = chapterColor || '#F5A623';

  return (
    <div className="w-full max-w-2xl mx-auto">
      <SegmentedProgressBar
        total={exercises.length}
        current={currentIndex}
        answers={answers}
        chapterColor={chapterColor}
      />

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          {/* Question header */}
          <div className="mb-5">
            <span className="text-xs font-mono text-muted mb-1.5 block">
              Question {currentIndex + 1} of {exercises.length}
            </span>

            {/* Scenario callout */}
            {current.type === 'scenario' && current.scenario && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="border-l-4 bg-[#D97706]/5 px-4 py-3 rounded-lg mb-3"
                style={{ borderLeftColor: '#92400E' }}
              >
                <div className="flex items-start gap-2.5">
                  <BookOpen className="w-4 h-4 text-[#92400E] mt-0.5 shrink-0" />
                  <p className="font-body text-dark/90 leading-relaxed text-sm">
                    {current.scenario}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Prompt */}
            <h3 className="font-display text-lg text-dark leading-snug">
              {current.prompt}
            </h3>

            {/* Multi-select hint */}
            {isMultiSelect && !currentAnswer.submitted && (
              <p className="text-xs font-body text-muted mt-1.5">
                Select all that apply
              </p>
            )}
          </div>

          {/* MCQ-Single / MCQ-Multi / Scenario / True-False options — unified card style */}
          {(current.type === 'mcq-single' ||
            current.type === 'mcq-multi' ||
            current.type === 'scenario' ||
            current.type === 'true-false') && (
            <div className="space-y-2.5">
              {opts.map((option, i) => (
                <OptionCard
                  key={i}
                  text={option.text}
                  isSelected={currentAnswer.selected.includes(i)}
                  isCorrect={currentAnswer.submitted ? (currentAnswer.selected.includes(i) && option.isCorrect) : false}
                  isSubmitted={currentAnswer.submitted}
                  isMulti={isMultiSelect}
                  onSelect={() => handleSelect(i)}
                  disabled={currentAnswer.submitted}
                  chapterColor={chapterColor}
                  isCorrectAnswer={option.isCorrect}
                />
              ))}

              {isMultiSelect && !currentAnswer.submitted && (
                <motion.button
                  whileHover={currentAnswer.selected.length > 0 ? { scale: 1.02, y: -1 } : undefined}
                  whileTap={currentAnswer.selected.length > 0 ? { scale: 0.98 } : undefined}
                  onClick={handleMultiSubmit}
                  disabled={currentAnswer.selected.length === 0}
                  className="mt-3 w-full py-3 rounded-xl text-white font-display font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: currentAnswer.selected.length > 0 ? accent : '#9CA3AF',
                    boxShadow: currentAnswer.selected.length > 0 ? `0 4px 16px ${accent}30` : undefined,
                  }}
                >
                  Check Answer
                </motion.button>
              )}
            </div>
          )}

          {/* Sorting */}
          {current.type === 'sorting' && (
            <SortingExercise
              exercise={current}
              onSubmit={handleSortSubmit}
              chapterColor={chapterColor}
            />
          )}

          {/* Calculator */}
          {current.type === 'calculator' && (
            <CalculatorExercise
              exercise={current}
              onSubmit={
                current.followUpQuestion ? handleCalcSubmit : () => handleCalcNoFollowUp()
              }
              chapterColor={chapterColor}
            />
          )}

          {/* Explanation (for non-calculator types) */}
          {currentAnswer.submitted &&
            current.type !== 'calculator' && (
              <ExplanationBox
                explanation={current.explanation}
                isCorrect={!!currentAnswer.isCorrect}
              />
            )}

          {/* Next button */}
          {currentAnswer.submitted && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-4 flex justify-end"
            >
              <motion.button
                whileHover={{ scale: 1.03, x: 2 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-display font-semibold text-sm transition-all duration-200"
                style={{
                  backgroundColor: accent,
                  boxShadow: `0 4px 16px ${accent}25`,
                }}
              >
                {currentIndex < exercises.length - 1 ? 'Next' : 'See Results'}
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
