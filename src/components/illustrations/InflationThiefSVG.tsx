'use client';

interface InflationThiefSVGProps {
  color?: string;
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

function darken(hex: string, amount: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const r = Math.max(0, Math.round(rgb.r * (1 - amount)));
  const g = Math.max(0, Math.round(rgb.g * (1 - amount)));
  const b = Math.max(0, Math.round(rgb.b * (1 - amount)));
  return `rgb(${r}, ${g}, ${b})`;
}

function lighten(hex: string, amount: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const r = Math.min(255, Math.round(rgb.r + (255 - rgb.r) * amount));
  const g = Math.min(255, Math.round(rgb.g + (255 - rgb.g) * amount));
  const b = Math.min(255, Math.round(rgb.b + (255 - rgb.b) * amount));
  return `rgb(${r}, ${g}, ${b})`;
}

// Simple basket of goods icons at different scales
function BasketGroup({
  cx,
  cy,
  scale,
  color,
  items,
}: {
  cx: number;
  cy: number;
  scale: number;
  color: string;
  items: number; // number of items visible (5, 3, or 1)
}) {
  const dark = darken(color, 0.15);
  const light = lighten(color, 0.3);
  const s = scale;

  // Item positions (max 5 items in a row)
  const allItems = [
    // Milk carton
    (key: number) => (
      <g key={key}>
        <rect x={cx - 40 * s} y={cy - 16 * s} width={14 * s} height={20 * s} rx={2 * s} fill={light} stroke={dark} strokeWidth={s} />
        <rect x={cx - 38 * s} y={cy - 8 * s} width={10 * s} height={6 * s} rx={1 * s} fill="white" opacity="0.6" />
      </g>
    ),
    // Bread loaf
    (key: number) => (
      <g key={key}>
        <ellipse cx={cx - 16 * s} cy={cy} rx={10 * s} ry={8 * s} fill={lighten(color, 0.5)} stroke={dark} strokeWidth={s} />
        <line x1={cx - 22 * s} y1={cy - 2 * s} x2={cx - 10 * s} y2={cy - 2 * s} stroke={dark} strokeWidth={0.7 * s} />
        <line x1={cx - 20 * s} y1={cy + 2 * s} x2={cx - 12 * s} y2={cy + 2 * s} stroke={dark} strokeWidth={0.7 * s} />
      </g>
    ),
    // Apple
    (key: number) => (
      <g key={key}>
        <circle cx={cx + 4 * s} cy={cy} r={8 * s} fill={withOpacity('#e74c3c', 0.7)} stroke={darken('#e74c3c', 0.2)} strokeWidth={s} />
        <path d={`M${cx + 4 * s} ${cy - 8 * s} q2 -4 4 -3`} fill="none" stroke={darken('#27ae60', 0.1)} strokeWidth={1.2 * s} />
      </g>
    ),
    // Rice bag
    (key: number) => (
      <g key={key}>
        <rect x={cx + 18 * s} y={cy - 12 * s} width={14 * s} height={18 * s} rx={3 * s} fill={lighten(color, 0.45)} stroke={dark} strokeWidth={s} />
        <text x={cx + 25 * s} y={cy + 1 * s} textAnchor="middle" fontSize={7 * s} fontFamily="sans-serif" fill={dark}>R</text>
      </g>
    ),
    // Egg
    (key: number) => (
      <g key={key}>
        <ellipse cx={cx + 40 * s} cy={cy} rx={6 * s} ry={8 * s} fill="#FFF8E7" stroke={dark} strokeWidth={s} />
      </g>
    ),
  ];

  return (
    <g>
      {allItems.slice(0, items).map((renderItem, i) => renderItem(i))}
    </g>
  );
}

export default function InflationThiefSVG({
  color = '#F5A623',
  className = '',
}: InflationThiefSVGProps) {
  const svgWidth = 600;
  const svgHeight = 280;
  const dark = darken(color, 0.15);

  const periods = [
    { label: 'Today', items: 5, scale: 1.0, noteScale: 1.0 },
    { label: 'In 10 Years', items: 3, scale: 0.85, noteScale: 0.85 },
    { label: 'In 20 Years', items: 1, scale: 0.7, noteScale: 0.7 },
  ] as const;

  const sectionWidth = svgWidth / 3;

  return (
    <div className={`w-full ${className}`}>
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Illustration showing 100 rupees buying fewer goods over 10 and 20 years due to inflation"
        className="w-full h-auto"
      >
        {/* Title */}
        <text
          x={svgWidth / 2}
          y={24}
          textAnchor="middle"
          fontSize="15"
          fontWeight="600"
          fontFamily="'DM Sans', system-ui, sans-serif"
          fill="#1A1A2E"
        >
          {'\u20B9'}100 Buys Less Over Time
        </text>

        {periods.map((period, i) => {
          const cx = sectionWidth * i + sectionWidth / 2;
          const topY = 55;
          const basketY = 150;

          return (
            <g key={period.label}>
              {/* Section separator */}
              {i > 0 && (
                <line
                  x1={sectionWidth * i}
                  y1={40}
                  x2={sectionWidth * i}
                  y2={svgHeight - 40}
                  stroke="#E8E8E8"
                  strokeWidth="1"
                  strokeDasharray="4 3"
                />
              )}

              {/* Time period label */}
              <text
                x={cx}
                y={topY}
                textAnchor="middle"
                fontSize="12"
                fontWeight="600"
                fontFamily="'DM Sans', system-ui, sans-serif"
                fill="#1A1A2E"
              >
                {period.label}
              </text>

              {/* Rupee note - shrinks visually */}
              {(() => {
                const noteW = 60 * period.noteScale;
                const noteH = 30 * period.noteScale;
                const noteX = cx - noteW / 2;
                const noteY = topY + 10;
                return (
                  <g>
                    <rect
                      x={noteX}
                      y={noteY}
                      width={noteW}
                      height={noteH}
                      rx={4 * period.noteScale}
                      fill={lighten(color, 0.4)}
                      stroke={dark}
                      strokeWidth="1"
                    />
                    <rect
                      x={noteX + 3 * period.noteScale}
                      y={noteY + 3 * period.noteScale}
                      width={noteW - 6 * period.noteScale}
                      height={noteH - 6 * period.noteScale}
                      rx={2 * period.noteScale}
                      fill="none"
                      stroke={dark}
                      strokeWidth="0.5"
                      strokeDasharray="2 1.5"
                    />
                    <text
                      x={cx}
                      y={noteY + noteH / 2 + 1}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={12 * period.noteScale}
                      fontWeight="700"
                      fontFamily="'JetBrains Mono', monospace"
                      fill={dark}
                    >
                      {'\u20B9'}100
                    </text>
                  </g>
                );
              })()}

              {/* Arrow down to basket */}
              <line
                x1={cx}
                y1={topY + 10 + 30 * period.noteScale + 5}
                x2={cx}
                y2={basketY - 25}
                stroke={withOpacity(color, 0.4)}
                strokeWidth="1.5"
                strokeDasharray="4 3"
              />
              <text
                x={cx}
                y={basketY - 30}
                textAnchor="middle"
                fontSize="10"
                fontFamily="'DM Sans', system-ui, sans-serif"
                fill="#596673"
              >
                buys
              </text>

              {/* Basket of goods */}
              <BasketGroup
                cx={cx}
                cy={basketY}
                scale={period.scale}
                color={color}
                items={period.items}
              />

              {/* Item count label */}
              <text
                x={cx}
                y={basketY + 30}
                textAnchor="middle"
                fontSize="11"
                fontWeight="600"
                fontFamily="'JetBrains Mono', monospace"
                fill={i === 0 ? '#1B6B4A' : i === 1 ? color : '#e74c3c'}
              >
                {period.items === 5
                  ? '5 items'
                  : period.items === 3
                  ? '3 items'
                  : '1 item'}
              </text>
            </g>
          );
        })}

        {/* Downward trend line connecting the item counts */}
        <path
          d={`M${sectionWidth / 2} ${185}
              Q${svgWidth / 2} ${200}
              ${svgWidth - sectionWidth / 2} ${190}`}
          fill="none"
          stroke="rgba(231, 76, 60, 0.3)"
          strokeWidth="2"
          strokeDasharray="6 4"
          strokeLinecap="round"
        />

        {/* Caption */}
        <text
          x={svgWidth / 2}
          y={svgHeight - 16}
          textAnchor="middle"
          fontSize="11"
          fontFamily="'DM Sans', system-ui, sans-serif"
          fill="#596673"
        >
          Inflation silently steals your purchasing power
        </text>

        {/* Subtle red downward arrow on the right */}
        <path
          d={`M${svgWidth - 40} ${svgHeight - 60} l0 20 l-5 -7 m5 7 l5 -7`}
          fill="none"
          stroke="rgba(231, 76, 60, 0.4)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
