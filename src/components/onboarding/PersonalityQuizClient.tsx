"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles, Star, Shield, Eye, Zap, ChevronRight } from "lucide-react";
import { fireConfetti } from "@/lib/confetti";
import Button from "@/components/ui/Button";

/* ─────────────────── Types ─────────────────── */

type PersonalityTypeId = "saver" | "spender" | "investor" | "avoider" | "risk-taker";

interface ScoreMap {
  [key: string]: number;
}

interface QuizOption {
  text: string;
  scores: ScoreMap;
}

interface QuizQuestion {
  questionId: string;
  question: string;
  options: QuizOption[];
}

interface PersonalityResult {
  typeId: PersonalityTypeId;
  name: string;
  emoji: string;
  tagline: string;
  description: string;
  superpower: string;
  blindSpot: string;
  watchOut: string;
  celebrity: string;
}

type QuizPhase = "intro" | "quiz" | "calculating" | "result";

/* ─────────────────── Quiz Data ─────────────────── */

const PERSONALITY_TYPES: PersonalityResult[] = [
  {
    typeId: "saver",
    name: "The Saver",
    emoji: "\uD83D\uDC3F\uFE0F",
    tagline: "You've always got something set aside",
    description:
      "You genuinely enjoy watching your balance grow and you feel deeply uncomfortable spending money on things that feel 'wasteful.' You're reliable, prepared, and never scrambling for cash at the end of the month. Your emergency fund is probably already a thing.",
    superpower:
      "You're financially safe and rarely stressed about money. You can handle unexpected expenses, you don't live paycheck to paycheck, and you're building a foundation everyone else envies.",
    blindSpot:
      "You might be so focused on saving that you forget to *use* your money \u2014 or invest it. Cash sitting in a savings account loses value to inflation every year. Also, it's okay to enjoy money sometimes.",
    watchOut:
      "Under-investing and over-saving \u2014 when your money earns less than inflation, you're technically losing wealth even as your balance grows.",
    celebrity: "The most prepared person in the room.",
  },
  {
    typeId: "spender",
    name: "The Spender",
    emoji: "\uD83C\uDF89",
    tagline: "Life is short, money is made to move",
    description:
      "You love treating yourself and people around you. Money feels like a tool for experiences, not something to be hoarded. You're fun, generous, and you know how to enjoy your earnings. The problem is that 'Future You' sometimes wonders where it all went.",
    superpower:
      "You're great at enjoying life, being generous, and creating experiences. You're not stressed about spending \u2014 you see money as a flow, not a pile. People love being around you for this energy.",
    blindSpot:
      "Short-term thinking can leave you vulnerable. No emergency fund, no savings habit, relying on income that might not always come. One bad month can become a crisis.",
    watchOut:
      "Lifestyle inflation \u2014 every time your income goes up, your expenses go up with it, and savings never quite happen.",
    celebrity:
      "The most fun person to travel with, but maybe don't look at their bank account before a trip.",
  },
  {
    typeId: "investor",
    name: "The Investor",
    emoji: "\uD83D\uDCC8",
    tagline: "Every rupee should be doing a job",
    description:
      "You think about where your money is going and expect it to work for you. You've probably already looked into SIPs, mutual funds, or at least thought about it. You see money as a tool to build the future, not just get through the month.",
    superpower:
      "You're wired for long-term thinking. You can delay gratification, you understand that today's small sacrifice becomes tomorrow's financial freedom, and you don't panic when markets dip.",
    blindSpot:
      "You can get so focused on optimization that you over-think, over-research, and under-act. Paralysis by analysis is real. Also, you might under-spend on present experiences that genuinely matter.",
    watchOut:
      "Over-researching without executing \u2014 spending six months comparing mutual funds instead of just starting a \u20B9500/month SIP.",
    celebrity: "The person who will have the most interesting financial life at 35.",
  },
  {
    typeId: "avoider",
    name: "The Avoider",
    emoji: "\uD83D\uDE48",
    tagline: "Money stuff is stressful \u2014 I'll deal with it later",
    description:
      "You find money conversations overwhelming and tend to avoid looking at your bank balance, your bills, or your spending patterns. It's not that you don't care \u2014 it's that the whole topic feels like a lot. So you just... don't look.",
    superpower:
      "Often deeply empathetic, value-driven, and not materialistic. You care about things beyond money \u2014 relationships, experiences, creativity. Money just isn't your main focus.",
    blindSpot:
      "Avoidance doesn't make financial problems smaller. It makes them bigger. Unread credit card bills, unchecked subscriptions, ignored tax filing \u2014 silence makes things worse.",
    watchOut:
      "Debt accumulation and financial surprises \u2014 by the time you look, there might be a lot to deal with. Small problems compound quietly.",
    celebrity:
      "The most likely to be surprised by their own bank balance \u2014 in both directions.",
  },
  {
    typeId: "risk-taker",
    name: "The Risk-Taker",
    emoji: "\uD83C\uDFB2",
    tagline: "High risk, high reward \u2014 let's go",
    description:
      "You're drawn to the exciting end of money decisions \u2014 crypto, stocks, side hustles, new opportunities. You're not afraid of losing \u2014 in fact, the thrill of a big win motivates you. You move fast and you're not waiting for 'perfect.'",
    superpower:
      "You spot opportunities others miss. You're willing to try things that others hesitate at, and occasionally you'll hit something huge. Your appetite for action means you actually do things.",
    blindSpot:
      "Risk without knowledge is just gambling. The confidence that comes with your personality type can lead to large losses on things you didn't fully understand. 'High risk' has 'risk' in the name.",
    watchOut:
      "Overconfidence in new or complex financial products \u2014 crypto, F&O trading, MLM schemes. High conviction \u2260 good research.",
    celebrity:
      "The person in the group chat sharing the next big thing \u2014 sometimes it's a gem, sometimes it's a cautionary tale.",
  },
];

