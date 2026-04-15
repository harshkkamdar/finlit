'use client';

interface ChapterIllustrationProps {
  chapterNumber: number;
  variant?: 'hero' | 'card' | 'icon';
  className?: string;
}

const CHAPTER_COLORS: Record<number, string> = {
  0: '#F5A623',
  1: '#2ECC71',
  2: '#4A90D9',
  3: '#8E44AD',
  4: '#1ABC9C',
  5: '#E74C3C',
  6: '#2980B9',
};

const CHAPTER_LABELS: Record<number, string> = {
  0: 'Money Basics',
  1: 'Stocks',
  2: 'Investing',
  3: 'Psychology',
  4: 'Budgeting',
  5: 'Credit',
  6: 'Fraud',
};

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

function withOpacity(hex: string, opacity: number): string {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

const variantDimensions = {
  hero: { width: 300, height: 200 },
  card: { width: 200, height: 150 },
  icon: { width: 48, height: 48 },
};

/** Ch 0: Overlapping coins/circles pattern */
function MoneyBasicsIllustration({ color, w, h, isIcon }: IllustrationContext) {
  if (isIcon) {
    return (
      <>
        <circle cx="18" cy="24" r="12" fill={withOpacity(color, 0.15)} stroke={color} strokeWidth="1.5" />
        <circle cx="30" cy="24" r="12" fill={withOpacity(color, 0.1)} stroke={color} strokeWidth="1.5" />
        <text x="18" y="27" textAnchor="middle" fontSize="9" fontWeight="700" fontFamily="'JetBrains Mono', monospace" fill={color}>$</text>
      </>
    );
  }

  const cx = w / 2;
  const cy = h / 2;
  const r1 = Math.min(w, h) * 0.22;
  const offsets = [
    { dx: -r1 * 0.55, dy: -r1 * 0.2, r: r1, op: 0.18 },
    { dx: r1 * 0.55, dy: -r1 * 0.2, r: r1, op: 0.14 },
    { dx: 0, dy: r1 * 0.35, r: r1 * 0.85, op: 0.1 },
    { dx: -r1 * 1.2, dy: r1 * 0.1, r: r1 * 0.5, op: 0.08 },
    { dx: r1 * 1.3, dy: -r1 * 0.3, r: r1 * 0.4, op: 0.06 },
  ];

  return (
    <>
      {offsets.map((o, i) => (
        <g key={i}>
          <circle
            cx={cx + o.dx}
            cy={cy + o.dy}
            r={o.r}
            fill={withOpacity(color, o.op)}
            stroke={withOpacity(color, 0.25)}
            strokeWidth="1.5"
          />
          {i < 3 && (
            <text
              x={cx + o.dx}
              y={cy + o.dy + 2}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={o.r * 0.55}
              fontWeight="700"
              fontFamily="'JetBrains Mono', monospace"
              fill={withOpacity(color, 0.35)}
            >
              $
            </text>
          )}
        </g>
      ))}
      {/* Decorative sparkle dots */}
      <circle cx={cx - r1 * 1.6} cy={cy - r1 * 0.8} r="2.5" fill={withOpacity(color, 0.2)} />
      <circle cx={cx + r1 * 1.5} cy={cy + r1 * 0.6} r="2" fill={withOpacity(color, 0.15)} />
      <circle cx={cx + r1 * 0.2} cy={cy - r1 * 1.1} r="1.5" fill={withOpacity(color, 0.12)} />
    </>
  );
}

/** Ch 1: Upward trending line chart */
function StocksIllustration({ color, w, h, isIcon }: IllustrationContext) {
  if (isIcon) {
    return (
      <>
        <polyline
          points="8,36 16,28 24,32 32,16 40,12"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <circle cx="40" cy="12" r="3" fill={color} />
      </>
    );
  }

  const padX = w * 0.12;
  const padY = h * 0.15;
  const chartW = w - padX * 2;
  const chartH = h - padY * 2;
  const bottom = h - padY;

  // Generate chart path
  const points = [
    { x: padX, y: bottom - chartH * 0.15 },
    { x: padX + chartW * 0.15, y: bottom - chartH * 0.35 },
    { x: padX + chartW * 0.28, y: bottom - chartH * 0.25 },
    { x: padX + chartW * 0.42, y: bottom - chartH * 0.5 },
    { x: padX + chartW * 0.58, y: bottom - chartH * 0.42 },
    { x: padX + chartW * 0.72, y: bottom - chartH * 0.65 },
    { x: padX + chartW * 0.88, y: bottom - chartH * 0.6 },
    { x: padX + chartW, y: bottom - chartH * 0.85 },
  ];

  const linePoints = points.map((p) => `${p.x},${p.y}`).join(' ');
  const areaPoints = `${padX},${bottom} ${linePoints} ${padX + chartW},${bottom}`;

  return (
    <>
      {/* Grid lines */}
      {[0.25, 0.5, 0.75].map((frac) => (
        <line
          key={frac}
          x1={padX}
          y1={bottom - chartH * frac}
          x2={padX + chartW}
          y2={bottom - chartH * frac}
          stroke={withOpacity(color, 0.08)}
          strokeWidth="1"
          strokeDasharray="4 4"
        />
      ))}

      {/* Area fill */}
      <polygon points={areaPoints} fill={withOpacity(color, 0.06)} />

      {/* Line */}
      <polyline
        points={linePoints}
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Endpoint dot */}
      <circle
        cx={points[points.length - 1].x}
        cy={points[points.length - 1].y}
        r="5"
        fill="white"
        stroke={color}
        strokeWidth="2"
      />

      {/* Baseline */}
      <line
        x1={padX}
        y1={bottom}
        x2={padX + chartW}
        y2={bottom}
        stroke={withOpacity(color, 0.2)}
        strokeWidth="1"
      />

      {/* Decorative dots along line */}
      {points.slice(0, -1).filter((_, i) => i % 2 === 1).map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill={withOpacity(color, 0.2)} />
      ))}
    </>
  );
}

