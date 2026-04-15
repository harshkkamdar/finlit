'use client';

interface SamosaPriceChartProps {
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

const dataPoints = [
  { year: '1990', price: 2 },
  { year: '2000', price: 5 },
  { year: '2010', price: 10 },
  { year: '2024', price: 15 },
] as const;

export default function SamosaPriceChart({
  color = '#F5A623',
  className = '',
}: SamosaPriceChartProps) {
  const svgWidth = 480;
  const svgHeight = 280;
  const chartLeft = 80;
  const chartRight = svgWidth - 40;
  const chartTop = 50;
  const chartBottom = 210;
  const chartWidth = chartRight - chartLeft;
  const chartHeight = chartBottom - chartTop;

  const maxPrice = 15;
  const barCount = dataPoints.length;
  const barGap = 24;
  const barWidth = (chartWidth - barGap * (barCount + 1)) / barCount;

  const dark = darken(color, 0.15);

  return (
    <div className={`w-full ${className}`}>
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Bar chart showing samosa prices rising from 2 rupees in 1990 to 15 rupees in 2024"
        className="w-full h-auto"
      >
        {/* Title */}
        <text
          x={svgWidth / 2}
          y={28}
          textAnchor="middle"
          fontSize="15"
          fontWeight="600"
          fontFamily="'DM Sans', system-ui, sans-serif"
          fill="#1A1A2E"
        >
          Price of a Samosa Over Time
        </text>

        {/* Y-axis line */}
        <line
          x1={chartLeft}
          y1={chartTop}
          x2={chartLeft}
          y2={chartBottom}
          stroke="#E0E0E0"
          strokeWidth="1"
        />

        {/* X-axis line */}
        <line
          x1={chartLeft}
          y1={chartBottom}
          x2={chartRight}
          y2={chartBottom}
          stroke="#E0E0E0"
          strokeWidth="1"
        />

        {/* Y-axis gridlines and labels */}
        {[0, 5, 10, 15].map((val) => {
          const y = chartBottom - (val / maxPrice) * chartHeight;
          return (
            <g key={val}>
              <line
                x1={chartLeft}
                y1={y}
                x2={chartRight}
                y2={y}
                stroke={val === 0 ? 'transparent' : '#F0F0F0'}
                strokeWidth="1"
                strokeDasharray="4 3"
              />
              <text
                x={chartLeft - 10}
                y={y + 1}
                textAnchor="end"
                dominantBaseline="central"
                fontSize="11"
                fontFamily="'JetBrains Mono', monospace"
                fill="#596673"
              >
                {`\u20B9${val}`}
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {dataPoints.map((d, i) => {
          const barHeight = (d.price / maxPrice) * chartHeight;
          const x = chartLeft + barGap + i * (barWidth + barGap);
          const y = chartBottom - barHeight;
          const barColor = lighten(color, 0.1 - i * 0.03);

          return (
            <g key={d.year}>
              {/* Bar */}
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                rx={4}
                fill={barColor}
                stroke={dark}
                strokeWidth="1"
              />

              {/* Price label on top of bar */}
              <text
                x={x + barWidth / 2}
                y={y - 8}
                textAnchor="middle"
                fontSize="13"
                fontWeight="700"
                fontFamily="'JetBrains Mono', monospace"
                fill={dark}
              >
                {`\u20B9${d.price}`}
              </text>

              {/* Year label below */}
              <text
                x={x + barWidth / 2}
                y={chartBottom + 20}
                textAnchor="middle"
                fontSize="12"
                fontWeight="500"
                fontFamily="'DM Sans', system-ui, sans-serif"
                fill="#1A1A2E"
              >
                {d.year}
              </text>
            </g>
          );
        })}

        {/* Small samosa icon on top of the last bar for warmth */}
        {(() => {
          const lastIdx = dataPoints.length - 1;
          const lastX =
            chartLeft + barGap + lastIdx * (barWidth + barGap) + barWidth / 2;
          const lastBarHeight = (dataPoints[lastIdx].price / maxPrice) * chartHeight;
          const lastY = chartBottom - lastBarHeight - 28;
          return (
            <g>
              {/* Samosa triangle */}
              <path
                d={`M${lastX} ${lastY - 8} L${lastX - 7} ${lastY + 5} L${lastX + 7} ${lastY + 5} Z`}
                fill={withOpacity(color, 0.3)}
                stroke={dark}
                strokeWidth="1"
                strokeLinejoin="round"
              />
              {/* Crimp lines */}
              <path
                d={`M${lastX - 4} ${lastY + 2} q2 -2 4 0 q2 2 4 0`}
                fill="none"
                stroke={dark}
                strokeWidth="0.7"
              />
            </g>
          );
        })()}

        {/* Upward trend arrow */}
        <path
          d={`M${chartLeft + barGap + barWidth / 2} ${chartBottom - (2 / maxPrice) * chartHeight - 4}
              Q${svgWidth / 2} ${chartTop + 30}
              ${chartLeft + barGap + (dataPoints.length - 1) * (barWidth + barGap) + barWidth / 2} ${chartBottom - (15 / maxPrice) * chartHeight - 4}`}
          fill="none"
          stroke={withOpacity(color, 0.3)}
          strokeWidth="2"
          strokeDasharray="6 4"
          strokeLinecap="round"
        />

        {/* Caption */}
        <text
          x={svgWidth / 2}
          y={svgHeight - 12}
          textAnchor="middle"
          fontSize="11"
          fontFamily="'DM Sans', system-ui, sans-serif"
          fill="#596673"
        >
          Same samosa, rising price — that&apos;s inflation!
        </text>
      </svg>
    </div>
  );
}
