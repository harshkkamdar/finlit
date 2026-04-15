'use client';

import { useEffect, useRef, useState } from 'react';

interface MoneyTimelineSVGProps {
  color?: string;
  className?: string;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
    : null;
}

function withOpacity(hex: string, opacity: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
}

function darken(hex: string, amount: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  return `rgb(${Math.max(0, Math.round(rgb.r * (1 - amount)))}, ${Math.max(0, Math.round(rgb.g * (1 - amount)))}, ${Math.max(0, Math.round(rgb.b * (1 - amount)))})`;
}

function lighten(hex: string, amount: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  return `rgb(${Math.min(255, Math.round(rgb.r + (255 - rgb.r) * amount))}, ${Math.min(255, Math.round(rgb.g + (255 - rgb.g) * amount))}, ${Math.min(255, Math.round(rgb.b + (255 - rgb.b) * amount))})`;
}

const stages = [
  { label: 'Barter', date: '~3000 BC' },
  { label: 'Commodity', date: '~1000 BC' },
  { label: 'Coins', date: '~300 BC' },
  { label: 'Paper Money', date: '~1700s' },
  { label: 'Digital / UPI', date: '2016' },
] as const;

// ── Bold, simple icons that fill the space ──

function BarterIcon({ cx, cy, color }: { cx: number; cy: number; color: string }) {
  const dark = darken(color, 0.2);
  const light = lighten(color, 0.3);
  // Two bold arrows forming a cycle (exchange symbol)
  return (
    <g>
      {/* Wheat/grain bundle - left */}
      <ellipse cx={cx - 28} cy={cy - 6} rx={14} ry={22} fill={light} stroke={dark} strokeWidth="2" />
      <line x1={cx - 28} y1={cy - 28} x2={cx - 28} y2={cy + 16} stroke={dark} strokeWidth="2" />
      <line x1={cx - 35} y1={cy - 18} x2={cx - 28} y2={cy - 8} stroke={dark} strokeWidth="1.5" />
      <line x1={cx - 21} y1={cy - 18} x2={cx - 28} y2={cy - 8} stroke={dark} strokeWidth="1.5" />
      <line x1={cx - 35} y1={cy - 6} x2={cx - 28} y2={cy + 4} stroke={dark} strokeWidth="1.5" />
      <line x1={cx - 21} y1={cy - 6} x2={cx - 28} y2={cy + 4} stroke={dark} strokeWidth="1.5" />

      {/* Exchange arrows in center */}
      <path d={`M${cx - 8} ${cy - 8} L${cx + 8} ${cy - 8}`} stroke={dark} strokeWidth="2.5" strokeLinecap="round" />
      <path d={`M${cx + 4} ${cy - 14} L${cx + 10} ${cy - 8} L${cx + 4} ${cy - 2}`} fill="none" stroke={dark} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d={`M${cx + 8} ${cy + 8} L${cx - 8} ${cy + 8}`} stroke={dark} strokeWidth="2.5" strokeLinecap="round" />
      <path d={`M${cx - 4} ${cy + 14} L${cx - 10} ${cy + 8} L${cx - 4} ${cy + 2}`} fill="none" stroke={dark} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* Shoe/sandal - right */}
      <path
        d={`M${cx + 18} ${cy + 12} q0 -30 10 -30 q10 0 12 10 l-2 20 q-4 4 -14 4 z`}
        fill={light} stroke={dark} strokeWidth="2" strokeLinejoin="round"
      />
      <line x1={cx + 22} y1={cy - 4} x2={cx + 36} y2={cy - 4} stroke={dark} strokeWidth="1.5" />
      <line x1={cx + 22} y1={cy + 4} x2={cx + 36} y2={cy + 4} stroke={dark} strokeWidth="1.5" />
    </g>
  );
}

function CommodityIcon({ cx, cy, color }: { cx: number; cy: number; color: string }) {
  const dark = darken(color, 0.2);
  const light = lighten(color, 0.25);
  // Bold cowrie shells cluster
  return (
    <g>
      {/* Large central shell */}
      <ellipse cx={cx} cy={cy - 4} rx={24} ry={32} fill={light} stroke={dark} strokeWidth="2" />
      <path d={`M${cx} ${cy - 36} q-4 16 0 32 q4 16 0 32`} fill="none" stroke={dark} strokeWidth="1.5" />
      <line x1={cx - 10} y1={cy - 18} x2={cx + 10} y2={cy - 18} stroke={dark} strokeWidth="1.2" />
      <line x1={cx - 14} y1={cy - 8} x2={cx + 14} y2={cy - 8} stroke={dark} strokeWidth="1.2" />
      <line x1={cx - 14} y1={cy + 2} x2={cx + 14} y2={cy + 2} stroke={dark} strokeWidth="1.2" />
      <line x1={cx - 10} y1={cy + 12} x2={cx + 10} y2={cy + 12} stroke={dark} strokeWidth="1.2" />

      {/* Small shell - top right */}
      <ellipse cx={cx + 30} cy={cy - 20} rx={12} ry={16} fill={lighten(color, 0.45)} stroke={dark} strokeWidth="1.5" transform={`rotate(20 ${cx + 30} ${cy - 20})`} />
      <line x1={cx + 24} y1={cy - 22} x2={cx + 36} y2={cy - 18} stroke={dark} strokeWidth="1" />

      {/* Small shell - bottom left */}
      <ellipse cx={cx - 28} cy={cy + 14} rx={12} ry={16} fill={lighten(color, 0.45)} stroke={dark} strokeWidth="1.5" transform={`rotate(-15 ${cx - 28} ${cy + 14})`} />
      <line x1={cx - 34} y1={cy + 12} x2={cx - 22} y2={cy + 16} stroke={dark} strokeWidth="1" />
    </g>
  );
}

