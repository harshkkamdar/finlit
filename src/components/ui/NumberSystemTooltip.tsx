'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info } from 'lucide-react';

const conversions = [
  { indian: '1 Lakh (1L)', international: '100,000 (100K)' },
  { indian: '10 Lakh', international: '1,000,000 (1M / 1 Million)' },
  { indian: '1 Crore (1Cr)', international: '10,000,000 (10M)' },
  { indian: '10 Crore', international: '100,000,000 (100M)' },
  { indian: '100 Crore', international: '1,000,000,000 (1B / 1 Billion)' },
];

export default function NumberSystemTooltip() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback(
    (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    },
    []
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, handleClickOutside]);

  return (
    <div ref={containerRef} className="relative z-20">
      {/* Trigger chip */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-body font-medium bg-blue-50 text-blue-600 border border-blue-100 transition-all hover:bg-blue-100 hover:border-blue-200"
        aria-expanded={isOpen}
        aria-label="Indian Number System reference"
      >
        <Info className="w-3.5 h-3.5" />
        Indian Number System
      </button>

      {/* Expanded card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.25, 1, 0.5, 1] }}
            className="absolute right-0 top-full mt-2 w-[340px] bg-surface rounded-xl border border-border shadow-lg overflow-hidden"
          >
            {/* Header */}
            <div className="px-4 pt-3.5 pb-2.5 bg-blue-50/60 border-b border-border">
              <p className="font-display font-semibold text-dark text-sm">
                Indian Number System
              </p>
              <p className="text-muted font-body text-xs mt-0.5">
                Quick reference for Indian vs International notation
              </p>
            </div>

            {/* Conversion rows */}
            <div className="px-4 py-3 space-y-2">
              {conversions.map((row) => (
                <div
                  key={row.indian}
                  className="flex items-baseline justify-between gap-3 py-1.5 border-b border-border-light last:border-0"
                >
                  <span className="font-mono text-xs text-dark font-medium whitespace-nowrap">
                    {row.indian}
                  </span>
                  <span className="text-muted font-body text-xs">=</span>
                  <span className="font-mono text-xs text-muted whitespace-nowrap text-right">
                    {row.international}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