/** Ch 2: Growing plant/seedling from circles */
function InvestingIllustration({ color, w, h, isIcon }: IllustrationContext) {
  if (isIcon) {
    return (
      <>
        {/* Pot */}
        <rect x="16" y="32" width="16" height="10" rx="2" fill={withOpacity(color, 0.2)} stroke={color} strokeWidth="1.2" />
        {/* Stem */}
        <line x1="24" y1="32" x2="24" y2="16" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
        {/* Leaves */}
        <ellipse cx="20" cy="18" rx="5" ry="3" fill={withOpacity(color, 0.25)} transform="rotate(-30, 20, 18)" />
        <ellipse cx="28" cy="22" rx="5" ry="3" fill={withOpacity(color, 0.2)} transform="rotate(30, 28, 22)" />
        <circle cx="24" cy="12" r="3" fill={color} opacity="0.3" />
      </>
    );
  }

  const cx = w / 2;
  const baseY = h * 0.72;

  // Soil/pot circles
  const potW = w * 0.25;
  const potH = h * 0.12;

  return (
    <>
      {/* Ground circles (nested) */}
      <ellipse cx={cx} cy={baseY + potH} rx={potW * 1.2} ry={potH * 0.6} fill={withOpacity(color, 0.06)} />
      <ellipse cx={cx} cy={baseY + potH * 0.6} rx={potW} ry={potH * 0.5} fill={withOpacity(color, 0.1)} />

      {/* Pot */}
      <rect
        x={cx - potW * 0.7}
        y={baseY}
        width={potW * 1.4}
        height={potH}
        rx="6"
        fill={withOpacity(color, 0.15)}
        stroke={withOpacity(color, 0.3)}
        strokeWidth="1.5"
      />

      {/* Stem */}
      <path
        d={`M${cx} ${baseY} Q${cx - 8} ${baseY - h * 0.2} ${cx} ${baseY - h * 0.38}`}
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Leaves */}
      <ellipse
        cx={cx - w * 0.08}
        cy={baseY - h * 0.22}
        rx={w * 0.06}
        ry={h * 0.04}
        fill={withOpacity(color, 0.2)}
        transform={`rotate(-35, ${cx - w * 0.08}, ${baseY - h * 0.22})`}
      />
      <ellipse
        cx={cx + w * 0.07}
        cy={baseY - h * 0.3}
        rx={w * 0.065}
        ry={h * 0.038}
        fill={withOpacity(color, 0.18)}
        transform={`rotate(30, ${cx + w * 0.07}, ${baseY - h * 0.3})`}
      />
      <ellipse
        cx={cx - w * 0.05}
        cy={baseY - h * 0.36}
        rx={w * 0.05}
        ry={h * 0.03}
        fill={withOpacity(color, 0.15)}
        transform={`rotate(-25, ${cx - w * 0.05}, ${baseY - h * 0.36})`}
      />

      {/* Top bloom circles */}
      <circle cx={cx} cy={baseY - h * 0.42} r={w * 0.04} fill={withOpacity(color, 0.25)} />
      <circle cx={cx - w * 0.035} cy={baseY - h * 0.46} r={w * 0.03} fill={withOpacity(color, 0.2)} />
      <circle cx={cx + w * 0.035} cy={baseY - h * 0.45} r={w * 0.025} fill={withOpacity(color, 0.18)} />

      {/* Floating particles */}
      <circle cx={cx + w * 0.2} cy={baseY - h * 0.5} r="3" fill={withOpacity(color, 0.12)} />
      <circle cx={cx - w * 0.18} cy={baseY - h * 0.45} r="2" fill={withOpacity(color, 0.1)} />
      <circle cx={cx + w * 0.15} cy={baseY - h * 0.25} r="2.5" fill={withOpacity(color, 0.08)} />
    </>
  );
}