const QUESTIONS: QuizQuestion[] = [
  {
    questionId: "mpq-1",
    question:
      "It's the 5th of the month. You just got paid. What do you actually do first?",
    options: [
      {
        text: "Move a fixed amount to savings immediately, before I spend anything",
        scores: { saver: 3, investor: 1 },
      },
      {
        text: "Check what bills are due, then figure out what I have to spend freely",
        scores: { spender: 2, avoider: 1 },
      },
      {
        text: "Invest a chunk into SIPs or stocks, then budget the rest",
        scores: { investor: 3, "risk-taker": 1 },
      },
      {
        text: "Transfer some to investments immediately and look for any new opportunities",
        scores: { "risk-taker": 3, investor: 1 },
      },
      {
        text: "Honestly? It kind of just... gets spent. I don't really have a system.",
        scores: { avoider: 3, spender: 1 },
      },
    ],
  },
  {
    questionId: "mpq-2",
    question:
      "Your favorite sneakers just dropped in a limited edition colorway. They're \u20B97,500 \u2014 a bit of a stretch. What happens?",
    options: [
      {
        text: "I buy them. YOLO. I work hard and I deserve things I love.",
        scores: { spender: 3, "risk-taker": 1 },
      },
      {
        text: "I track the resell value and buy as an investment if margins look good.",
        scores: { "risk-taker": 3, investor: 1 },
      },
      {
        text: "I really want them but I'll wait a week and see if I still want them. If yes, maybe.",
        scores: { saver: 2, investor: 1 },
      },
      {
        text: "I put them in my wishlist and check my budget. Can I fit it in this month without cutting elsewhere?",
        scores: { saver: 3, investor: 1 },
      },
      {
        text: "I close the app. I feel vaguely stressed. I'll think about it later.",
        scores: { avoider: 3 },
      },
    ],
  },
  {
    questionId: "mpq-3",
    question: "How often do you actually check your bank balance?",
    options: [
      {
        text: "Every day or every few days \u2014 I like knowing exactly where I stand.",
        scores: { saver: 3, investor: 1 },
      },
      {
        text: "When I need to make a bigger purchase or transfer money.",
        scores: { spender: 2, "risk-taker": 1 },
      },
      {
        text: "A few times a month. I track my portfolio more than my bank balance.",
        scores: { investor: 3 },
      },
      {
        text: "Honestly, not often. I kinda know roughly, but I don't check until I have to.",
        scores: { avoider: 3, spender: 1 },
      },
      {
        text: "Only when I'm deciding whether to make a move on something exciting.",
        scores: { "risk-taker": 3 },
      },
    ],
  },
  {
    questionId: "mpq-4",
    question:
      "A friend pitches you a new crypto coin they've been researching. 'Bro, this is the next big thing. Get in now.' You have \u20B95,000 to spare. What do you do?",
    options: [
      {
        text: "Hard pass. I don't invest in things I don't understand, and this sounds sus.",
        scores: { saver: 3 },
      },
      {
        text: "I spend 2-3 days researching it myself. If I get convinced, I'll put in a small amount.",
        scores: { investor: 3, "risk-taker": 1 },
      },
      {
        text: "I put in \u20B92,000 \u2014 worst case I lose it. Best case I'm early on something big.",
        scores: { "risk-taker": 3 },
      },
      {
        text: "I'd feel pressured, feel bad saying no to my friend, then probably not do it but feel guilty.",
        scores: { avoider: 3, spender: 1 },
      },
      {
        text: "What's crypto? I'll just listen and nod and hope they don't ask if I'm in.",
        scores: { avoider: 3 },
      },
    ],
  },
  {
    questionId: "mpq-5",
    question:
      "End of the month. You have \u20B93,000 left over. What do you actually do with it?",
    options: [
      {
        text: "Add it to savings \u2014 that's what leftover money is for.",
        scores: { saver: 3 },
      },
      {
        text: "Honestly? Something fun. I worked all month. This is the bonus round.",
        scores: { spender: 3 },
      },
      {
        text: "Move it to my investment account. It's too small to matter much, but the habit matters.",
        scores: { investor: 3, saver: 1 },
      },
      {
        text: "Put it toward something high-potential \u2014 maybe top up my trading account.",
        scores: { "risk-taker": 3 },
      },
      {
        text: "It'll probably just kind of... get spent on small stuff. I won't really decide anything.",
        scores: { avoider: 3, spender: 1 },
      },
    ],
  },
  {
    questionId: "mpq-6",
    question:
      "Your friends are planning a group trip to Manali. Estimated cost: \u20B912,000. You can technically afford it, but it would wipe your savings for the month. What do you feel?",
    options: [
      {
        text: "Genuinely torn. The trip sounds amazing but losing my savings buffer makes me anxious.",
        scores: { saver: 3 },
      },
      {
        text: "I'm in. Experiences > savings. I'll make the money back. Let's go.",
        scores: { spender: 3, "risk-taker": 1 },
      },
      {
        text: "I'd go if I can figure out how to either cut costs or rebuild savings next month.",
        scores: { investor: 2, saver: 1 },
      },
      {
        text: "I'd want to go but feel stressed about the logistics. I might say yes and then panic later.",
        scores: { avoider: 3, spender: 1 },
      },
      {
        text: "I'd skip unless the trip had some angle \u2014 like meeting people who could open career doors.",
        scores: { investor: 3 },
      },
    ],
  },
  {
    questionId: "mpq-7",
    question:
      "How do you feel when you think about your financial future (retirement, long-term savings, etc.)?",
    options: [
      {
        text: "I've already thought about this. I have a rough plan and I'm executing it.",
        scores: { investor: 3, saver: 1 },
      },
      {
        text: "It's too far away to stress about. I'll figure it out when I'm older.",
        scores: { spender: 3, avoider: 1 },
      },
      {
        text: "I think about it a lot. I want to be financially free early, not just comfortable.",
        scores: { investor: 2, "risk-taker": 2 },
      },
      {
        text: "I know I should care but every time I try to think about it I get overwhelmed and close the tab.",
        scores: { avoider: 3 },
      },
      {
        text: "I'm banking on making big money moves in the next few years that will sort it out.",
        scores: { "risk-taker": 3 },
      },
    ],
  },
  {
    questionId: "mpq-8",
    question:
      "You see an Instagram reel of your college batchmate living it up in London \u2014 fancy flat, nice clothes, great social life. You're in your hometown saving for a goal. What do you feel?",
    options: [
      {
        text: "Genuinely happy for them, but also reconfirmed in my own plan. I know where I'm going.",
        scores: { investor: 3, saver: 1 },
      },
      {
        text: "Immediate FOMO. Within 20 minutes I've Googled flights and looked at what 'London life' costs.",
        scores: { spender: 3, "risk-taker": 1 },
      },
      {
        text: "I screenshot it for inspiration and think about what moves I need to make to get there faster.",
        scores: { "risk-taker": 3, investor: 1 },
      },
      {
        text: "A bit of comparison anxiety. I close the app and feel weird for a bit.",
        scores: { avoider: 2, spender: 1, saver: 1 },
      },
      {
        text: "Slight pang of FOMO but also genuine curiosity about their financial situation. Sustainable?",
        scores: { saver: 2, investor: 1 },
      },
    ],
  },
  {
    questionId: "mpq-9",
    question: "What does 'financial success' mean to you, right now?",
    options: [
      {
        text: "Having a solid emergency fund and no financial anxiety.",
        scores: { saver: 3 },
      },
      {
        text: "Being able to afford the experiences and things I love without guilt.",
        scores: { spender: 3 },
      },
      {
        text: "Having my money grow faster than inflation while I sleep.",
        scores: { investor: 3 },
      },
      {
        text: "Not having to think about money constantly \u2014 some peace around it.",
        scores: { avoider: 3 },
      },
      {
        text: "Building something big enough to retire early or take big swings.",
        scores: { "risk-taker": 3 },
      },
    ],
  },
  {
    questionId: "mpq-10",
    question:
      "You've been putting off filing your taxes or checking a financial account you've been avoiding. Why?",
    options: [
      {
        text: "Honestly, I filed last week. Why would I procrastinate on this?",
        scores: { saver: 3, investor: 1 },
      },
      {
        text: "It's just so boring. I'll get to it eventually.",
        scores: { spender: 2, avoider: 1 },
      },
      {
        text: "I don't love admin stuff, but I schedule it so it gets done even if it's not fun.",
        scores: { investor: 2, saver: 1 },
      },
      {
        text: "Every time I look at it, something new stresses me out and I just close it.",
        scores: { avoider: 3 },
      },
      {
        text: "I'm waiting for the right moment \u2014 when I have a bigger move to make alongside it.",
        scores: { "risk-taker": 2, avoider: 1 },
      },
    ],
  },
];

