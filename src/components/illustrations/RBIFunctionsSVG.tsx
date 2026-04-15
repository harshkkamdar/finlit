'use client';

interface RBIFunctionsSVGProps {
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

// Icon: Currency / banknote with print press feel
function CurrencyIcon({ cx, cy, color }: { cx: number; cy: number; color: string }) {
  const dark = darken(color, 0.15);
  const light = lighten(color, 0.35);
  return (
    <g>
      {/* Back note */}
      <rect x={cx - 16} y={cy - 13} width={34} height={20} rx={3} fill={lighten(color, 0.5)} stroke={dark} strokeWidth="0.8" />
      {/* Front note */}
      <rect x={cx - 19} y={cy - 10} width={34} height={20} rx={3} fill={light} stroke={dark} strokeWidth="1" />
      {/* Rupee symbol */}
      <text
        x={cx - 2}
        y={cy + 3}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="14"
        fontWeight="700"
        fontFamily="sans-serif"
        fill={dark}
      >
        {'\u20B9'}
      </text>
      {/* Small sparkle to indicate "printing" */}
      <path d={`M${cx + 12} ${cy - 12} l1.5 -3 l1.5 3 l3 1.5 l-3 1.5 l-1.5 3 l-1.5 -3 l-3 -1.5 z`} fill={color} />
    </g>
  );
}

// Icon: Interest rate gauge
function RateIcon({ cx, cy, color }: { cx: number; cy: number; color: string }) {
  const dark = darken(color, 0.15);
  return (
    <g>
      {/* Semi-circle gauge */}
      <path
        d={`M${cx - 18} ${cy + 6} A18 18 0 0 1 ${cx + 18} ${cy + 6}`}
        fill="none"
        stroke={lighten(color, 0.3)}
        strokeWidth="5"
        strokeLinecap="round"
      />
      {/* Active portion */}
      <path
        d={`M${cx - 18} ${cy + 6} A18 18 0 0 1 ${cx + 4} ${cy - 16}`}
        fill="none"
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
      />
      {/* Needle */}
      <line
        x1={cx}
        y1={cy + 6}
        x2={cx + 2}
        y2={cy - 12}
        stroke={dark}
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Center dot */}
      <circle cx={cx} cy={cy + 6} r={3} fill={dark} />
      {/* % label */}
      <text
        x={cx}
        y={cy + 20}
        textAnchor="middle"
        fontSize="8"
        fontWeight="600"
        fontFamily="'JetBrains Mono', monospace"
        fill={dark}
      >
        6.5%
      </text>
    </g>
  );
}

