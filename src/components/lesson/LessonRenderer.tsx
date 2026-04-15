'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  Lightbulb,
  AlertTriangle,
  Sparkles,
  ImageIcon,
  Play,
  SlidersHorizontal,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import { useState, useMemo, useCallback, type ReactNode } from 'react';
import type { ContentBlock } from '@/types';
import { isFormulaSafe } from '@/lib/formula-sanitizer';

// ── Props ────────────────────────────────────────────────────────────────────

interface LessonRendererProps {
  blocks: ContentBlock[];
  chapterColor?: string;
}

interface BlockProps {
  data: Record<string, unknown>;
  chapterColor: string;
  isFirstText?: boolean;
}

// ── Constants ────────────────────────────────────────────────────────────────

const DEFAULT_CHAPTER_COLOR = '#1B6B4A';

const blockVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: 'easeOut' as const,
    },
  }),
};

// ── Markdown parser (bold + italic) ──────────────────────────────────────────

function parseInlineMarkdown(text: string): ReactNode[] {
  // Matches **bold**, *italic*, and plain text segments
  const parts: ReactNode[] = [];
  // Use a regex that matches **bold** or *italic*
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    // Push text before match
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    if (match[2]) {
      // **bold**
      parts.push(
        <strong key={match.index} className="font-semibold text-dark">
          {match[2]}
        </strong>
      );
    } else if (match[3]) {
      // *italic*
      parts.push(
        <em key={match.index} className="italic">
          {match[3]}
        </em>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  // Push remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}

// ── Hex to rgba helper ───────────────────────────────────────────────────────

function hexToRgba(hex: string, alpha: number): string {
  const cleaned = hex.replace('#', '');
  const r = parseInt(cleaned.substring(0, 2), 16);
  const g = parseInt(cleaned.substring(2, 4), 16);
  const b = parseInt(cleaned.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// ── Text Block ───────────────────────────────────────────────────────────────

function TextBlock({ data, isFirstText }: BlockProps) {
  const content = (data.content as string) || '';
  const paragraphs = content.split('\n\n').filter(Boolean);

  return (
    <div className="max-w-[720px]">
      {paragraphs.map((paragraph, idx) => (
        <p
          key={idx}
          className={`leading-[1.7] text-dark/90 font-body mb-5 last:mb-0 ${
            isFirstText && idx === 0 ? 'text-lg' : 'text-base'
          }`}
        >
          {parseInlineMarkdown(paragraph)}
        </p>
      ))}
    </div>
  );
}

// ── Callout Block ────────────────────────────────────────────────────────────

const CALLOUT_VARIANTS = {
  tip: {
    bg: '#E8F5E9',
    icon: Lightbulb,
    defaultTitle: 'Key Takeaway',
    getBorderColor: (chapterColor: string) => chapterColor,
  },
  warning: {
    bg: '#FFF8E1',
    icon: AlertTriangle,
    defaultTitle: 'Watch Out',
    getBorderColor: () => '#D97706',
  },
  'fun-fact': {
    bg: '#E3F2FD',
    icon: Sparkles,
    defaultTitle: 'Fun Fact',
    getBorderColor: () => '#2563EB',
  },
  'chip-says': {
    bg: '#FFF8E1',
    icon: null,
    defaultTitle: 'Chip Says',
    getBorderColor: () => '#F5A623',
  },
} as const;

function CalloutBlock({ data, chapterColor }: BlockProps) {
  const variant = (data.variant as string) || 'tip';
  const config = CALLOUT_VARIANTS[variant as keyof typeof CALLOUT_VARIANTS] || CALLOUT_VARIANTS.tip;
  const title = (data.title as string) || config.defaultTitle;
  const content = String(data.content || '');
  const borderColor = config.getBorderColor(chapterColor);
  const IconComponent = config.icon;

  if (variant === 'chip-says') {
    return (
      <motion.div
        className="max-w-[720px] rounded-xl p-5 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${hexToRgba('#F5A623', 0.08)}, ${hexToRgba('#F5A623', 0.15)})`,
          border: `2px solid ${hexToRgba('#F5A623', 0.35)}`,
        }}
        whileHover={{ scale: 1.005 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        {/* Subtle gold shimmer accent */}
        <div
          className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 blur-2xl"
          style={{ background: '#F5A623' }}
        />
        <div className="flex items-start gap-3.5 relative z-10">
          <span className="text-[40px] leading-none shrink-0 mt-0.5" role="img" aria-label="Chip the coin">
            🪙
          </span>
          <div>
            <p className="font-display font-semibold text-dark text-sm mb-1.5 tracking-wide uppercase">
              {title}
            </p>
            <p className="text-dark/80 font-body leading-relaxed italic">
              {parseInlineMarkdown(content)}
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div
      className="border-l-4 p-5 rounded-xl max-w-[720px] shadow-sm"
      style={{
        borderColor: borderColor,
        backgroundColor: config.bg,
      }}
    >
      <div className="flex items-start gap-3">
        {IconComponent && (
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${borderColor}15` }}
          >
            <IconComponent
              className="w-4.5 h-4.5"
              style={{ color: borderColor }}
            />
          </div>
        )}
        <div>
          <p
            className="font-display font-semibold text-dark mb-1.5 text-[15px]"
          >
            {title}
          </p>
          <p className="text-dark/80 font-body leading-relaxed text-[15px]">
            {parseInlineMarkdown(content)}
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Key-Term Block ───────────────────────────────────────────────────────────

function KeyTermBlock({ data, chapterColor }: BlockProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const term = data.term as string;
  const definition = data.definition as string;

  return (
    <div className="max-w-[720px] my-1 relative inline-block">
      <span
        className="font-semibold px-2 py-0.5 rounded-md cursor-help inline-flex items-center gap-1 font-body transition-colors duration-200 hover:opacity-80"
        style={{
          backgroundColor: hexToRgba(chapterColor, 0.12),
          borderBottom: `2px dotted ${hexToRgba(chapterColor, 0.5)}`,
          color: '#1A1A2E',
        }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {term}
      </span>

      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.2, ease: [0.25, 1, 0.5, 1] }}
            className="absolute left-0 top-full mt-2.5 z-30 bg-dark text-white text-sm px-4 py-3.5 rounded-xl shadow-2xl max-w-sm font-body leading-relaxed"
            style={{ boxShadow: '0 8px 32px rgba(26,26,46,0.4)' }}
          >
            <p className="font-display font-semibold mb-1" style={{ color: chapterColor }}>
              {term}
            </p>
            <p className="text-white/85 leading-relaxed">{definition}</p>
            {/* Arrow */}
            <div className="absolute -top-1.5 left-5 w-3 h-3 bg-dark rotate-45 rounded-[1px]" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Image Block ──────────────────────────────────────────────────────────────

function ImageBlock({ data, chapterColor }: BlockProps) {
  const src = data.src as string | undefined;
  const alt = (data.alt as string) || '';
  const caption = data.caption as string | undefined;
  const description = data.description as string | undefined;

  if (!src) {
    return (
      <figure className="w-full my-4">
        <div
          className="w-full min-h-[280px] rounded-xl flex flex-col items-center justify-center gap-4 relative overflow-hidden"
          style={{
            borderTop: `4px solid ${chapterColor}`,
            backgroundColor: '#F9FAFB',
          }}
        >
          {/* Diagonal pattern background via CSS */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `repeating-linear-gradient(
                45deg,
                ${chapterColor},
                ${chapterColor} 1px,
                transparent 1px,
                transparent 12px
              )`,
            }}
          />
          <div className="relative z-10 flex flex-col items-center gap-3 px-8 py-6">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ backgroundColor: hexToRgba(chapterColor, 0.1) }}
            >
              <ImageIcon className="w-7 h-7" style={{ color: chapterColor }} />
            </div>
            {alt && (
              <p className="font-display text-dark font-semibold text-center text-base">
                {alt}
              </p>
            )}
            {description && (
              <p className="text-muted font-body text-sm text-center max-w-md leading-relaxed">
                {description}
              </p>
            )}
          </div>
        </div>
        {caption && (
          <figcaption className="text-center text-muted text-sm mt-3 font-body">
            {caption}
          </figcaption>
        )}
      </figure>
    );
  }

  return (
    <figure className="w-full my-4">
      <img
        src={src}
        alt={alt}
        className="w-full rounded-xl object-cover shadow-md"
      />
      {caption && (
        <figcaption className="text-center text-muted text-sm mt-3 font-body">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

// ── Interactive: Slider Calculator ───────────────────────────────────────────

function SliderCalculator({ data, chapterColor }: BlockProps) {
  const config = data.config as Record<string, unknown> | undefined;
  const title = (data.title as string) || 'Calculator';
  const description = (data.description as string) || '';

  const inputLabel = (config?.inputLabel as string) || 'Value';
  const min = Number(config?.min ?? 0);
  const max = Number(config?.max ?? 100);
  const formula = (config?.formula as string) || '0';
  const outputLabel = (config?.outputLabel as string) || 'Result';
  const outputPrefix = (config?.outputPrefix as string) || '';
  const outputSuffix = (config?.outputSuffix as string) || '';

  // Parse the variable name from the formula
  const variableName = useMemo(() => {
    // Look for a word that isn't a JS keyword or number
    const matches = formula.match(/\b([a-zA-Z_]\w*)\b/g);
    const jsKeywords = new Set([
      'Math', 'pow', 'sqrt', 'abs', 'round', 'floor', 'ceil',
      'log', 'min', 'max', 'PI', 'E', 'Number', 'parseInt',
      'parseFloat', 'Infinity', 'NaN', 'undefined', 'null',
      'true', 'false', 'return', 'var', 'let', 'const',
    ]);
    if (matches) {
      for (const m of matches) {
        if (!jsKeywords.has(m) && isNaN(Number(m))) {
          return m;
        }
      }
    }
    return 'x';
  }, [formula]);

  const defaultValue = Math.round((min + max) / 2);
  const [sliderValue, setSliderValue] = useState(defaultValue);

  const computedOutput = useMemo(() => {
    try {
      if (!isFormulaSafe(formula, [variableName])) {
        return 'Invalid formula';
      }
      // eslint-disable-next-line no-new-func
      const fn = new Function(variableName, `return (${formula});`);
      const result = fn(sliderValue);
      if (typeof result === 'number' && !isNaN(result)) {
        // Format nicely: if large, use locale string; if has decimals, fix to 2
        if (Number.isInteger(result)) {
          return result.toLocaleString('en-IN');
        }
        return result.toLocaleString('en-IN', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        });
      }
      return String(result);
    } catch {
      return '—';
    }
  }, [formula, variableName, sliderValue]);

  // Percentage for gradient fill on slider track
  const fillPercent = ((sliderValue - min) / (max - min)) * 100;

  return (
    <motion.div
      className="max-w-[720px] rounded-xl bg-white shadow-sm border border-border overflow-hidden"
      whileHover={{ boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}
      transition={{ duration: 0.2 }}
    >
      {/* Accent top border */}
      <div className="h-1" style={{ backgroundColor: chapterColor }} />

      <div className="p-6">
        {/* Header */}
        <div className="flex items-center gap-2.5 mb-1">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: hexToRgba(chapterColor, 0.12) }}
          >
            <SlidersHorizontal className="w-4 h-4" style={{ color: chapterColor }} />
          </div>
          <h3 className="font-display font-semibold text-dark text-base">
            {title}
          </h3>
        </div>
        {description && (
          <p className="text-muted font-body text-sm mb-5 ml-[42px]">
            {description}
          </p>
        )}

        {/* Slider */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-body font-medium text-dark/80">
              {inputLabel}
            </label>
            <span
              className="font-mono text-sm font-semibold px-2.5 py-0.5 rounded-md"
              style={{
                backgroundColor: hexToRgba(chapterColor, 0.1),
                color: chapterColor,
              }}
            >
              {sliderValue.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="relative">
            <input
              type="range"
              min={min}
              max={max}
              value={sliderValue}
              onChange={(e) => setSliderValue(Number(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer"
              style={{
                background: `linear-gradient(to right, ${chapterColor} ${fillPercent}%, #E5E7EB ${fillPercent}%)`,
                // Thumb color via CSS variable
                ['--thumb-color' as string]: chapterColor,
              }}
            />
            <style>{`
              input[type="range"]::-webkit-slider-thumb {
                background-color: ${chapterColor};
              }
              input[type="range"]::-moz-range-thumb {
                background-color: ${chapterColor};
                width: 20px;
                height: 20px;
                border-radius: 50%;
                border: 2px solid white;
                box-shadow: 0 1px 4px rgba(0,0,0,0.15);
                cursor: pointer;
              }
            `}</style>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-muted font-mono">{min.toLocaleString('en-IN')}</span>
            <span className="text-xs text-muted font-mono">{max.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Output */}
        <div
          className="rounded-lg p-4 text-center"
          style={{ backgroundColor: hexToRgba(chapterColor, 0.06) }}
        >
          <p className="text-sm text-muted font-body mb-1">{outputLabel}</p>
          <motion.p
            key={computedOutput}
            initial={{ scale: 0.95, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="font-mono text-2xl font-bold"
            style={{ color: chapterColor }}
          >
            {outputPrefix}{computedOutput}{outputSuffix}
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}

// ── Interactive: Poll ────────────────────────────────────────────────────────

function PollBlock({ data, chapterColor }: BlockProps) {
  const config = data.config as Record<string, unknown> | undefined;
  const title = (data.title as string) || 'Quick Poll';
  const description = (data.description as string) || '';
  const options = (config?.options as string[]) || [];
  const footnote = (config?.footnote as string) || '';

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const hasVoted = selectedIndex !== null;

  return (
    <motion.div
      className="max-w-[720px] rounded-xl bg-white shadow-sm border border-border overflow-hidden"
      whileHover={{ boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}
      transition={{ duration: 0.2 }}
    >
      <div className="h-1" style={{ backgroundColor: chapterColor }} />
      <div className="p-6">
        <div className="flex items-center gap-2.5 mb-1">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: hexToRgba(chapterColor, 0.12) }}
          >
            <Play className="w-4 h-4 ml-0.5" style={{ color: chapterColor }} />
          </div>
          <h3 className="font-display font-semibold text-dark text-base">
            {title}
          </h3>
        </div>
        {description && (
          <p className="text-muted font-body text-sm mb-5 ml-[42px]">
            {description}
          </p>
        )}

        <AnimatePresence mode="wait">
          {!hasVoted ? (
            <motion.div
              key="options"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col gap-2.5"
            >
              {options.map((option, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => setSelectedIndex(idx)}
                  className="w-full text-left px-4 py-3 rounded-lg border-2 border-border font-body text-[15px] text-dark transition-all hover:border-current"
                  style={{
                    ['--tw-border-opacity' as string]: 1,
                  }}
                  whileHover={{
                    borderColor: chapterColor,
                    backgroundColor: hexToRgba(chapterColor, 0.04),
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-mono font-semibold shrink-0"
                      style={{ borderColor: hexToRgba(chapterColor, 0.4), color: chapterColor }}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    {option}
                  </span>
                </motion.button>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="text-center py-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <CheckCircle2
                  className="w-10 h-10 mx-auto mb-3"
                  style={{ color: chapterColor }}
                />
              </motion.div>
              <p className="font-display font-semibold text-dark text-lg mb-1">
                Thanks for your answer!
              </p>
              <p className="text-muted font-body text-sm mb-3">
                You picked: <span className="font-medium text-dark">{options[selectedIndex]}</span>
              </p>
              {footnote && (
                <p className="text-muted font-body text-sm italic border-t border-border pt-3 mt-3">
                  {footnote}
                </p>
              )}
              <button
                onClick={() => setSelectedIndex(null)}
                className="mt-3 text-sm font-body flex items-center gap-1 mx-auto transition-colors hover:opacity-80"
                style={{ color: chapterColor }}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Vote again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ── Interactive: Budget Allocator ────────────────────────────────────────────

function BudgetAllocator({ data, chapterColor }: BlockProps) {
  const title = (data.title as string) || 'Budget Allocator';
  const description = (data.description as string) || '';

  const [salary, setSalary] = useState(50000);
  const needs = Math.round(salary * 0.5);
  const wants = Math.round(salary * 0.3);
  const savings = salary - needs - wants; // remainder to avoid rounding issues

  const categories = [
    { label: 'Needs (50%)', amount: needs, color: '#16A34A' },
    { label: 'Wants (30%)', amount: wants, color: '#F5A623' },
    { label: 'Savings (20%)', amount: savings, color: '#2563EB' },
  ];

  const fillPercent = ((salary - 10000) / (200000 - 10000)) * 100;

  return (
    <motion.div
      className="max-w-[720px] rounded-xl bg-white shadow-sm border border-border overflow-hidden"
      whileHover={{ boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}
    >
      <div className="h-1" style={{ backgroundColor: chapterColor }} />
      <div className="p-6">
        <div className="flex items-center gap-2.5 mb-1">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: hexToRgba(chapterColor, 0.12) }}
          >
            <SlidersHorizontal className="w-4 h-4" style={{ color: chapterColor }} />
          </div>
          <h3 className="font-display font-semibold text-dark text-base">{title}</h3>
        </div>
        {description && (
          <p className="text-muted font-body text-sm mb-5 ml-[42px]">{description}</p>
        )}

        {/* Salary Slider */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-body font-medium text-dark/80">Monthly Salary</label>
            <span
              className="font-mono text-sm font-semibold px-2.5 py-0.5 rounded-md"
              style={{ backgroundColor: hexToRgba(chapterColor, 0.1), color: chapterColor }}
            >
              ₹{salary.toLocaleString('en-IN')}
            </span>
          </div>
          <input
            type="range"
            min={10000}
            max={200000}
            step={1000}
            value={salary}
            onChange={(e) => setSalary(Number(e.target.value))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer"
            style={{
              background: `linear-gradient(to right, ${chapterColor} ${fillPercent}%, #E5E7EB ${fillPercent}%)`,
            }}
          />
          <style>{`
            input[type="range"]::-webkit-slider-thumb { background-color: ${chapterColor}; }
            input[type="range"]::-moz-range-thumb { background-color: ${chapterColor}; width:20px; height:20px; border-radius:50%; border:2px solid white; }
          `}</style>
        </div>

        {/* Breakdown bars */}
        <div className="space-y-3">
          {categories.map((cat) => {
            const percent = salary > 0 ? (cat.amount / salary) * 100 : 0;
            return (
              <div key={cat.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-body font-medium text-dark/80">{cat.label}</span>
                  <motion.span
                    key={cat.amount}
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: 1 }}
                    className="font-mono text-sm font-semibold"
                    style={{ color: cat.color }}
                  >
                    ₹{cat.amount.toLocaleString('en-IN')}
                  </motion.span>
                </div>
                <div className="w-full h-3 bg-fill-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: cat.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

// ── Interactive: Tap-to-Identify ─────────────────────────────────────────────

function TapToIdentify({ data, chapterColor }: BlockProps) {
  const config = data.config as Record<string, unknown> | undefined;
  const title = (data.title as string) || 'Tap to Identify';
  const description = (data.description as string) || '';
  const items = (config?.items as Array<Record<string, unknown>>) || [];

  const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set());

  const handleTap = useCallback((idx: number) => {
    setRevealedIndices((prev) => {
      const next = new Set(prev);
      next.add(idx);
      return next;
    });
  }, []);

  return (
    <motion.div className="max-w-[720px] rounded-xl bg-white shadow-sm border border-border overflow-hidden">
      <div className="h-1" style={{ backgroundColor: chapterColor }} />
      <div className="p-6">
        <h3 className="font-display font-semibold text-dark text-base mb-1">{title}</h3>
        {description && (
          <p className="text-muted font-body text-sm mb-5">{description}</p>
        )}
        <div className="grid grid-cols-2 gap-3">
          {items.map((item, idx) => {
            const label = (item.label as string) || (item.text as string) || `Item ${idx + 1}`;
            const answer = (item.answer as string) || (item.category as string) || '';
            const isRevealed = revealedIndices.has(idx);

            return (
              <motion.button
                key={idx}
                onClick={() => handleTap(idx)}
                className="relative p-4 rounded-lg border-2 text-left transition-all font-body text-sm min-h-[60px]"
                style={{
                  borderColor: isRevealed ? chapterColor : '#E5E7EB',
                  backgroundColor: isRevealed ? hexToRgba(chapterColor, 0.06) : 'white',
                }}
                whileHover={!isRevealed ? { borderColor: hexToRgba(chapterColor, 0.5) } : {}}
                whileTap={!isRevealed ? { scale: 0.97 } : {}}
              >
                <span className="font-medium text-dark">{label}</span>
                <AnimatePresence>
                  {isRevealed && answer && (
                    <motion.span
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="block mt-1.5 text-xs font-semibold"
                      style={{ color: chapterColor }}
                    >
                      {answer}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

// ── Interactive: Red Flag Checker ────────────────────────────────────────────

function RedFlagChecker({ data, chapterColor }: BlockProps) {
  const config = data.config as Record<string, unknown> | undefined;
  const title = (data.title as string) || 'Red Flag Checker';
  const description = (data.description as string) || '';
  const flags = (config?.flags as string[]) || (config?.items as string[]) || [];

  const [checkedFlags, setCheckedFlags] = useState<Set<number>>(new Set());

  const toggleFlag = useCallback((idx: number) => {
    setCheckedFlags((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });
  }, []);

  const checkedCount = checkedFlags.size;

  return (
    <motion.div className="max-w-[720px] rounded-xl bg-white shadow-sm border border-border overflow-hidden">
      <div className="h-1" style={{ backgroundColor: chapterColor }} />
      <div className="p-6">
        <h3 className="font-display font-semibold text-dark text-base mb-1">{title}</h3>
        {description && (
          <p className="text-muted font-body text-sm mb-5">{description}</p>
        )}
        <div className="space-y-2">
          {flags.map((flag, idx) => {
            const isChecked = checkedFlags.has(idx);
            return (
              <motion.button
                key={idx}
                onClick={() => toggleFlag(idx)}
                className="w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-all font-body text-sm"
                style={{
                  borderColor: isChecked ? '#E74C3C' : '#E5E7EB',
                  backgroundColor: isChecked ? 'rgba(231, 76, 60, 0.05)' : 'white',
                }}
                whileTap={{ scale: 0.98 }}
              >
                <div
                  className="w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors"
                  style={{
                    borderColor: isChecked ? '#E74C3C' : '#9CA3AF',
                    backgroundColor: isChecked ? '#E74C3C' : 'transparent',
                  }}
                >
                  {isChecked && (
                    <motion.svg
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                    >
                      <path
                        d="M2 6L5 9L10 3"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </motion.svg>
                  )}
                </div>
                <span className={`text-dark/90 ${isChecked ? 'line-through text-dark/50' : ''}`}>
                  {String(flag)}
                </span>
              </motion.button>
            );
          })}
        </div>
        {flags.length > 0 && (
          <p className="text-sm text-muted font-body mt-4 text-center">
            {checkedCount} of {flags.length} flagged
          </p>
        )}
      </div>
    </motion.div>
  );
}

// ── Interactive: Fallback (Coming Soon) ──────────────────────────────────────

function InteractiveFallback({ data, chapterColor }: BlockProps) {
  const title = (data.title as string) || 'Interactive Element';
  const description = (data.description as string) || 'This interactive will be available soon.';

  return (
    <motion.div
      className="max-w-[720px] rounded-xl bg-white shadow-sm border border-border overflow-hidden"
      whileHover={{ boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}
    >
      <div className="h-1" style={{ backgroundColor: chapterColor }} />
      <div className="p-8 flex flex-col items-center justify-center gap-3 text-center">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center"
          style={{ backgroundColor: hexToRgba(chapterColor, 0.12) }}
        >
          <Play className="w-6 h-6 ml-0.5" style={{ color: chapterColor }} />
        </div>
        <p className="font-display text-lg text-dark font-semibold">{title}</p>
        <p className="text-muted text-sm font-body max-w-md">{description}</p>
        <span
          className="mt-1 inline-flex items-center gap-1.5 text-xs font-mono font-semibold px-3 py-1 rounded-full"
          style={{
            backgroundColor: hexToRgba(chapterColor, 0.1),
            color: chapterColor,
          }}
        >
          Coming Soon
        </span>
      </div>
    </motion.div>
  );
}

// ── Interactive Block Router ─────────────────────────────────────────────────

function InteractiveBlock({ data, chapterColor }: BlockProps) {
  const interactiveType = (data.interactiveType as string) || '';

  switch (interactiveType) {
    case 'slider-calculator':
      return <SliderCalculator data={data} chapterColor={chapterColor} />;
    case 'poll':
    case 'scenario-predictor':
    case 'timeline-quiz':
      return <PollBlock data={data} chapterColor={chapterColor} />;
    case 'budget-allocator':
      return <BudgetAllocator data={data} chapterColor={chapterColor} />;
    case 'income-expense-calculator':
      return <SliderCalculator data={data} chapterColor={chapterColor} />;
    case 'tap-to-identify':
      return <TapToIdentify data={data} chapterColor={chapterColor} />;
    case 'red-flag-checker':
      return <RedFlagChecker data={data} chapterColor={chapterColor} />;
    default:
      return <InteractiveFallback data={data} chapterColor={chapterColor} />;
  }
}

// ── Block Renderer Map ───────────────────────────────────────────────────────

const BLOCK_RENDERERS: Record<
  string,
  React.ComponentType<BlockProps>
> = {
  text: TextBlock,
  callout: CalloutBlock,
  'key-term': KeyTermBlock,
  image: ImageBlock,
  interactive: InteractiveBlock,
};

// ── Main Component ───────────────────────────────────────────────────────────

export default function LessonRenderer({ blocks, chapterColor }: LessonRendererProps) {
  const resolvedColor = chapterColor || DEFAULT_CHAPTER_COLOR;

  // Find the index of the first text block to mark it with isFirstText
  const firstTextBlockIndex = useMemo(
    () => blocks.findIndex((b) => b.type === 'text'),
    [blocks]
  );

  return (
    <div className="flex flex-col gap-6">
      {blocks.map((block, index) => {
        const Renderer = BLOCK_RENDERERS[block.type];
        if (!Renderer) return null;

        const isFirstText = block.type === 'text' && index === firstTextBlockIndex;

        return (
          <motion.div
            key={`${block.type}-${index}`}
            custom={index}
            variants={blockVariants}
            initial="hidden"
            animate="visible"
          >
            <Renderer
              data={block.data as Record<string, unknown>}
              chapterColor={resolvedColor}
              isFirstText={isFirstText}
            />
          </motion.div>
        );
      })}
    </div>
  );
}