const CALCULATING_MESSAGES = [
  "Crunching the numbers...",
  "Analyzing your money mind...",
  "Consulting the financial stars...",
  "Decoding your spending DNA...",
  "Almost there...",
];

/* ─────────────────── Color Palette ─────────────────── */

const CHAPTER_PURPLE = "#8E44AD";
const CHAPTER_PURPLE_LIGHT = "rgba(142, 68, 173, 0.08)";
const CHAPTER_PURPLE_MEDIUM = "rgba(142, 68, 173, 0.15)";

const TYPE_COLORS: Record<PersonalityTypeId, { bg: string; text: string; accent: string; icon: string }> = {
  saver: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    accent: "#1B6B4A",
    icon: "bg-emerald-100",
  },
  spender: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    accent: "#F5A623",
    icon: "bg-amber-100",
  },
  investor: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    accent: "#2563EB",
    icon: "bg-blue-100",
  },
  avoider: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    accent: "#8E44AD",
    icon: "bg-purple-100",
  },
  "risk-taker": {
    bg: "bg-orange-50",
    text: "text-orange-700",
    accent: "#EA580C",
    icon: "bg-orange-100",
  },
};

const TYPE_ICONS: Record<PersonalityTypeId, typeof Shield> = {
  saver: Shield,
  spender: Star,
  investor: Sparkles,
  avoider: Eye,
  "risk-taker": Zap,
};

