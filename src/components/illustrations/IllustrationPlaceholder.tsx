'use client';

import { useId } from 'react';

interface IllustrationPlaceholderProps {
  alt: string;
  accentColor: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function withOpacity(hex: string, opacity: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
}

/**
 * Deterministic pseudo-random from a string seed.
 * Returns a function that produces values in [0, 1).
 */
function seededRandom(seed: string): () => number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return () => {
    hash = (hash * 16807) % 2147483647;
    return (hash & 0x7fffffff) / 0x7fffffff;
  };
}

const sizeConfig = {
  sm: { width: 200, height: 140, padding: 16 },
  md: { width: 320, height: 200, padding: 24 },
  lg: { width: 480, height: 280, padding: 32 },
};

export default function IllustrationPlaceholder({
  alt,
  accentColor,
  size = 'md',
  className = '',
}: IllustrationPlaceholderProps) {
  const uniqueId = useId();
  const safeId = uniqueId.replace(/:/g, '_');
  const { width, height, padding } = sizeConfig[size];
  const rand = seededRandom(alt + accentColor);

  // Generate deterministic decorative elements
  const circleCount = size === 'sm' ? 5 : size === 'md' ? 8 : 12;
  const lineCount = size === 'sm' ? 3 : size === 'md' ? 5 : 7;

  const circles = Array.from({ length: circleCount }, () => ({
    cx: padding + rand() * (width - padding * 2),
    cy: padding + rand() * (height - padding * 2 - 30),
    r: 4 + rand() * (size === 'sm' ? 12 : size === 'md' ? 20 : 28),
    opacity: 0.06 + rand() * 0.12,
  }));

  const lines = Array.from({ length: lineCount }, () => {
    const x1 = padding + rand() * (width - padding * 2);
    const y1 = padding + rand() * (height - padding * 2 - 30);
    const angle = rand() * Math.PI;
    const len = 20 + rand() * 40;
    return {
      x1,
      y1,
      x2: x1 + Math.cos(angle) * len,
      y2: y1 + Math.sin(angle) * len,
      opacity: 0.08 + rand() * 0.1,
    };
  });

  // Small dots
  const dotCount = size === 'sm' ? 6 : size === 'md' ? 10 : 16;
  const dots = Array.from({ length: dotCount }, () => ({
    cx: padding / 2 + rand() * (width - padding),
    cy: padding / 2 + rand() * (height - padding - 24),
    r: 1.5 + rand() * 2.5,
    opacity: 0.1 + rand() * 0.15,
  }));

  // Geometric accents — rounded rects
  const rectCount = size === 'sm' ? 2 : 3;
  const rects = Array.from({ length: rectCount }, () => ({
    x: padding + rand() * (width - padding * 3),
    y: padding + rand() * (height - padding * 3 - 20),
    w: 16 + rand() * 24,
    h: 16 + rand() * 24,
    rotation: rand() * 45,
    opacity: 0.05 + rand() * 0.08,
  }));

  return (
    <div
      className={`relative rounded-xl overflow-hidden ${className}`}
      style={{
        backgroundColor: withOpacity(accentColor, 0.06),
        border: `1px solid ${withOpacity(accentColor, 0.12)}`,
      }}
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={alt}
        className="w-full h-auto"
      >
        <defs>
          <radialGradient id={`grad-${safeId}`} cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor={accentColor} stopOpacity="0.08" />
            <stop offset="100%" stopColor={accentColor} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Subtle radial gradient overlay */}
        <rect
          x="0"
          y="0"
          width={width}
          height={height}
          fill={`url(#grad-${safeId})`}
        />

        {/* Decorative lines */}
        {lines.map((line, i) => (
          <line
            key={`l-${i}`}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke={accentColor}
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity={line.opacity}
          />
        ))}

        {/* Decorative rounded rects */}
        {rects.map((r, i) => (
          <rect
            key={`r-${i}`}
            x={r.x}
            y={r.y}
            width={r.w}
            height={r.h}
            rx="4"
            fill={accentColor}
            opacity={r.opacity}
            transform={`rotate(${r.rotation}, ${r.x + r.w / 2}, ${r.y + r.h / 2})`}
          />
        ))}

        {/* Decorative circles */}
        {circles.map((c, i) => (
          <circle
            key={`c-${i}`}
            cx={c.cx}
            cy={c.cy}
            r={c.r}
            fill={accentColor}
            opacity={c.opacity}
          />
        ))}

        {/* Tiny dots */}
        {dots.map((d, i) => (
          <circle
            key={`d-${i}`}
            cx={d.cx}
            cy={d.cy}
            r={d.r}
            fill={accentColor}
            opacity={d.opacity}
          />
        ))}

        {/* Central decorative motif — concentric rings */}
        <circle
          cx={width / 2}
          cy={height / 2 - 10}
          r={size === 'sm' ? 18 : size === 'md' ? 28 : 36}
          stroke={accentColor}
          strokeWidth="1.5"
          opacity="0.15"
          fill="none"
        />
        <circle
          cx={width / 2}
          cy={height / 2 - 10}
          r={size === 'sm' ? 10 : size === 'md' ? 16 : 22}
          stroke={accentColor}
          strokeWidth="1"
          opacity="0.12"
          fill="none"
        />
        <circle
          cx={width / 2}
          cy={height / 2 - 10}
          r={size === 'sm' ? 4 : 6}
          fill={accentColor}
          opacity="0.2"
        />

        {/* Alt text at bottom */}
        <text
          x={width / 2}
          y={height - (size === 'sm' ? 10 : 14)}
          textAnchor="middle"
          fontSize={size === 'sm' ? '9' : '10.5'}
          fontFamily="'DM Sans', system-ui, sans-serif"
          fill="#596673"
          opacity="0.7"
        >
          {alt.length > 40 ? alt.slice(0, 38) + '...' : alt}
        </text>
      </svg>
    </div>
  );
}
