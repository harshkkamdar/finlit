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
      className="lesson-card !p-0 relative overflow-hidden"
      style={{ background: `linear-gradient(180deg, ${hexToRgba(accent, 0.02)}, ${hexToRgba(accent, 0.08)})` }}
    >
      {/* Character sprite — bottom left, large, filling ~38% width */}
      <div className="absolute bottom-0 left-0 w-[38%] max-w-[260px]">
        <Image
          src={spriteSrc}
          alt={`${config.name} looking ${expr}`}
          width={260}
          height={260}
          className="w-full h-auto object-contain"
        />
      </div>

      {/* Speech bubble — center-right, vertically centered, filling remaining space */}
      <div className="absolute inset-0 flex items-center justify-end pl-[36%] pr-5 py-6">
        <div className="w-full">
          <span
            className="text-[11px] font-display font-bold uppercase tracking-wider mb-2 block"
            style={{ color: accent }}
          >
            {config.name}
          </span>
          <div
            className="relative rounded-2xl px-6 py-5"
            style={{
              backgroundColor: hexToRgba(accent, 0.08),
              border: `1.5px solid ${hexToRgba(accent, 0.2)}`,
            }}
          >
            {/* Speech bubble tail pointing left toward character */}
            <div
              className="absolute left-[-10px] top-1/2 -translate-y-1/2 w-0 h-0"
              style={{
                borderTop: '10px solid transparent',
                borderBottom: '10px solid transparent',
                borderRight: `10px solid ${hexToRgba(accent, 0.2)}`,
              }}
            />
            <div
              className="absolute left-[-8px] top-1/2 -translate-y-1/2 w-0 h-0"
              style={{
                borderTop: '9px solid transparent',
                borderBottom: '9px solid transparent',
                borderRight: `9px solid ${hexToRgba(accent, 0.08)}`,
              }}
            />
            <p className="text-dark/85 font-body text-[17px] leading-relaxed">
              {parseInlineMarkdown(text)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