/* ─────────────────── Scoring ─────────────────── */

function calculateResult(answers: ScoreMap[]): PersonalityResult {
  const totals: Record<string, number> = {};

  for (const scoreMap of answers) {
    for (const [typeId, weight] of Object.entries(scoreMap)) {
      totals[typeId] = (totals[typeId] || 0) + (weight || 1);
    }
  }

  // Find the highest score; break ties by first occurrence in PERSONALITY_TYPES
  let bestType: PersonalityTypeId = "saver";
  let bestScore = -1;

  for (const pt of PERSONALITY_TYPES) {
    const score = totals[pt.typeId] || 0;
    if (score > bestScore) {
      bestScore = score;
      bestType = pt.typeId;
    }
  }

  return PERSONALITY_TYPES.find((p) => p.typeId === bestType)!;
}

/* ─────────────────── Component ─────────────────── */

export default function PersonalityQuizClient() {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<QuizPhase>("intro");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<ScoreMap[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [result, setResult] = useState<PersonalityResult | null>(null);
  const [saving, setSaving] = useState(false);
  const [calcMessageIndex, setCalcMessageIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const autoAdvanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const totalQuestions = QUESTIONS.length;
  const question = QUESTIONS[currentQuestion];
  const progressPercent = ((currentQuestion) / totalQuestions) * 100;

  // Clean up auto-advance timer on unmount
  useEffect(() => {
    return () => {
      if (autoAdvanceTimer.current) {
        clearTimeout(autoAdvanceTimer.current);
      }
    };
  }, []);

  // Calculating phase message rotation
  useEffect(() => {
    if (phase !== "calculating") return;

    const interval = setInterval(() => {
      setCalcMessageIndex((prev) => {
        if (prev >= CALCULATING_MESSAGES.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 500);

    const timer = setTimeout(() => {
      clearInterval(interval);
      setPhase("result");
    }, 2800);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [phase]);

  // Fire confetti when result is revealed
  useEffect(() => {
    if (phase === "result" && result && !prefersReducedMotion) {
      const timer = setTimeout(() => {
        fireConfetti();
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [phase, result, prefersReducedMotion]);

  const handleStartQuiz = useCallback(() => {
    setPhase("quiz");
  }, []);

  const handleSelectOption = useCallback(
    (optionIndex: number) => {
      if (selectedOption !== null) return; // Prevent double-click

      setSelectedOption(optionIndex);

      // Auto-advance after brief delay
      autoAdvanceTimer.current = setTimeout(() => {
        const newAnswers = [...answers, question.options[optionIndex].scores];
        setAnswers(newAnswers);

        if (currentQuestion === totalQuestions - 1) {
          // Final question -> calculating
          const finalResult = calculateResult(newAnswers);
          setResult(finalResult);
          setCalcMessageIndex(0);
          setPhase("calculating");
        } else {
          setDirection(1);
          setCurrentQuestion((prev) => prev + 1);
        }
        setSelectedOption(null);
      }, 500);
    },
    [selectedOption, answers, question, currentQuestion, totalQuestions]
  );

  const handleSaveResult = useCallback(async () => {
    if (!result) return;
    setSaving(true);

    try {
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moneyPersonality: result.name }),
      });
      if (!res.ok) {
        console.error("Failed to save personality result:", res.status);
      }
    } catch (e) {
      console.error("Network error saving personality:", e);
    } finally {
      setSaving(false);
    }

    router.push("/dashboard");
  }, [result, router]);

  /* ─── Animation Variants ─── */

  const duration = prefersReducedMotion ? 0.01 : undefined;

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -80 : 80,
      opacity: 0,
    }),
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: prefersReducedMotion ? 0 : i * 0.12,
        duration: prefersReducedMotion ? 0.01 : 0.5,
        ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
      },
    }),
  };

  /* ─── Intro Screen ─── */

  if (phase === "intro") {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0.01 : 0.6 }}
          className="w-full max-w-lg text-center"
        >
          {/* Decorative emoji cluster */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: prefersReducedMotion ? 0.01 : 0.5,
              delay: prefersReducedMotion ? 0 : 0.2,
              type: "spring",
              stiffness: 200,
              damping: 15,
            }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-3 text-5xl">
              <span className="inline-block" style={{ transform: "rotate(-12deg)" }}>
                {"\uD83D\uDCB8"}
              </span>
              <span className="inline-block text-6xl" style={{ transform: "translateY(-4px)" }}>
                {"\uD83E\uDDE0"}
              </span>
              <span className="inline-block" style={{ transform: "rotate(12deg)" }}>
                {"\uD83D\uDCB0"}
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: prefersReducedMotion ? 0.01 : 0.5,
              delay: prefersReducedMotion ? 0 : 0.35,
            }}
          >
            <p
              className="font-mono text-xs uppercase tracking-widest mb-3"
              style={{ color: CHAPTER_PURPLE }}
            >
              Chapter 3 &middot; Lesson 3.5
            </p>
            <h1 className="font-display text-4xl font-bold text-dark mb-4 leading-tight">
              What&rsquo;s Your Money
              <br />
              <span style={{ color: CHAPTER_PURPLE }}>Personality?</span>
            </h1>
            <p className="font-body text-base text-muted max-w-md mx-auto mb-2 leading-relaxed">
              10 questions. No right answers. Just hold up a mirror to your
              relationship with money.
            </p>
            <p className="font-body text-sm text-muted/70 mb-10">
              Answer honestly based on what you <em>actually</em> do, not what you
              think you should do.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: prefersReducedMotion ? 0.01 : 0.5,
              delay: prefersReducedMotion ? 0 : 0.55,
            }}
          >
            <button
              onClick={handleStartQuiz}
              className="group relative inline-flex items-center gap-3 px-10 py-4 rounded-2xl font-display text-lg font-semibold text-white overflow-hidden transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{
                backgroundColor: CHAPTER_PURPLE,
              }}
            >
              <span className="relative z-10">Start Quiz</span>
              <ArrowRight className="relative z-10 w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
              {/* Shimmer overlay */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background:
                    "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%)",
                }}
                animate={
                  prefersReducedMotion
                    ? {}
                    : {
                        backgroundPosition: ["200% 0", "-200% 0"],
                      }
                }
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </button>
          </motion.div>

          {/* Fun subtext */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: prefersReducedMotion ? 0.01 : 0.4,
              delay: prefersReducedMotion ? 0 : 0.8,
            }}
            className="font-body text-xs text-muted/50 mt-6"
          >
            Takes about 2 minutes &middot; Your result stays on your profile
          </motion.p>
        </motion.div>
      </div>
    );
  }

  /* ─── Calculating Screen ─── */

  if (phase === "calculating") {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          {/* Animated dots / spinner */}
          <motion.div
            className="mb-8 flex items-center justify-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: CHAPTER_PURPLE }}
                animate={
                  prefersReducedMotion
                    ? {}
                    : {
                        y: [0, -16, 0],
                        scale: [1, 1.2, 1],
                      }
                }
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: "easeInOut",
                }}
              />
            ))}
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.p
              key={calcMessageIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: prefersReducedMotion ? 0.01 : 0.25 }}
              className="font-display text-xl font-semibold text-dark"
            >
              {CALCULATING_MESSAGES[calcMessageIndex]}
            </motion.p>
          </AnimatePresence>
        </motion.div>
      </div>
    );
  }

  /* ─── Result Screen ─── */

  if (phase === "result" && result) {
    const colors = TYPE_COLORS[result.typeId];
    const TypeIcon = TYPE_ICONS[result.typeId];

    return (
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-2xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: prefersReducedMotion ? 0.01 : 0.5 }}
            className="bg-surface rounded-3xl shadow-xl shadow-black/8 overflow-hidden"
          >
            {/* Header with color accent */}
            <div
              className="relative px-8 pt-10 pb-8 text-center overflow-hidden"
              style={{ backgroundColor: CHAPTER_PURPLE_LIGHT }}
            >
              {/* Background pattern */}
              <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage: `radial-gradient(${CHAPTER_PURPLE} 1px, transparent 1px)`,
                  backgroundSize: "24px 24px",
                }}
              />

              {/* Large Emoji */}
              <motion.div
                custom={0}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="relative z-10 mb-4"
              >
                <span className="text-7xl leading-none">{result.emoji}</span>
              </motion.div>

              {/* Type label */}
              <motion.div
                custom={1}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="relative z-10"
              >
                <p
                  className="font-mono text-xs uppercase tracking-widest mb-2"
                  style={{ color: CHAPTER_PURPLE }}
                >
                  Your Money Personality
                </p>
                <h2 className="font-display text-4xl font-bold text-dark mb-2">
                  {result.name}
                </h2>
                <p className="font-body text-base text-muted italic">
                  &ldquo;{result.tagline}&rdquo;
                </p>
              </motion.div>
            </div>

            {/* Body content */}
            <div className="px-8 py-8 space-y-6">
              {/* Description */}
              <motion.p
                custom={2}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="font-body text-base text-dark/80 leading-relaxed"
              >
                {result.description}
              </motion.p>

              {/* Superpower */}
              <motion.div
                custom={3}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="p-5 rounded-2xl border"
                style={{
                  backgroundColor: CHAPTER_PURPLE_LIGHT,
                  borderColor: CHAPTER_PURPLE_MEDIUM,
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4" style={{ color: CHAPTER_PURPLE }} />
                  <p
                    className="font-display text-sm font-bold uppercase tracking-wider"
                    style={{ color: CHAPTER_PURPLE }}
                  >
                    Your Superpower
                  </p>
                </div>
                <p className="font-body text-sm text-dark/75 leading-relaxed">
                  {result.superpower}
                </p>
              </motion.div>

              {/* Blind Spot */}
              <motion.div
                custom={4}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="p-5 rounded-2xl bg-amber-50 border border-amber-100"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="w-4 h-4 text-amber-600" />
                  <p className="font-display text-sm font-bold uppercase tracking-wider text-amber-700">
                    Your Blind Spot
                  </p>
                </div>
                <p className="font-body text-sm text-dark/75 leading-relaxed">
                  {result.blindSpot}
                </p>
              </motion.div>

              {/* Watch Out */}
              <motion.div
                custom={5}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="p-5 rounded-2xl bg-red-50 border border-red-100"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-red-500" />
                  <p className="font-display text-sm font-bold uppercase tracking-wider text-red-600">
                    Watch Out For
                  </p>
                </div>
                <p className="font-body text-sm text-dark/75 leading-relaxed">
                  {result.watchOut}
                </p>
              </motion.div>

              {/* Celebrity comparison */}
              <motion.div
                custom={6}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className={`p-5 rounded-2xl ${colors.bg} border border-black/5`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <TypeIcon className={`w-4 h-4 ${colors.text}`} />
                  <p className={`font-display text-sm font-bold uppercase tracking-wider ${colors.text}`}>
                    In a Nutshell
                  </p>
                </div>
                <p className="font-body text-sm text-dark/75 leading-relaxed italic">
                  &ldquo;{result.celebrity}&rdquo;
                </p>
              </motion.div>

              {/* Badge unlocked */}
              <motion.div
                custom={7}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="flex items-center gap-4 p-5 rounded-2xl border"
                style={{
                  backgroundColor: "rgba(245, 166, 35, 0.06)",
                  borderColor: "rgba(245, 166, 35, 0.2)",
                }}
              >
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                  <Sparkles className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="font-display text-sm font-bold text-dark">
                    Personality Unlocked!
                  </p>
                  <p className="font-body text-xs text-muted mt-0.5">
                    Your money personality is now saved to your profile.
                    Check your badges!
                  </p>
                </div>
              </motion.div>

              {/* Save & Continue */}
              <motion.div
                custom={8}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="pt-2"
              >
                <Button
                  onClick={handleSaveResult}
                  loading={saving}
                  className="w-full"
                  size="lg"
                >
                  Save &amp; Continue
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  /* ─── Quiz Screen ─── */

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-start py-8 px-4">
      {/* Progress bar - thin, fixed at top of quiz area */}
      <div className="w-full max-w-2xl mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-xs text-muted">
            {currentQuestion + 1} of {totalQuestions}
          </span>
          <span
            className="font-mono text-xs font-semibold"
            style={{ color: CHAPTER_PURPLE }}
          >
            {Math.round(((currentQuestion + 1) / totalQuestions) * 100)}%
          </span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: CHAPTER_PURPLE }}
            initial={{ width: `${progressPercent}%` }}
            animate={{
              width: `${((currentQuestion + 1) / totalQuestions) * 100}%`,
            }}
            transition={{
              duration: prefersReducedMotion ? 0.01 : 0.4,
              ease: "easeOut",
            }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="w-full max-w-2xl">
        <div className="bg-surface rounded-2xl shadow-lg shadow-black/5 overflow-hidden">
          {/* Top accent bar */}
          <div
            className="h-1"
            style={{
              background: `linear-gradient(90deg, ${CHAPTER_PURPLE}, #C39BD3, ${CHAPTER_PURPLE})`,
            }}
          />

          <div className="px-8 py-8">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentQuestion}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  duration: prefersReducedMotion ? 0.01 : 0.25,
                  ease: "easeOut",
                }}
              >
                {/* Question text */}
                <p className="font-body text-lg text-dark font-medium leading-relaxed mb-8">
                  {question.question}
                </p>

                {/* Option cards */}
                <div className="space-y-3">
                  {question.options.map((option, i) => {
                    const isSelected = selectedOption === i;
                    return (
                      <motion.button
                        key={`${question.questionId}-${i}`}
                        onClick={() => handleSelectOption(i)}
                        disabled={selectedOption !== null}
                        whileHover={
                          selectedOption === null && !prefersReducedMotion
                            ? { scale: 1.02, y: -1 }
                            : {}
                        }
                        whileTap={
                          selectedOption === null && !prefersReducedMotion
                            ? { scale: 0.99 }
                            : {}
                        }
                        animate={
                          isSelected && !prefersReducedMotion
                            ? {
                                scale: [1, 1.05, 1],
                                transition: { duration: 0.3 },
                              }
                            : {}
                        }
                        className={`
                          w-full text-left px-5 py-4 rounded-xl border-2
                          font-body text-sm leading-relaxed
                          transition-all duration-200 cursor-pointer
                          disabled:cursor-default
                          ${
                            isSelected
                              ? "text-dark shadow-md"
                              : selectedOption !== null
                                ? "border-gray-100 bg-gray-50/50 text-dark/40"
                                : "border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50 hover:shadow-sm text-dark/80"
                          }
                        `}
                        style={
                          isSelected
                            ? {
                                borderColor: CHAPTER_PURPLE,
                                backgroundColor: CHAPTER_PURPLE_LIGHT,
                              }
                            : {}
                        }
                      >
                        <span className="flex items-start gap-3">
                          <span
                            className={`
                              w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5
                              transition-all duration-200
                            `}
                            style={
                              isSelected
                                ? {
                                    borderColor: CHAPTER_PURPLE,
                                    backgroundColor: CHAPTER_PURPLE,
                                  }
                                : { borderColor: "#D1D5DB" }
                            }
                          >
                            {isSelected && (
                              <motion.div
                                initial={
                                  prefersReducedMotion
                                    ? { scale: 1 }
                                    : { scale: 0 }
                                }
                                animate={{ scale: 1 }}
                                transition={{
                                  type: "spring",
                                  stiffness: 400,
                                  damping: 15,
                                }}
                                className="w-2 h-2 rounded-full bg-white"
                              />
                            )}
                          </span>
                          <span>{option.text}</span>
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Encouraging text below card */}
        <motion.p
          key={currentQuestion}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: prefersReducedMotion ? 0 : 0.3,
            duration: prefersReducedMotion ? 0.01 : 0.3,
          }}
          className="text-center font-body text-xs text-muted/50 mt-4"
        >
          {currentQuestion < 3
            ? "Pick the one that feels most like you"
            : currentQuestion < 7
              ? "No right or wrong answers here"
              : "Almost done \u2014 keep going!"}
        </motion.p>
      </div>
    </div>
  );
}
