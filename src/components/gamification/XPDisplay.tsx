'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface XPDisplayProps {
  xp: number;
  animate?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizeStyles = {
  sm: 'text-sm',
  md: 'text-lg',
  lg: 'text-3xl',
};

const iconSizes = {
  sm: 'w-3.5 h-3.5',
  md: 'w-4 h-4',
  lg: 'w-6 h-6',
};

export default function XPDisplay({
  xp,
  animate = false,
  size = 'md',
}: XPDisplayProps) {
  const [displayValue, setDisplayValue] = useState(animate ? 0 : xp);
  const rafRef = useRef<number>(0);
  const prevXP = useRef(animate ? 0 : xp);

  useEffect(() => {
    if (!animate && prevXP.current === 0) {
      setDisplayValue(xp);
      prevXP.current = xp;
      return;
    }

    const from = prevXP.current;
    const to = xp;
    prevXP.current = xp;

    if (from === to) return;

    const duration = 1200;
    const startTime = performance.now();

    const run = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(from + (to - from) * eased));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(run);
      }
    };

    rafRef.current = requestAnimationFrame(run);
    return () => cancelAnimationFrame(rafRef.current);
  }, [xp, animate]);

  return (
    <motion.div
      initial={animate ? { scale: 0.8, opacity: 0 } : false}
      animate={{ scale: 1, opacity: 1 }}
      className="inline-flex items-center gap-1.5"
      aria-label={`${xp} experience points`}
    >
      <Sparkles className={`${iconSizes[size]} text-accent`} />
      <span
        className={`font-mono font-bold text-accent tabular-nums ${sizeStyles[size]}`}
      >
        {displayValue.toLocaleString()} XP
      </span>
    </motion.div>
  );
}