/** Ch 3: Brain-shaped arrangement of dots */
function PsychologyIllustration({ color, w, h, isIcon }: IllustrationContext) {
  if (isIcon) {
    return (
      <>
        {/* Simplified brain outline with dots */}
        <circle cx="20" cy="22" r="8" fill="none" stroke={color} strokeWidth="1.5" opacity="0.3" />
        <circle cx="28" cy="22" r="8" fill="none" stroke={color} strokeWidth="1.5" opacity="0.3" />
        {[{ x: 20, y: 18 }, { x: 28, y: 18 }, { x: 24, y: 24 }, { x: 18, y: 26 }, { x: 30, y: 26 }].map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="2" fill={color} opacity={0.4 + i * 0.1} />
        ))}
      </>
    );
  }

  const cx = w / 2;
  const cy = h / 2 - 5;
  const brainR = Math.min(w, h) * 0.28;

  // Left hemisphere dots
  const leftDots = Array.from({ length: 14 }, (_, i) => {
    const angle = (i / 14) * Math.PI + Math.PI / 2;
    const r = brainR * (0.4 + (i % 3) * 0.2);
    return {
      x: cx - brainR * 0.15 + Math.cos(angle) * r,
      y: cy + Math.sin(angle) * r * 0.9,
      size: 2.5 + (i % 4) * 1.2,
      opacity: 0.12 + (i % 3) * 0.08,
    };
  });

  // Right hemisphere dots
  const rightDots = Array.from({ length: 14 }, (_, i) => {
    const angle = (i / 14) * Math.PI - Math.PI / 2;
    const r = brainR * (0.4 + (i % 3) * 0.2);
    return {
      x: cx + brainR * 0.15 + Math.cos(angle) * r,
      y: cy + Math.sin(angle) * r * 0.9,
      size: 2.5 + (i % 4) * 1.2,
      opacity: 0.12 + (i % 3) * 0.08,
    };
  });

  // Connection lines between hemispheres
  const connections = [
    { x1: cx - 8, y1: cy - brainR * 0.2, x2: cx + 8, y2: cy - brainR * 0.15 },
    { x1: cx - 6, y1: cy, x2: cx + 6, y2: cy + 5 },
    { x1: cx - 8, y1: cy + brainR * 0.2, x2: cx + 8, y2: cy + brainR * 0.25 },
  ];

  return (
    <>
      {/* Outer brain silhouette */}
      <ellipse
        cx={cx - brainR * 0.15}
        cy={cy}
        rx={brainR * 0.85}
        ry={brainR}
        fill="none"
        stroke={withOpacity(color, 0.1)}
        strokeWidth="1.5"
      />
      <ellipse
        cx={cx + brainR * 0.15}
        cy={cy}
        rx={brainR * 0.85}
        ry={brainR}
        fill="none"
        stroke={withOpacity(color, 0.1)}
        strokeWidth="1.5"
      />

      {/* Connection lines */}
      {connections.map((c, i) => (
        <line
          key={`conn-${i}`}
          x1={c.x1}
          y1={c.y1}
          x2={c.x2}
          y2={c.y2}
          stroke={withOpacity(color, 0.15)}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      ))}

      {/* Left dots */}
      {leftDots.map((d, i) => (
        <circle key={`l-${i}`} cx={d.x} cy={d.y} r={d.size} fill={color} opacity={d.opacity} />
      ))}

      {/* Right dots */}
      {rightDots.map((d, i) => (
        <circle key={`r-${i}`} cx={d.x} cy={d.y} r={d.size} fill={color} opacity={d.opacity} />
      ))}

      {/* Central highlight */}
      <circle cx={cx} cy={cy} r={brainR * 0.08} fill={color} opacity="0.3" />

      {/* Synaptic sparks */}
      <circle cx={cx - brainR * 0.9} cy={cy - brainR * 0.7} r="2" fill={withOpacity(color, 0.15)} />
      <circle cx={cx + brainR * 0.95} cy={cy - brainR * 0.5} r="1.5" fill={withOpacity(color, 0.12)} />
      <circle cx={cx + brainR * 0.1} cy={cy + brainR * 0.9} r="2" fill={withOpacity(color, 0.1)} />
    </>
  );
}

