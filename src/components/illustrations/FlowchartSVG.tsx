'use client';

import { useEffect, useRef, useState } from 'react';

interface FlowchartStep {
  label: string;
  description?: string;
}

interface FlowchartSVGProps {
  steps: FlowchartStep[];
  direction?: 'vertical' | 'horizontal';
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

export default function FlowchartSVG({
  steps,
  direction = 'vertical',
  accentColor,
  className = '',
}: FlowchartSVGProps) {
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

  const count = steps.length;
  if (count === 0) return null;

  const isVertical = direction === 'vertical';

  // Dimensions
  const boxWidth = isVertical ? 280 : 140;
  const boxHeight = isVertical ? 56 : 72;
  const gapBetween = isVertical ? 40 : 50;
  const padding = 30;
  const numberR = 14;

  let svgWidth: number;
  let svgHeight: number;

  if (isVertical) {
    svgWidth = boxWidth + padding * 2 + 40;
    svgHeight = count * boxHeight + (count - 1) * gapBetween + padding * 2;
  } else {
    svgWidth = count * boxWidth + (count - 1) * gapBetween + padding * 2;
    svgHeight = boxHeight + padding * 2 + 50;
  }

  return (
    <div ref={containerRef} className={`w-full ${className}`}>
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={`Flowchart with ${count} steps`}
        className="w-full h-auto"
      >
        {steps.map((step, i) => {
          let bx: number, by: number;

          if (isVertical) {
            bx = padding + 20;
            by = padding + i * (boxHeight + gapBetween);
          } else {
            bx = padding + i * (boxWidth + gapBetween);
            by = padding + 20;
          }

          const delay = prefersReducedMotion ? 0 : i * 0.1;

          return (
            <g key={i}>
              {/* Arrow between steps */}
              {i < count - 1 && (
                <g
                  style={{
                    opacity: visible || prefersReducedMotion ? 1 : 0,
                    transition: prefersReducedMotion
                      ? 'none'
                      : `opacity 0.3s cubic-bezier(0.25, 1, 0.5, 1) ${delay + 0.05}s`,
                  }}
                >
                  {isVertical ? (
                    <>
                      <line
                        x1={bx + boxWidth / 2}
                        y1={by + boxHeight}
                        x2={bx + boxWidth / 2}
                        y2={by + boxHeight + gapBetween}
                        stroke={withOpacity(accentColor, 0.3)}
                        strokeWidth="2"
                        strokeDasharray="4 3"
                      />
                      {/* Arrow head */}
                      <path
                        d={`M${bx + boxWidth / 2 - 5} ${by + boxHeight + gapBetween - 6} l5 6 5-6`}
                        stroke={withOpacity(accentColor, 0.5)}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                      />
                    </>
                  ) : (
                    <>
                      <line
                        x1={bx + boxWidth}
                        y1={by + boxHeight / 2}
                        x2={bx + boxWidth + gapBetween}
                        y2={by + boxHeight / 2}
                        stroke={withOpacity(accentColor, 0.3)}
                        strokeWidth="2"
                        strokeDasharray="4 3"
                      />
                      {/* Arrow head */}
                      <path
                        d={`M${bx + boxWidth + gapBetween - 6} ${by + boxHeight / 2 - 5} l6 5 -6 5`}
                        stroke={withOpacity(accentColor, 0.5)}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                      />
                    </>
                  )}
                </g>
              )}

              {/* Step box */}
              <g
                style={{
                  opacity: visible || prefersReducedMotion ? 1 : 0,
                  transform:
                    visible || prefersReducedMotion
                      ? 'translateY(0)'
                      : isVertical
                      ? 'translateY(12px)'
                      : 'translateY(8px)',
                  transition: prefersReducedMotion
                    ? 'none'
                    : `opacity 0.45s cubic-bezier(0.25, 1, 0.5, 1) ${delay}s, transform 0.45s cubic-bezier(0.25, 1, 0.5, 1) ${delay}s`,
                }}
              >
                {/* Box background */}
                <rect
                  x={bx}
                  y={by}
                  width={boxWidth}
                  height={boxHeight}
                  rx="14"
                  fill="white"
                  stroke={withOpacity(accentColor, 0.25)}
                  strokeWidth="1.5"
                />

                {/* Subtle accent left border */}
                {isVertical && (
                  <rect
                    x={bx}
                    y={by + 8}
                    width="3.5"
                    height={boxHeight - 16}
                    rx="2"
                    fill={accentColor}
                  />
                )}

                {/* Step number badge */}
                <circle
                  cx={isVertical ? bx - numberR - 4 : bx + boxWidth / 2}
                  cy={isVertical ? by + boxHeight / 2 : by - numberR - 4}
                  r={numberR}
                  fill={accentColor}
                />
                <text
                  x={isVertical ? bx - numberR - 4 : bx + boxWidth / 2}
                  y={isVertical ? by + boxHeight / 2 + 1 : by - numberR - 3}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="11"
                  fontWeight="700"
                  fontFamily="'JetBrains Mono', monospace"
                  fill="white"
                >
                  {i + 1}
                </text>

                {/* Label */}
                <text
                  x={isVertical ? bx + 16 : bx + boxWidth / 2}
                  y={
                    isVertical
                      ? step.description
                        ? by + boxHeight / 2 - 7
                        : by + boxHeight / 2 + 1
                      : step.description
                      ? by + boxHeight / 2 - 4
                      : by + boxHeight / 2 + 2
                  }
                  textAnchor={isVertical ? 'start' : 'middle'}
                  dominantBaseline="central"
                  fontSize="12.5"
                  fontWeight="600"
                  fontFamily="'DM Sans', system-ui, sans-serif"
                  fill="#1A1A2E"
                >
                  {step.label}
                </text>

                {/* Description */}
                {step.description && (
                  <text
                    x={isVertical ? bx + 16 : bx + boxWidth / 2}
                    y={
                      isVertical
                        ? by + boxHeight / 2 + 10
                        : by + boxHeight / 2 + 14
                    }
                    textAnchor={isVertical ? 'start' : 'middle'}
                    dominantBaseline="central"
                    fontSize="10"
                    fontFamily="'DM Sans', system-ui, sans-serif"
                    fill="#596673"
                  >
                    {step.description.length > (isVertical ? 40 : 20)
                      ? step.description.slice(0, isVertical ? 38 : 18) + '...'
                      : step.description}
                  </text>
                )}
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
