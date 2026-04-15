import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { DailyChallenge, User } from "@/models";
import {
  calculateLeague,
  DAILY_CHALLENGE_CORRECT_XP,
  DAILY_CHALLENGE_ATTEMPT_XP,
} from "@/lib/xp";
import { updateStreak } from "@/lib/streak";
import { evaluateBadges } from "@/lib/badges";

function getISTDateString(): string {
  const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
  const now = new Date();
  const ist = new Date(now.getTime() + IST_OFFSET_MS);
  return ist.toISOString().split("T")[0];
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { challengeId, answers } = body;

    if (!challengeId) {
      return Response.json(
        { error: "challengeId is required" },
        { status: 400 }
      );
    }

    const challenge = await DailyChallenge.findById(challengeId);
    if (!challenge) {
      return Response.json(
        { error: "Challenge not found" },
        { status: 404 }
      );
    }

    const user = await User.findById(session.user.id);
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const todayStr = getISTDateString();

    // Check if already completed today
    const alreadyCompleted = user.dailyChallengesCompleted.some(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (dc: any) => dc.date === todayStr
    );

    if (alreadyCompleted) {
      return Response.json(
        { error: "You have already completed today's challenge" },
        { status: 400 }
      );
    }

    // Score the challenge based on type
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const content = challenge.content as Record<string, any>;
    let score = 0;
    let maxScore = 1;

    if (challenge.type === "mini-simulation") {
      // Mini-simulation: answers is an array of choice indices per node
      // Score based on whether they reached a "good" ending (heuristic: wallet impact)
      // For simplicity: any completion = 1 point, we award based on the path taken
      maxScore = 1;
      score = Array.isArray(answers) && answers.length > 0 ? 1 : 0;
    } else {
      // Quiz / Scenario: flat content structure { prompt, options: [{ text, isCorrect }] }
      // May also have content.questions[] for multi-question format
      const questions: Array<{ options?: Array<{ isCorrect?: boolean }> }> = [];

      if (content.questions && Array.isArray(content.questions) && content.questions.length > 0) {
        // Multi-question format
        questions.push(...content.questions);
      } else if (content.options && Array.isArray(content.options)) {
        // Single question flat format (most common in seed data)
        questions.push({ options: content.options });
      }

      maxScore = questions.length || 1;

      if (Array.isArray(answers) && questions.length > 0) {
        for (let i = 0; i < questions.length; i++) {
          const question = questions[i];
          const userAnswer = answers[i];
          if (userAnswer !== undefined && question.options) {
            const correctIndex = question.options.findIndex(
              (opt: { isCorrect?: boolean }) => opt.isCorrect
            );
            if (userAnswer === correctIndex) {
              score++;
            }
          }
        }
      }
    }

    // Award XP
    const isPerfect = score === maxScore;
    const xpEarned = isPerfect
      ? DAILY_CHALLENGE_CORRECT_XP
      : DAILY_CHALLENGE_ATTEMPT_XP;

    // Store result
    user.dailyChallengesCompleted.push({
      challengeId: challenge._id,
      date: todayStr,
      score,
    });

    // Update XP
    user.xp += xpEarned;
    user.league = calculateLeague(user.xp);

    // Update streak
    const previousStreak = user.currentStreak;
    const streakUpdate = updateStreak({
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
      graceAvailable: user.graceAvailable,
      lastActiveDate: user.lastActiveDate,
    });

    user.currentStreak = streakUpdate.currentStreak;
    user.longestStreak = streakUpdate.longestStreak;
    user.graceAvailable = streakUpdate.graceAvailable;
    user.lastActiveDate = streakUpdate.lastActiveDate;

    // Evaluate badges
    const badgesEarned = await evaluateBadges(user, {
      action: "challenge_complete",
      score,
      maxScore,
      streakWasZero: previousStreak === 0,
    });

    await user.save();

    return Response.json({
      score,
      maxScore,
      xpEarned,
      newTotalXP: user.xp,
      league: user.league,
      badgesEarned,
      streakUpdate: {
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak,
      },
    });
  } catch (error) {
    console.error("POST /api/challenges/submit error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
