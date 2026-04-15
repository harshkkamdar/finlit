'use client';

import { useEffect, useRef, useState } from 'react';

interface GaugeZone {
  color: string;
  label: string;
  threshold: number;
}

interface GaugeSVGProps {
  value: number;
  max: number;
  label: string;
  accentColor: string;
  zones?: GaugeZone[];
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

function polarToCartesian(
  cx: number,
  cy: number,
  r: number,
  angleDeg: number
): { x: number; y: number } {
  const rad = ((angleDeg - 180) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function describeArc(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number
): string {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
}

export default function GaugeSVG({
  value,
  max,
  label,
  accentColor,
  zones,
  className = '',
}: GaugeSVGProps) {
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

  const svgWidth = 320;
  const svgHeight = 200;
  const cx = svgWidth / 2;
  const cy = 160;
  const outerR = 120;
  const innerR = 88;
  const arcWidth = 18;
  const arcR = (outerR + innerR) / 2;

  const clampedValue = Math.min(Math.max(value, 0), max);
  const fraction = max > 0 ? clampedValue / max : 0;
  const valueAngle = fraction * 180;

  // Sort zones by threshold
  const sortedZones = zones
    ? [...zones].sort((a, b) => a.threshold - b.threshold)
    : null;

  // Build zone arcs
  const zoneArcs: { startAngle: number; endAngle: number; color: string; label: string }[] = [];
  if (sortedZones) {
    let prevThreshold = 0;
    for (const zone of sortedZones) {
      const startAngle = (prevThreshold / max) * 180;
      const endAngle = (zone.threshold / max) * 180;
      zoneArcs.push({
        startAngle,
        endAngle: Math.min(endAngle, 180),
        color: zone.color,
        label: zone.label,
      });
      prevThreshold = zone.threshold;
    }
  }

  // Needle endpoint
  const needleTip = polarToCartesian(cx, cy, arcR + 8, valueAngle);

  return (
    <div ref={containerRef} className={`w-full ${className}`}>
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={`${label}: ${clampedValue} out of ${max}`}
        className="w-full h-auto"
      >
        {/* Background arc */}
        <path
          d={describeArc(cx, cy, arcR, 0, 180)}
          stroke={withOpacity(accentColor, 0.1)}
          strokeWidth={arcWidth}
          strokeLinecap="round"
          fill="none"
        />

        {/* Zone arcs */}
        {zoneArcs.map((zone, i) => (
          <path
            key={i}
            d={describeArc(cx, cy, arcR, zone.startAngle, zone.endAngle)}
            stroke={withOpacity(zone.color, 0.25)}
            strokeWidth={arcWidth}
            strokeLinecap="butt"
            fill="none"
          />
        ))}

        {/* Filled arc (animated) */}
        <path
          d={describeArc(cx, cy, arcR, 0, 180)}
          stroke={accentColor}
          strokeWidth={arcWidth}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${Math.PI * arcR}`}
          strokeDashoffset={
            visible || prefersReducedMotion
              ? Math.PI * arcR * (1 - fraction)
              : Math.PI * arcR
          }
          style={{
            transition: prefersReducedMotion
              ? 'none'
              : 'stroke-dashoffset 1s cubic-bezier(0.25, 1, 0.5, 1) 0.2s',
          }}
        />

        {/* Needle */}
        <g
          style={{
            opacity: visible || prefersReducedMotion ? 1 : 0,
            transition: prefersReducedMotion
              ? 'none'
              : 'opacity 0.4s cubic-bezier(0.25, 1, 0.5, 1) 0.8s',
          }}
        >
          <line
            x1={cx}
            y1={cy}
            x2={
              visible || prefersReducedMotion
                ? needleTip.x
                : polarToCartesian(cx, cy, arcR + 8, 0).x
            }
            y2={
              visible || prefersReducedMotion
                ? needleTip.y
                : polarToCartesian(cx, cy, arcR + 8, 0).y
            }
            stroke="#1A1A2E"
            strokeWidth="2.5"
            strokeLinecap="round"
            style={{
              transition: prefersReducedMotion
                ? 'none'
                : 'x2 1s cubic-bezier(0.25, 1, 0.5, 1) 0.2s, y2 1s cubic-bezier(0.25, 1, 0.5, 1) 0.2s',
            }}
          />
          {/* Center dot */}
          <circle cx={cx} cy={cy} r="6" fill="white" stroke="#1A1A2E" strokeWidth="2" />
        </g>

        {/* Value display */}
        <text
          x={cx}
          y={cy - 24}
          textAnchor="middle"
          dominantBaseline="auto"
          fontSize="28"
          fontWeight="600"
          fontFamily="'JetBrains Mono', monospace"
          fill="#1A1A2E"
          style={{
            opacity: visible || prefersReducedMotion ? 1 : 0,
            transition: prefersReducedMotion
              ? 'none'
              : 'opacity 0.4s cubic-bezier(0.25, 1, 0.5, 1) 0.6s',
          }}
        >
          {clampedValue}
        </text>

        {/* Label */}
        <text
          x={cx}
          y={cy + 4}
          textAnchor="middle"
          dominantBaseline="auto"
          fontSize="11"
          fontFamily="'DM Sans', system-ui, sans-serif"
          fill="#596673"
        >
          {label}
        </text>

        {/* Min / Max labels */}
        <text
          x={cx - outerR - 4}
          y={cy + 16}
          textAnchor="middle"
          fontSize="9"
          fontFamily="'JetBrains Mono', monospace"
          fill="#596673"
        >
          0
        </text>
        <text
          x={cx + outerR + 4}
          y={cy + 16}
          textAnchor="middle"
          fontSize="9"
          fontFamily="'JetBrains Mono', monospace"
          fill="#596673"
        >
          {max}
        </text>

        {/* Zone labels below */}
        {sortedZones && sortedZones.length > 0 && (
          <g>
            {sortedZones.map((zone, i) => (
              <g key={i}>
                <circle
                  cx={cx - ((sortedZones.length - 1) * 50) / 2 + i * 50}
                  cy={cy + 32}
                  r="4"
                  fill={zone.color}
                />
                <text
                  x={cx - ((sortedZones.length - 1) * 50) / 2 + i * 50 + 10}
                  y={cy + 35}
                  fontSize="8"
                  fontFamily="'DM Sans', system-ui, sans-serif"
                  fill="#596673"
                >
                  {zone.label}
                </text>
              </g>
            ))}
          </g>
        )}
      </svg>
    </div>
  );
}