function CoinIcon({ cx, cy, color }: { cx: number; cy: number; color: string }) {
  const dark = darken(color, 0.2);
  // Bold ancient coin with Ashoka-wheel motif
  return (
    <g>
      {/* Outer coin */}
      <circle cx={cx} cy={cy} r={40} fill={lighten(color, 0.15)} stroke={dark} strokeWidth="3" />
      {/* Inner ring */}
      <circle cx={cx} cy={cy} r={32} fill="none" stroke={dark} strokeWidth="1.5" />
      {/* Center hub */}
      <circle cx={cx} cy={cy} r={8} fill="none" stroke={dark} strokeWidth="2" />
      {/* Spokes */}
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        return (
          <line
            key={angle}
            x1={cx + Math.cos(rad) * 9}
            y1={cy + Math.sin(rad) * 9}
            x2={cx + Math.cos(rad) * 22}
            y2={cy + Math.sin(rad) * 22}
            stroke={dark}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        );
      })}
      {/* Dots on outer ring */}
      {[0, 60, 120, 180, 240, 300].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        return <circle key={angle} cx={cx + Math.cos(rad) * 27} cy={cy + Math.sin(rad) * 27} r={3} fill={dark} />;
      })}
      {/* Stacked coin edge hint */}
      <path d={`M${cx - 38} ${cy + 6} a40 40 0 0 0 76 0`} fill="none" stroke={darken(color, 0.35)} strokeWidth="2.5" />
    </g>
  );
}

function PaperMoneyIcon({ cx, cy, color }: { cx: number; cy: number; color: string }) {
  const dark = darken(color, 0.2);
  const light = lighten(color, 0.3);
  const w = 80;
  const h = 44;
  return (
    <g>
      {/* Back note (offset) */}
      <rect x={cx - w / 2 + 6} y={cy - h / 2 - 5} width={w} height={h} rx={5} fill={lighten(color, 0.5)} stroke={dark} strokeWidth="1.5" />
      {/* Front note */}
      <rect x={cx - w / 2} y={cy - h / 2} width={w} height={h} rx={5} fill={light} stroke={dark} strokeWidth="2" />
      {/* Inner border */}
      <rect x={cx - w / 2 + 6} y={cy - h / 2 + 5} width={w - 12} height={h - 10} rx={3} fill="none" stroke={dark} strokeWidth="1" strokeDasharray="4 3" />
      {/* ₹ symbol */}
      <text
        x={cx}
        y={cy + 2}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="32"
        fontWeight="700"
        fontFamily="'DM Sans', system-ui, sans-serif"
        fill={dark}
      >
        {'\u20B9'}
      </text>
      {/* Corner decorations */}
      <circle cx={cx - w / 2 + 10} cy={cy - h / 2 + 10} r={4} fill="none" stroke={dark} strokeWidth="1" />
      <circle cx={cx + w / 2 - 10} cy={cy + h / 2 - 10} r={4} fill="none" stroke={dark} strokeWidth="1" />
    </g>
  );
}

function DigitalIcon({ cx, cy, color }: { cx: number; cy: number; color: string }) {
  const dark = darken(color, 0.2);
  const light = lighten(color, 0.35);
  const pw = 44;
  const ph = 68;
  const px = cx - pw / 2;
  const py = cy - ph / 2;
  return (
    <g>
      {/* Phone body */}
      <rect x={px} y={py} width={pw} height={ph} rx={8} fill={light} stroke={dark} strokeWidth="2" />
      {/* Screen */}
      <rect x={px + 4} y={py + 8} width={pw - 8} height={ph - 18} rx={3} fill="white" stroke={dark} strokeWidth="1" />
      {/* QR code pattern */}
      {(() => {
        const qx = px + 8;
        const qy = py + 14;
        const cs = 5;
        const pattern = [
          [1, 1, 1, 0, 1, 1],
          [1, 0, 1, 1, 0, 1],
          [1, 1, 1, 0, 1, 0],
          [0, 1, 0, 1, 0, 1],
          [1, 0, 1, 1, 1, 1],
          [1, 1, 0, 1, 0, 1],
        ];
        return pattern.flatMap((row, ri) =>
          row.map((cell, ci) =>
            cell ? <rect key={`${ri}-${ci}`} x={qx + ci * cs} y={qy + ri * cs} width={cs} height={cs} fill={dark} rx={1} /> : null
          )
        );
      })()}
      {/* Home bar */}
      <line x1={cx - 8} y1={py + ph - 5} x2={cx + 8} y2={py + ph - 5} stroke={dark} strokeWidth="2.5" strokeLinecap="round" />
      {/* Signal waves */}
      <path d={`M${cx + pw / 2 + 4} ${cy - 14} q6 -4 0 -10`} fill="none" stroke={withOpacity(color, 0.4)} strokeWidth="1.5" />
      <path d={`M${cx + pw / 2 + 4} ${cy - 8} q10 -8 0 -18`} fill="none" stroke={withOpacity(color, 0.25)} strokeWidth="1.5" />
    </g>
  );
}

