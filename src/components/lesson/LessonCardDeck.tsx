'use client';

import {
  useState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type TouchEvent,
} from 'react';
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
  /** Optional: emit current progress so a parent can render its own progress UI. */
  onProgress?: (currentIndex: number, totalCards: number) => void;
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
  ease: [0.25, 1, 0.5, 1] as [number, number, number, number],
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function hexToRgba(hex: string, alpha: number): string {
  const cleaned = hex.replace('#', '');
  const r = parseInt(cleaned.substring(0, 2), 16);
  const g = parseInt(cleaned.substring(2, 4), 16);
  const b = parseInt(cleaned.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Swipe thresholds — only commit if move is clearly horizontal AND past min distance
const SWIPE_MIN_DX = 60;
const SWIPE_DOMINANCE = 1.5; // |dx| must exceed |dy| * this

// ── Main Component ────────────────────────────────────────────────────────────

export default function LessonCardDeck({
  blocks,
  chapterColor,
  exerciseCount,
  onContentComplete,
  onProgress,
}: LessonCardDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');

  // Convert content blocks to card deck
  const cards = useMemo(() => convertBlocksToCards(blocks), [blocks]);

  // Collect all key terms for inline highlighting
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

  // Emit progress to parent (used by mobile chrome's top bar)
  useEffect(() => {
    onProgress?.(currentIndex, totalCards);
  }, [currentIndex, totalCards, onProgress]);

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

  // Keyboard navigation (desktop)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
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

  // Touch swipe gesture: only commit if horizontal-dominant + past threshold.
  // This way vertical scroll inside a tall card still works naturally.
  const touchStartRef = useRef<{ x: number; y: number; t: number } | null>(null);

  const handleTouchStart = useCallback((e: TouchEvent<HTMLDivElement>) => {
    const t = e.touches[0];
    touchStartRef.current = { x: t.clientX, y: t.clientY, t: Date.now() };
  }, []);

  const handleTouchEnd = useCallback(
    (e: TouchEvent<HTMLDivElement>) => {
      const start = touchStartRef.current;
      if (!start) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - start.x;
      const dy = t.clientY - start.y;
      const elapsed = Date.now() - start.t;
      touchStartRef.current = null;

      // Ignore long taps (> 500ms) — likely scroll or hold, not a swipe
      if (elapsed > 500) return;
      if (Math.abs(dx) < SWIPE_MIN_DX) return;
      if (Math.abs(dx) < Math.abs(dy) * SWIPE_DOMINANCE) return;

      // Don't trigger from inside form controls or quick check buttons
      const target = e.target as HTMLElement;
      const interactive = target.closest(
        'button, a, input, [role="button"], [role="slider"]'
      );
      if (interactive) return;

      if (dx < 0) goForward();
      else goBackward();
    },
    [goForward, goBackward]
  );

  // ── Quick check auto-advance ────────────────────────────────────────────────

  const handleQuickCheckAutoAdvance = useCallback(() => {
    goForward();
  }, [goForward]);

  // ── Progress percentage (for inline desktop bar) ────────────────────────────

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

  const ctaLabel = isLastCard
    ? exerciseCount > 0
      ? 'Start Exercises'
      : 'Complete'
    : 'Continue';

  return (
    <div className="flex flex-col items-center w-full">
      {/* ── Inline progress (DESKTOP ONLY) ─────────────────────────────────── */}
      <div className="hidden lg:block w-full max-w-[680px] mb-3 shrink-0">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-mono text-muted tabular-nums">
            {currentIndex + 1} / {totalCards}
            {exerciseCount > 0 && (
              <span className="text-muted/50">
                {' '}+ {exerciseCount} exercises
              </span>
            )}
          </span>
          <NumberSystemTooltip />
        </div>

        <div className="w-full h-1.5 rounded-full bg-border overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: chapterColor }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
          />
        </div>
      </div>

      {/* ── Card area ──────────────────────────────────────────────────────── */}
      <div
        className="w-full max-w-[680px] relative overflow-hidden h-[calc(100dvh-180px)] lg:h-[calc(100dvh-240px)] min-h-0"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
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

      {/* ── Navigation (mobile = sticky bottom, desktop = inline) ──────────── */}
      <div
        className="
          w-full max-w-[680px]
          lg:mt-4 lg:px-0 lg:py-0 lg:bg-transparent lg:border-0 lg:static lg:shadow-none
          fixed bottom-0 left-0 right-0 z-30 px-4 py-3 bg-bg/95 backdrop-blur border-t border-border safe-bottom
          flex items-center justify-between gap-3 shrink-0
        "
      >
        <button
          onClick={goBackward}
          disabled={currentIndex === 0}
          aria-label="Previous card"
          className="
            inline-flex items-center justify-center
            w-12 h-12 lg:w-auto lg:h-auto lg:px-4 lg:py-2.5
            rounded-xl text-sm font-body font-medium text-muted
            transition-all hover:text-dark hover:bg-fill-subtle
            disabled:opacity-30 disabled:cursor-not-allowed
            disabled:hover:bg-transparent disabled:hover:text-muted
          "
        >
          <ChevronLeft className="w-5 h-5 lg:w-4 lg:h-4" />
          <span className="hidden lg:inline ml-1.5">Back</span>
        </button>

        {currentCard.type !== 'quick-check' ? (
          <motion.button
            onClick={goForward}
            aria-label={ctaLabel}
            className="
              flex-1 lg:flex-none
              inline-flex items-center justify-center gap-2
              min-h-[48px] lg:min-h-0 px-6 py-3 lg:px-7
              rounded-xl text-base font-body font-semibold text-white shadow-lg transition-all
            "
            style={{
              backgroundColor: chapterColor,
              boxShadow: `0 4px 14px ${hexToRgba(chapterColor, 0.3)}`,
            }}
            whileTap={{ scale: 0.97 }}
          >
            {ctaLabel}
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        ) : (
          <button
            onClick={goForward}
            aria-label="Skip"
            className="
              inline-flex items-center justify-center gap-1.5
              min-h-[48px] lg:min-h-0 px-5 py-2.5
              rounded-xl text-sm font-body font-medium text-muted/70
              transition-all hover:text-muted hover:bg-fill-subtle
            "
          >
            Skip
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
