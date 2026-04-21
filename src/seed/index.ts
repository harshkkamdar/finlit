import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

import { Chapter, Lesson, Simulation, Badge, DailyChallenge } from "../models";
import { chapters as chapterMeta } from "./chapters";
import { badges } from "./badges";

// ── Constants ────────────────────────────────────────────────────────────────

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error(
    "ERROR: MONGODB_URI is not defined. Make sure .env.local exists and contains MONGODB_URI."
  );
  process.exit(1);
}

const CONTENT_DIR = path.resolve(__dirname, "content");

/** Ordered list of JSON filenames, index = chapter number */
const JSON_FILES: string[] = [
  "chapter_0_seed_fixed.json",
  "chapter1_stock_market.json",
  "chapter_2_investing_101.json",
  "chapter3_your_money_psychology.json",
  "chapter4_managing_your_money.json",
  "chapter_5_credit_and_debt_fixed.json",
  "chapter6_the_shield_fixed.json",
];

/** Canonical accent colors per chapter */
const CHAPTER_COLORS: Record<number, string> = {
  0: "#F5A623",
  1: "#2ECC71",
  2: "#4A90D9",
  3: "#8E44AD",
  4: "#1ABC9C",
  5: "#E74C3C",
  6: "#2980B9",
};

// ── JSON reading helper ──────────────────────────────────────────────────────

function readJsonFile(filename: string): any {
  const filePath = path.join(CONTENT_DIR, filename);
  console.log(`  Reading ${filename}...`);
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

// ── Normalization helpers ────────────────────────────────────────────────────

/**
 * Parse an estimatedReadingTime string like "10 minutes" to a number.
 * If already a number, return as-is.
 */
function parseEstimatedMinutes(value: any): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const match = value.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 10; // default 10 if unparseable
  }
  return 10;
}

/**
 * Normalize true-false exercises: ensure they have an `options` array.
 */
function normalizeTrueFalseExercise(exercise: any): void {
  if (
    exercise.correctAnswer !== undefined &&
    exercise.correctAnswer !== null &&
    !exercise.options
  ) {
    exercise.options = [
      { text: "True", isCorrect: exercise.correctAnswer === true },
      { text: "False", isCorrect: exercise.correctAnswer === false },
    ];
  }
}

/**
 * Normalize calculator exercises: ensure `prompt` exists.
 */
function normalizeCalculatorExercise(exercise: any): void {
  if (exercise.type === "calculator") {
    if (!exercise.prompt) {
      exercise.prompt = exercise.title || "Calculator exercise";
    }
    // Calculator exercises store explanation in followUpQuestion
    if (!exercise.explanation && exercise.followUpQuestion?.explanation) {
      exercise.explanation = exercise.followUpQuestion.explanation;
    }
    if (!exercise.explanation) {
      exercise.explanation = "Use the calculator above to explore the answer.";
    }
  }
}

/**
 * Normalize a single exercise (any type).
 */
function normalizeExercise(exercise: any): any {
  normalizeTrueFalseExercise(exercise);
  normalizeCalculatorExercise(exercise);
  return exercise;
}

/**
 * Normalize all exercises in a list.
 */
function normalizeExercises(exercises: any[] | undefined): any[] {
  if (!exercises || !Array.isArray(exercises)) return [];
  return exercises.map(normalizeExercise);
}

/**
 * Unwrap chapter data from different JSON structures.
 * Ch4 wraps data inside { "chapter": { ... } }
 * Others have data at the top level.
 */
function unwrapChapterData(raw: any, chapterNumber: number): any {
  if (chapterNumber === 4 && raw.chapter) {
    return raw.chapter;
  }
  return raw;
}

/**
 * Get lessons array from chapter data, handling field name differences.
 */
function getLessons(data: any): any[] {
  return data.lessons || [];
}

/**
 * Normalize a lesson's content blocks field.
 * Ch2 uses `content` instead of `contentBlocks`.
 */
function normalizeContentBlocks(lesson: any): any[] {
  return lesson.contentBlocks || lesson.content || [];
}

/**
 * Get a lesson ID from the lesson object.
 * Ch4 uses `id` instead of `lessonId`.
 */
function getLessonId(lesson: any): string {
  return lesson.lessonId || lesson.id || "unknown";
}

/**
 * Get estimated minutes from a lesson.
 * Ch4 uses `estimatedReadingMinutes` (number), others use `estimatedReadingTime` (string).
 */
