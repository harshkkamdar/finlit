'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, Lock, Play } from 'lucide-react';

interface LessonItem {
  _id: string;
  lessonNumber: string;
  title: string;
  estimatedMinutes: number;
  exerciseCount: number;
  status: 'completed' | 'in-progress' | 'locked';
}

interface LessonPathProps {
  lessons: LessonItem[];
  chapterColor: string;
}

// Zigzag offsets from center (px). Alternates every other lesson with center-anchored start.
const ZIGZAG_OFFSETS = [0, 48, -48, 48, -48, 48, -48, 48, -48];

// Layout constants
const NODE_SIZE_MOBILE = 84;
const NODE_SIZE_DESKTOP = 96;
const SLOT_HEIGHT_MOBILE = 172; // node + caption + breathing room
const SLOT_HEIGHT_DESKTOP = 196;

function hexToRgba(hex: string, alpha: number): string {
  const cleaned = hex.replace('#', '');
  const r = parseInt(cleaned.substring(0, 2), 16);
  const g = parseInt(cleaned.substring(2, 4), 16);
  const b = parseInt(cleaned.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function LessonPath({ lessons, chapterColor }: LessonPathProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);

  // Track container width and breakpoint via ResizeObserver / matchMedia
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) setContainerWidth(entry.contentRect.width);
    });
    ro.observe(node);

    const mq = window.matchMedia('(min-width: 1024px)');
    setIsDesktop(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener('change', onChange);

    return () => {
      ro.disconnect();
      mq.removeEventListener('change', onChange);
    };
  }, []);

  const nodeSize = isDesktop ? NODE_SIZE_DESKTOP : NODE_SIZE_MOBILE;
  const slotHeight = isDesktop ? SLOT_HEIGHT_DESKTOP : SLOT_HEIGHT_MOBILE;
  const totalHeight = lessons.length * slotHeight;
  const cx = containerWidth / 2;

  // Build SVG path data for connectors. A "solid" connector means the user has
  // crossed that threshold (origin lesson is completed).
  const connectors: Array<{ d: string; solid: boolean }> = [];
  if (containerWidth > 0) {
    for (let i = 0; i < lessons.length - 1; i++) {
      const x0 = cx + (ZIGZAG_OFFSETS[i] ?? 0);
      const y0 = i * slotHeight + nodeSize / 2 + 4;
      const x1 = cx + (ZIGZAG_OFFSETS[i + 1] ?? 0);
      const y1 = (i + 1) * slotHeight + nodeSize / 2 + 4;
      const midY = (y0 + y1) / 2;
      const d = `M ${x0} ${y0 + nodeSize / 2 + 2} C ${x0} ${midY} ${x1} ${midY} ${x1} ${y1 - nodeSize / 2 - 2}`;
      connectors.push({
        d,
        solid: lessons[i].status === 'completed',
      });
    }
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[400px] lg:max-w-[480px] mx-auto"
      style={{ height: totalHeight }}
      role="list"
      aria-label="Chapter lessons"
    >
      {/* Connectors (behind nodes) */}
      {containerWidth > 0 && (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox={`0 0 ${containerWidth} ${totalHeight}`}
          preserveAspectRatio="none"
          aria-hidden
        >
          {connectors.map((seg, i) => (
            <path
              key={i}
              d={seg.d}
              fill="none"
              stroke={seg.solid ? chapterColor : '#D1D5DB'}
              strokeWidth={seg.solid ? 3 : 2}
              strokeLinecap="round"
              strokeDasharray={seg.solid ? undefined : '4 8'}
              opacity={seg.solid ? 0.7 : 1}
            />
          ))}
        </svg>
      )}

      {/* Nodes */}
      {lessons.map((lesson, i) => {
        const offset = ZIGZAG_OFFSETS[i] ?? 0;
        const top = i * slotHeight;
        const isCompleted = lesson.status === 'completed';
        const isActive = lesson.status === 'in-progress';
        const isLocked = lesson.status === 'locked';

        return (
          <motion.div
            key={lesson._id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: i * 0.06,
              duration: 0.35,
              ease: [0.25, 1, 0.5, 1],
            }}
            className="absolute left-1/2"
            style={{
              top,
              transform: `translate(calc(-50% + ${offset}px), 0)`,
            }}
            role="listitem"
          >
            <LessonNode
              lesson={lesson}
              chapterColor={chapterColor}
              isCompleted={isCompleted}
              isActive={isActive}
              isLocked={isLocked}
              nodeSize={nodeSize}
            />
          </motion.div>
        );
      })}
    </div>
  );
}

