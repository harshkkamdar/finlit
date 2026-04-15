import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { Lesson, User } from "@/models";
import { calculateExerciseXP, calculateLeague, LESSON_COMPLETION_XP } from "@/lib/xp";
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
    const { lessonId, answers } = body;

    if (!lessonId || !Array.isArray(answers)) {
      return Response.json(
        { error: "lessonId and answers array are required" },
        { status: 400 }
      );
    }

    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return Response.json({ error: "Lesson not found" }, { status: 404 });
    }

    const user = await User.findById(session.user.id);
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    // Grade answers
    const exercises = lesson.exercises;
    const maxScore = exercises.length;
    let score = 0;

    for (const answer of answers) {
      const { questionIndex, selectedOptions } = answer;
      if (questionIndex < 0 || questionIndex >= exercises.length) continue;

      const exercise = exercises[questionIndex];

      // For exercise types without options (sorting, calculator), the client
      // sends an empty selectedOptions array and handles scoring internally.
      // Trust the client's isCorrect determination for these types.
      if (!exercise.options || exercise.options.length === 0) {
        // Sorting/calculator exercises: if the client sent empty selectedOptions,
        // this was scored client-side. Count as correct if the answer was submitted
        // (the ExerciseRenderer only calls onComplete after grading).
        // We can't re-grade these server-side, so count them as answered.
        score++;
        continue;
      }

      const correctIndices = exercise.options
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((opt: any, idx: number) => (opt.isCorrect ? idx : -1))
        .filter((idx: number) => idx !== -1);

      const selected = [...(selectedOptions || [])].sort();
      const correct = [...correctIndices].sort();

      if (
        selected.length === correct.length &&
        selected.every((v: number, i: number) => v === correct[i])
      ) {
        score++;
      }
    }

    // Calculate XP
    const exerciseXP = calculateExerciseXP(score, maxScore);

    // Check if first time completing this lesson
    const alreadyCompleted = user.lessonsCompleted.some(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (lid: any) => lid.toString() === lessonId
    );

    let totalXPEarned = exerciseXP;
    if (!alreadyCompleted) {
      totalXPEarned += LESSON_COMPLETION_XP;
      user.lessonsCompleted.push(lessonId);
    }

    // Store exercise result
    user.exerciseResults.push({
      lessonId,
      score,
      maxScore,
      xpEarned: totalXPEarned,
      completedAt: new Date(),
    });

    // Update XP
    user.xp += totalXPEarned;

    // Update league
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
      action: "exercise_complete",
      lessonId,
      score,
      maxScore,
      streakWasZero: previousStreak === 0,
    });

    await user.save();

    return Response.json({
      score,
      maxScore,
      xpEarned: totalXPEarned,
      newTotalXP: user.xp,
      league: user.league,
      badgesEarned,
      streakUpdate: {
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak,
      },
    });
  } catch (error) {
    console.error("POST /api/exercises/submit error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