function getEstimatedMinutes(lesson: any): number {
  if (lesson.estimatedReadingMinutes !== undefined) {
    return lesson.estimatedReadingMinutes;
  }
  return parseEstimatedMinutes(lesson.estimatedReadingTime);
}

/**
 * Normalize simulation choices: default missing impact fields.
 */
function normalizeSimulationChoice(choice: any): any {
  return {
    ...choice,
    walletImpact: choice.walletImpact ?? 0,
    creditImpact: choice.creditImpact ?? 0,
    scoreImpact: choice.scoreImpact ?? 0,
    stocksBought: choice.stocksBought ?? null,
    stocksSold: choice.stocksSold ?? null,
  };
}

/**
 * Normalize simulation nodes.
 */
function normalizeSimulationNode(node: any): any {
  return {
    nodeId: node.nodeId,
    narrative: node.narrative || node.prompt || "",
    timeSkip: node.timeSkip ?? null,
    choices: (node.choices || []).map(normalizeSimulationChoice),
    isEnd: node.isEnd ?? false,
    // Ch6 message type
    type: node.type ?? null,
    // Ch0 Chip's comment
    chipComment: node.chipComment ?? null,
    // Ch1 time label
    timeLabel: node.timeLabel ?? null,
    // Ch5 monthly tracking
    month: node.month ?? null,
    walletBalance: node.walletBalance ?? null,
    creditBalance: node.creditBalance ?? null,
    // End node outcomes
    outcome: node.outcome ?? null,
    outcomeType: node.outcomeType ?? node.endingType ?? null,
    // Preserve additional display/prompt/biasQuestion fields via spread
    ...(node.display ? { display: node.display } : {}),
    ...(node.biasQuestion ? { biasQuestion: node.biasQuestion } : {}),
    ...(node.outcomeTitle ? { outcomeTitle: node.outcomeTitle } : {}),
    ...(node.outcomeSummary ? { outcomeSummary: node.outcomeSummary } : {}),
    ...(node.endingNarrative ? { endingNarrative: node.endingNarrative } : {}),
    ...(node.endingChipQuote ? { endingChipQuote: node.endingChipQuote } : {}),
  };
}

/**
 * Normalize a simulation object, extracting all chapter-specific fields.
 */
function normalizeSimulation(sim: any, chapterNumber: number): any {
  const scoringType = chapterNumber === 6 ? "points" : "wallet";

  return {
    title: sim.title,
    description: sim.description,
    startingWallet: sim.startingWallet ?? null,
    optimalWalletOutcome: sim.optimalWalletOutcome ?? null,
    badgeThreshold: sim.badgeThreshold ?? {},
    startNodeId: sim.startNodeId,
    nodes: (sim.nodes || []).map(normalizeSimulationNode),
    // Ch0 special fields
    walletLabel: sim.walletLabel ?? null,
    startingInventory: sim.startingInventory ?? null,
    // Ch1 stock trading
    availableStocks: sim.availableStocks ?? null,
    // Ch3 bias tracking
    biasTracker: sim.biasTracker ?? null,
    // Ch5 credit tracking
    creditLimit: sim.creditLimit ?? null,
    creditBalance: sim.creditBalance ?? null,
    monthlyIncome: sim.monthlyIncome ?? null,
    // Ch6 points-based scoring
    scoringType,
    startingScore: sim.startingScore ?? null,
    maxScore: sim.maxScore ?? null,
    // Badge info from JSON
    badgeId: sim.badgeId ?? null,
    badgeName: sim.badgeName ?? null,
  };
}

/**
 * Normalize daily challenge exercises (true-false options, etc.).
 */
function normalizeDailyChallenge(challenge: any): any {
  const normalized = { ...challenge };

  // Normalize exercises within content if they have true-false patterns
  if (normalized.content) {
    if (
      normalized.content.correctAnswer !== undefined &&
      !normalized.content.options
    ) {
      normalized.content.options = [
        {
          text: "True",
          isCorrect: normalized.content.correctAnswer === true,
        },
        {
          text: "False",
          isCorrect: normalized.content.correctAnswer === false,
        },
      ];
    }
  }

  // For mini-simulation challenges where nodes/description/startingWallet
  // are at the top level (ch3 style), fold them into the content object
  // so Mongoose does not silently discard them (the schema only stores `content`).
  if (normalized.type === "mini-simulation") {
    if (!normalized.content) {
      normalized.content = {};
    }
    if (normalized.nodes && !normalized.content.nodes) {
      normalized.content.nodes = normalized.nodes;
      delete normalized.nodes;
    }
    if (normalized.startingWallet !== undefined && normalized.content.startingWallet === undefined) {
      normalized.content.startingWallet = normalized.startingWallet;
      delete normalized.startingWallet;
    }
    if (normalized.description && !normalized.content.setup) {
      normalized.content.setup = normalized.description;
      delete normalized.description;
    }
    // Ensure startNodeId exists
    if (!normalized.content.startNodeId && normalized.content.nodes?.length > 0) {
      normalized.content.startNodeId = normalized.content.nodes[0].nodeId;
    }
  }

  return normalized;
}