/** Ch 4: Grid/compartment pattern */
function BudgetingIllustration({ color, w, h, isIcon }: IllustrationContext) {
  if (isIcon) {
    return (
      <>
        <rect x="8" y="8" width="14" height="14" rx="3" fill={withOpacity(color, 0.2)} stroke={color} strokeWidth="1.2" />
        <rect x="26" y="8" width="14" height="14" rx="3" fill={withOpacity(color, 0.12)} stroke={color} strokeWidth="1.2" />
        <rect x="8" y="26" width="14" height="14" rx="3" fill={withOpacity(color, 0.12)} stroke={color} strokeWidth="1.2" />
        <rect x="26" y="26" width="14" height="14" rx="3" fill={withOpacity(color, 0.08)} stroke={color} strokeWidth="1.2" />
      </>
    );
  }

  const padX = w * 0.12;
  const padY = h * 0.1;
  const gridW = w - padX * 2;
  const gridH = h - padY * 2;
  const cols = 4;
  const rows = 3;
  const gap = 8;
  const cellW = (gridW - gap * (cols - 1)) / cols;
  const cellH = (gridH - gap * (rows - 1)) / rows;

  const fills = [0.18, 0.12, 0.08, 0.14, 0.06, 0.1, 0.16, 0.04, 0.12, 0.08, 0.14, 0.06];

  return (
    <>
      {Array.from({ length: rows }, (_, row) =>
        Array.from({ length: cols }, (_, col) => {
          const x = padX + col * (cellW + gap);
          const y = padY + row * (cellH + gap);
          const idx = row * cols + col;

          return (
            <g key={`${row}-${col}`}>
              <rect
                x={x}
                y={y}
                width={cellW}
                height={cellH}
                rx="8"
                fill={withOpacity(color, fills[idx] || 0.08)}
                stroke={withOpacity(color, 0.15)}
                strokeWidth="1"
              />
              {/* Percentage label */}
              <text
                x={x + cellW / 2}
                y={y + cellH / 2 + 1}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="10"
                fontWeight="500"
                fontFamily="'JetBrains Mono', monospace"
                fill={withOpacity(color, 0.4)}
              >
                {Math.round((fills[idx] || 0.08) * 100)}%
              </text>
            </g>
          );
        })
      )}
    </>
  );
}

