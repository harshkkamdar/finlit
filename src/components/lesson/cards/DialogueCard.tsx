'use client';

import Image from 'next/image';
import type { ReactNode } from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────

type Character = 'chip' | 'priya' | 'arjun';

interface DialogueCardProps {
  character: Character;
  expression?: string;
  text: string;
  chapterColor: string;
}

// ── Character Config ─────────────────────────────────────────────────────────

interface CharacterConfig {
  name: string;
  defaultExpression: string;
  accentColor: string;
}

const CHARACTER_CONFIGS: Record<Character, CharacterConfig> = {
  chip: {
    name: 'Chip',
    defaultExpression: 'neutral',
    accentColor: '#F5A623',
  },
  priya: {
    name: 'Priya',
    defaultExpression: 'neutral',
    accentColor: '#1B6B4A',
  },
  arjun: {
    name: 'Arjun',
    defaultExpression: 'neutral',
    accentColor: '#3366CC',
  },
};

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

// ── Component ─────────────────────────────────────────────────────────────────

export default function DialogueCard({
  character,
  expression,
  text,
  chapterColor,
}: DialogueCardProps) {
  const config = CHARACTER_CONFIGS[character] || CHARACTER_CONFIGS.chip;
  const expr = expression || config.defaultExpression;
  const spriteSrc = `/characters/${character}-${expr}.png`;
  const accent = config.accentColor;

  return (
    <div
      className="lesson-card relative overflow-hidden"
      style={{ background: `linear-gradient(180deg, ${hexToRgba(accent, 0.02)}, ${hexToRgba(accent, 0.08)})` }}
    >
      {/* Mobile/tablet: stack column. Desktop: side-by-side. */}
      <div className="flex flex-col items-center md:flex-row md:items-center md:justify-start gap-4 md:gap-0 md:relative md:h-full">
        {/* Character sprite */}
        <div className="w-32 sm:w-40 md:absolute md:bottom-0 md:left-0 md:w-[38%] md:max-w-[260px] overflow-hidden shrink-0">
          <Image
            src={spriteSrc}
            alt=""
            role="presentation"
            width={260}
            height={260}
            className="w-full h-auto object-contain md:scale-110 md:origin-top"
            priority
          />
        </div>

        {/* Speech bubble */}
        <div className="w-full md:absolute md:inset-0 md:flex md:items-center md:justify-end md:pl-[36%] md:pr-5 md:py-6">
          <div className="w-full">
            <span
              className="text-[11px] font-display font-bold uppercase tracking-wider mb-2 block"
              style={{ color: accent }}
            >
              {config.name}
            </span>
            <div
              className="relative rounded-2xl px-5 py-4 md:px-6 md:py-5"
              style={{
                backgroundColor: hexToRgba(accent, 0.08),
                border: `1.5px solid ${hexToRgba(accent, 0.2)}`,
              }}
            >
              {/* Mobile tail (top, pointing up at character) */}
              <div
                className="md:hidden absolute top-[-10px] left-1/2 -translate-x-1/2 w-0 h-0"
                style={{
                  borderLeft: '10px solid transparent',
                  borderRight: '10px solid transparent',
                  borderBottom: `10px solid ${hexToRgba(accent, 0.2)}`,
                }}
              />
              <div
                className="md:hidden absolute top-[-8px] left-1/2 -translate-x-1/2 w-0 h-0"
                style={{
                  borderLeft: '9px solid transparent',
                  borderRight: '9px solid transparent',
                  borderBottom: `9px solid ${hexToRgba(accent, 0.08)}`,
                }}
              />
              {/* Desktop tail (left, pointing at character) */}
              <div
                className="hidden md:block absolute left-[-10px] top-1/2 -translate-y-1/2 w-0 h-0"
                style={{
                  borderTop: '10px solid transparent',
                  borderBottom: '10px solid transparent',
                  borderRight: `10px solid ${hexToRgba(accent, 0.2)}`,
                }}
              />
              <div
                className="hidden md:block absolute left-[-8px] top-1/2 -translate-y-1/2 w-0 h-0"
                style={{
                  borderTop: '9px solid transparent',
                  borderBottom: '9px solid transparent',
                  borderRight: `9px solid ${hexToRgba(accent, 0.08)}`,
                }}
              />
              <p className="text-dark/85 font-body text-base md:text-[17px] leading-relaxed">
                {parseInlineMarkdown(text)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
