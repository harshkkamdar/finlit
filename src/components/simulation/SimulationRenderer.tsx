'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  Trophy,
  ArrowLeft,
  Check,
  X,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Mail,
  Phone,
  CreditCard,
  Smartphone,
  Clock,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import type { SimulationNode, SimulationChoice } from '@/types';
import WalletDisplay from './WalletDisplay';
import { fireConfetti } from '@/lib/confetti';

/* ── Types ──────────────────────────────────────────────────────────── */

interface SimulationData {
  title: string;
  description: string;
  startingWallet: number | null;
  optimalWalletOutcome: number | null;
  nodes: SimulationNode[];
  startNodeId: string;
  badgeThreshold: Record<string, unknown>;
  // Ch0
  walletLabel?: string | null;
  startingInventory?: string | null;
  // Ch1
  availableStocks?: Record<string, unknown> | null;
  // Ch3
  biasTracker?: Record<string, unknown> | null;
  // Ch5
  creditLimit?: number | null;
  creditBalance?: number | null;
  monthlyIncome?: number | null;
  // Ch6
  scoringType?: 'wallet' | 'points';
  startingScore?: number | null;
  maxScore?: number | null;
  // Badge
  badgeId?: string | null;
  badgeName?: string | null;
}

interface SimulationResult {
  score: number;
  walletFinal: number;
  path: string[];
}

interface SimulationRendererProps {
  simulation: SimulationData;
  chapterNumber: number;
  chapterColor: string;
  onComplete: (result: SimulationResult) => void;
}

interface DecisionRecord {
  nodeId: string;
  choiceText: string;
  feedback: string;
  walletImpact: number;
  creditImpact: number;
  scoreImpact: number;
}

/* ── Chapter color map (fallback) ───────────────────────────────────── */

const CHAPTER_COLORS: Record<number, string> = {
  0: '#F5A623',
  1: '#2ECC71',
  2: '#4A90D9',
  3: '#8E44AD',
  4: '#1ABC9C',
  5: '#E74C3C',
  6: '#2980B9',
};

/* ── Helpers ────────────────────────────────────────────────────────── */

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(value);
}

function getNodeById(
  nodes: SimulationNode[],
  id: string
): SimulationNode | undefined {
  return nodes.find((n) => n.nodeId === id);
}

function getMessageIcon(type: string | null | undefined) {
  switch (type) {
    case 'sms':
      return <Smartphone className="w-5 h-5" />;
    case 'whatsapp':
      return <MessageSquare className="w-5 h-5" />;
    case 'email':
      return <Mail className="w-5 h-5" />;
    case 'upi-notification':
      return <CreditCard className="w-5 h-5" />;
    case 'phone-call':
      return <Phone className="w-5 h-5" />;
    default:
      return <MessageSquare className="w-5 h-5" />;
  }
}

function getMessageLabel(type: string | null | undefined): string {
  switch (type) {
    case 'sms':
      return 'SMS';
    case 'whatsapp':
      return 'WhatsApp';
    case 'email':
      return 'Email';
    case 'upi-notification':
      return 'UPI Notification';
    case 'phone-call':
      return 'Incoming Call';
    default:
      return 'Message';
  }
}

/* ── Title Card ─────────────────────────────────────────────────────── */

