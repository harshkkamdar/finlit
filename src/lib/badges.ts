import { Badge, Chapter, Lesson } from "@/models";

interface BadgeContext {
  action:
    | "exercise_complete"
    | "simulation_complete"
    | "lesson_complete"
    | "login"
    | "challenge_complete";
  lessonId?: string;
  simulationId?: string;
  score?: number;
  maxScore?: number;
  streakWasZero?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function evaluateBadges(user: any, context: BadgeContext): Promise<Array<{ id: string; name: string; icon: string }>> {
  const allBadges = await Badge.find({});
  const earnedBadgeIds = new Set(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    user.badges.map((b: any) => b.badgeId.toString())
  );

  const unearnedBadges = allBadges.filter(
    (b) => !earnedBadgeIds.has(b._id.toString())
  );

  const newlyEarned: Array<{ id: string; name: string; icon: string }> = [];

  const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
  const nowIST = new Date(Date.now() + IST_OFFSET_MS);
  const currentHourIST = nowIST.getUTCHours();

  for (const badge of unearnedBadges) {
    const { type, params } = badge.unlockCondition;
    let earned = false;

    switch (type) {
      case "lesson_count": {
        earned = user.lessonsCompleted.length >= (params.count as number);
        break;
      }

      case "perfect_exercise": {
        if (context.action === "exercise_complete") {
          earned =
            context.score !== undefined &&
            context.maxScore !== undefined &&
            context.score === context.maxScore &&
            context.maxScore > 0;
        }
        break;
      }

      case "streak": {
        earned = user.currentStreak >= (params.days as number);
        break;
      }

      case "simulation_count": {
        earned =
          user.simulationsCompleted.length >= (params.count as number);
        break;
      }

      case "speed_completion": {
        // Skip - requires timing data not currently tracked
        break;
      }

      case "time_of_day": {
        const after = params.after as number;
        const before = params.before as number;
        if (
          context.action === "exercise_complete" ||
          context.action === "lesson_complete" ||
          context.action === "simulation_complete"
        ) {
          earned = currentHourIST >= after && currentHourIST < before;
        }
        break;
      }

      case "consecutive_perfect": {
        const count = params.count as number;
        const results = user.exerciseResults;
        if (results.length >= count) {
          const lastN = results.slice(-count);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          earned = lastN.every((r: any) => r.score === r.maxScore && r.maxScore > 0);
        }
        break;
      }

      case "comeback": {
        if (
          context.action === "exercise_complete" ||
          context.action === "lesson_complete" ||
          context.action === "simulation_complete"
        ) {
          earned = context.streakWasZero === true;
        }
        break;
      }

      case "explorer": {
        // Skip - hard to track with current data model
        break;
      }

      case "personality_quiz": {
        earned = user.moneyPersonality != null && user.moneyPersonality !== "";
        break;
      }

      case "chapter_perfect": {
        const chapterNum = params.chapter as number;
        try {
          const chapter = await Chapter.findOne({ number: chapterNum }).populate("lessons");
          if (chapter && chapter.lessons.length > 0) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const chapterLessonIds = chapter.lessons.map((l: any) =>
              l._id.toString()
            );
            earned = chapterLessonIds.every((lessonId: string) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const results = user.exerciseResults.filter((r: any) =>
                r.lessonId.toString() === lessonId
              );
              return results.length > 0 &&
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                results.some((r: any) => r.score === r.maxScore && r.maxScore > 0);
            });
          }
        } catch {
          earned = false;
        }
        break;
      }

      case "simulation_perfect": {
        const simChapterNum = params.chapter as number;
        try {
          const chapter = await Chapter.findOne({ number: simChapterNum });
          if (chapter && chapter.simulationId) {
            const simId = chapter.simulationId.toString();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const simResult = user.simulationsCompleted.find((s: any) =>
              s.simulationId.toString() === simId
            );
            if (simResult) {
              // Consider a simulation "perfect" if the score is >= 90
              earned = simResult.score >= 90;
            }
          }
        } catch {
          earned = false;
        }
        break;
      }

      case "completionist": {
        try {
          const totalChapters = await Chapter.countDocuments();
          const totalLessons = await Lesson.countDocuments();
          const totalBadgesCount = allBadges.length;
          earned =
            user.chaptersCompleted.length >= totalChapters &&
            user.lessonsCompleted.length >= totalLessons &&
            user.badges.length + newlyEarned.length >= totalBadgesCount - 1; // -1 for this badge itself
        } catch {
          earned = false;
        }
        break;
      }

      case "share": {
        // Triggered externally - skip
        break;
      }

      case "money_mind": {
        const mmChapter = params.chapter as number;
        if (user.moneyPersonality) {
          try {
            const chapter = await Chapter.findOne({ number: mmChapter });
            if (chapter && chapter.simulationId) {
              const simId = chapter.simulationId.toString();
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const simResult = user.simulationsCompleted.find((s: any) =>
                s.simulationId.toString() === simId
              );
              earned = !!simResult && simResult.score >= 90;
            }
          } catch {
            earned = false;
          }
        }
        break;
      }

      case "chapter_complete": {
        const ccChapter = params.chapter as number;
        try {
          const chapter = await Chapter.findOne({ number: ccChapter });
          if (chapter) {
            const chapterLessonIds = chapter.lessons.map((l: string | { toString(): string }) =>
              l.toString()
            );
            const allLessonsDone = chapterLessonIds.every((lid: string) =>
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              user.lessonsCompleted.some((lc: any) => lc.toString() === lid)
            );
            const simDone =
              !chapter.simulationId ||
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              user.simulationsCompleted.some((s: any) =>
                s.simulationId.toString() === chapter.simulationId!.toString()
              );
            earned = allLessonsDone && simDone;
          }
        } catch {
          earned = false;
        }
        break;
      }

      default:
        break;
    }

    if (earned) {
      newlyEarned.push({ id: badge._id.toString(), name: badge.name, icon: badge.icon });
      user.badges.push({
        badgeId: badge._id,
        earnedAt: new Date(),
      });
    }
  }

  return newlyEarned;
}
