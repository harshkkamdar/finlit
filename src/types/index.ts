import { Types } from "mongoose";

// ── Content & Exercise sub-types ──────────────────────────────────────

export interface ContentBlock {
  type: "text" | "callout" | "key-term" | "image" | "interactive" | "dialogue" | "quick-check";
  data: Record<string, unknown>;
}

export interface ExerciseOption {
  text: string;
  isCorrect: boolean;
}

export interface Exercise {
  type:
    | "mcq-single"
    | "mcq-multi"
    | "true-false"
    | "scenario"
    | "sorting"
    | "calculator";
  prompt: string;
  options?: ExerciseOption[];
  explanation: string;
  xpValue: number;
  // Scenario type
  scenario?: string | null;
  // True-false type
  correctAnswer?: boolean | null;
  // Sorting type
  categories?: string[];
  items?: Record<string, unknown>[] | null;
  // Calculator type
  title?: string | null;
  inputs?: Record<string, unknown>[] | null;
  formula?: string | null;
  outputLabel?: string | null;
  followUpQuestion?: Record<string, unknown> | null;
}

// ── Simulation sub-types ──────────────────────────────────────────────

export interface SimulationChoice {
  text: string;
  nextNodeId: string;
  walletImpact?: number;
  creditImpact?: number;
  scoreImpact?: number;
  feedback?: string | null;
  // Ch1 stock trading
  stocksBought?: Record<string, unknown> | null;
  stocksSold?: Record<string, unknown> | null;
}

export interface SimulationNode {
  nodeId: string;
  narrative: string;
  timeSkip: string | null;
  choices: SimulationChoice[];
  isEnd: boolean;
  // Ch6 message type
  type?: string | null;
  // Ch0 Chip's comment
  chipComment?: string | null;
  // Ch1 time label
  timeLabel?: string | null;
  // Ch5 monthly tracking
  month?: number | null;
  walletBalance?: number | null;
  creditBalance?: number | null;
  // End node outcome
  outcome?: Record<string, unknown> | null;
  outcomeType?: string | null;
}

// ── User embedded sub-types ───────────────────────────────────────────

export interface ExerciseResult {
  lessonId: Types.ObjectId | string;
  score: number;
  maxScore: number;
  xpEarned: number;
  completedAt: Date;
}

export interface SimulationResult {
  simulationId: Types.ObjectId | string;
  score: number;
  walletFinal: number;
  path: string[];
}

export interface BadgeEarned {
  badgeId: Types.ObjectId | string;
  earnedAt: Date;
}

export interface DailyChallengeResult {
  challengeId: Types.ObjectId | string;
  date: string;
  score: number;
}

// ── Document interfaces ───────────────────────────────────────────────

export interface IUser {
  _id: Types.ObjectId | string;
  name: string;
  email: string;
  passwordHash: string;
  age: number;
  role: "student" | "admin";
  avatarSeed: string;
  xp: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: Date | null;
  graceAvailable: boolean;
  league: string;
  moneyPersonality: string | null;
  chaptersCompleted: (Types.ObjectId | string)[];
  lessonsCompleted: (Types.ObjectId | string)[];
  simulationsCompleted: SimulationResult[];
  exerciseResults: ExerciseResult[];
  badges: BadgeEarned[];
  dailyChallengesCompleted: DailyChallengeResult[];
  certificateId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IChapter {
  _id: Types.ObjectId | string;
  number: number;
  title: string;
  subtitle: string;
  description: string;
  colorAccent: string;
  iconUrl: string;
  lessons: (Types.ObjectId | string)[];
  simulationId: Types.ObjectId | string | null;
  order: number;
  personalityQuiz: Record<string, unknown> | null;
}

export interface ILesson {
  _id: Types.ObjectId | string;
  chapterId: Types.ObjectId | string;
  lessonNumber: string;
  title: string;
  subtitle: string | null;
  content: {
    blocks: ContentBlock[];
  };
  exercises: Exercise[];
  estimatedMinutes: number;
  order: number;
}

export interface ISimulation {
  _id: Types.ObjectId | string;
  chapterId: Types.ObjectId | string;
  title: string;
  description: string;
  startingWallet: number | null;
  optimalWalletOutcome: number | null;
  badgeThreshold: Record<string, unknown>;
  startNodeId: string;
  nodes: SimulationNode[];
  // Ch0 special fields
  walletLabel?: string | null;
  startingInventory?: string | null;
  // Ch1 stock trading
  availableStocks?: Record<string, unknown> | null;
  // Ch3 bias tracking
  biasTracker?: Record<string, unknown> | null;
  // Ch5 credit tracking
  creditLimit?: number | null;
  creditBalance?: number | null;
  monthlyIncome?: number | null;
  // Ch6 points-based scoring
  scoringType?: "wallet" | "points";
  startingScore?: number | null;
  maxScore?: number | null;
  // Badge info from JSON
  badgeId?: string | null;
  badgeName?: string | null;
}

export interface IBadge {
  _id: Types.ObjectId | string;
  name: string;
  description: string;
  icon: string;
  unlockCondition: {
    type: string;
    params: Record<string, unknown>;
  };
  isSecret: boolean;
  category: string;
  order: number;
}

export interface IDailyChallenge {
  _id: Types.ObjectId | string;
  date: string | null;
  type: "quiz" | "scenario" | "mini-simulation";
  title: string;
  content: Record<string, unknown>;
  xpReward: number;
  requiredChaptersCompleted: number;
}