/** Ch 5: Card shape with score meter */
function CreditIllustration({ color, w, h, isIcon }: IllustrationContext) {
  if (isIcon) {
    return (
      <>
        <rect x="6" y="12" width="36" height="24" rx="4" fill={withOpacity(color, 0.12)} stroke={color} strokeWidth="1.5" />
        <rect x="10" y="18" width="12" height="6" rx="1.5" fill={withOpacity(color, 0.2)} />
        <line x1="10" y1="28" x2="38" y2="28" stroke={withOpacity(color, 0.15)} strokeWidth="1.5" />
      </>
    );
  }

  const cx = w / 2;
  const cardW = w * 0.55;
  const cardH = cardW * 0.63;
  const cardX = cx - cardW / 2;
  const cardY = h * 0.15;

  // Small gauge below card
  const gaugeY = cardY + cardH + h * 0.08;
  const gaugeR = w * 0.12;
  const gaugeCx = cx;

  return (
    <>
      {/* Card shadow */}
      <rect
        x={cardX + 4}
        y={cardY + 4}
        width={cardW}
        height={cardH}
        rx="12"
        fill={withOpacity(color, 0.06)}
      />

      {/* Card body */}
      <rect
        x={cardX}
        y={cardY}
        width={cardW}
        height={cardH}
        rx="12"
        fill={withOpacity(color, 0.08)}
        stroke={withOpacity(color, 0.25)}
        strokeWidth="1.5"
      />

      {/* Chip */}
      <rect
        x={cardX + cardW * 0.1}
        y={cardY + cardH * 0.25}
        width={cardW * 0.16}
        height={cardH * 0.22}
        rx="3"
        fill={withOpacity(color, 0.25)}
        stroke={withOpacity(color, 0.35)}
        strokeWidth="1"
      />

      {/* Card number dots */}
      {[0, 1, 2, 3].map((group) => (
        <g key={group}>
          {[0, 1, 2, 3].map((dot) => (
            <circle
              key={dot}
              cx={cardX + cardW * 0.12 + group * cardW * 0.22 + dot * 6}
              cy={cardY + cardH * 0.6}
              r="2"
              fill={withOpacity(color, group === 3 ? 0.3 : 0.15)}
            />
          ))}
        </g>
      ))}

      {/* Card name line */}
      <rect
        x={cardX + cardW * 0.1}
        y={cardY + cardH * 0.78}
        width={cardW * 0.4}
        height="3"
        rx="1.5"
        fill={withOpacity(color, 0.15)}
      />

      {/* Score meter arc */}
      <path
        d={`M${gaugeCx - gaugeR} ${gaugeY} A${gaugeR} ${gaugeR} 0 0 1 ${gaugeCx + gaugeR} ${gaugeY}`}
        stroke={withOpacity(color, 0.12)}
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d={`M${gaugeCx - gaugeR} ${gaugeY} A${gaugeR} ${gaugeR} 0 0 1 ${gaugeCx + gaugeR * 0.5} ${gaugeY - gaugeR * 0.866}`}
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
      />

      {/* Score label */}
      <text
        x={gaugeCx}
        y={gaugeY + 14}
        textAnchor="middle"
        fontSize="10"
        fontWeight="500"
        fontFamily="'JetBrains Mono', monospace"
        fill={withOpacity(color, 0.5)}
      >
        750
      </text>
    </>
  );
}

