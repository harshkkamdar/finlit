'use client';

import { Lightbulb, AlertTriangle, Sparkles, Star } from 'lucide-react';
import Image from 'next/image';
import type { ReactNode } from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────

type CalloutVariant = 'chip-says' | 'fun-fact' | 'tip' | 'warning' | 'key-takeaway';

interface CalloutCardProps {
  variant: CalloutVariant;
  text: string;
  title?: string;
  chapterColor: string;
}

// ── Chip Expression Detection ────────────────────────────────────────────────

type ChipExpression = 'neutral' | 'excited' | 'thinking' | 'shocked' | 'warning' | 'sarcastic' | 'proud';

const CHIP_EXPRESSION_HINTS: Array<{ pattern: RegExp; expression: ChipExpression }> = [
  { pattern: /mind.?blown|brain.*explod|wait,?\s*what|surprised/i, expression: 'shocked' },
  { pattern: /revelation|realized|turns out|whoa/i, expression: 'excited' },
  { pattern: /careful|watch out|warning|don't|avoid/i, expression: 'warning' },
  { pattern: /think about|consider|hmm|wonder/i, expression: 'thinking' },
  { pattern: /proud|nice|great|nailed|impressive/i, expression: 'proud' },
  { pattern: /oh really|seriously|sure about that|honestly/i, expression: 'sarcastic' },
];

function detectChipExpression(text: string): ChipExpression {
  for (const { pattern, expression } of CHIP_EXPRESSION_HINTS) {
    if (pattern.test(text)) return expression;
  }
  return 'neutral';
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function hexToRgba(hex: string, alpha: number): string {
  const cleaned = hex.replace('#', '');
  const r = parseInt(cleaned.substring(0, 2), 16);
  const g = parseInt(cleaned.substring(2, 4), 16);
  const b = parseInt(cleaned.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

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
        <strong key={`b-${match.index}`} className="font-semibold">
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

// ── Variant Configs ───────────────────────────────────────────────────────────

interface VariantConfig {
  emoji: string;
  defaultTitle: string;
  bgGradient: (color: string) => string;
  borderColor: string;
  textStyle: string;
  icon: typeof Lightbulb | null;
}

const VARIANT_CONFIGS: Record<CalloutVariant, VariantConfig> = {
  'chip-says': {
    emoji: '\uD83E\uDE99',
    defaultTitle: 'Chip Says',
    bgGradient: () =>
      `linear-gradient(135deg, rgba(245,166,35,0.1), rgba(245,166,35,0.18))`,
    borderColor: 'rgba(245,166,35,0.4)',
    textStyle: 'italic',
    icon: null,
  },
  'fun-fact': {
    emoji: '\u2728',
    defaultTitle: 'Fun Fact',
    bgGradient: () =>
      `linear-gradient(135deg, rgba(37,99,235,0.06), rgba(37,99,235,0.12))`,
    borderColor: 'rgba(37,99,235,0.3)',
    textStyle: '',
    icon: Sparkles,
  },
  tip: {
    emoji: '\uD83D\uDCA1',
    defaultTitle: 'Tip',
    bgGradient: (color: string) =>
      `linear-gradient(135deg, ${hexToRgba(color, 0.06)}, ${hexToRgba(color, 0.12)})`,
    borderColor: '',
    textStyle: '',
    icon: Lightbulb,
  },
  warning: {
    emoji: '\u26A0\uFE0F',
    defaultTitle: 'Watch Out',
    bgGradient: () =>
      `linear-gradient(135deg, rgba(217,119,6,0.06), rgba(217,119,6,0.12))`,
    borderColor: 'rgba(217,119,6,0.35)',
    textStyle: '',
    icon: AlertTriangle,
  },
  'key-takeaway': {
    emoji: '\u2B50',
    defaultTitle: 'Key Takeaway',
    bgGradient: (color: string) =>
      `linear-gradient(135deg, ${hexToRgba(color, 0.06)}, ${hexToRgba(color, 0.14)})`,
    borderColor: '',
    textStyle: '',
    icon: Star,
  },
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function CalloutCard({
  variant,
  text,
  title,
  chapterColor,
}: CalloutCardProps) {
  const config = VARIANT_CONFIGS[variant] || VARIANT_CONFIGS.tip;
  const displayTitle = title || config.defaultTitle;
  const borderColor = config.borderColor || hexToRgba(chapterColor, 0.35);

  if (variant === 'chip-says') {
    const expression = detectChipExpression(text);
    const spriteSrc = `/characters/chip-${expression}.png`;

    // Strip "Chip's take:", "Chip says:", etc. since avatar shows who's speaking
    const cleanedText = text.replace(/^chip'?s?\s*(says?|take|tip|thought|surprised face|warning|proud moment)\s*[:!]\s*/i, '');

    return (
      <div
        className="lesson-card !p-0 relative overflow-hidden"
        style={{ background: 'linear-gradient(180deg, rgba(245,166,35,0.02), rgba(245,166,35,0.08))' }}
      >
        {/* Chip sprite — bottom left, large, filling ~38% width */}
        <div className="absolute bottom-0 left-0 w-[38%] max-w-[260px]">
          <Image
            src={spriteSrc}
            alt={`Chip looking ${expression}`}
            width={260}
            height={260}
            className="w-full h-auto object-contain"
          />
        </div>

        {/* Speech bubble — center-right, vertically centered, filling remaining space */}
        <div className="absolute inset-0 flex items-center justify-end pl-[36%] pr-5 py-6">
          <div className="w-full">
            <span className="text-[11px] font-display font-bold uppercase tracking-wider text-amber-600 mb-2 block">
              Chip
            </span>
            <div
              className="relative rounded-2xl px-6 py-5"
              style={{
                backgroundColor: 'rgba(245,166,35,0.08)',
                border: '1.5px solid rgba(245,166,35,0.22)',
              }}
            >
              {/* Speech bubble tail pointing left toward Chip */}
              <div
                className="absolute left-[-10px] top-1/2 -translate-y-1/2 w-0 h-0"
                style={{
                  borderTop: '10px solid transparent',
                  borderBottom: '10px solid transparent',
                  borderRight: '10px solid rgba(245,166,35,0.22)',
                }}
              />
              <div
                className="absolute left-[-8px] top-1/2 -translate-y-1/2 w-0 h-0"
                style={{
                  borderTop: '9px solid transparent',
                  borderBottom: '9px solid transparent',
                  borderRight: '9px solid rgba(245,166,35,0.08)',
                }}
              />
              <p className="text-dark/85 font-body text-[17px] leading-relaxed">
                {parseInlineMarkdown(cleanedText)}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Standard callout variants: fun-fact, tip, warning, key-takeaway
  const IconComponent = config.icon;

  return (
    <div
      className="lesson-card relative overflow-hidden"
      style={{
        background: config.bgGradient(chapterColor),
        border: `2px solid ${borderColor}`,
      }}
    >
      <div className="flex items-start gap-4">
        {/* Icon or emoji */}
        <div className="shrink-0 mt-0.5">
          {IconComponent ? (
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                backgroundColor: hexToRgba(
                  variant === 'fun-fact'
                    ? '#2563EB'
                    : variant === 'warning'
                    ? '#D97706'
                    : chapterColor,
                  0.15
                ),
              }}
            >
              <IconComponent
                className="w-5 h-5"
                style={{
                  color:
                    variant === 'fun-fact'
                      ? '#2563EB'
                      : variant === 'warning'
                      ? '#D97706'
                      : chapterColor,
                }}
              />
            </div>
          ) : (
            <span className="text-3xl">{config.emoji}</span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1">
          <p className="font-display font-semibold text-dark text-sm mb-2 tracking-wide uppercase">
            {displayTitle}
          </p>
          <p
            className={`text-dark/80 font-body text-lg leading-relaxed ${
              config.textStyle === 'italic' ? 'italic' : ''
            }`}
          >
            {parseInlineMarkdown(text)}
          </p>
        </div>
      </div>
    </div>
  );
}
