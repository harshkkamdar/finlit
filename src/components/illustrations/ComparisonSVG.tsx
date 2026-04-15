'use client';

import { useEffect, useRef, useState } from 'react';

interface ComparisonColumn {
  title: string;
  items: string[];
  color: string;
}

interface ComparisonSVGProps {
  left: ComparisonColumn;
  right: ComparisonColumn;
  accentColor: string;
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

export default function ComparisonSVG({
  left,
  right,
  accentColor,
  className = '',
}: ComparisonSVGProps) {
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

  const maxItems = Math.max(left.items.length, right.items.length);
  const itemHeight = 32;
  const headerHeight = 52;
  const padding = 24;
  const svgWidth = 680;
  const svgHeight = headerHeight + padding + maxItems * itemHeight + padding * 2;
  const colWidth = (svgWidth - padding * 2 - 60) / 2;
  const leftX = padding;
  const rightX = svgWidth - padding - colWidth;
  const centerX = svgWidth / 2;

  return (
    <div ref={containerRef} className={`w-full ${className}`}>
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={`Comparison: ${left.title} vs ${right.title}`}
        className="w-full h-auto"
      >
        {/* Background cards */}
        <rect
          x={leftX}
          y={padding}
          width={colWidth}
          height={svgHeight - padding * 2}
          rx="12"
          fill={withOpacity(left.color, 0.06)}
          stroke={withOpacity(left.color, 0.15)}
          strokeWidth="1"
          style={{
            opacity: visible || prefersReducedMotion ? 1 : 0,
            transition: prefersReducedMotion
              ? 'none'
              : 'opacity 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
          }}
        />
        <rect
          x={rightX}
          y={padding}
          width={colWidth}
          height={svgHeight - padding * 2}
          rx="12"
          fill={withOpacity(right.color, 0.06)}
          stroke={withOpacity(right.color, 0.15)}
          strokeWidth="1"
          style={{
            opacity: visible || prefersReducedMotion ? 1 : 0,
            transition: prefersReducedMotion
              ? 'none'
              : 'opacity 0.5s cubic-bezier(0.25, 1, 0.5, 1) 0.1s',
          }}
        />

        {/* VS Badge */}
        <circle
          cx={centerX}
          cy={padding + headerHeight / 2 + 10}
          r="18"
          fill="white"
          stroke={withOpacity(accentColor, 0.25)}
          strokeWidth="2"
          style={{
            opacity: visible || prefersReducedMotion ? 1 : 0,
            transition: prefersReducedMotion
              ? 'none'
              : 'opacity 0.4s cubic-bezier(0.25, 1, 0.5, 1) 0.2s',
          }}
        />
        <text
          x={centerX}
          y={padding + headerHeight / 2 + 11}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="11"
          fontWeight="700"
          fontFamily="'DM Sans', system-ui, sans-serif"
          fill={accentColor}
          style={{
            opacity: visible || prefersReducedMotion ? 1 : 0,
            transition: prefersReducedMotion
              ? 'none'
              : 'opacity 0.4s cubic-bezier(0.25, 1, 0.5, 1) 0.2s',
          }}
        >
          VS
        </text>

        {/* Left column header */}
        <text
          x={leftX + colWidth / 2}
          y={padding + 30}
          textAnchor="middle"
          dominantBaseline="auto"
          fontSize="14"
          fontWeight="600"
          fontFamily="'DM Sans', system-ui, sans-serif"
          fill={left.color}
        >
          {left.title}
        </text>

        {/* Right column header */}
        <text
          x={rightX + colWidth / 2}
          y={padding + 30}
          textAnchor="middle"
          dominantBaseline="auto"
          fontSize="14"
          fontWeight="600"
          fontFamily="'DM Sans', system-ui, sans-serif"
          fill={right.color}
        >
          {right.title}
        </text>

        {/* Divider lines under headers */}
        <line
          x1={leftX + 16}
          y1={padding + headerHeight}
          x2={leftX + colWidth - 16}
          y2={padding + headerHeight}
          stroke={withOpacity(left.color, 0.2)}
          strokeWidth="1"
        />
        <line
          x1={rightX + 16}
          y1={padding + headerHeight}
          x2={rightX + colWidth - 16}
          y2={padding + headerHeight}
          stroke={withOpacity(right.color, 0.2)}
          strokeWidth="1"
        />

        {/* Left items */}
        {left.items.map((item, i) => {
          const y = padding + headerHeight + 16 + i * itemHeight + itemHeight / 2;
          const delay = prefersReducedMotion ? 0 : 0.15 + i * 0.06;

          return (
            <g
              key={`left-${i}`}
              style={{
                opacity: visible || prefersReducedMotion ? 1 : 0,
                transform:
                  visible || prefersReducedMotion
                    ? 'translateX(0)'
                    : 'translateX(-10px)',
                transition: prefersReducedMotion
                  ? 'none'
                  : `opacity 0.4s cubic-bezier(0.25, 1, 0.5, 1) ${delay}s, transform 0.4s cubic-bezier(0.25, 1, 0.5, 1) ${delay}s`,
              }}
            >
              {/* Check icon */}
              <circle
                cx={leftX + 24}
                cy={y}
                r="8"
                fill={withOpacity(left.color, 0.12)}
              />
              <path
                d={`M${leftX + 20} ${y} l3 3 5-5`}
                stroke={left.color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <text
                x={leftX + 40}
                y={y + 1}
                dominantBaseline="central"
                fontSize="11"
                fontFamily="'DM Sans', system-ui, sans-serif"
                fill="#1A1A2E"
              >
                {item.length > 32 ? item.slice(0, 30) + '...' : item}
              </text>
            </g>
          );
        })}

        {/* Right items */}
        {right.items.map((item, i) => {
          const y = padding + headerHeight + 16 + i * itemHeight + itemHeight / 2;
          const delay = prefersReducedMotion ? 0 : 0.15 + i * 0.06;

          return (
            <g
              key={`right-${i}`}
              style={{
                opacity: visible || prefersReducedMotion ? 1 : 0,
                transform:
                  visible || prefersReducedMotion
                    ? 'translateX(0)'
                    : 'translateX(10px)',
                transition: prefersReducedMotion
                  ? 'none'
                  : `opacity 0.4s cubic-bezier(0.25, 1, 0.5, 1) ${delay}s, transform 0.4s cubic-bezier(0.25, 1, 0.5, 1) ${delay}s`,
              }}
            >
              {/* X icon */}
              <circle
                cx={rightX + 24}
                cy={y}
                r="8"
                fill={withOpacity(right.color, 0.12)}
              />
              <path
                d={`M${rightX + 20} ${y - 4} l8 8 M${rightX + 28} ${y - 4} l-8 8`}
                stroke={right.color}
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
              />
              <text
                x={rightX + 40}
                y={y + 1}
                dominantBaseline="central"
                fontSize="11"
                fontFamily="'DM Sans', system-ui, sans-serif"
                fill="#1A1A2E"
              >
                {item.length > 32 ? item.slice(0, 30) + '...' : item}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
