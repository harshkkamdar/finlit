'use client';

import { useState, useRef, useCallback, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TooltipPortal from '@/components/ui/TooltipPortal';

// ── Inline Markdown Parser ────────────────────────────────────────────────────

function parseInlineMarkdown(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    if (match[2]) {
      parts.push(
        <strong key={`b-${match.index}`} className="font-semibold text-dark">
          {match[2]}
        </strong>
      );
    } else if (match[3]) {
      parts.push(
        <em key={`i-${match.index}`} className="italic">
          {match[3]}
        </em>
      );
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}

// ── Key Term Inline Highlight ─────────────────────────────────────────────────

interface InlineKeyTermProps {
  term: string;
  definition: string;
  chapterColor: string;
}

function InlineKeyTerm({ term, definition, chapterColor }: InlineKeyTermProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPos, setTooltipPos] = useState<{ top: number; left: number; placement: 'above' | 'below' }>({
    top: 0,
    left: 0,
    placement: 'above',
  });
  const lastTouchRef = useRef(0);
  const spanRef = useRef<HTMLSpanElement>(null);

  const computePosition = useCallback((el: HTMLElement) => {
    const rect = el.getBoundingClientRect();
    const placement = rect.top < 200 ? 'below' : 'above';
    // Clamp horizontal center so the tooltip never spills off either edge.
    // Tooltip width is min(320, vw - 48); half = min(160, (vw - 48) / 2).
    const vw = window.innerWidth;
    const halfTooltip = Math.min(160, (vw - 48) / 2);
    const minLeft = halfTooltip + 16;
    const maxLeft = vw - halfTooltip - 16;
    const rawLeft = rect.left + rect.width / 2;
    const clampedLeft = Math.max(minLeft, Math.min(maxLeft, rawLeft));
    setTooltipPos({
      top: placement === 'above' ? rect.top - 10 : rect.bottom + 10,
      left: clampedLeft,
      placement,
    });
  }, []);

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    lastTouchRef.current = Date.now();
    if (!showTooltip) computePosition(e.currentTarget as HTMLElement);
    setShowTooltip((prev) => !prev);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (Date.now() - lastTouchRef.current < 500) return;
    e.preventDefault();
    if (!showTooltip) computePosition(e.currentTarget as HTMLElement);
    setShowTooltip((prev) => !prev);
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    computePosition(e.currentTarget as HTMLElement);
    setShowTooltip(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!showTooltip) computePosition(e.currentTarget as HTMLElement);
      setShowTooltip((prev) => !prev);
    }
  };

  return (
    <span className="inline-block">
      <span
        ref={spanRef}
        className="key-term-highlight font-semibold cursor-help"
        style={{
          ['--highlight-color' as string]: hexToRgba(chapterColor, 0.15),
          ['--highlight-border' as string]: chapterColor,
          ['--highlight-color-hover' as string]: hexToRgba(chapterColor, 0.25),
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={handleClick}
        onTouchEnd={handleTouchEnd}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label={`${term}: ${definition}`}
      >
        {term}
      </span>
      <AnimatePresence>
        {showTooltip && (
          <TooltipPortal>
            <motion.div
              initial={{ opacity: 0, y: tooltipPos.placement === 'above' ? -6 : 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: tooltipPos.placement === 'above' ? -6 : 6 }}
              transition={{ duration: 0.2, ease: [0.25, 1, 0.5, 1] }}
              className="fixed z-[9999] bg-dark text-white text-sm px-4 py-3.5 rounded-xl shadow-2xl font-body leading-relaxed pointer-events-none"
              style={{
                boxShadow: '0 8px 32px rgba(26,26,46,0.4)',
                width: 'min(320px, calc(100vw - 48px))',
                top: tooltipPos.placement === 'above' ? undefined : tooltipPos.top,
                bottom: tooltipPos.placement === 'above' ? `calc(100vh - ${tooltipPos.top}px)` : undefined,
                left: tooltipPos.left,
                transform: 'translateX(-50%)',
              }}
            >
              <p className="font-display font-semibold mb-1" style={{ color: chapterColor }}>
                {term}
              </p>
              <p className="text-white/85 leading-relaxed">{definition}</p>
              <div
                className={`absolute w-3 h-3 bg-dark rotate-45 rounded-[1px] left-1/2 -translate-x-1/2 ${
                  tooltipPos.placement === 'above' ? '-bottom-1.5' : '-top-1.5'
                }`}
              />
            </motion.div>
          </TooltipPortal>
        )}
      </AnimatePresence>
    </span>
  );
}

// ── Hex to RGBA helper ────────────────────────────────────────────────────────

function hexToRgba(hex: string, alpha: number): string {
  const cleaned = hex.replace('#', '');
  const r = parseInt(cleaned.substring(0, 2), 16);
  const g = parseInt(cleaned.substring(2, 4), 16);
  const b = parseInt(cleaned.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// ── Text Card Component ───────────────────────────────────────────────────────

interface TextCardProps {
  text: string;
  chapterColor: string;
  /** Optional key terms from the lesson for inline highlighting */
  keyTerms?: Array<{ term: string; definition: string }>;
  /** Optional inline illustration merged from an adjacent image block */
  illustration?: {
    src?: string;
    alt: string;
    caption?: string;
  };
}

export default function TextCard({ text, chapterColor, keyTerms = [], illustration }: TextCardProps) {
  // Parse paragraphs (handle \n\n breaks within a card)
  const paragraphs = text.split(/\n\n+/).filter(Boolean);

  // Resolve illustration source from the image registry
  const illustrationSrc = illustration ? resolveIllustrationSrc(illustration.alt, illustration.src) : null;

  return (
    <div className="lesson-card overflow-hidden relative">
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ backgroundColor: chapterColor }}
      />

      {/* Inline illustration */}
      {illustration && illustrationSrc && (
        <div className="-mx-5 -mt-5 lg:-mx-8 lg:-mt-6 mb-4 lg:mb-5 flex items-center justify-center bg-fill-subtle px-3 py-4 lg:px-4 lg:py-5">
          <img
            src={illustrationSrc}
            alt={illustration.alt}
            className="max-h-[220px] lg:max-h-[280px] w-auto object-contain drop-shadow-sm"
          />
        </div>
      )}

      <div className="flex flex-col justify-center flex-1">
        {paragraphs.map((paragraph, idx) => (
          <p
            key={idx}
            className="text-base lg:text-lg leading-[1.7] lg:leading-[1.8] text-dark/90 font-body mb-3 lg:mb-4 last:mb-0"
          >
            {renderWithKeyTerms(paragraph, keyTerms, chapterColor)}
          </p>
        ))}
      </div>

      {/* No caption — illustrations speak for themselves */}
    </div>
  );
}

/**
 * Resolve an illustration src to an actual image path.
 * If src starts with '/', use it directly (path-based resolution).
 * Otherwise returns null (no match).
 */
function resolveIllustrationSrc(_alt: string, src?: string): string | null {
  if (src && src.startsWith('/')) return src;
  return null;
}

/**
 * Renders text with inline key term highlights. If a known key term appears
 * in the text, it gets wrapped in an InlineKeyTerm component with a tooltip.
 */
function renderWithKeyTerms(
  text: string,
  keyTerms: Array<{ term: string; definition: string }>,
  chapterColor: string
): ReactNode[] {
  if (keyTerms.length === 0) {
    return parseInlineMarkdown(text);
  }

  // Build a regex that matches any known term (case-insensitive, word boundary)
  const sortedTerms = [...keyTerms].sort((a, b) => b.term.length - a.term.length);
  const escapedTerms = sortedTerms.map((kt) =>
    kt.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  );
  const termRegex = new RegExp(`\\b(${escapedTerms.join('|')})\\b`, 'gi');

  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = termRegex.exec(text)) !== null) {
    // Text before the match
    if (match.index > lastIndex) {
      const before = text.slice(lastIndex, match.index);
      parts.push(...parseInlineMarkdown(before));
    }

    // Find the matching key term (case-insensitive)
    const matchedText = match[1];
    const ktEntry = keyTerms.find(
      (kt) => kt.term.toLowerCase() === matchedText.toLowerCase()
    );

    if (ktEntry) {
      parts.push(
        <InlineKeyTerm
          key={`kt-${match.index}`}
          term={matchedText}
          definition={ktEntry.definition}
          chapterColor={chapterColor}
        />
      );
    } else {
      parts.push(matchedText);
    }

    lastIndex = match.index + match[0].length;
  }

  // Remaining text
  if (lastIndex < text.length) {
    parts.push(...parseInlineMarkdown(text.slice(lastIndex)));
  }

  return parts.length > 0 ? parts : parseInlineMarkdown(text);
}
