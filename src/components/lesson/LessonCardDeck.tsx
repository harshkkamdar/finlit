'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { convertBlocksToCards } from '@/lib/content-to-cards';
import type { LessonCard } from '@/lib/content-to-cards';
import type { ContentBlock } from '@/types';
import NumberSystemTooltip from '@/components/ui/NumberSystemTooltip';
import TextCard from '@/components/lesson/cards/TextCard';
import KeyTermCard from '@/components/lesson/cards/KeyTermCard';
import CalloutCard from '@/components/lesson/cards/CalloutCard';
import VisualCard from '@/components/lesson/cards/VisualCard';
import InteractiveCard from '@/components/lesson/cards/InteractiveCard';
import DialogueCard from '@/components/lesson/cards/DialogueCard';
import QuickCheckCard from '@/components/lesson/cards/QuickCheckCard';

// ── Types ─────────────────────────────────────────────────────────────────────

interface LessonCardDeckProps {
  blocks: ContentBlock[];
  chapterColor: string;
  exerciseCount: number;
  onContentComplete: () => void;
}

// ── Card Slide Animation Variants ─────────────────────────────────────────────

const slideVariants = {
  enter: (dir: 'forward' | 'backward') => ({
    x: dir === 'forward' ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (dir: 'forward' | 'backward') => ({
    x: dir === 'forward' ? -300 : 300,
    opacity: 0,
  }),
};

const slideTransition = {
  duration: 0.25,
  ease: [0.25, 1, 0.5, 1] as [number, number, number, number], // ease-out-quart
};

// ── Helper: Hex to RGBA ───────────────────────────────────────────────────────

function hexToRgba(hex: string, alpha: number): string {
  const cleaned = hex.replace('#', '');
  const r = parseInt(cleaned.substring(0, 2), 16);
  const g = parseInt(cleaned.substring(2, 4), 16);
  const b = parseInt(cleaned.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function LessonCardDeck({
  blocks,
  chapterColor,
  exerciseCount,
  onContentComplete,
}: LessonCardDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');

  // Convert content blocks to card deck
  const cards = useMemo(() => convertBlocksToCards(blocks), [blocks]);

  // Collect all key terms from blocks for inline highlighting in text cards
  const allKeyTerms = useMemo(() => {
    const terms: Array<{ term: string; definition: string }> = [];
    for (const block of blocks) {
      if (block.type === 'key-term') {
        const data = block.data as Record<string, unknown>;
        const term = data.term as string | undefined;
        const definition = data.definition as string | undefined;
        if (term && definition) {
          terms.push({ term, definition });
        }
      }
    }
    return terms;
  }, [blocks]);

  const totalCards = cards.length;
  const totalWithExercises = totalCards + exerciseCount;
  const isLastCard = currentIndex >= totalCards - 1;
  const currentCard = cards[currentIndex] as LessonCard | undefined;

  // ── Navigation ──────────────────────────────────────────────────────────────

  const goForward = useCallback(() => {
    if (isLastCard) {
      onContentComplete();
      return;
    }
    setDirection('forward');
    setCurrentIndex((prev) => Math.min(prev + 1, totalCards - 1));
  }, [isLastCard, onContentComplete, totalCards]);

  const goBackward = useCallback(() => {
    setDirection('backward');
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Don't capture keyboard events when user is interacting with form elements
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable
      ) {
        return;
      }

      if (e.key === 'ArrowRight' || e.key === 'Enter') {
        e.preventDefault();
        goForward();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goBackward();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goForward, goBackward]);

  // ── Quick Check auto-advance handler ────────────────────────────────────────

  const handleQuickCheckAutoAdvance = useCallback(() => {
    goForward();
  }, [goForward]);

  // ── Progress ────────────────────────────────────────────────────────────────

  const progressPercent =
    totalWithExercises > 0
      ? ((currentIndex + 1) / totalWithExercises) * 100
      : 0;

  // ── Render current card ─────────────────────────────────────────────────────

  function renderCard(card: LessonCard) {
    switch (card.type) {
      case 'text':
        return (
          <TextCard
            text={card.text}
            chapterColor={chapterColor}
            keyTerms={allKeyTerms}
            illustration={card.illustration}
          />
        );
      case 'key-term':
        return (
          <KeyTermCard
            term={card.term}
            definition={card.definition}
            chapterColor={chapterColor}
          />
        );
      case 'callout':
        return (
          <CalloutCard
            variant={card.variant}
            text={card.text}
            title={card.title}
            chapterColor={chapterColor}
          />
        );
      case 'visual':
        return (
          <VisualCard
            src={card.src}
            alt={card.alt}
            caption={card.caption}
            description={card.description}
            chapterColor={chapterColor}
          />
        );
      case 'interactive':
        return (
          <InteractiveCard
            data={card.data}
            chapterColor={chapterColor}
          />
        );
      case 'dialogue':
        return (
          <DialogueCard
            character={card.character as 'chip' | 'priya' | 'arjun'}
            expression={card.expression}
            text={card.text}
            chapterColor={chapterColor}
          />
        );
      case 'quick-check':
        return (
          <QuickCheckCard
            question={card.question}
            options={card.options}
            chapterColor={chapterColor}
            onAutoAdvance={handleQuickCheckAutoAdvance}
          />
        );
      default:
        return null;
    }
  }

  if (!currentCard) {
    return null;
  }

  return (
    <div className="flex flex-col items-center h-[calc(100vh-240px)]">
      {/* ── Progress Bar ─────────────────────────────────────────────────────── */}
      <div className="w-full max-w-[680px] mb-3 shrink-0">
        <div className="flex items-center justify-between mb-1.5">
          {/* Card counter */}
          <span className="text-xs font-mono text-muted tabular-nums">
            {currentIndex + 1} / {totalCards}
            {exerciseCount > 0 && (
              <span className="text-muted/50">
                {' '}+ {exerciseCount} exercises
              </span>
            )}
          </span>

          {/* Indian number system reference */}
          <NumberSystemTooltip />
        </div>

        {/* Progress track */}
        <div className="w-full h-1.5 rounded-full bg-border overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: chapterColor }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
          />
        </div>
      </div>

      {/* ── Card Display Area — fills remaining space ────────────────────────── */}
      <div className="w-full max-w-[680px] relative overflow-hidden flex-1 min-h-0">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentCard.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={slideTransition}
            className="w-full h-full"
          >
            {renderCard(currentCard)}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Navigation Controls ──────────────────────────────────────────────── */}
      <div className="w-full max-w-[680px] mt-4 flex items-center justify-between shrink-0">
        {/* Back button */}
        <button
          onClick={goBackward}
          disabled={currentIndex === 0}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-body font-medium text-muted transition-all hover:text-dark hover:bg-fill-subtle disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-muted"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        {/* Continue button */}
        {currentCard.type !== 'quick-check' && (
          <motion.button
            onClick={goForward}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-xl text-base font-body font-semibold text-white shadow-lg transition-all hover:-translate-y-[1px]"
            style={{
              backgroundColor: chapterColor,
              boxShadow: `0 4px 14px ${hexToRgba(chapterColor, 0.3)}`,
            }}
            whileHover={{
              boxShadow: `0 6px 20px ${hexToRgba(chapterColor, 0.4)}`,
            }}
            whileTap={{ scale: 0.97 }}
          >
            {isLastCard
              ? exerciseCount > 0
                ? 'Start Exercises'
                : 'Complete'
              : 'Continue'}
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        )}

        {/* For quick check cards, show a subtle skip option */}
        {currentCard.type === 'quick-check' && (
          <button
            onClick={goForward}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-body font-medium text-muted/60 transition-all hover:text-muted hover:bg-fill-subtle"
          >
            Skip
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
