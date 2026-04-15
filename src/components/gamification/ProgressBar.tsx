'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
  value: number;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const sizeStyles = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
};

export default function ProgressBar({
  value,
  color,
  size = 'md',
  showLabel = false,
  className = '',
}: ProgressBarProps) {
  const clamped = Math.min(Math.max(value, 0), 100);

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-end mb-1">
          <span className="text-xs font-mono text-muted tabular-nums">
            {Math.round(clamped)}%
          </span>
        </div>
      )}
      <div
        className={`w-full rounded-full bg-border overflow-hidden ${sizeStyles[size]}`}
      >
        <motion.div
          className={`h-full rounded-full ${
            color ? '' : 'bg-primary'
          }`}
          style={color ? { backgroundColor: color } : undefined}
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{
            duration: 0.8,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        />
      </div>
    </div>
  );
}
