'use client';

import { useEffect, useRef, useState } from 'react';

interface PieSegment {
  label: string;
  value: number;
  color: string;
}

interface PieChartSVGProps {
  segments: PieSegment[];
  accentColor: string;
  title?: string;
  className?: string;
}

export default function PieChartSVG({
  segments,
  accentColor,
  title,
  className = '',
}: PieChartSVGProps) {
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
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const total = segments.reduce((sum, s) => sum + s.value, 0);
  if (total === 0 || segments.length === 0) return null;

  const cx = 160;
  const cy = 130;
  const outerR = 95;
  const innerR = 58;
  const midR = (outerR + innerR) / 2;
  const strokeW = outerR - innerR;
  const circumference = 2 * Math.PI * midR;

  // Calculate segment data
  const segmentData = segments.map((seg) => {
    const fraction = seg.value / total;
    const percent = Math.round(fraction * 100);
    const dashLength = fraction * circumference;
    return { ...seg, fraction, percent, dashLength };
  });

  // Calculate dash offsets (cumulative)
  let cumulativeOffset = 0;
  const segmentRender = segmentData.map((seg) => {
    const offset = cumulativeOffset;
    cumulativeOffset += seg.dashLength;
    return { ...seg, offset };
  });

  const legendStartY = cy + outerR + 30;
  const legendItemH = 22;
  const legendCols = segments.length > 4 ? 2 : 1;
  const legendRows = Math.ceil(segments.length / legendCols);
  const svgHeight = legendStartY + legendRows * legendItemH + 16;
  const svgWidth = 320;

  return (
    <div ref={containerRef} className={`w-full ${className}`}>
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={title ? `${title} chart` : 'Donut chart'}
        className="w-full h-auto"
      >
        {/* Title */}
        {title && (
          <text
            x={cx}
            y={16}
            textAnchor="middle"
            fontSize="13"
            fontWeight="600"
            fontFamily="'DM Sans', system-ui, sans-serif"
            fill="#1A1A2E"
          >
            {title}
          </text>
        )}

        {/* Background ring */}
        <circle
          cx={cx}
          cy={cy}
          r={midR}
          fill="none"
          stroke="#F0F0EC"
          strokeWidth={strokeW}
        />

        {/* Segments */}
        {segmentRender.map((seg, i) => {
          const dasharray = `${seg.dashLength} ${circumference - seg.dashLength}`;
          const dashoffset = -seg.offset;
          const animDelay = prefersReducedMotion ? 0 : 0.1 + i * 0.08;

          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={midR}
              fill="none"
              stroke={seg.color}
              strokeWidth={strokeW}
              strokeDasharray={dasharray}
              strokeDashoffset={dashoffset}
              strokeLinecap="butt"
              transform={`rotate(-90, ${cx}, ${cy})`}
              style={{
                opacity: visible || prefersReducedMotion ? 1 : 0,
                transition: prefersReducedMotion
                  ? 'none'
                  : `opacity 0.5s cubic-bezier(0.25, 1, 0.5, 1) ${animDelay}s`,
              }}
            />
          );
        })}

        {/* Inner circle (white donut hole) */}
        <circle cx={cx} cy={cy} r={innerR - 2} fill="white" />

        {/* Center accent dot */}
        <circle
          cx={cx}
          cy={cy}
          r="4"
          fill={accentColor}
          opacity="0.3"
        />

        {/* Center total */}
        <text
          x={cx}
          y={cy - 4}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="20"
          fontWeight="600"
          fontFamily="'JetBrains Mono', monospace"
          fill="#1A1A2E"
          style={{
            opacity: visible || prefersReducedMotion ? 1 : 0,
            transition: prefersReducedMotion
              ? 'none'
              : 'opacity 0.4s cubic-bezier(0.25, 1, 0.5, 1) 0.4s',
          }}
        >
          {total}
        </text>
        <text
          x={cx}
          y={cy + 14}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="9"
          fontFamily="'DM Sans', system-ui, sans-serif"
          fill="#596673"
          style={{
            opacity: visible || prefersReducedMotion ? 1 : 0,
            transition: prefersReducedMotion
              ? 'none'
              : 'opacity 0.4s cubic-bezier(0.25, 1, 0.5, 1) 0.4s',
          }}
        >
          total
        </text>

        {/* Legend */}
        {segmentRender.map((seg, i) => {
          const col = legendCols > 1 ? i % legendCols : 0;
          const row = legendCols > 1 ? Math.floor(i / legendCols) : i;
          const lx = col === 0 ? 24 : svgWidth / 2 + 8;
          const ly = legendStartY + row * legendItemH;
          const animDelay = prefersReducedMotion ? 0 : 0.3 + i * 0.04;

          return (
            <g
              key={`legend-${i}`}
              style={{
                opacity: visible || prefersReducedMotion ? 1 : 0,
                transition: prefersReducedMotion
                  ? 'none'
                  : `opacity 0.3s cubic-bezier(0.25, 1, 0.5, 1) ${animDelay}s`,
              }}
            >
              <circle cx={lx} cy={ly + 2} r="5" fill={seg.color} />
              <text
                x={lx + 14}
                y={ly + 3}
                dominantBaseline="central"
                fontSize="10.5"
                fontFamily="'DM Sans', system-ui, sans-serif"
                fill="#1A1A2E"
              >
                {seg.label}
              </text>
              <text
                x={lx + (legendCols > 1 ? 120 : 200)}
                y={ly + 3}
                dominantBaseline="central"
                textAnchor="end"
                fontSize="10.5"
                fontWeight="500"
                fontFamily="'JetBrains Mono', monospace"
                fill="#596673"
              >
                {seg.percent}%
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