const iconComponents = [BarterIcon, CommodityIcon, CoinIcon, PaperMoneyIcon, DigitalIcon];

// ── Main component ──

export default function MoneyTimelineSVG({
  color = '#F5A623',
  className = '',
}: MoneyTimelineSVGProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Serpentine: 3 top, 2 bottom
  const W = 640;
  const H = 420;
  const sideP = 70;
  const row1Y = 90;
  const row2Y = 310;
  const colSpan = (W - sideP * 2) / 2;

  const positions = [
    { cx: sideP, cy: row1Y },
    { cx: sideP + colSpan, cy: row1Y },
    { cx: sideP + colSpan * 2, cy: row1Y },
    { cx: sideP + colSpan * 2, cy: row2Y },
    { cx: sideP, cy: row2Y },
  ];

  // Curved serpentine path
  const p = positions;
  const midY = (row1Y + row2Y) / 2;
  const pathD = [
    `M ${p[0].cx} ${p[0].cy}`,
    `L ${p[1].cx} ${p[1].cy}`,
    `L ${p[2].cx} ${p[2].cy}`,
    `C ${p[2].cx} ${midY}, ${p[3].cx} ${midY}, ${p[3].cx} ${p[3].cy}`,
    `L ${p[4].cx} ${p[4].cy}`,
  ].join(' ');

  const R = 58; // icon background circle radius

  return (
    <div ref={containerRef} className={`w-full ${className}`}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Timeline showing the evolution of money from barter to digital payments"
        className="w-full h-auto"
      >
        {/* Background path */}
        <path d={pathD} stroke={withOpacity(color, 0.08)} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />

        {/* Animated path */}
        <path
          d={pathD}
          stroke={withOpacity(color, 0.3)}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          strokeDasharray="1800"
          strokeDashoffset={visible && !prefersReducedMotion ? 0 : 1800}
          style={{
            transition: prefersReducedMotion ? 'none' : 'stroke-dashoffset 2s cubic-bezier(0.25, 1, 0.5, 1)',
          }}
        />

        {/* Stage nodes */}
        {stages.map((stage, i) => {
          const { cx, cy } = positions[i];
          const delay = prefersReducedMotion ? 0 : 0.15 + i * 0.18;
          const Icon = iconComponents[i];

          return (
            <g
              key={stage.label}
              style={{
                opacity: visible || prefersReducedMotion ? 1 : 0,
                transform: visible || prefersReducedMotion ? 'translateY(0)' : 'translateY(14px)',
                transition: prefersReducedMotion
                  ? 'none'
                  : `opacity 0.5s cubic-bezier(0.25, 1, 0.5, 1) ${delay}s, transform 0.5s cubic-bezier(0.25, 1, 0.5, 1) ${delay}s`,
              }}
            >
              {/* Circle bg */}
              <circle cx={cx} cy={cy} r={R} fill={withOpacity(color, 0.06)} />
              <circle cx={cx} cy={cy} r={R} fill="none" stroke={withOpacity(color, 0.12)} strokeWidth="1.5" />

              {/* Icon */}
              <Icon cx={cx} cy={cy} color={color} />

              {/* Label */}
              <text
                x={cx}
                y={cy + R + 18}
                textAnchor="middle"
                fontSize="14"
                fontWeight="600"
                fontFamily="'DM Sans', system-ui, sans-serif"
                fill="#1A1A2E"
              >
                {stage.label}
              </text>

              {/* Date */}
              <text
                x={cx}
                y={cy + R + 34}
                textAnchor="middle"
                fontSize="11"
                fontWeight="400"
                fontFamily="'JetBrains Mono', monospace"
                fill="#596673"
              >
                {stage.date}
              </text>
            </g>
          );
        })}

        {/* Step numbers on the path */}
        {positions.map((pos, i) => (
          <g key={`num-${i}`}>
            <circle cx={pos.cx + R - 8} cy={pos.cy - R + 8} r={11} fill={color} />
            <text
              x={pos.cx + R - 8}
              y={pos.cy - R + 9}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="11"
              fontWeight="700"
              fontFamily="'DM Sans', system-ui, sans-serif"
              fill="white"
            >
              {i + 1}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
