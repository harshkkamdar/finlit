'use client';

interface InterestSpreadSVGProps {
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

export default function InterestSpreadSVG({
  color = '#F5A623',
  className = '',
}: InterestSpreadSVGProps) {
  const svgWidth = 520;
  const svgHeight = 300;
  const green = '#1B6B4A';
  const dark = darken(color, 0.15);

  // Bar dimensions
  const barWidth = 80;
  const maxBarHeight = 180;
  const barBottom = 240;
  const depositBarHeight = (4 / 10) * maxBarHeight; // 4% of 10% max
  const lendBarHeight = (10 / 10) * maxBarHeight;  // 10% of 10% max
  const depositBarX = 100;
  const lendBarX = 320;

  // Profit zone
  const profitHeight = lendBarHeight - depositBarHeight;

  return (
    <div className={`w-full ${className}`}>
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Diagram showing interest rate spread: bank pays 4 percent on deposits and charges 10 percent on loans, keeping a 6 percent profit"
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
          The Interest Rate Spread
        </text>

        {/* ── LEFT BAR: Deposit Rate (4%) ── */}
        <rect
          x={depositBarX}
          y={barBottom - depositBarHeight}
          width={barWidth}
          height={depositBarHeight}
          rx={6}
          fill={lighten(color, 0.3)}
          stroke={dark}
          strokeWidth="1.5"
        />
        {/* Rate label inside bar */}
        <text
          x={depositBarX + barWidth / 2}
          y={barBottom - depositBarHeight / 2 + 2}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="22"
          fontWeight="800"
          fontFamily="'JetBrains Mono', monospace"
          fill={dark}
        >
          4%
        </text>
        {/* Label below bar */}
        <text
          x={depositBarX + barWidth / 2}
          y={barBottom + 18}
          textAnchor="middle"
          fontSize="12"
          fontWeight="600"
          fontFamily="'DM Sans', system-ui, sans-serif"
          fill="#1A1A2E"
        >
          Bank Pays You
        </text>
        <text
          x={depositBarX + barWidth / 2}
          y={barBottom + 34}
          textAnchor="middle"
          fontSize="10"
          fontFamily="'DM Sans', system-ui, sans-serif"
          fill="#596673"
        >
          (Deposit Rate)
        </text>
        {/* Label above bar */}
        <text
          x={depositBarX + barWidth / 2}
          y={barBottom - depositBarHeight - 12}
          textAnchor="middle"
          fontSize="11"
          fontFamily="'DM Sans', system-ui, sans-serif"
          fill="#596673"
        >
          You deposit
        </text>

        {/* ── RIGHT BAR: Lending Rate (10%) ── */}
        {/* Base portion matching deposit rate */}
        <rect
          x={lendBarX}
          y={barBottom - depositBarHeight}
          width={barWidth}
          height={depositBarHeight}
          fill={lighten(color, 0.3)}
          stroke={dark}
          strokeWidth="1.5"
        />
        {/* Profit portion */}
        <rect
          x={lendBarX}
          y={barBottom - lendBarHeight}
          width={barWidth}
          height={profitHeight}
          rx={6}
          fill={lighten(green, 0.6)}
          stroke={darken(green, 0.1)}
          strokeWidth="1.5"
        />
        {/* Bottom corners fix - fill the gap between rounded top and straight bottom */}
        <rect
          x={lendBarX + 1}
          y={barBottom - depositBarHeight - 1}
          width={barWidth - 2}
          height={4}
          fill={lighten(green, 0.6)}
        />
        {/* Bottom rect rounded */}
        <rect
          x={lendBarX}
          y={barBottom - depositBarHeight}
          width={barWidth}
          height={depositBarHeight}
          rx={0}
          ry={0}
          fill={lighten(color, 0.3)}
          stroke={dark}
          strokeWidth="1.5"
        />
        {/* Bottom rounded corners */}
        <rect
          x={lendBarX}
          y={barBottom - depositBarHeight}
          width={barWidth}
          height={depositBarHeight}
          rx={0}
          fill="none"
          stroke="none"
        />
        {/* Full outer border */}
        <rect
          x={lendBarX}
          y={barBottom - lendBarHeight}
          width={barWidth}
          height={lendBarHeight}
          rx={6}
          fill="none"
          stroke={darken(green, 0.1)}
          strokeWidth="1.5"
        />

        {/* Rate label */}
        <text
          x={lendBarX + barWidth / 2}
          y={barBottom - lendBarHeight / 2 + 5}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="22"
          fontWeight="800"
          fontFamily="'JetBrains Mono', monospace"
          fill={darken(green, 0.15)}
        >
          10%
        </text>
        {/* Label below */}
        <text
          x={lendBarX + barWidth / 2}
          y={barBottom + 18}
          textAnchor="middle"
          fontSize="12"
          fontWeight="600"
          fontFamily="'DM Sans', system-ui, sans-serif"
          fill="#1A1A2E"
        >
          Borrower Pays
        </text>
        <text
          x={lendBarX + barWidth / 2}
          y={barBottom + 34}
          textAnchor="middle"
          fontSize="10"
          fontFamily="'DM Sans', system-ui, sans-serif"
          fill="#596673"
        >
          (Lending Rate)
        </text>
        {/* Label above bar */}
        <text
          x={lendBarX + barWidth / 2}
          y={barBottom - lendBarHeight - 12}
          textAnchor="middle"
          fontSize="11"
          fontFamily="'DM Sans', system-ui, sans-serif"
          fill="#596673"
        >
          Bank lends
        </text>

        {/* ── PROFIT BRACKET in the middle ── */}
        {(() => {
          const bracketX = depositBarX + barWidth + 20;
          const bracketRight = lendBarX - 20;
          const midX = (bracketX + bracketRight) / 2;
          const profitTop = barBottom - lendBarHeight;
          const profitBottom = barBottom - depositBarHeight;
          const midY = (profitTop + profitBottom) / 2;

          return (
            <g>
              {/* Dashed lines showing the gap */}
              <line
                x1={depositBarX + barWidth + 5}
                y1={barBottom - depositBarHeight}
                x2={lendBarX - 5}
                y2={barBottom - depositBarHeight}
                stroke={withOpacity(green, 0.3)}
                strokeWidth="1"
                strokeDasharray="4 3"
              />
              <line
                x1={lendBarX - 5}
                y1={barBottom - lendBarHeight}
                x2={depositBarX + barWidth + 5}
                y2={barBottom - lendBarHeight}
                stroke={withOpacity(green, 0.3)}
                strokeWidth="1"
                strokeDasharray="4 3"
              />

              {/* Bracket */}
              <path
                d={`M${bracketX} ${profitTop + 5}
                    L${midX - 2} ${profitTop + 5}
                    L${midX} ${profitTop}
                    L${midX + 2} ${profitTop + 5}
                    L${bracketRight} ${profitTop + 5}`}
                fill="none"
                stroke={green}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d={`M${bracketX} ${profitBottom - 5}
                    L${midX - 2} ${profitBottom - 5}
                    L${midX} ${profitBottom}
                    L${midX + 2} ${profitBottom - 5}
                    L${bracketRight} ${profitBottom - 5}`}
                fill="none"
                stroke={green}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Profit label */}
              <rect
                x={midX - 38}
                y={midY - 22}
                width={76}
                height={44}
                rx={8}
                fill={lighten(green, 0.85)}
                stroke={green}
                strokeWidth="1.5"
              />
              <text
                x={midX}
                y={midY - 5}
                textAnchor="middle"
                fontSize="20"
                fontWeight="800"
                fontFamily="'JetBrains Mono', monospace"
                fill={darken(green, 0.15)}
              >
                6%
              </text>
              <text
                x={midX}
                y={midY + 14}
                textAnchor="middle"
                fontSize="10"
                fontWeight="600"
                fontFamily="'DM Sans', system-ui, sans-serif"
                fill={green}
              >
                Bank Profit
              </text>
            </g>
          );
        })()}

        {/* Caption */}
        <text
          x={svgWidth / 2}
          y={svgHeight - 8}
          textAnchor="middle"
          fontSize="11"
          fontFamily="'DM Sans', system-ui, sans-serif"
          fill="#596673"
        >
          The gap between these rates is how banks make money
        </text>
      </svg>
    </div>
  );
}
