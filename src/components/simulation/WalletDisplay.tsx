'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, Shield, CreditCard } from 'lucide-react';

interface WalletDisplayProps {
  balance: number;
  previousBalance?: number;
  className?: string;
  /** Custom label (e.g. "Trading Wallet", "Monthly Budget") */
  label?: string;
  /** Show as credit balance with danger tinting */
  creditMode?: boolean;
  /** Credit limit for danger threshold */
  creditLimit?: number;
  /** Show as X/Y score instead of currency */
  scoreMode?: boolean;
  /** Max score for score mode */
  maxScore?: number;
  /** Chapter accent color for border/glow */
  accentColor?: string;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(Math.abs(value));
}

export default function WalletDisplay({
  balance,
  previousBalance,
  className = '',
  label,
  creditMode = false,
  creditLimit,
  scoreMode = false,
  maxScore = 100,
  accentColor,
}: WalletDisplayProps) {
  const [displayValue, setDisplayValue] = useState(balance);
  const [flashColor, setFlashColor] = useState<'green' | 'red' | null>(null);
  const rafRef = useRef<number>(0);
  const prevRef = useRef(balance);

  useEffect(() => {
    const from = prevRef.current;
    const to = balance;
    prevRef.current = balance;

    if (from === to) {
      setDisplayValue(to);
      return;
    }

    // Trigger color flash
    if (creditMode) {
      // For credit: increase = bad (red), decrease = good (green)
      setFlashColor(to > from ? 'red' : 'green');
    } else {
      setFlashColor(to > from ? 'green' : 'red');
    }
    const flashTimer = setTimeout(() => setFlashColor(null), 800);

    // Animate count
    const duration = 600;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(from + (to - from) * eased));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(flashTimer);
    };
  }, [balance, creditMode]);

  const diff =
    previousBalance !== undefined ? balance - previousBalance : null;

  /* ── Credit danger level ─────────────────────────────────────────── */
  const creditDangerPct =
    creditMode && creditLimit && creditLimit > 0
      ? Math.min(balance / creditLimit, 1)
      : 0;
  const isCreditDanger = creditDangerPct > 0.6;

  /* ── Icon ────────────────────────────────────────────────────────── */
  const Icon = creditMode ? CreditCard : scoreMode ? Shield : Wallet;

  /* ── Display label ───────────────────────────────────────────────── */
  const displayLabel = label || (creditMode ? 'Credit Balance' : scoreMode ? 'Score' : 'Virtual Wallet');

  /* ── Border / glow color ─────────────────────────────────────────── */
  const borderColor = (() => {
    if (flashColor === 'green') return 'rgba(34,197,94,0.5)';
    if (flashColor === 'red') return 'rgba(239,68,68,0.5)';
    if (creditMode && isCreditDanger) return 'rgba(239,68,68,0.4)';
    if (accentColor) return `${accentColor}30`;
    return 'rgba(255,255,255,0.15)';
  })();

  /* ── Value color ─────────────────────────────────────────────────── */
  const valueColor = (() => {
    if (flashColor === 'green') return '#22c55e';
    if (flashColor === 'red') return '#ef4444';
    if (creditMode && isCreditDanger) return '#ef4444';
    return '#ffffff';
  })();

  /* ── Box shadow for flash ────────────────────────────────────────── */
  const boxShadowAnim = (() => {
    if (flashColor === 'green') {
      return {
        boxShadow: [
          '0 0 0px rgba(34,197,94,0)',
          '0 0 20px rgba(34,197,94,0.4)',
          '0 0 0px rgba(34,197,94,0)',
        ],
      };
    }
    if (flashColor === 'red') {
      return {
        boxShadow: [
          '0 0 0px rgba(239,68,68,0)',
          '0 0 20px rgba(239,68,68,0.4)',
          '0 0 0px rgba(239,68,68,0)',
        ],
      };
    }
    return {};
  })();

  return (
    <motion.div
      className={`
        relative rounded-xl px-3 py-2.5 sm:px-4 sm:py-3 lg:p-4
        bg-black/40 backdrop-blur-md
        shadow-xl min-w-0 sm:min-w-[140px] lg:min-w-[160px]
        ${className}
      `}
      style={{ borderWidth: 1, borderStyle: 'solid', borderColor }}
      animate={boxShadowAnim}
      transition={{ duration: 0.8 }}
    >
      {/* Label row — compressed on mobile (icon only) */}
      <div className="flex items-center gap-2 mb-0.5 sm:mb-1">
        <Icon
          className="w-4 h-4 shrink-0"
          style={{
            color: creditMode && isCreditDanger
              ? '#ef4444'
              : accentColor
                ? `${accentColor}AA`
                : 'rgba(255,255,255,0.6)',
          }}
        />
        <span
          className="hidden sm:inline text-xs font-body uppercase tracking-wider"
          style={{
            color: creditMode && isCreditDanger
              ? 'rgba(239,68,68,0.8)'
              : 'rgba(255,255,255,0.6)',
          }}
        >
          {displayLabel}
        </span>
      </div>

      {/* Value */}
      <div className="flex items-baseline gap-1">
        {scoreMode ? (
          /* Score mode: X / Y */
          <>
            <motion.span
              className="font-mono text-xl sm:text-2xl font-bold tabular-nums"
              style={{ color: valueColor }}
              transition={{ duration: 0.3 }}
            >
              {displayValue}
            </motion.span>
            <span className="font-mono text-sm text-white/40">
              / {maxScore}
            </span>
          </>
        ) : (
          /* Currency mode */
          <>
            <span className="text-white/80 font-mono text-base sm:text-lg">&#x20B9;</span>
            <motion.span
              className="font-mono text-xl sm:text-2xl font-bold tabular-nums"
              style={{ color: valueColor }}
              transition={{ duration: 0.3 }}
            >
              {formatCurrency(displayValue)}
            </motion.span>
          </>
        )}
      </div>

      {/* Credit limit warning bar */}
      {creditMode && creditLimit && creditLimit > 0 && (
        <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full transition-colors duration-500"
            style={{
              backgroundColor: isCreditDanger ? '#ef4444' : '#f59e0b',
              width: `${creditDangerPct * 100}%`,
            }}
          />
        </div>
      )}

      {/* Diff indicator */}
      <AnimatePresence>
        {diff !== null && diff !== 0 && flashColor && (
          <motion.span
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="block text-xs font-mono mt-1"
            style={{
              color:
                (creditMode ? diff < 0 : diff > 0)
                  ? '#22c55e'
                  : '#ef4444',
            }}
          >
            {scoreMode
              ? `${diff > 0 ? '+' : ''}${diff} pts`
              : `${diff > 0 ? '+' : '-'}₹${formatCurrency(diff)}`}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
