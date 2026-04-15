'use client';

import { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Flame } from 'lucide-react';

interface StreakDisplayProps {
  streak: number;
  size?: 'sm' | 'md' | 'lg';
}

const sizeStyles = {
  sm: { text: 'text-sm', icon: 'w-4 h-4', flameSize: 'w-5 h-5' },
  md: { text: 'text-lg', icon: 'w-5 h-5', flameSize: 'w-7 h-7' },
  lg: { text: 'text-2xl', icon: 'w-7 h-7', flameSize: 'w-9 h-9' },
};

export default function StreakDisplay({
  streak,
  size = 'md',
}: StreakDisplayProps) {
  const controls = useAnimation();
  const prevStreak = useRef(streak);
  const styles = sizeStyles[size];
  const isZero = streak === 0;

  useEffect(() => {
    if (streak > prevStreak.current && streak > 0) {
      controls.start({
        scale: [1, 1.4, 1],
        rotate: [0, -10, 10, -5, 5, 0],
        transition: { duration: 0.6, ease: 'easeOut' },
      });
    }
    prevStreak.current = streak;
  }, [streak, controls]);

  return (
    <div className="inline-flex items-center gap-1.5" aria-label={`Current streak: ${streak} days`}>
      <motion.div animate={controls} className="relative">
        <Flame
          className={`${styles.icon} ${
            isZero ? 'text-border' : 'text-orange-500'
          }`}
          fill={isZero ? 'none' : 'currentColor'}
        />
        {/* Glow behind flame when active */}
        {!isZero && (
          <motion.div
            className="absolute inset-0 rounded-full bg-orange-500/30 blur-md -z-10"
            animate={{
              opacity: [0.4, 0.7, 0.4],
              scale: [0.9, 1.2, 0.9],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}
      </motion.div>
      <span
        className={`font-mono font-bold tabular-nums ${styles.text} ${
          isZero ? 'text-text-disabled' : 'text-dark'
        }`}
      >
        {streak}
      </span>
    </div>
  );
}
