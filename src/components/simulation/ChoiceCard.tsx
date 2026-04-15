'use client';

import { motion } from 'framer-motion';

interface ChoiceCardProps {
  text: string;
  index: number;
  onClick: () => void;
  disabled?: boolean;
}

const labels = ['A', 'B', 'C', 'D'];

export default function ChoiceCard({
  text,
  index,
  onClick,
  disabled = false,
}: ChoiceCardProps) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      aria-label={`Choice ${labels[index] || index + 1}: ${text}`}
      aria-disabled={disabled}
      whileHover={
        !disabled
          ? {
              y: -4,
              boxShadow: '0 12px 40px rgba(245,166,35,0.15)',
              borderColor: 'rgba(245,166,35,0.5)',
            }
          : undefined
      }
      whileTap={!disabled ? { scale: 0.98 } : undefined}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 25,
        delay: index * 0.08,
      }}
      className={`
        w-full text-left p-5 rounded-xl
        bg-surface/10 backdrop-blur-sm
        border border-white/15
        transition-all duration-200 ease-[cubic-bezier(0.25,1,0.5,1)]
        focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-dark outline-none
        ${
          disabled
            ? 'opacity-50 cursor-not-allowed'
            : 'cursor-pointer hover:bg-surface/15'
        }
      `}
    >
      <div className="flex items-start gap-4">
        <span className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center shrink-0 font-display font-semibold text-sm text-accent transition-colors duration-200 group-hover:bg-accent/30">
          {labels[index] || index + 1}
        </span>
        <span className="text-white/90 font-body text-base leading-relaxed pt-0.5">
          {text}
        </span>
      </div>
    </motion.button>
  );
}
