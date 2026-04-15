'use client';

interface BankDepositFlowSVGProps {
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

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const headLen = 8;
  const ax = x2 - headLen * Math.cos(angle - Math.PI / 6);
  const ay = y2 - headLen * Math.sin(angle - Math.PI / 6);
  const bx = x2 - headLen * Math.cos(angle + Math.PI / 6);
  const by = y2 - headLen * Math.sin(angle + Math.PI / 6);

  return (
    <g>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d={`M${x2} ${y2} L${ax} ${ay} L${bx} ${by} Z`}
        fill={color}
      />
    </g>
  );
}

export default function BankDepositFlowSVG({
  color = '#F5A623',
  className = '',
}: BankDepositFlowSVGProps) {
  const svgWidth = 700;
  const svgHeight = 300;
  const dark = darken(color, 0.15);
  const light = lighten(color, 0.4);
  const veryLight = lighten(color, 0.7);
  const green = '#1B6B4A';

  // Positions for the 4 boxes
  const youBox = { x: 30, y: 95, w: 120, h: 70 };
  const bankBox = { x: 220, y: 70, w: 130, h: 120 };
  const reserveBox = { x: 440, y: 20, w: 120, h: 60 };
  const lendBox = { x: 440, y: 130, w: 120, h: 60 };
  const borrowerBox = { x: 580, y: 130, w: 100, h: 60 };

  return (
    <div className={`w-full ${className}`}>
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Flow diagram showing how a bank deposit of 10000 rupees is split into reserves and lending"
        className="w-full h-auto"
      >
        {/* Title */}
        <text
          x={svgWidth / 2}
          y={18}
          textAnchor="middle"
          fontSize="14"
          fontWeight="600"
          fontFamily="'DM Sans', system-ui, sans-serif"
          fill="#1A1A2E"
        >
          What Happens to Your Deposit?
        </text>

        {/* ── YOU BOX ── */}
        <rect
          x={youBox.x}
          y={youBox.y}
          width={youBox.w}
          height={youBox.h}
          rx={10}
          fill={veryLight}
          stroke={color}
          strokeWidth="1.5"
        />
        {/* Person icon */}
        <circle cx={youBox.x + 30} cy={youBox.y + 24} r={8} fill={withOpacity(color, 0.5)} />
        <line
          x1={youBox.x + 30}
          y1={youBox.y + 32}
          x2={youBox.x + 30}
          y2={youBox.y + 48}
          stroke={withOpacity(color, 0.5)}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <text
          x={youBox.x + 70}
          y={youBox.y + 27}
          textAnchor="middle"
          fontSize="12"
          fontWeight="600"
          fontFamily="'DM Sans', system-ui, sans-serif"
          fill="#1A1A2E"
        >
          You
        </text>
        <text
          x={youBox.x + 70}
          y={youBox.y + 46}
          textAnchor="middle"
          fontSize="13"
          fontWeight="700"
          fontFamily="'JetBrains Mono', monospace"
          fill={dark}
        >
          {'\u20B9'}10,000
        </text>

        {/* Arrow: You → Bank */}
        <Arrow
          x1={youBox.x + youBox.w + 4}
          y1={youBox.y + youBox.h / 2}
          x2={bankBox.x - 4}
          y2={bankBox.y + bankBox.h / 2}
          color={color}
        />
        <text
          x={(youBox.x + youBox.w + bankBox.x) / 2}
          y={youBox.y + youBox.h / 2 - 10}
          textAnchor="middle"
          fontSize="10"
          fontFamily="'DM Sans', system-ui, sans-serif"
          fill="#596673"
        >
          deposits
        </text>

        {/* ── BANK BOX ── */}
        <rect
          x={bankBox.x}
          y={bankBox.y}
          width={bankBox.w}
          height={bankBox.h}
          rx={12}
          fill={light}
          stroke={dark}
          strokeWidth="2"
        />
        {/* Bank icon - simple building */}
        <rect x={bankBox.x + 45} y={bankBox.y + 15} width={40} height={30} rx={2} fill="white" stroke={dark} strokeWidth="1" />
        <path
          d={`M${bankBox.x + 45} ${bankBox.y + 15} L${bankBox.x + 65} ${bankBox.y + 5} L${bankBox.x + 85} ${bankBox.y + 15}`}
          fill="white"
          stroke={dark}
          strokeWidth="1"
          strokeLinejoin="round"
        />
        {/* Columns */}
        <line x1={bankBox.x + 52} y1={bankBox.y + 20} x2={bankBox.x + 52} y2={bankBox.y + 43} stroke={dark} strokeWidth="1.5" />
        <line x1={bankBox.x + 65} y1={bankBox.y + 20} x2={bankBox.x + 65} y2={bankBox.y + 43} stroke={dark} strokeWidth="1.5" />
        <line x1={bankBox.x + 78} y1={bankBox.y + 20} x2={bankBox.x + 78} y2={bankBox.y + 43} stroke={dark} strokeWidth="1.5" />
        <text
          x={bankBox.x + bankBox.w / 2}
          y={bankBox.y + 65}
          textAnchor="middle"
          fontSize="13"
          fontWeight="700"
          fontFamily="'DM Sans', system-ui, sans-serif"
          fill="#1A1A2E"
        >
          Bank
        </text>
        <text
          x={bankBox.x + bankBox.w / 2}
          y={bankBox.y + 82}
          textAnchor="middle"
          fontSize="10"
          fontFamily="'DM Sans', system-ui, sans-serif"
          fill="#596673"
        >
          splits your money
        </text>

        {/* Arrow: Bank → Reserve */}
        <Arrow
          x1={bankBox.x + bankBox.w + 4}
          y1={bankBox.y + 30}
          x2={reserveBox.x - 4}
          y2={reserveBox.y + reserveBox.h / 2}
          color="#596673"
        />

        {/* Arrow: Bank → Lend */}
        <Arrow
          x1={bankBox.x + bankBox.w + 4}
          y1={bankBox.y + bankBox.h - 30}
          x2={lendBox.x - 4}
          y2={lendBox.y + lendBox.h / 2}
          color={green}
        />

        {/* ── RESERVE BOX ── */}
        <rect
          x={reserveBox.x}
          y={reserveBox.y}
          width={reserveBox.w}
          height={reserveBox.h}
          rx={8}
          fill="#F5F5F5"
          stroke="#C0C0C0"
          strokeWidth="1.5"
        />
        {/* Lock icon */}
        <rect x={reserveBox.x + 12} y={reserveBox.y + 20} width={14} height={12} rx={2} fill="#C0C0C0" />
        <path
          d={`M${reserveBox.x + 15} ${reserveBox.y + 20} v-5 a4 4 0 0 1 8 0 v5`}
          fill="none"
          stroke="#999"
          strokeWidth="1.5"
        />
        <text
          x={reserveBox.x + 72}
          y={reserveBox.y + 22}
          textAnchor="middle"
          fontSize="11"
          fontWeight="600"
          fontFamily="'DM Sans', system-ui, sans-serif"
          fill="#596673"
        >
          Reserve (9%)
        </text>
        <text
          x={reserveBox.x + 72}
          y={reserveBox.y + 42}
          textAnchor="middle"
          fontSize="14"
          fontWeight="700"
          fontFamily="'JetBrains Mono', monospace"
          fill="#596673"
        >
          {'\u20B9'}900
        </text>

        {/* ── LEND BOX ── */}
        <rect
          x={lendBox.x}
          y={lendBox.y}
          width={lendBox.w}
          height={lendBox.h}
          rx={8}
          fill={lighten(green, 0.85)}
          stroke={green}
          strokeWidth="1.5"
        />
        <text
          x={lendBox.x + lendBox.w / 2}
          y={lendBox.y + 22}
          textAnchor="middle"
          fontSize="11"
          fontWeight="600"
          fontFamily="'DM Sans', system-ui, sans-serif"
          fill={green}
        >
          Lends Out (91%)
        </text>
        <text
          x={lendBox.x + lendBox.w / 2}
          y={lendBox.y + 44}
          textAnchor="middle"
          fontSize="14"
          fontWeight="700"
          fontFamily="'JetBrains Mono', monospace"
          fill={darken(green, 0.1)}
        >
          {'\u20B9'}9,100
        </text>

        {/* Arrow: Lend → Borrower */}
        <Arrow
          x1={lendBox.x + lendBox.w + 4}
          y1={lendBox.y + lendBox.h / 2}
          x2={borrowerBox.x - 4}
          y2={borrowerBox.y + borrowerBox.h / 2}
          color={green}
        />

        {/* ── BORROWER BOX ── */}
        <rect
          x={borrowerBox.x}
          y={borrowerBox.y}
          width={borrowerBox.w}
          height={borrowerBox.h}
          rx={8}
          fill={lighten(green, 0.9)}
          stroke={darken(green, 0.1)}
          strokeWidth="1"
        />
        {/* Person icon */}
        <circle cx={borrowerBox.x + borrowerBox.w / 2} cy={borrowerBox.y + 18} r={7} fill={withOpacity(green, 0.4)} />
        <text
          x={borrowerBox.x + borrowerBox.w / 2}
          y={borrowerBox.y + 42}
          textAnchor="middle"
          fontSize="11"
          fontWeight="600"
          fontFamily="'DM Sans', system-ui, sans-serif"
          fill="#1A1A2E"
        >
          Borrower
        </text>

        {/* Interest return arrows (curved, going back) */}
        {/* Borrower pays interest → Bank */}
        <path
          d={`M${borrowerBox.x + borrowerBox.w / 2} ${borrowerBox.y + borrowerBox.h + 4}
              Q${borrowerBox.x + borrowerBox.w / 2} ${svgHeight - 45}
              ${bankBox.x + bankBox.w / 2} ${bankBox.y + bankBox.h + 4}`}
          fill="none"
          stroke={withOpacity(green, 0.5)}
          strokeWidth="1.5"
          strokeDasharray="5 3"
          strokeLinecap="round"
        />
        <text
          x={(borrowerBox.x + bankBox.x + bankBox.w) / 2}
          y={svgHeight - 36}
          textAnchor="middle"
          fontSize="10"
          fontFamily="'DM Sans', system-ui, sans-serif"
          fill={green}
        >
          pays interest (e.g. 10%)
        </text>

        {/* Bank pays you interest */}
        <path
          d={`M${bankBox.x + 20} ${bankBox.y + bankBox.h + 4}
              Q${(bankBox.x + youBox.x + youBox.w) / 2} ${svgHeight - 20}
              ${youBox.x + youBox.w / 2} ${youBox.y + youBox.h + 4}`}
          fill="none"
          stroke={withOpacity(color, 0.5)}
          strokeWidth="1.5"
          strokeDasharray="5 3"
          strokeLinecap="round"
        />
        <text
          x={(bankBox.x + youBox.x + youBox.w) / 2}
          y={svgHeight - 14}
          textAnchor="middle"
          fontSize="10"
          fontFamily="'DM Sans', system-ui, sans-serif"
          fill={dark}
        >
          you earn interest (e.g. 4%)
        </text>
      </svg>
    </div>
  );
}