/** Ch 6: Shield shape */
function FraudIllustration({ color, w, h, isIcon }: IllustrationContext) {
  if (isIcon) {
    return (
      <>
        <path
          d="M24 8 L38 16 L38 28 Q38 38 24 42 Q10 38 10 28 L10 16 Z"
          fill={withOpacity(color, 0.12)}
          stroke={color}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M18 24 l4 4 8-8"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </>
    );
  }

  const cx = w / 2;
  const shieldTop = h * 0.1;
  const shieldW = w * 0.35;
  const shieldH = h * 0.7;

  const d = `
    M${cx} ${shieldTop}
    L${cx + shieldW} ${shieldTop + shieldH * 0.2}
    L${cx + shieldW} ${shieldTop + shieldH * 0.55}
    Q${cx + shieldW} ${shieldTop + shieldH * 0.85} ${cx} ${shieldTop + shieldH}
    Q${cx - shieldW} ${shieldTop + shieldH * 0.85} ${cx - shieldW} ${shieldTop + shieldH * 0.55}
    L${cx - shieldW} ${shieldTop + shieldH * 0.2}
    Z
  `;

  return (
    <>
      {/* Shield shadow */}
      <path
        d={d}
        fill={withOpacity(color, 0.04)}
        transform="translate(3, 3)"
      />

      {/* Shield body */}
      <path
        d={d}
        fill={withOpacity(color, 0.08)}
        stroke={withOpacity(color, 0.25)}
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Inner shield accent */}
      <path
        d={`
          M${cx} ${shieldTop + shieldH * 0.12}
          L${cx + shieldW * 0.7} ${shieldTop + shieldH * 0.28}
          L${cx + shieldW * 0.7} ${shieldTop + shieldH * 0.52}
          Q${cx + shieldW * 0.7} ${shieldTop + shieldH * 0.75} ${cx} ${shieldTop + shieldH * 0.88}
          Q${cx - shieldW * 0.7} ${shieldTop + shieldH * 0.75} ${cx - shieldW * 0.7} ${shieldTop + shieldH * 0.52}
          L${cx - shieldW * 0.7} ${shieldTop + shieldH * 0.28}
          Z
        `}
        fill="none"
        stroke={withOpacity(color, 0.15)}
        strokeWidth="1"
        strokeLinejoin="round"
      />

      {/* Checkmark */}
      <path
        d={`M${cx - shieldW * 0.25} ${shieldTop + shieldH * 0.48} l${shieldW * 0.2} ${shieldH * 0.1} ${shieldW * 0.35}-${shieldH * 0.2}`}
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.5"
      />

      {/* Lock icon hint above checkmark */}
      <circle
        cx={cx}
        cy={shieldTop + shieldH * 0.3}
        r={shieldW * 0.12}
        fill="none"
        stroke={withOpacity(color, 0.2)}
        strokeWidth="1.5"
      />

      {/* Radiating lines */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const innerDist = Math.min(w, h) * 0.35;
        const outerDist = innerDist + 8;
        return (
          <line
            key={angle}
            x1={cx + Math.cos(rad) * innerDist}
            y1={shieldTop + shieldH * 0.45 + Math.sin(rad) * innerDist * 0.6}
            x2={cx + Math.cos(rad) * outerDist}
            y2={shieldTop + shieldH * 0.45 + Math.sin(rad) * outerDist * 0.6}
            stroke={withOpacity(color, 0.08)}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        );
      })}
    </>
  );
}

interface IllustrationContext {
  color: string;
  w: number;
  h: number;
  isIcon: boolean;
}

const CHAPTER_ILLUSTRATIONS: Record<
  number,
  (ctx: IllustrationContext) => React.ReactElement
> = {
  0: MoneyBasicsIllustration,
  1: StocksIllustration,
  2: InvestingIllustration,
  3: PsychologyIllustration,
  4: BudgetingIllustration,
  5: CreditIllustration,
  6: FraudIllustration,
};

export default function ChapterIllustration({
  chapterNumber,
  variant = 'card',
  className = '',
}: ChapterIllustrationProps) {
  const color = CHAPTER_COLORS[chapterNumber] || '#596673';
  const label = CHAPTER_LABELS[chapterNumber] || 'Chapter';
  const { width, height } = variantDimensions[variant];
  const isIcon = variant === 'icon';

  const Illustration = CHAPTER_ILLUSTRATIONS[chapterNumber];

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={`${label} illustration`}
      className={`${isIcon ? 'w-12 h-12' : 'w-full h-auto'} ${className}`}
      style={
        isIcon
          ? undefined
          : { maxWidth: width, maxHeight: height }
      }
    >
      {!isIcon && (
        <rect
          x="0"
          y="0"
          width={width}
          height={height}
          rx="12"
          fill={withOpacity(color, 0.04)}
        />
      )}

      {Illustration ? (
        <Illustration color={color} w={width} h={height} isIcon={isIcon} />
      ) : null}
    </svg>
  );
}
