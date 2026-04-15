'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Lock,
  Check,
  X,
  Sparkles,
  Award,
  Lightbulb,
  Clock,
  ChevronRight,
  AlertTriangle,
  Flame,
  Zap,
  ArrowRight,
  Trophy,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import BadgeToast from '@/components/gamification/BadgeToast';
import { fireConfetti } from '@/lib/confetti';

// ── Types ────────────────────────────────────────────────────────────────

interface ChallengeOption {
  text: string;
  isCorrect: boolean;
}

interface SimulationChoice {
  text: string;
  nextNodeId: string;
  walletImpact?: number;
  scoreImpact?: number;
  feedback?: string;
}

interface SimulationNode {
  nodeId: string;
  narrative: string;
  choices: SimulationChoice[];
  isEnd: boolean;
  outcomeTitle?: string;
  outcomeDescription?: string;
}

interface ChallengeContent {
  // Quiz / Scenario fields
  type?: string;
  prompt?: string;
  scenario?: string;
  options?: ChallengeOption[];
  explanation?: string;
  questions?: Array<{
    prompt?: string;
    options?: ChallengeOption[];
    explanation?: string;
  }>;
  // Mini-simulation fields (ch6 style — nodes inside content)
  setup?: string;
  startNodeId?: string;
  startingWallet?: number;
  nodes?: SimulationNode[];
}

interface ChallengeData {
  _id: string;
  type: 'quiz' | 'scenario' | 'mini-simulation';
  title: string;
  content: ChallengeContent;
  // Mini-simulation fields (ch3 style — at top level alongside content)
  description?: string;
  startingWallet?: number;
  nodes?: SimulationNode[];
  xpReward: number;
  requiredChaptersCompleted: number;
  alreadyCompleted: boolean;
  hasRequiredChapters: boolean;
  date: string;
  streak: {
    current: number;
    longest: number;
  };
}

interface SubmitResult {
  score: number;
  maxScore: number;
  xpEarned: number;
  newTotalXP: number;
  league: string;
  badgesEarned: Array<{ name: string; icon: string }>;
  streakUpdate: { currentStreak: number; longestStreak: number };
}

type PageState =
  | 'loading'
  | 'locked'
  | 'already-done'
  | 'challenge'
  | 'results'
  | 'error';

// ── Countdown Hook ───────────────────────────────────────────────────────

function useCountdown() {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    function calculate() {
      const now = new Date();
      // IST offset: UTC+5:30
      const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
      const istNow = new Date(now.getTime() + IST_OFFSET_MS + now.getTimezoneOffset() * 60000);
      const tomorrow = new Date(istNow);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const diff = tomorrow.getTime() - istNow.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
      );
    }

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, []);

  return timeLeft;
}

// ── XP Counter Animation ─────────────────────────────────────────────────

function AnimatedXP({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (value === 0) return;
    const duration = 1200;
    const steps = 30;
    const increment = value / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.round(increment * step), value);
      setDisplay(current);
      if (step >= steps) {
        clearInterval(timer);
        setDisplay(value);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <span className="font-mono text-5xl text-accent font-bold tabular-nums">
      +{display} XP
    </span>
  );
}

// ── Main Component ───────────────────────────────────────────────────────