// ── Main seed function ───────────────────────────────────────────────────────

async function seed() {
  console.log("=== FinoLingo Database Seeder (JSON Content) ===\n");

  try {
    // ── Connect to MongoDB ─────────────────────────────────────────────
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI as string, { bufferCommands: false });
    console.log("Connected successfully!\n");

    // ── Clear existing data ────────────────────────────────────────────
    console.log("Clearing existing data...");
    await Promise.all([
      Chapter.deleteMany({}),
      Lesson.deleteMany({}),
      Simulation.deleteMany({}),
      Badge.deleteMany({}),
      DailyChallenge.deleteMany({}),
    ]);
    console.log("  Cleared all collections.\n");

    // ── Seed Badges ────────────────────────────────────────────────────
    console.log("Seeding badges...");
    const insertedBadges = await Badge.insertMany(badges);
    console.log(`  Inserted ${insertedBadges.length} badges.\n`);

    // ── Process each chapter ───────────────────────────────────────────
    const allLessonDocs: any[] = [];
    const allSimulationDocs: any[] = [];
    const allDailyChallenges: any[] = [];
    const chapterDocs: any[] = [];

    for (let chapterNum = 0; chapterNum < 7; chapterNum++) {
      console.log(`\n── Chapter ${chapterNum} ──────────────────────────────────`);

      // Read and unwrap JSON
      const rawJson = readJsonFile(JSON_FILES[chapterNum]);
      const data = unwrapChapterData(rawJson, chapterNum);

      // Get chapter metadata from chapters.ts
      const meta = chapterMeta.find((c) => c.number === chapterNum);
      if (!meta) {
        throw new Error(`No metadata found for chapter ${chapterNum} in chapters.ts`);
      }

      // Build chapter document (will update with lesson/simulation IDs later)
      const chapterDoc: any = {
        number: meta.number,
        title: meta.title,
        subtitle: meta.subtitle,
        description: meta.description,
        colorAccent: CHAPTER_COLORS[chapterNum] || meta.colorAccent,
        iconUrl: meta.iconUrl,
        order: meta.order,
        lessons: [],
        simulationId: null,
        personalityQuiz: null,
      };

      // ── Personality Quiz (Ch3) ──────────────────────────────────────
      if (chapterNum === 3 && data.moneyPersonalityQuiz) {
        chapterDoc.personalityQuiz = data.moneyPersonalityQuiz;
        console.log("  Found personality quiz, will attach to chapter.");
      }

      chapterDocs.push(chapterDoc);

      // ── Lessons ─────────────────────────────────────────────────────
      const lessons = getLessons(data);
      console.log(`  Found ${lessons.length} lessons.`);

      for (let i = 0; i < lessons.length; i++) {
        const lesson = lessons[i];
        const lessonId = getLessonId(lesson);
        const contentBlocks = normalizeContentBlocks(lesson);
        const exercises = normalizeExercises(lesson.exercises);
        const estimatedMinutes = getEstimatedMinutes(lesson);

        allLessonDocs.push({
          _chapterNum: chapterNum, // temporary, used for linking
          lessonNumber: lessonId,
          title: lesson.title,
          subtitle: lesson.subtitle || null,
          content: {
            blocks: contentBlocks,
          },
          exercises,
          estimatedMinutes,
          order: lesson.order || i + 1,
        });
      }

      // ── Simulation ──────────────────────────────────────────────────
      const simData = data.simulation;
      if (simData) {
        const normalizedSim = normalizeSimulation(simData, chapterNum);
        normalizedSim._chapterNum = chapterNum; // temporary, used for linking
        allSimulationDocs.push(normalizedSim);
        console.log(`  Found simulation: "${normalizedSim.title}"`);
      } else {
        console.log("  No simulation found.");
      }

      // ── Daily Challenges ────────────────────────────────────────────
      const challenges = data.dailyChallenges;
      if (challenges && Array.isArray(challenges)) {
        for (const challenge of challenges) {
          allDailyChallenges.push(normalizeDailyChallenge(challenge));
        }
        console.log(`  Found ${challenges.length} daily challenges.`);
      }
    }

    // ── Insert Chapters ────────────────────────────────────────────────
    console.log("\n\nSeeding chapters...");
    const insertedChapters = await Chapter.insertMany(chapterDocs);
    console.log(`  Inserted ${insertedChapters.length} chapters.`);

    // Build a map of chapterNumber -> chapter document
    const chapterMap = new Map<number, (typeof insertedChapters)[number]>();
    for (const ch of insertedChapters) {
      chapterMap.set(ch.number, ch);
    }

    // ── Insert Lessons ─────────────────────────────────────────────────
    console.log("\nSeeding lessons...");
    const lessonInsertDocs = allLessonDocs.map((lesson) => {
      const chapter = chapterMap.get(lesson._chapterNum);
      if (!chapter) {
        throw new Error(
          `Chapter ${lesson._chapterNum} not found for lesson "${lesson.title}"`
        );
      }
      const { _chapterNum, ...lessonData } = lesson;
      return {
        ...lessonData,
        chapterId: chapter._id,
      };
    });

    const insertedLessons = await Lesson.insertMany(lessonInsertDocs);
    console.log(`  Inserted ${insertedLessons.length} lessons.`);

    // ── Insert Simulations ─────────────────────────────────────────────
    console.log("\nSeeding simulations...");
    const simulationInsertDocs = allSimulationDocs.map((sim) => {
      const chapter = chapterMap.get(sim._chapterNum);
      if (!chapter) {
        throw new Error(
          `Chapter ${sim._chapterNum} not found for simulation "${sim.title}"`
        );
      }
      const { _chapterNum, ...simData } = sim;
      return {
        ...simData,
        chapterId: chapter._id,
      };
    });

    const insertedSimulations = await Simulation.insertMany(simulationInsertDocs);
    console.log(`  Inserted ${insertedSimulations.length} simulations.`);

    // ── Insert Daily Challenges ────────────────────────────────────────
    console.log("\nSeeding daily challenges...");
    let insertedChallenges: any[] = [];
    if (allDailyChallenges.length > 0) {
      insertedChallenges = await DailyChallenge.insertMany(allDailyChallenges);
    }
    console.log(`  Inserted ${insertedChallenges.length} daily challenges.`);

    // ── Update Chapters with lesson IDs and simulation IDs ─────────────
    console.log("\nUpdating chapters with lesson and simulation references...");

    for (const chapter of insertedChapters) {
      // Find lessons belonging to this chapter
      const chapterLessons = insertedLessons.filter(
        (l) => l.chapterId.toString() === chapter._id.toString()
      );
      const lessonIds = chapterLessons.map((l) => l._id);

      // Find simulation belonging to this chapter
      const chapterSimulation = insertedSimulations.find(
        (s) => s.chapterId.toString() === chapter._id.toString()
      );

      await Chapter.findByIdAndUpdate(chapter._id, {
        lessons: lessonIds,
        simulationId: chapterSimulation?._id || null,
      });

      console.log(
        `  Chapter ${chapter.number} "${chapter.title}": ${lessonIds.length} lessons, ${chapterSimulation ? "1 simulation" : "no simulation"}`
      );
    }

    // ── Summary ────────────────────────────────────────────────────────
    console.log("\n=== Seed Complete! ===");
    console.log(`  Chapters:         ${insertedChapters.length}`);
    console.log(`  Lessons:          ${insertedLessons.length}`);
    console.log(`  Simulations:      ${insertedSimulations.length}`);
    console.log(`  Badges:           ${insertedBadges.length}`);
    console.log(`  Daily Challenges: ${insertedChallenges.length}`);

    // Per-chapter breakdown
    console.log("\n── Per-Chapter Breakdown ──");
    for (const chapter of insertedChapters) {
      const lessonCount = insertedLessons.filter(
        (l) => l.chapterId.toString() === chapter._id.toString()
      ).length;
      const simCount = insertedSimulations.filter(
        (s) => s.chapterId.toString() === chapter._id.toString()
      ).length;
      const exerciseCount = insertedLessons
        .filter((l) => l.chapterId.toString() === chapter._id.toString())
        .reduce((sum: number, l: any) => sum + (l.exercises?.length || 0), 0);

      console.log(
        `  Ch${chapter.number} "${chapter.title}": ${lessonCount} lessons, ${exerciseCount} exercises, ${simCount} simulation(s)`
      );
    }
    console.log("");
  } catch (error) {
    console.error("\nSeed failed with error:");
    console.error(error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

seed();