interface LessonNodeProps {
  lesson: LessonItem;
  chapterColor: string;
  isCompleted: boolean;
  isActive: boolean;
  isLocked: boolean;
  nodeSize: number;
}

function LessonNode({
  lesson,
  chapterColor,
  isCompleted,
  isActive,
  isLocked,
  nodeSize,
}: LessonNodeProps) {
  // Wrap the entire node + caption + (start pill) in a single tap target
  const href = isLocked ? '#' : `/lesson/${lesson._id}`;

  const content = (
    <div className="flex flex-col items-center gap-2 select-none">
      {/* Node + optional START pill row */}
      <div className="relative flex items-center">
        {/* Pulse rings for active node (CSS keyframes inherit prefers-reduced-motion) */}
        {isActive && (
          <>
            <span
              aria-hidden
              className="absolute inset-0 rounded-full path-pulse"
              style={{
                width: nodeSize,
                height: nodeSize,
                borderColor: chapterColor,
              }}
            />
            <span
              aria-hidden
              className="absolute inset-0 rounded-full path-pulse path-pulse-delayed"
              style={{
                width: nodeSize,
                height: nodeSize,
                borderColor: chapterColor,
              }}
            />
          </>
        )}

        {/* Node circle */}
        <div
          className={`relative rounded-full flex items-center justify-center transition-transform ${
            !isLocked ? 'group-active:scale-95' : ''
          }`}
          style={{
            width: nodeSize,
            height: nodeSize,
            backgroundColor: isCompleted
              ? chapterColor
              : isActive
                ? 'white'
                : 'var(--color-fill-muted)',
            border: isActive
              ? `4px solid ${chapterColor}`
              : isCompleted
                ? `4px solid ${chapterColor}`
                : `2px dashed var(--color-border)`,
            boxShadow: isCompleted || isActive
              ? `0 4px 14px ${hexToRgba(chapterColor, 0.25)}`
              : 'none',
          }}
        >
          {isCompleted && (
            <Check className="w-9 h-9 text-white" strokeWidth={3} />
          )}
          {isActive && (
            <div
              className="rounded-full"
              style={{
                width: nodeSize * 0.32,
                height: nodeSize * 0.32,
                backgroundColor: chapterColor,
              }}
            />
          )}
          {isLocked && (
            <Lock className="w-7 h-7 text-text-disabled" strokeWidth={2} />
          )}
        </div>

        {/* START pill — only on active node, juts to the right */}
        {isActive && (
          <div
            className="absolute left-full ml-3 path-start-pill flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-display font-semibold text-white text-sm shadow-lg whitespace-nowrap"
            style={{
              backgroundColor: chapterColor,
              boxShadow: `0 4px 14px ${hexToRgba(chapterColor, 0.4)}`,
            }}
          >
            <Play className="w-3.5 h-3.5 fill-white" strokeWidth={0} />
            START
          </div>
        )}
      </div>

      {/* Caption */}
      <div
        className="text-center max-w-[180px] lg:max-w-[220px]"
        style={{ marginTop: 8 }}
      >
        <p
          className={`text-[11px] font-mono font-semibold uppercase tracking-wider ${
            isLocked ? 'text-text-disabled' : ''
          }`}
          style={
            isLocked
              ? undefined
              : { color: chapterColor }
          }
        >
          {lesson.lessonNumber}
        </p>
        <p
          className={`font-display font-semibold text-sm leading-tight mt-0.5 line-clamp-2 ${
            isLocked ? 'text-text-disabled' : 'text-dark'
          }`}
        >
          {lesson.title}
        </p>
        <p
          className={`text-[11px] font-mono mt-1 ${
            isLocked ? 'text-text-disabled/70' : 'text-muted'
          }`}
        >
          {lesson.estimatedMinutes} min · {lesson.exerciseCount} ex
        </p>
      </div>
    </div>
  );

  if (isLocked) {
    return (
      <div
        className="opacity-60"
        aria-disabled="true"
        aria-label={`${lesson.title} (locked — complete previous lesson)`}
      >
        {content}
      </div>
    );
  }

  return (
    <Link
      href={href}
      className="group block outline-none focus-visible:ring-2 focus-visible:ring-offset-4 rounded-2xl"
      style={
        isActive
          ? ({ ['--tw-ring-color' as string]: chapterColor } as React.CSSProperties)
          : undefined
      }
      aria-label={`${isActive ? 'Start' : 'Review'} ${lesson.title}`}
    >
      {content}
    </Link>
  );
}
