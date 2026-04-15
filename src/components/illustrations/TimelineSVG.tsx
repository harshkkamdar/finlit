'use client';

import { useEffect, useId, useRef, useState } from 'react';

interface TimelineItem {
  label: string;
  icon?: string;
  description?: string;
}

interface TimelineSVGProps {
  items: TimelineItem[];
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

export default function TimelineSVG({
  items,
  accentColor,
  className = '',
}: TimelineSVGProps) {
  const uniqueId = useId();
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

  const count = items.length;
  if (count === 0) return null;

  const padding = 60;
  const nodeRadius = 20;
  const svgWidth = 800;
  const svgHeight = 160;
  const lineY = 50;
  const spacing = count > 1 ? (svgWidth - padding * 2) / (count - 1) : 0;

  const safeId = uniqueId.replace(/:/g, '_');

  return (
    <div ref={containerRef} className={`w-full ${className}`}>
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={`Timeline with ${count} steps`}
        className="w-full h-auto"
      >
        <defs>
          <filter id={`glow-${safeId}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Connection line */}
        {count > 1 && (
          <line
            x1={padding}
            y1={lineY}
            x2={svgWidth - padding}
            y2={lineY}
            stroke={withOpacity(accentColor, 0.2)}
            strokeWidth="3"
            strokeLinecap="round"
          />
        )}

        {/* Animated fill line */}
        {count > 1 && (
          <line
            x1={padding}
            y1={lineY}
            x2={svgWidth - padding}
            y2={lineY}
            stroke={withOpacity(accentColor, 0.5)}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={svgWidth - padding * 2}
            strokeDashoffset={
              visible && !prefersReducedMotion ? 0 : svgWidth - padding * 2
            }
            style={{
              transition: prefersReducedMotion
                ? 'none'
                : `stroke-dashoffset 1s cubic-bezier(0.25, 1, 0.5, 1)`,
            }}
          />
        )}

        {/* Nodes */}
        {items.map((item, i) => {
          const cx = count > 1 ? padding + i * spacing : svgWidth / 2;
          const delay = prefersReducedMotion ? 0 : i * 0.12;

          return (
            <g
              key={i}
              style={{
                opacity: visible || prefersReducedMotion ? 1 : 0,
                transform:
                  visible || prefersReducedMotion
                    ? 'translateY(0)'
                    : 'translateY(8px)',
                transition: prefersReducedMotion
                  ? 'none'
                  : `opacity 0.4s cubic-bezier(0.25, 1, 0.5, 1) ${delay}s, transform 0.4s cubic-bezier(0.25, 1, 0.5, 1) ${delay}s`,
              }}
            >
              {/* Outer glow ring */}
              <circle
                cx={cx}
                cy={lineY}
                r={nodeRadius + 4}
                fill={withOpacity(accentColor, 0.08)}
              />

              {/* Node circle */}
              <circle
                cx={cx}
                cy={lineY}
                r={nodeRadius}
                fill="white"
                stroke={accentColor}
                strokeWidth="2.5"
                filter={`url(#glow-${safeId})`}
              />

              {/* Icon/emoji or step number */}
              {item.icon ? (
                <text
                  x={cx}
                  y={lineY + 1}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="16"
                >
                  {item.icon}
                </text>
              ) : (
                <text
                  x={cx}
                  y={lineY + 1}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="13"
                  fontWeight="600"
                  fontFamily="'JetBrains Mono', monospace"
                  fill={accentColor}
                >
                  {i + 1}
                </text>
              )}

              {/* Label */}
              <text
                x={cx}
                y={lineY + nodeRadius + 20}
                textAnchor="middle"
                dominantBaseline="auto"
                fontSize="11.5"
                fontWeight="500"
                fontFamily="'DM Sans', system-ui, sans-serif"
                fill="#1A1A2E"
              >
                {item.label}
              </text>

              {/* Description */}
              {item.description && (
                <text
                  x={cx}
                  y={lineY + nodeRadius + 36}
                  textAnchor="middle"
                  dominantBaseline="auto"
                  fontSize="9.5"
                  fontFamily="'DM Sans', system-ui, sans-serif"
                  fill="#596673"
                >
                  {item.description}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
