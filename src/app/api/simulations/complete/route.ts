import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { Simulation, User, Chapter } from "@/models";
import { calculateSimulationXP, calculateLeague } from "@/lib/xp";
import { updateStreak } from "@/lib/streak";
import { evaluateBadges } from "@/lib/badges";

export async function POST(request: Request) {
  try {
    await dbConnect();
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { simulationId, walletFinal, path, score } = body;

    if (!simulationId) {
      return Response.json(
        { error: "simulationId is required" },
        { status: 400 }
      );
    }

    const simulation = await Simulation.findById(simulationId);
    if (!simulation) {
      return Response.json(
        { error: "Simulation not found" },
        { status: 404 }
      );
    }

    const user = await User.findById(session.user.id);
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    // Calculate XP
    const optimalWallet = simulation.optimalWalletOutcome || 0;
    const badgeThreshold =
      typeof simulation.badgeThreshold === "object" && simulation.badgeThreshold !== null
        ? (simulation.badgeThreshold as { walletMin?: number }).walletMin || optimalWallet * 0.8
        : optimalWallet * 0.8;

    const { xp: simXP, earnedBadge } = calculateSimulationXP(
      walletFinal ?? 0,
      optimalWallet,
      badgeThreshold
    );

    // Store simulation result
    const alreadyCompleted = user.simulationsCompleted.some(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (s: any) => s.simulationId.toString() === simulationId
    );

    // If already completed, return existing state without awarding XP again
    if (alreadyCompleted) {
      return Response.json({
        xpEarned: 0,
        newTotalXP: user.xp,
        league: user.league,
        badgesEarned: [],
        chapterCompleted: false,
        earnedSimBadge: false,
        streakUpdate: {
          currentStreak: user.currentStreak,
          longestStreak: user.longestStreak,
        },
      });
    }

    user.simulationsCompleted.push({
      simulationId,
      score: score ?? 0,
      walletFinal: walletFinal ?? 0,
      path: path ?? [],
    });

    // Update XP
    user.xp += simXP;
    user.league = calculateLeague(user.xp);

    // Check if all chapter lessons + simulation complete -> add to chaptersCompleted
    let chapterCompleted = false;
    const chapter = await Chapter.findById(simulation.chapterId);
    if (chapter) {
      const chapterLessonIds = chapter.lessons.map(
        (l: { toString(): string }) => l.toString()
      );
      const allLessonsDone = chapterLessonIds.every((lid: string) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        user.lessonsCompleted.some((lc: any) => lc.toString() === lid)
      );
      const simDone = user.simulationsCompleted.some(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (s: any) => s.simulationId.toString() === simulation._id.toString()
      );

      if (allLessonsDone && simDone) {
        const alreadyChapterComplete = user.chaptersCompleted.some(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (cid: any) => cid.toString() === chapter._id.toString()
        );
        if (!alreadyChapterComplete) {
          user.chaptersCompleted.push(chapter._id);
          chapterCompleted = true;
        }
      }
    }

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
      action: "simulation_complete",
      simulationId,
      score: score ?? 0,
      maxScore: 100,
      streakWasZero: previousStreak === 0,
    });

    await user.save();

    return Response.json({
      xpEarned: simXP,
      newTotalXP: user.xp,
      league: user.league,
      badgesEarned,
      chapterCompleted,
      earnedSimBadge: earnedBadge,
      streakUpdate: {
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak,
      },
    });
  } catch (error) {
    console.error("POST /api/simulations/complete error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