function TitleCard({
  title,
  description,
  accentColor,
  onBegin,
  reducedMotion,
}: {
  title: string;
  description: string;
  accentColor: string;
  onBegin: () => void;
  reducedMotion: boolean;
}) {
  return (
    <motion.div
      initial={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-50 bg-dark flex items-center justify-center overflow-hidden"
    >
      {/* Subtle radial glow behind content */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full opacity-[0.07] blur-[120px]"
        style={{ backgroundColor: accentColor }}
      />

      <div className="max-w-2xl mx-auto px-8 text-center relative z-10">
        {/* Accent line */}
        <motion.div
          initial={reducedMotion ? {} : { width: 0 }}
          animate={{ width: 80 }}
          transition={{ delay: 0.3, duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
          className="h-1 rounded-full mx-auto mb-10"
          style={{ backgroundColor: accentColor }}
        />

        <motion.p
          initial={reducedMotion ? {} : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="font-mono text-xs uppercase tracking-[0.2em] mb-4"
          style={{ color: accentColor }}
        >
          Simulation
        </motion.p>

        <motion.h1
          initial={reducedMotion ? {} : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
          className="font-display text-5xl md:text-6xl text-white font-bold mb-5 leading-[1.1]"
        >
          {title}
        </motion.h1>

        <motion.p
          initial={reducedMotion ? {} : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.5 }}
          className="font-body text-lg text-white/50 mb-12 leading-relaxed max-w-lg mx-auto"
        >
          {description}
        </motion.p>

        <motion.button
          initial={reducedMotion ? {} : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.15, duration: 0.4 }}
          whileHover={reducedMotion ? undefined : { scale: 1.05, y: -2 }}
          whileTap={reducedMotion ? undefined : { scale: 0.97 }}
          onClick={onBegin}
          className="inline-flex items-center gap-2 px-12 py-4 rounded-xl font-display font-semibold text-lg text-dark transition-all duration-200 shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-dark"
          style={{
            backgroundColor: accentColor,
            boxShadow: `0 8px 40px ${accentColor}40`,
            ['--tw-ring-color' as string]: accentColor,
          }}
        >
          Begin Simulation
        </motion.button>
      </div>
    </motion.div>
  );
}

/* ── Time Skip Overlay ──────────────────────────────────────────────── */

function TimeSkipOverlay({
  text,
  accentColor,
  onDone,
  reducedMotion,
}: {
  text: string;
  accentColor: string;
  onDone: () => void;
  reducedMotion: boolean;
}) {
  useEffect(() => {
    const timer = setTimeout(onDone, reducedMotion ? 100 : 3500);
    return () => clearTimeout(timer);
  }, [onDone, reducedMotion]);

  if (reducedMotion) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
        <p className="font-display text-3xl text-white/90 text-center px-8">
          {text}
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center gap-4"
    >
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: 60 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="h-0.5 rounded-full"
        style={{ backgroundColor: accentColor }}
      />
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="font-display text-3xl md:text-4xl text-white/90 text-center px-8"
      >
        {text}
      </motion.p>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: 60 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="h-0.5 rounded-full"
        style={{ backgroundColor: accentColor }}
      />
    </motion.div>
  );
}

/* ── Typewriter Narrative ───────────────────────────────────────────── */

function TypewriterText({
  text,
  reducedMotion,
}: {
  text: string;
  reducedMotion: boolean;
}) {
  const [revealed, setRevealed] = useState(reducedMotion);

  // Reset when text changes
  useEffect(() => {
    setRevealed(reducedMotion);
  }, [text, reducedMotion]);

  if (reducedMotion || revealed) {
    return (
      <p className="text-lg md:text-xl text-white/90 font-body leading-relaxed max-w-[640px] mx-auto">
        {text}
      </p>
    );
  }

  // Split into words for staggered reveal
  const words = text.split(' ');

  return (
    <button
      type="button"
      onClick={() => setRevealed(true)}
      className="text-left w-full cursor-pointer max-w-[640px] mx-auto block"
      aria-label="Click to reveal full text"
    >
      <p className="text-lg md:text-xl text-white/90 font-body leading-relaxed">
        {words.map((word, i) => (
          <motion.span
            key={`${word}-${i}`}
            initial={{ opacity: 0, filter: 'blur(4px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ delay: i * 0.03, duration: 0.3 }}
            className="inline-block mr-[0.3em]"
          >
            {word}
          </motion.span>
        ))}
      </p>
    </button>
  );
}

/* ── Chip Comment Bubble (Ch0) ──────────────────────────────────────── */

function ChipComment({
  comment,
  accentColor,
}: {
  comment: string;
  accentColor: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.5, duration: 0.4 }}
      className="mt-6 flex items-start gap-3 max-w-[640px] mx-auto"
    >
      {/* Chip avatar */}
      <div
        className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center text-dark font-display font-bold text-sm"
        style={{ backgroundColor: accentColor }}
      >
        C
      </div>
      {/* Speech bubble */}
      <div
        className="relative rounded-xl rounded-tl-sm px-4 py-3 text-sm font-body leading-relaxed"
        style={{
          backgroundColor: `${accentColor}15`,
          borderLeft: `3px solid ${accentColor}`,
          color: 'rgba(255,255,255,0.85)',
        }}
      >
        {comment}
      </div>
    </motion.div>
  );
}

/* ── Feedback Toast ─────────────────────────────────────────────────── */

function FeedbackToast({
  feedback,
  accentColor,
}: {
  feedback: string;
  accentColor: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="mt-6 max-w-[640px] mx-auto rounded-xl p-4"
      style={{
        borderLeft: `4px solid ${accentColor}`,
        backgroundColor: `${accentColor}12`,
      }}
    >
      <p className="text-white/90 font-body leading-relaxed text-sm md:text-base">
        {feedback}
      </p>
    </motion.div>
  );
}

/* ── Stock Impact Display (Ch1) ─────────────────────────────────────── */

function StockImpactDisplay({
  choice,
  accentColor,
}: {
  choice: SimulationChoice;
  accentColor: string;
}) {
  const bought = choice.stocksBought as
    | Array<{
        symbol: string;
        shares: number;
        pricePerShare: number;
        totalCost: number;
      }>
    | null
    | undefined;
  const sold = choice.stocksSold as
    | Array<{
        symbol: string;
        shares: number;
        pricePerShare: number;
        totalCost: number;
      }>
    | null
    | undefined;

  if (!bought?.length && !sold?.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="mt-3 max-w-[640px] mx-auto space-y-2"
    >
      {bought?.map((stock, i) => (
        <div
          key={`buy-${i}`}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-500/10 border border-green-500/20"
        >
          <TrendingUp className="w-4 h-4 text-green-400 shrink-0" />
          <span className="font-mono text-xs text-green-400">
            BUY {stock.shares}x {stock.symbol} @ &#x20B9;
            {formatCurrency(stock.pricePerShare)}
          </span>
          <span className="ml-auto font-mono text-xs text-green-400/70">
            -&#x20B9;{formatCurrency(stock.totalCost)}
          </span>
        </div>
      ))}
      {sold?.map((stock, i) => (
        <div
          key={`sell-${i}`}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20"
        >
          <TrendingDown className="w-4 h-4 text-blue-400 shrink-0" />
          <span className="font-mono text-xs text-blue-400">
            SELL {stock.shares}x {stock.symbol} @ &#x20B9;
            {formatCurrency(stock.pricePerShare)}
          </span>
          <span className="ml-auto font-mono text-xs text-blue-400/70">
            +&#x20B9;{formatCurrency(stock.totalCost)}
          </span>
        </div>
      ))}
    </motion.div>
  );
}

/* ── Ch6 Message Card ───────────────────────────────────────────────── */

function MessageCard({
  node,
  accentColor,
  children,
}: {
  node: SimulationNode;
  accentColor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-[640px] mx-auto">
      {/* Message header */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-3 mb-4"
      >
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: `${accentColor}25` }}
        >
          <span style={{ color: accentColor }}>
            {getMessageIcon(node.type)}
          </span>
        </div>
        <div>
          <span
            className="text-xs font-mono uppercase tracking-wider"
            style={{ color: accentColor }}
          >
            {getMessageLabel(node.type)}
          </span>
        </div>
      </motion.div>
      {/* Message content */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="rounded-xl p-5 border"
        style={{
          backgroundColor: 'rgba(255,255,255,0.04)',
          borderColor: `${accentColor}25`,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/* ── Choice Card (redesigned — no letter badges) ───────────────────── */

function SimChoiceCard({
  text,
  index,
  accentColor,
  onClick,
  disabled,
  selected,
  faded,
  reducedMotion,
}: {
  text: string;
  index: number;
  accentColor: string;
  onClick: () => void;
  disabled: boolean;
  selected: boolean;
  faded: boolean;
  reducedMotion: boolean;
}) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      aria-label={`Choice ${index + 1}: ${text}`}
      aria-disabled={disabled}
      initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
      animate={{
        opacity: faded ? 0.3 : 1,
        y: 0,
        scale: selected ? 1.02 : 1,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 25,
        delay: reducedMotion ? 0 : index * 0.12,
      }}
      whileHover={
        !disabled && !reducedMotion
          ? {
              y: -3,
              boxShadow: `0 8px 32px ${accentColor}20`,
            }
          : undefined
      }
      whileTap={!disabled && !reducedMotion ? { scale: 0.97 } : undefined}
      className={`
        w-full text-left px-6 py-5 rounded-2xl
        bg-white/[0.05] backdrop-blur-sm
        border transition-all duration-200
        focus-visible:ring-2 focus-visible:ring-offset-2 outline-none
        ${
          disabled
            ? 'cursor-not-allowed border-white/10'
            : 'cursor-pointer border-white/15 hover:bg-white/[0.08] hover:border-white/25'
        }
        ${selected ? 'ring-2' : ''}
      `}
      style={
        selected
          ? {
              borderColor: accentColor,
              backgroundColor: `${accentColor}12`,
              outlineColor: accentColor,
            }
          : undefined
      }
    >
      <div className="flex items-center gap-4">
        <span className="text-white/90 font-body text-base leading-relaxed flex-1">
          {text}
        </span>
        {selected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center"
            style={{ backgroundColor: accentColor }}
          >
            <Check className="w-3 h-3 text-white" strokeWidth={3} />
          </motion.div>
        )}
        {!selected && !disabled && (
          <div
            className="w-5 h-5 rounded-full shrink-0 border-2 border-white/20"
          />
        )}
      </div>
    </motion.button>
  );
}

/* ── Results Screen ─────────────────────────────────────────────────── */

function SimulationResults({
  decisions,
  walletFinal,
  startingWallet,
  optimalWallet,
  accentColor,
  endNode,
  isScoreMode,
  scoreFinal,
  maxScore,
  chapterNumber,
  onBack,
}: {
  decisions: DecisionRecord[];
  walletFinal: number;
  startingWallet: number;
  optimalWallet: number;
  accentColor: string;
  endNode: SimulationNode | null;
  isScoreMode: boolean;
  scoreFinal: number;
  maxScore: number;
  chapterNumber: number;
  onBack: () => void;
}) {
  const [reviewExpanded, setReviewExpanded] = useState(false);

  const outcome = endNode?.outcome as {
    title?: string;
    description?: string;
  } | null;
  const outcomeType = endNode?.outcomeType;

  // Fire confetti for good/excellent outcomes
  const didFireConfetti = useRef(false);
  useEffect(() => {
    if (didFireConfetti.current) return;
    if (
      outcomeType === 'excellent' ||
      outcomeType === 'good' ||
      (!outcomeType && walletFinal >= optimalWallet * 0.8)
    ) {
      didFireConfetti.current = true;
      // Small delay for dramatic effect
      const timer = setTimeout(() => fireConfetti(), 600);
      return () => clearTimeout(timer);
    }
  }, [outcomeType, walletFinal, optimalWallet]);

  const outcomeColorMap: Record<string, string> = {
    excellent: '#2ECC71',
    good: '#4A90D9',
    okay: '#F5A623',
    poor: '#E74C3C',
  };
  const outcomeColor = outcomeColorMap[outcomeType ?? ''] ?? accentColor;

  const isNoWallet = chapterNumber === 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="max-w-[720px] mx-auto py-12 px-6"
    >
      {/* Heading */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
        className="text-center mb-12"
      >
        <motion.div
          initial={{ scale: 0, rotate: -15 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 180, damping: 14, delay: 0.3 }}
          className="relative w-24 h-24 mx-auto mb-6"
        >
          <div
            className="w-full h-full rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${outcomeColor}20` }}
          >
            <Trophy className="w-12 h-12" style={{ color: outcomeColor }} />
          </div>
          {/* Expanding glow ring */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: [0, 0.3, 0], scale: [0.8, 1.4, 1.6] }}
            transition={{ duration: 1.5, delay: 0.6 }}
            className="absolute inset-0 rounded-full"
            style={{ backgroundColor: `${outcomeColor}30` }}
          />
        </motion.div>

        {outcome?.title ? (
          <>
            <h2 className="font-display text-4xl md:text-5xl text-white mb-3 leading-tight">
              {outcome.title}
            </h2>
            {outcome.description && (
              <p className="text-white/50 font-body text-lg max-w-md mx-auto leading-relaxed">
                {outcome.description}
              </p>
            )}
          </>
        ) : (
          <>
            <h2 className="font-display text-4xl md:text-5xl text-white mb-3 leading-tight">
              Simulation Complete
            </h2>
            <p className="text-white/50 font-body text-lg">
              Here&apos;s how your decisions played out
            </p>
          </>
        )}
      </motion.div>

      {/* Score / Wallet Comparison — skip for Ch0 (no wallet) */}
      {!isNoWallet && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white/[0.04] backdrop-blur-sm rounded-xl border border-white/10 p-6 mb-8"
        >
          {isScoreMode ? (
            /* Ch6 score display */
            <div className="text-center">
              <h3 className="font-display text-lg text-white/80 mb-4">
                Scam Detection Score
              </h3>
              <div className="flex items-baseline justify-center gap-1">
                <span
                  className="font-mono text-5xl font-bold"
                  style={{ color: accentColor }}
                >
                  {scoreFinal}
                </span>
                <span className="font-mono text-2xl text-white/40">
                  / {maxScore}
                </span>
              </div>
              <div className="mt-4 h-3 bg-white/10 rounded-full overflow-hidden max-w-xs mx-auto">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.min((scoreFinal / maxScore) * 100, 100)}%`,
                  }}
                  transition={{ delay: 0.6, duration: 1, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: accentColor }}
                />
              </div>
            </div>
          ) : (
            /* Standard wallet comparison */
            <>
              <h3 className="font-display text-lg text-white/80 mb-6">
                Wallet Performance
              </h3>
              <div className="space-y-5">
                {/* Starting */}
                <div>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-white/50 font-body">Starting</span>
                    <span className="font-mono text-white/70">
                      &#x20B9;{formatCurrency(startingWallet)}
                    </span>
                  </div>
                  <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${Math.min(
                          optimalWallet > 0
                            ? (startingWallet / optimalWallet) * 100
                            : 50,
                          100
                        )}%`,
                      }}
                      transition={{
                        delay: 0.6,
                        duration: 0.8,
                        ease: 'easeOut',
                      }}
                      className="h-full bg-white/30 rounded-full"
                    />
                  </div>
                </div>

                {/* Your result */}
                <div>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-white/80 font-body font-semibold">
                      Your Result
                    </span>
                    <span className="font-mono text-white font-bold">
                      &#x20B9;{formatCurrency(walletFinal)}
                    </span>
                  </div>
                  <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${Math.min(
                          optimalWallet > 0
                            ? (walletFinal / optimalWallet) * 100
                            : 80,
                          100
                        )}%`,
                      }}
                      transition={{
                        delay: 0.8,
                        duration: 0.8,
                        ease: 'easeOut',
                      }}
                      className={`h-full rounded-full ${
                        walletFinal >= startingWallet
                          ? 'bg-green-500'
                          : 'bg-red-500'
                      }`}
                    />
                  </div>
                </div>

                {/* Optimal */}
                {optimalWallet > 0 && (
                  <div>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-white/50 font-body">Optimal</span>
                      <span
                        className="font-mono"
                        style={{ color: `${accentColor}CC` }}
                      >
                        &#x20B9;{formatCurrency(optimalWallet)}
                      </span>
                    </div>
                    <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{
                          delay: 1.0,
                          duration: 0.8,
                          ease: 'easeOut',
                        }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: `${accentColor}80` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </motion.div>
      )}

      {/* Decision Review (collapsible) */}
      {decisions.length > 0 && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-white/[0.04] backdrop-blur-sm rounded-xl border border-white/10 mb-8 overflow-hidden"
        >
          <button
            onClick={() => setReviewExpanded((prev) => !prev)}
            className="w-full flex items-center justify-between p-6 text-left hover:bg-white/[0.02] transition-colors"
          >
            <h3 className="font-display text-lg text-white/80">
              Decision Review ({decisions.length})
            </h3>
            {reviewExpanded ? (
              <ChevronUp className="w-5 h-5 text-white/40" />
            ) : (
              <ChevronDown className="w-5 h-5 text-white/40" />
            )}
          </button>

          <AnimatePresence>
            {reviewExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-6 space-y-3">
                  {decisions.map((d, i) => {
                    const impact = isScoreMode
                      ? d.scoreImpact
                      : d.walletImpact + d.creditImpact;
                    return (
                      <div
                        key={i}
                        className="flex items-start gap-3 p-3 rounded-lg bg-white/5"
                      >
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                            impact > 0
                              ? 'bg-green-500/20'
                              : impact === 0
                                ? 'bg-yellow-500/20'
                                : 'bg-red-500/20'
                          }`}
                        >
                          {impact > 0 ? (
                            <Check className="w-3.5 h-3.5 text-green-400" />
                          ) : impact === 0 ? (
                            <AlertTriangle className="w-3.5 h-3.5 text-yellow-400" />
                          ) : (
                            <X className="w-3.5 h-3.5 text-red-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white/80 text-sm font-body">
                            {d.choiceText}
                          </p>
                          {d.feedback && (
                            <p className="text-white/50 text-xs font-body mt-0.5">
                              {d.feedback}
                            </p>
                          )}
                        </div>
                        {!isNoWallet && (
                          <span
                            className={`font-mono text-xs shrink-0 ${
                              impact > 0
                                ? 'text-green-400'
                                : impact === 0
                                  ? 'text-yellow-400'
                                  : 'text-red-400'
                            }`}
                          >
                            {isScoreMode
                              ? `${impact > 0 ? '+' : ''}${impact} pts`
                              : `${impact > 0 ? '+' : ''}${impact !== 0 ? formatCurrency(impact) : '0'}`}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Back button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="flex justify-center"
      >
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onBack}
          className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-display font-semibold text-lg text-dark transition-colors shadow-lg"
          style={{
            backgroundColor: accentColor,
            boxShadow: `0 8px 24px ${accentColor}30`,
          }}
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Chapter
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   MAIN SIMULATION RENDERER
   ════════════════════════════════════════════════════════════════════════ */

export default function SimulationRenderer({
  simulation,
  chapterNumber,
  chapterColor,
  onComplete,
}: SimulationRendererProps) {
  const prefersReducedMotion = useReducedMotion() ?? false;

  const accentColor =
    chapterColor || CHAPTER_COLORS[chapterNumber] || '#F5A623';

  /* ── Derived config ──────────────────────────────────────────────── */
  const isScoreMode = simulation.scoringType === 'points';
  const isCh0 = chapterNumber === 0;
  const isCh1 = chapterNumber === 1;
  const isCh5 = chapterNumber === 5;
  const isCh6 = chapterNumber === 6;
  const hasWallet = simulation.startingWallet !== null && !isCh0;

  const startingWallet = simulation.startingWallet ?? 0;
  const optimalWallet = simulation.optimalWalletOutcome ?? startingWallet;
  const startingCredit = simulation.creditBalance ?? 0;
  const startingScore = simulation.startingScore ?? 0;
  const maxScore = simulation.maxScore ?? 100;

  /* ── Wallet label ────────────────────────────────────────────────── */
  const walletLabel = (() => {
    if (simulation.walletLabel) return simulation.walletLabel;
    if (isScoreMode) return 'Scam Detection Score';
    if (isCh5) return 'Monthly Budget';
    if (isCh1) return 'Trading Wallet';
    return 'Virtual Wallet';
  })();

  /* ── State ───────────────────────────────────────────────────────── */
  const [showTitleCard, setShowTitleCard] = useState(true);
  const [currentNodeId, setCurrentNodeId] = useState(simulation.startNodeId);
  const [walletBalance, setWalletBalance] = useState(startingWallet);
  const [previousBalance, setPreviousBalance] = useState(startingWallet);
  const [creditBalance, setCreditBalance] = useState(startingCredit);
  const [previousCredit, setPreviousCredit] = useState(startingCredit);
  const [score, setScore] = useState(startingScore);
  const [previousScore, setPreviousScore] = useState(startingScore);
  const [decisionHistory, setDecisionHistory] = useState<DecisionRecord[]>([]);
  const [pathIds, setPathIds] = useState<string[]>([simulation.startNodeId]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showTimeSkip, setShowTimeSkip] = useState(false);
  const [timeSkipText, setTimeSkipText] = useState('');
  const [activeFeedback, setActiveFeedback] = useState<string | null>(null);
  const [activeStockChoice, setActiveStockChoice] =
    useState<SimulationChoice | null>(null);
  const [selectedChoiceIndex, setSelectedChoiceIndex] = useState<number | null>(
    null
  );
  const [isEnd, setIsEnd] = useState(false);

  const currentNode = getNodeById(simulation.nodes, currentNodeId);

  /* ── Show time skip when entering a new node ─────────────────────── */
  useEffect(() => {
    if (currentNode?.timeSkip && !isEnd && !showTitleCard) {
      setTimeSkipText(currentNode.timeSkip);
      setShowTimeSkip(true);
    }
  }, [currentNodeId, currentNode, isEnd, showTitleCard]);

  /* ── Handle choice ───────────────────────────────────────────────── */
  const handleChoice = useCallback(
    (choice: SimulationChoice, choiceIndex: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setSelectedChoiceIndex(choiceIndex);

      // Record decision
      const record: DecisionRecord = {
        nodeId: currentNodeId,
        choiceText: choice.text,
        feedback: choice.feedback ?? '',
        walletImpact: choice.walletImpact ?? 0,
        creditImpact: choice.creditImpact ?? 0,
        scoreImpact: choice.scoreImpact ?? 0,
      };

      setDecisionHistory((prev) => [...prev, record]);

      // Show feedback
      if (choice.feedback) {
        setActiveFeedback(choice.feedback);
      }

      // Show stock trades (Ch1)
      if (isCh1 && (choice.stocksBought || choice.stocksSold)) {
        setActiveStockChoice(choice);
      }

      // Animate wallet / credit / score
      if (hasWallet && !isScoreMode) {
        setPreviousBalance(walletBalance);
        setWalletBalance((prev) => prev + (choice.walletImpact ?? 0));
      }
      if (isCh5 && choice.creditImpact) {
        setPreviousCredit(creditBalance);
        setCreditBalance((prev) => prev + choice.creditImpact!);
      }
      if (isScoreMode && choice.scoreImpact) {
        setPreviousScore(score);
        setScore((prev) => prev + choice.scoreImpact!);
      }

      // Transition after delay — give users time to read feedback
      const delay = choice.feedback ? 5000 : 800;
      setTimeout(() => {
        setActiveFeedback(null);
        setActiveStockChoice(null);
        setSelectedChoiceIndex(null);

        const nextNode = getNodeById(simulation.nodes, choice.nextNodeId);
        setCurrentNodeId(choice.nextNodeId);
        setPathIds((prev) => [...prev, choice.nextNodeId]);

        if (nextNode?.isEnd) {
          // If end node has explicit balances, use them
          if (nextNode.walletBalance != null) {
            setPreviousBalance(walletBalance + (choice.walletImpact ?? 0));
            setWalletBalance(nextNode.walletBalance);
          }
          if (nextNode.creditBalance != null) {
            setPreviousCredit(
              creditBalance + (choice.creditImpact ?? 0)
            );
            setCreditBalance(nextNode.creditBalance);
          }
          setIsEnd(true);
        }

        setIsTransitioning(false);
      }, delay);
    },
    [
      currentNodeId,
      isTransitioning,
      walletBalance,
      creditBalance,
      score,
      simulation.nodes,
      hasWallet,
      isScoreMode,
      isCh1,
      isCh5,
    ]
  );

  /* ── Handle completion ───────────────────────────────────────────── */
  const handleComplete = useCallback(() => {
    const goodDecisions = decisionHistory.filter((d) => {
      if (isScoreMode) return d.scoreImpact > 0;
      return (d.walletImpact + d.creditImpact) > 0;
    }).length;
    const totalDecisions = decisionHistory.length;
    const pctScore =
      totalDecisions > 0
        ? Math.round((goodDecisions / totalDecisions) * 100)
        : 0;

    onComplete({
      score: isScoreMode ? score : pctScore,
      walletFinal: isScoreMode ? score : walletBalance,
      path: pathIds,
    });
  }, [decisionHistory, walletBalance, score, pathIds, onComplete, isScoreMode]);

  /* ── RENDER: Title Card ──────────────────────────────────────────── */
  if (showTitleCard) {
    return (
      <AnimatePresence>
        <TitleCard
          title={simulation.title}
          description={simulation.description}
          accentColor={accentColor}
          onBegin={() => setShowTitleCard(false)}
          reducedMotion={prefersReducedMotion}
        />
      </AnimatePresence>
    );
  }

  /* ── RENDER: End Screen ──────────────────────────────────────────── */
  if (isEnd) {
    const endNode = currentNode ?? null;
    return (
      <div className="bg-dark min-h-screen text-white relative">
        {/* Letterbox top */}
        <div className="h-12 bg-black w-full" />

        <SimulationResults
          decisions={decisionHistory}
          walletFinal={walletBalance}
          startingWallet={startingWallet}
          optimalWallet={optimalWallet}
          accentColor={accentColor}
          endNode={endNode}
          isScoreMode={isScoreMode}
          scoreFinal={score}
          maxScore={maxScore}
          chapterNumber={chapterNumber}
          onBack={handleComplete}
        />

        {/* Letterbox bottom */}
        <div className="h-12 bg-black w-full" />
      </div>
    );
  }

  /* ── RENDER: Gameplay ────────────────────────────────────────────── */

  // Determine what wallet display to show
  const showWalletUI = hasWallet && !isScoreMode && !isCh0;
  const showScoreUI = isScoreMode;
  const showCreditUI = isCh5;

  return (
    <div className="bg-dark min-h-screen text-white relative">
      {/* Time skip overlay */}
      <AnimatePresence>
        {showTimeSkip && (
          <TimeSkipOverlay
            text={timeSkipText}
            accentColor={accentColor}
            onDone={() => setShowTimeSkip(false)}
            reducedMotion={prefersReducedMotion}
          />
        )}
      </AnimatePresence>

      {/* Letterbox top */}
      <div className="h-12 bg-black w-full" />

      {/* Wallet / Score display — fixed top right */}
      <div className="fixed top-16 right-6 z-40 flex flex-col gap-2 items-end">
        {showScoreUI && (
          <WalletDisplay
            balance={score}
            previousBalance={previousScore}
            label="Scam Detection Score"
            scoreMode
            maxScore={maxScore}
            accentColor={accentColor}
          />
        )}
        {showWalletUI && (
          <WalletDisplay
            balance={walletBalance}
            previousBalance={previousBalance}
            label={walletLabel}
            accentColor={accentColor}
          />
        )}
        {showCreditUI && (
          <WalletDisplay
            balance={creditBalance}
            previousBalance={previousCredit}
            label="Credit Balance"
            creditMode
            creditLimit={simulation.creditLimit ?? undefined}
            accentColor="#E74C3C"
          />
        )}
      </div>

      {/* Content */}
      <div className="max-w-[800px] mx-auto px-6 py-12">
        {/* Node content with transitions */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentNodeId}
            initial={
              prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 16 }
            }
            animate={{ opacity: 1, y: 0 }}
            exit={
              prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -16 }
            }
            transition={{ duration: 0.5 }}
          >
            {currentNode && (
              <>
                {/* Ch1 time label */}
                {isCh1 && currentNode.timeLabel && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2 mb-4 max-w-[640px] mx-auto"
                  >
                    <Clock className="w-4 h-4" style={{ color: accentColor }} />
                    <span
                      className="font-mono text-sm"
                      style={{ color: accentColor }}
                    >
                      {currentNode.timeLabel}
                    </span>
                  </motion.div>
                )}

                {/* Ch5 month label */}
                {isCh5 && currentNode.month != null && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2 mb-4 max-w-[640px] mx-auto"
                  >
                    <span
                      className="font-mono text-xs uppercase tracking-wider px-3 py-1 rounded-full"
                      style={{
                        backgroundColor: `${accentColor}15`,
                        color: accentColor,
                      }}
                    >
                      Month {currentNode.month}
                    </span>
                  </motion.div>
                )}

                {/* Narrative — Ch6 wraps in message card */}
                {isCh6 && currentNode.type ? (
                  <MessageCard node={currentNode} accentColor={accentColor}>
                    <TypewriterText
                      text={currentNode.narrative}
                      reducedMotion={prefersReducedMotion}
                    />
                  </MessageCard>
                ) : (
                  <TypewriterText
                    text={currentNode.narrative}
                    reducedMotion={prefersReducedMotion}
                  />
                )}

                {/* Ch0 Chip comment */}
                {isCh0 && currentNode.chipComment && (
                  <ChipComment
                    comment={currentNode.chipComment}
                    accentColor={accentColor}
                  />
                )}

                {/* Feedback toast */}
                <AnimatePresence>
                  {activeFeedback && (
                    <FeedbackToast
                      feedback={activeFeedback}
                      accentColor={accentColor}
                    />
                  )}
                </AnimatePresence>

                {/* Stock impact display (Ch1) */}
                <AnimatePresence>
                  {activeStockChoice && (
                    <StockImpactDisplay
                      choice={activeStockChoice}
                      accentColor={accentColor}
                    />
                  )}
                </AnimatePresence>

                {/* Choices */}
                {!activeFeedback && (
                  <div className="space-y-3 mt-10 max-w-[640px] mx-auto">
                    {currentNode.choices.map((choice, i) => (
                      <SimChoiceCard
                        key={`${currentNodeId}-${i}`}
                        text={choice.text}
                        index={i}
                        accentColor={accentColor}
                        onClick={() => handleChoice(choice, i)}
                        disabled={isTransitioning}
                        selected={selectedChoiceIndex === i}
                        faded={
                          selectedChoiceIndex !== null &&
                          selectedChoiceIndex !== i
                        }
                        reducedMotion={prefersReducedMotion}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Letterbox bottom */}
      <div className="h-12 bg-black w-full" />
    </div>
  );
}
