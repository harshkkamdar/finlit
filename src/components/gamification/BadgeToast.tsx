'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, PartyPopper } from 'lucide-react';

interface BadgeToastProps {
  badgeName: string;
  badgeIcon?: string;
  isVisible: boolean;
  onDismiss: () => void;
  autoDismissMs?: number;
}

export default function BadgeToast({
  badgeName,
  isVisible,
  onDismiss,
  autoDismissMs = 5000,
}: BadgeToastProps) {
  useEffect(() => {
    if (!isVisible) return;
    const timer = setTimeout(onDismiss, autoDismissMs);
    return () => clearTimeout(timer);
  }, [isVisible, onDismiss, autoDismissMs]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: 400, opacity: 0, scale: 0.9 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          exit={{ x: 400, opacity: 0, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 260, damping: 24 }}
          className="fixed top-6 right-6 z-[110] pointer-events-auto"
        >
          <div
            className="
              relative overflow-hidden
              flex items-center gap-4 px-5 py-4
              bg-surface rounded-xl
              border-2 border-accent/50
              shadow-xl shadow-accent/15
              min-w-[320px] max-w-[400px]
            "
          >
            {/* Subtle gold shimmer accent */}
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-accent/10 blur-2xl -translate-y-1/2 translate-x-1/2" />

            {/* Celebration icon with entrance */}
            <motion.div
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.15 }}
              className="w-11 h-11 rounded-full bg-accent/15 flex items-center justify-center shrink-0 relative"
            >
              <PartyPopper className="w-5 h-5 text-accent" />
            </motion.div>

            {/* Content */}
            <div className="flex-1 min-w-0 relative z-10">
              <motion.p
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xs font-display text-accent font-semibold uppercase tracking-wider mb-0.5"
              >
                Badge Unlocked!
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-2"
              >
                <Award className="w-4 h-4 text-dark shrink-0" />
                <p className="font-display font-semibold text-dark truncate">
                  {badgeName}
                </p>
              </motion.div>
            </div>

            {/* Close button */}
            <button
              onClick={onDismiss}
              className="shrink-0 p-1.5 rounded-lg hover:bg-fill-muted transition-colors text-muted relative z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
              aria-label="Dismiss"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Auto-dismiss progress bar */}
          <motion.div
            className="h-0.5 bg-accent/80 rounded-b-xl mx-2"
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: autoDismissMs / 1000, ease: 'linear' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