// Icon: Bank regulation shield
function RegulateIcon({ cx, cy, color }: { cx: number; cy: number; color: string }) {
  const dark = darken(color, 0.15);
  return (
    <g>
      {/* Shield shape */}
      <path
        d={`M${cx} ${cy - 18}
            L${cx + 16} ${cy - 10}
            L${cx + 16} ${cy + 2}
            Q${cx + 16} ${cy + 16} ${cx} ${cy + 22}
            Q${cx - 16} ${cy + 16} ${cx - 16} ${cy + 2}
            L${cx - 16} ${cy - 10} Z`}
        fill={lighten(color, 0.4)}
        stroke={dark}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      {/* Checkmark inside */}
      <path
        d={`M${cx - 6} ${cy + 2} l4 5 l10 -12`}
        fill="none"
        stroke={dark}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
}

// Icon: Forex / globe with currency arrows
function ForexIcon({ cx, cy, color }: { cx: number; cy: number; color: string }) {
  const dark = darken(color, 0.15);
  return (
    <g>
      {/* Globe */}
      <circle cx={cx} cy={cy} r={16} fill={lighten(color, 0.45)} stroke={dark} strokeWidth="1.2" />
      {/* Latitude lines */}
      <ellipse cx={cx} cy={cy} rx={16} ry={6} fill="none" stroke={dark} strokeWidth="0.6" />
      <ellipse cx={cx} cy={cy} rx={6} ry={16} fill="none" stroke={dark} strokeWidth="0.6" />
      {/* Meridian */}
      <line x1={cx - 16} y1={cy} x2={cx + 16} y2={cy} stroke={dark} strokeWidth="0.6" />
      {/* Currency arrows around the globe */}
      {/* $ arrow */}
      <text
        x={cx - 20}
        y={cy - 14}
        fontSize="8"
        fontWeight="700"
        fontFamily="sans-serif"
        fill={color}
      >
        $
      </text>
      <text
        x={cx + 16}
        y={cy + 20}
        fontSize="8"
        fontWeight="700"
        fontFamily="sans-serif"
        fill={color}
      >
        {'\u20B9'}
      </text>
      {/* Circular arrows */}
      <path
        d={`M${cx + 20} ${cy - 6} a22 22 0 0 1 -2 16`}
        fill="none"
        stroke={withOpacity(color, 0.6)}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d={`M${cx - 20} ${cy + 6} a22 22 0 0 1 2 -16`}
        fill="none"
        stroke={withOpacity(color, 0.6)}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </g>
  );
}

const functions = [
  {
    title: 'Prints Currency',
    subtitle: 'Issues banknotes',
    Icon: CurrencyIcon,
  },
  {
    title: 'Sets Repo Rate',
    subtitle: 'Controls interest rates',
    Icon: RateIcon,
  },
  {
    title: 'Regulates Banks',
    subtitle: 'Ensures stability',
    Icon: RegulateIcon,
  },
  {
    title: 'Manages Forex',
    subtitle: 'Foreign reserves',
    Icon: ForexIcon,
  },
] as const;

export default function RBIFunctionsSVG({
  color = '#F5A623',
  className = '',
}: RBIFunctionsSVGProps) {
  const svgWidth = 480;
  const svgHeight = 340;
  const dark = darken(color, 0.15);

  const gridCols = 2;
  const gridRows = 2;
  const cellWidth = (svgWidth - 40) / gridCols;
  const cellHeight = 120;
  const gridTop = 60;
  const gridLeft = 20;

  return (
    <div className={`w-full ${className}`}>
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Four key functions of the Reserve Bank of India: prints currency, sets repo rate, regulates banks, and manages forex reserves"
        className="w-full h-auto"
      >
        {/* Title */}
        <text
          x={svgWidth / 2}
          y={22}
          textAnchor="middle"
          fontSize="15"
          fontWeight="600"
          fontFamily="'DM Sans', system-ui, sans-serif"
          fill="#1A1A2E"
        >
          Reserve Bank of India (RBI)
        </text>
        <text
          x={svgWidth / 2}
          y={42}
          textAnchor="middle"
          fontSize="11"
          fontFamily="'DM Sans', system-ui, sans-serif"
          fill="#596673"
        >
          4 Key Functions
        </text>

        {/* Grid cells */}
        {functions.map((fn, i) => {
          const col = i % gridCols;
          const row = Math.floor(i / gridCols);
          const cellX = gridLeft + col * cellWidth;
          const cellY = gridTop + row * cellHeight;
          const centerX = cellX + cellWidth / 2;

          return (
            <g key={fn.title}>
              {/* Cell background */}
              <rect
                x={cellX + 4}
                y={cellY + 4}
                width={cellWidth - 8}
                height={cellHeight - 8}
                rx={12}
                fill={lighten(color, 0.85)}
                stroke={withOpacity(color, 0.3)}
                strokeWidth="1"
              />

              {/* Icon */}
              <fn.Icon cx={centerX} cy={cellY + 44} color={color} />

              {/* Title */}
              <text
                x={centerX}
                y={cellY + 80}
                textAnchor="middle"
                fontSize="12"
                fontWeight="700"
                fontFamily="'DM Sans', system-ui, sans-serif"
                fill="#1A1A2E"
              >
                {fn.title}
              </text>

              {/* Subtitle */}
              <text
                x={centerX}
                y={cellY + 96}
                textAnchor="middle"
                fontSize="10"
                fontFamily="'DM Sans', system-ui, sans-serif"
                fill="#596673"
              >
                {fn.subtitle}
              </text>
            </g>
          );
        })}

        {/* Divider lines */}
        {/* Vertical divider */}
        <line
          x1={svgWidth / 2}
          y1={gridTop + 10}
          x2={svgWidth / 2}
          y2={gridTop + gridRows * cellHeight - 10}
          stroke={withOpacity(color, 0.15)}
          strokeWidth="1"
        />
        {/* Horizontal divider */}
        <line
          x1={gridLeft + 10}
          y1={gridTop + cellHeight}
          x2={svgWidth - gridLeft - 10}
          y2={gridTop + cellHeight}
          stroke={withOpacity(color, 0.15)}
          strokeWidth="1"
        />

        {/* Central RBI dot */}
        <circle
          cx={svgWidth / 2}
          cy={gridTop + cellHeight}
          r={12}
          fill="white"
          stroke={color}
          strokeWidth="1.5"
        />
        <text
          x={svgWidth / 2}
          y={gridTop + cellHeight + 1}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="7"
          fontWeight="700"
          fontFamily="'DM Sans', system-ui, sans-serif"
          fill={dark}
        >
          RBI
        </text>

        {/* Caption */}
        <text
          x={svgWidth / 2}
          y={svgHeight - 12}
          textAnchor="middle"
          fontSize="11"
          fontFamily="'DM Sans', system-ui, sans-serif"
          fill="#596673"
        >
          India&apos;s central bank — the banker to all banks
        </text>
      </svg>
    </div>
  );
}