export default function DailyChallengePage() {
  const [pageState, setPageState] = useState<PageState>('loading');
  const [challenge, setChallenge] = useState<ChallengeData | null>(null);

  // Quiz/Scenario state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [answers, setAnswers] = useState<number[]>([]);

  // Mini-simulation state
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
  const [simWallet, setSimWallet] = useState(0);
  const [simFeedback, setSimFeedback] = useState<string | null>(null);
  const [simChoicesMade, setSimChoicesMade] = useState<number[]>([]);
  const [simEnded, setSimEnded] = useState(false);

  // Shared
  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [badgeToast, setBadgeToast] = useState<{
    name: string;
    visible: boolean;
  }>({ name: '', visible: false });

  const confettiFired = useRef(false);
  const countdown = useCountdown();

  // ── Fetch challenge ──────────────────────────────────────────────────

  useEffect(() => {
    async function fetchChallenge() {
      try {
        const res = await fetch('/api/challenges/today');
        if (!res.ok) {
          if (res.status === 404) {
            setPageState('error');
            return;
          }
          throw new Error('Failed to fetch');
        }
        const data: ChallengeData = await res.json();
        setChallenge(data);

        if (!data.hasRequiredChapters) {
          setPageState('locked');
        } else if (data.alreadyCompleted) {
          setPageState('already-done');
        } else {
          setPageState('challenge');

          // Initialize mini-simulation state
          if (data.type === 'mini-simulation') {
            const nodes = getSimNodes(data);
            const startId = getSimStartNodeId(data);
            if (nodes.length > 0 && startId) {
              setCurrentNodeId(startId);
              setSimWallet(data.startingWallet ?? data.content?.startingWallet ?? 0);
            }
          }
        }
      } catch {
        setPageState('error');
      }
    }

    fetchChallenge();
  }, []);

  // ── Fire confetti on results ─────────────────────────────────────────

  useEffect(() => {
    if (pageState === 'results' && !confettiFired.current) {
      confettiFired.current = true;
      // Small delay so the results card is visible first
      const timer = setTimeout(() => {
        fireConfetti();
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [pageState]);

  // ── Helpers for quiz/scenario ────────────────────────────────────────

  const getQuestions = useCallback(() => {
    if (!challenge) return [];
    const content = challenge.content;

    // Multi-question format
    if (content.questions && content.questions.length > 0) {
      return content.questions.map((q) => ({
        prompt: q.prompt || '',
        options: q.options || [],
        explanation: q.explanation || '',
      }));
    }

    // Single question format (flat prompt/options — most common)
    return [
      {
        prompt: content.prompt || '',
        options: content.options || [],
        explanation: content.explanation || '',
      },
    ];
  }, [challenge]);

  // ── Helpers for mini-simulation ──────────────────────────────────────

  function getSimNodes(data: ChallengeData): SimulationNode[] {
    // Ch3 style: nodes at top level
    if (data.nodes && Array.isArray(data.nodes) && data.nodes.length > 0) {
      return data.nodes;
    }
    // Ch6 style: nodes inside content
    if (
      data.content?.nodes &&
      Array.isArray(data.content.nodes) &&
      data.content.nodes.length > 0
    ) {
      return data.content.nodes;
    }
    return [];
  }

  function getSimStartNodeId(data: ChallengeData): string | null {
    // Ch6 style: startNodeId inside content
    if (data.content?.startNodeId) return data.content.startNodeId;
    // Ch3 style: first node
    const nodes = getSimNodes(data);
    return nodes.length > 0 ? nodes[0].nodeId : null;
  }

  function getCurrentSimNode(): SimulationNode | null {
    if (!challenge || !currentNodeId) return null;
    const nodes = getSimNodes(challenge);
    return nodes.find((n) => n.nodeId === currentNodeId) || null;
  }

  // ── Handlers: Quiz / Scenario ────────────────────────────────────────

  const questions = challenge?.type !== 'mini-simulation' ? getQuestions() : [];
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;

  const handleSelectAnswer = (index: number) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswer(index);
  };

  const handleConfirmAnswer = () => {
    if (selectedAnswer === null) return;
    setIsAnswerSubmitted(true);
  };

  const handleNextQuestion = async () => {
    if (isSubmitting) return;

    const newAnswers = [...answers, selectedAnswer!];
    setAnswers(newAnswers);

    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
    } else {
      await submitChallenge(newAnswers);
    }
  };

  // ── Handlers: Mini-Simulation ────────────────────────────────────────

  const handleSimChoice = (choiceIndex: number) => {
    const node = getCurrentSimNode();
    if (!node) return;
    const choice = node.choices[choiceIndex];
    if (!choice) return;

    // Apply wallet/score impact
    const walletDelta = choice.walletImpact ?? choice.scoreImpact ?? 0;
    setSimWallet((prev) => prev + walletDelta);
    setSimChoicesMade((prev) => [...prev, choiceIndex]);

    // Show feedback if present
    if (choice.feedback) {
      setSimFeedback(choice.feedback);
    } else {
      setSimFeedback(null);
    }

    // Navigate to next node
    const nodes = challenge ? getSimNodes(challenge) : [];
    const nextNode = nodes.find((n) => n.nodeId === choice.nextNodeId);
    if (nextNode) {
      setCurrentNodeId(nextNode.nodeId);
      if (nextNode.isEnd) {
        setSimEnded(true);
      }
    }
  };

  const handleSimComplete = async () => {
    await submitChallenge(simChoicesMade);
  };

  // ── Submit ───────────────────────────────────────────────────────────

  async function submitChallenge(answerData: number[]) {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch('/api/challenges/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeId: challenge!._id,
          answers: answerData,
        }),
      });

      if (res.ok) {
        const data: SubmitResult = await res.json();
        setSubmitResult(data);
        setPageState('results');

        if (data.badgesEarned && data.badgesEarned.length > 0) {
          setBadgeToast({
            name: data.badgesEarned[0].name,
            visible: true,
          });
        }
      } else {
        setSubmitError('Failed to submit your answers. Please try again.');
      }
    } catch {
      setSubmitError(
        'Network error. Please check your connection and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  // ── Date formatting ──────────────────────────────────────────────────

  const formattedDate = new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  // ── Type label helper ────────────────────────────────────────────────

  function getTypeLabel(type: string): string {
    switch (type) {
      case 'scenario':
        return 'Scenario';
      case 'mini-simulation':
        return 'Mini Simulation';
      case 'quiz':
      default:
        return 'Quiz';
    }
  }

  // ── Render ───────────────────────────────────────────────────────────

  const currentSimNode = getCurrentSimNode();

  return (
    <div>
      <BadgeToast
        badgeName={badgeToast.name}
        isVisible={badgeToast.visible}
        onDismiss={() => setBadgeToast({ name: '', visible: false })}
      />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent/15 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold text-dark">
                Daily Challenge
              </h1>
              <p className="text-muted font-body text-sm">{formattedDate}</p>
            </div>
          </div>

          {/* Streak badge in header */}
          {challenge && challenge.streak && challenge.streak.current > 0 && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.3 }}
              className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-full px-4 py-2"
            >
              <Flame className="w-5 h-5 text-orange-500" />
              <span className="font-mono font-bold text-orange-600 text-sm">
                {challenge.streak.current} day streak
              </span>
            </motion.div>
          )}
        </div>

        {/* Countdown to next challenge */}
        {pageState !== 'loading' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-2 mt-3 ml-[52px]"
          >
            <Clock className="w-3.5 h-3.5 text-muted" />
            <p className="text-muted font-body text-xs">
              Next challenge in{' '}
              <span className="font-mono text-dark font-semibold">
                {countdown}
              </span>
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Loading state */}
      {pageState === 'loading' && (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-3 border-accent border-t-transparent rounded-full animate-spin" />
            <p className="text-muted font-body text-sm">
              Loading today&apos;s challenge...
            </p>
          </div>
        </div>
      )}

      {/* Error state */}
      {pageState === 'error' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card variant="bordered" className="max-w-lg mx-auto text-center py-12">
            <AlertTriangle className="w-12 h-12 text-muted mx-auto mb-4" />
            <h2 className="font-display text-xl text-dark mb-2">
              No Challenge Available
            </h2>
            <p className="text-muted font-body text-sm max-w-sm mx-auto">
              There&apos;s no daily challenge available right now. Check back
              tomorrow!
            </p>
          </Card>
        </motion.div>
      )}

      {/* Locked state */}
      {pageState === 'locked' && challenge && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card
            variant="bordered"
            className="max-w-lg mx-auto text-center py-12"
          >
            <div className="w-16 h-16 rounded-full bg-fill-muted flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-text-disabled" />
            </div>
            <h2 className="font-display text-xl text-dark mb-2">
              Challenge Locked
            </h2>
            <p className="text-muted font-body text-sm max-w-sm mx-auto mb-4">
              Complete at least{' '}
              <span className="font-semibold text-dark">
                {challenge.requiredChaptersCompleted} chapter
                {challenge.requiredChaptersCompleted !== 1 ? 's' : ''}
              </span>{' '}
              to unlock daily challenges.
            </p>
            <a href="/dashboard">
              <Button
                variant="primary"
                size="md"
                className="font-display font-semibold"
              >
                Go to Dashboard
              </Button>
            </a>
          </Card>
        </motion.div>
      )}

      {/* Already completed */}
      {pageState === 'already-done' && challenge && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card
            variant="elevated"
            className="max-w-lg mx-auto text-center py-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="w-20 h-20 rounded-full bg-primary-light flex items-center justify-center mx-auto mb-5"
            >
              <Check className="w-10 h-10 text-primary" />
            </motion.div>
            <h2 className="font-display text-2xl text-dark mb-2">
              Challenge Complete!
            </h2>
            <p className="text-muted font-body text-base mb-2">
              You&apos;ve already completed today&apos;s challenge.
            </p>

            {/* Streak display */}
            {challenge.streak && challenge.streak.current > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-full px-4 py-2 mb-4"
              >
                <Flame className="w-5 h-5 text-orange-500" />
                <span className="font-mono font-bold text-orange-600">
                  {challenge.streak.current} day streak
                </span>
              </motion.div>
            )}

            <div className="flex items-center justify-center gap-2 mb-6">
              <Clock className="w-4 h-4 text-muted" />
              <p className="text-muted font-body text-sm">
                Next challenge in{' '}
                <span className="font-mono font-semibold text-dark">
                  {countdown}
                </span>
              </p>
            </div>
            <a href="/dashboard">
              <Button
                variant="secondary"
                size="md"
                className="font-display font-semibold"
              >
                Back to Dashboard
              </Button>
            </a>
          </Card>
        </motion.div>
      )}

      {/* ── Active Challenge: Quiz / Scenario ─────────────────────────── */}
      {pageState === 'challenge' &&
        challenge &&
        challenge.type !== 'mini-simulation' &&
        currentQuestion && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            {/* Challenge info card */}
            <Card variant="elevated" className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-semibold uppercase tracking-wider text-accent">
                    {getTypeLabel(challenge.type)}
                  </span>
                  <span className="text-xs font-body text-muted">
                    |{' '}
                    <span className="font-mono text-accent">
                      +{challenge.xpReward} XP
                    </span>
                  </span>
                </div>
                {totalQuestions > 1 && (
                  <span className="text-xs font-mono text-muted">
                    {currentQuestionIndex + 1}/{totalQuestions}
                  </span>
                )}
              </div>

              <h2 className="font-display text-xl text-dark mb-1">
                {challenge.title}
              </h2>

              {/* Scenario context block */}
              {(challenge.type === 'scenario' ||
                challenge.content.type === 'scenario') &&
                challenge.content.scenario && (
                  <div className="mt-3 border-l-4 border-accent/40 bg-accent/5 p-4 rounded-r-lg">
                    <p className="font-body text-dark/80 text-sm leading-relaxed">
                      {challenge.content.scenario}
                    </p>
                  </div>
                )}

              {/* Progress dots for multi-question */}
              {totalQuestions > 1 && (
                <div className="flex items-center gap-1.5 mt-3">
                  {Array.from({ length: totalQuestions }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i < currentQuestionIndex
                          ? 'bg-primary flex-1'
                          : i === currentQuestionIndex
                            ? 'bg-accent flex-[2]'
                            : 'bg-border flex-1'
                      }`}
                    />
                  ))}
                </div>
              )}
            </Card>

            {/* Question */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestionIndex}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
              >
                {/* Prompt */}
                {challenge.type === 'scenario' ||
                challenge.content.type === 'scenario' ? (
                  <div className="border-l-4 border-accent bg-accent/5 p-5 rounded-lg mb-6">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                      <p className="font-body text-dark/90 leading-relaxed text-base">
                        {currentQuestion.prompt}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="mb-6">
                    <h3 className="font-display text-lg text-dark leading-snug">
                      {currentQuestion.prompt}
                    </h3>
                  </div>
                )}

                {/* Options */}
                <div className="space-y-3 mb-6">
                  {currentQuestion.options.map((option, i) => {
                    const isSelected = selectedAnswer === i;
                    const isCorrect = option.isCorrect;
                    const letters = ['A', 'B', 'C', 'D', 'E', 'F'];

                    let borderClass = 'border-border hover:border-primary/40';
                    let bgClass = 'bg-surface';

                    if (isAnswerSubmitted && isSelected && isCorrect) {
                      borderClass = 'border-primary';
                      bgClass = 'bg-primary-light/50';
                    } else if (isAnswerSubmitted && isSelected && !isCorrect) {
                      borderClass = 'border-error';
                      bgClass = 'bg-error/5';
                    } else if (
                      isAnswerSubmitted &&
                      !isSelected &&
                      isCorrect
                    ) {
                      borderClass = 'border-primary/50';
                      bgClass = 'bg-primary-light/30';
                    } else if (isSelected) {
                      borderClass = 'border-accent';
                      bgClass = 'bg-accent/5';
                    }

                    return (
                      <motion.button
                        key={i}
                        onClick={() => handleSelectAnswer(i)}
                        disabled={isAnswerSubmitted}
                        whileHover={
                          !isAnswerSubmitted ? { scale: 1.01 } : undefined
                        }
                        whileTap={
                          !isAnswerSubmitted ? { scale: 0.99 } : undefined
                        }
                        animate={
                          isAnswerSubmitted && isSelected && !isCorrect
                            ? { x: [0, -6, 6, -4, 4, -2, 2, 0] }
                            : isAnswerSubmitted && isSelected && isCorrect
                              ? { scale: [1, 1.02, 1] }
                              : {}
                        }
                        className={`
                          w-full p-4 rounded-xl border-2 text-left
                          flex items-center gap-4 transition-colors duration-200
                          disabled:cursor-default
                          ${borderClass} ${bgClass}
                          ${!isAnswerSubmitted ? 'cursor-pointer' : ''}
                        `}
                      >
                        {/* Letter circle */}
                        <div
                          className={`
                            w-9 h-9 rounded-full flex items-center justify-center shrink-0
                            font-display font-semibold text-sm transition-colors duration-200
                            ${
                              isSelected
                                ? isAnswerSubmitted
                                  ? isCorrect
                                    ? 'bg-primary text-white'
                                    : 'bg-error text-white'
                                  : 'bg-accent text-dark'
                                : isAnswerSubmitted && isCorrect
                                  ? 'bg-primary/20 text-primary'
                                  : 'bg-fill-muted text-muted'
                            }
                          `}
                        >
                          {isAnswerSubmitted && isSelected ? (
                            isCorrect ? (
                              <Check className="w-4 h-4" />
                            ) : (
                              <X className="w-4 h-4" />
                            )
                          ) : isAnswerSubmitted && isCorrect ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            letters[i]
                          )}
                        </div>

                        <span className="font-body text-dark flex-1">
                          {option.text}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Confirm button */}
                {!isAnswerSubmitted && selectedAnswer !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={handleConfirmAnswer}
                      className="w-full font-display font-semibold"
                    >
                      Check Answer
                    </Button>
                  </motion.div>
                )}

                {/* Explanation */}
                {isAnswerSubmitted && currentQuestion.explanation && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className={`p-4 rounded-lg border-l-4 mb-6 ${
                      currentQuestion.options[selectedAnswer!]?.isCorrect
                        ? 'border-primary bg-primary-light/30'
                        : 'border-error bg-error/5'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Lightbulb
                        className={`w-5 h-5 mt-0.5 shrink-0 ${
                          currentQuestion.options[selectedAnswer!]?.isCorrect
                            ? 'text-primary'
                            : 'text-error'
                        }`}
                      />
                      <div>
                        <p
                          className={`font-semibold text-sm mb-1 ${
                            currentQuestion.options[selectedAnswer!]?.isCorrect
                              ? 'text-primary'
                              : 'text-error'
                          }`}
                        >
                          {currentQuestion.options[selectedAnswer!]?.isCorrect
                            ? 'Correct!'
                            : 'Not quite right'}
                        </p>
                        <p className="text-dark/80 font-body text-sm leading-relaxed">
                          {currentQuestion.explanation}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Next / Submit button */}
                {isAnswerSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-col items-end gap-2"
                  >
                    {submitError && (
                      <p className="text-sm text-error font-body w-full text-right">
                        {submitError}
                      </p>
                    )}
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={handleNextQuestion}
                      loading={isSubmitting}
                      disabled={isSubmitting}
                      className="font-display font-semibold"
                    >
                      {currentQuestionIndex < totalQuestions - 1 ? (
                        <>
                          Next <ChevronRight className="w-5 h-5" />
                        </>
                      ) : (
                        'See Results'
                      )}
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}

      {/* ── Active Challenge: Mini-Simulation ─────────────────────────── */}
      {pageState === 'challenge' &&
        challenge &&
        challenge.type === 'mini-simulation' &&
        currentSimNode && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            {/* Simulation header card */}
            <Card variant="elevated" className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-semibold uppercase tracking-wider text-accent">
                    Mini Simulation
                  </span>
                  <span className="text-xs font-body text-muted">
                    |{' '}
                    <span className="font-mono text-accent">
                      +{challenge.xpReward} XP
                    </span>
                  </span>
                </div>
                {/* Wallet display */}
                {(challenge.startingWallet ?? 0) > 0 && (
                  <motion.div
                    key={simWallet}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-1.5 bg-primary-light/50 border border-primary/20 rounded-full px-3 py-1"
                  >
                    <Zap className="w-3.5 h-3.5 text-primary" />
                    <span className="font-mono text-sm font-bold text-primary">
                      &#x20B9;{simWallet.toLocaleString('en-IN')}
                    </span>
                  </motion.div>
                )}
              </div>

              <h2 className="font-display text-xl text-dark mb-1">
                {challenge.title}
              </h2>

              {/* Setup / description */}
              {(challenge.content.setup || challenge.description) && (
                <p className="text-muted font-body text-sm mt-2 leading-relaxed">
                  {challenge.content.setup || challenge.description}
                </p>
              )}
            </Card>

            {/* Current node */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentNodeId}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.35 }}
              >
                {/* Narrative */}
                <div className="border-l-4 border-accent bg-accent/5 p-5 rounded-lg mb-6">
                  <p className="font-body text-dark/90 leading-relaxed text-base">
                    {currentSimNode.narrative}
                  </p>
                </div>

                {/* Feedback from previous choice */}
                {simFeedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-6 p-4 rounded-lg bg-primary-light/30 border-l-4 border-primary"
                  >
                    <div className="flex items-start gap-3">
                      <Lightbulb className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                      <p className="font-body text-dark/80 text-sm leading-relaxed">
                        {simFeedback}
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* End node outcome */}
                {currentSimNode.isEnd && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {currentSimNode.outcomeTitle && (
                      <div className="mb-4 p-5 rounded-xl bg-surface border-2 border-primary/30">
                        <div className="flex items-center gap-2 mb-2">
                          <Trophy className="w-5 h-5 text-primary" />
                          <h3 className="font-display font-semibold text-dark">
                            {currentSimNode.outcomeTitle}
                          </h3>
                        </div>
                        {currentSimNode.outcomeDescription && (
                          <p className="font-body text-dark/70 text-sm leading-relaxed">
                            {currentSimNode.outcomeDescription}
                          </p>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Choices */}
                {!currentSimNode.isEnd && currentSimNode.choices.length > 0 && (
                  <div className="space-y-3 mb-6">
                    {currentSimNode.choices.map((choice, i) => (
                      <motion.button
                        key={i}
                        onClick={() => handleSimChoice(i)}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className="
                          w-full p-4 rounded-xl border-2 border-border bg-surface
                          hover:border-accent/60 hover:bg-accent/5
                          text-left flex items-center gap-4
                          transition-colors duration-200 cursor-pointer
                        "
                      >
                        <div className="w-9 h-9 rounded-full bg-accent/15 flex items-center justify-center shrink-0">
                          <ArrowRight className="w-4 h-4 text-accent" />
                        </div>
                        <span className="font-body text-dark flex-1">
                          {choice.text}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                )}

                {/* Complete simulation button (on end node) */}
                {simEnded && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-col items-end gap-2"
                  >
                    {submitError && (
                      <p className="text-sm text-error font-body w-full text-right">
                        {submitError}
                      </p>
                    )}
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={handleSimComplete}
                      loading={isSubmitting}
                      disabled={isSubmitting}
                      className="font-display font-semibold"
                    >
                      See Results
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}

      {/* ── Results ───────────────────────────────────────────────────── */}
      {pageState === 'results' && submitResult && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-lg mx-auto"
        >
          <Card variant="elevated" className="text-center py-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 15,
                delay: 0.2,
              }}
              className="w-20 h-20 rounded-full bg-accent/15 flex items-center justify-center mx-auto mb-5"
            >
              <Sparkles className="w-10 h-10 text-accent" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="font-display text-3xl text-dark mb-2">
                Challenge Complete!
              </h2>

              {/* Score (only show for quiz/scenario) */}
              {challenge?.type !== 'mini-simulation' && (
                <p className="text-muted font-body text-lg mb-2">
                  You scored{' '}
                  <span className="font-semibold text-dark">
                    {submitResult.score}/{submitResult.maxScore}
                  </span>
                </p>
              )}

              {/* Animated XP display */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
                className="mb-6"
              >
                <AnimatedXP value={submitResult.xpEarned} />
              </motion.div>

              {/* Streak info */}
              {submitResult.streakUpdate.currentStreak > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-full px-5 py-2.5 mb-6"
                >
                  <Flame className="w-5 h-5 text-orange-500" />
                  <span className="font-mono font-bold text-orange-600">
                    {submitResult.streakUpdate.currentStreak} day streak!
                  </span>
                  {submitResult.streakUpdate.currentStreak ===
                    submitResult.streakUpdate.longestStreak &&
                    submitResult.streakUpdate.currentStreak > 1 && (
                      <span className="text-xs font-body text-orange-400 ml-1">
                        Personal best!
                      </span>
                    )}
                </motion.div>
              )}

              {/* Badges */}
              {submitResult.badgesEarned.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 }}
                  className="mb-6 flex flex-col items-center gap-2"
                >
                  <div className="flex items-center gap-2 text-accent">
                    <Award className="w-5 h-5" />
                    <span className="font-display font-semibold">
                      Badges Earned
                    </span>
                  </div>
                  <div className="flex gap-2 flex-wrap justify-center">
                    {submitResult.badgesEarned.map((badge, i) => (
                      <span
                        key={i}
                        className="bg-accent/10 text-accent px-3 py-1.5 rounded-full text-sm font-body font-medium"
                      >
                        {badge.name}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Next challenge countdown */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="flex items-center justify-center gap-2 mb-6 text-muted"
              >
                <Clock className="w-4 h-4" />
                <p className="font-body text-sm">
                  Next challenge in{' '}
                  <span className="font-mono font-semibold text-dark">
                    {countdown}
                  </span>
                </p>
              </motion.div>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
              className="flex justify-center gap-3 mt-4"
            >
              <a href="/dashboard">
                <Button
                  variant="primary"
                  size="lg"
                  className="font-display font-semibold shadow-lg shadow-primary/20"
                >
                  Back to Dashboard
                </Button>
              </a>
            </motion.div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
