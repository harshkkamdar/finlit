import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { DailyChallenge, User } from "@/models";

function getISTDateString(): string {
  const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
  const now = new Date();
  const ist = new Date(now.getTime() + IST_OFFSET_MS);
  return ist.toISOString().split("T")[0];
}

export async function GET() {
  try {
    await dbConnect();
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(session.user.id).select(
      "chaptersCompleted dailyChallengesCompleted currentStreak longestStreak"
    );

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const todayStr = getISTDateString();

    // Try to find a challenge assigned to today's date
    let challenge = await DailyChallenge.findOne({ date: todayStr });

    // If no challenge for today, pick a deterministic one from the pool
    // Use the date string as a seed so the same challenge shows all day
    if (!challenge) {
      const pool = await DailyChallenge.find({ date: null });
      if (pool.length > 0) {
        // Simple deterministic hash from date string
        let hash = 0;
        for (let i = 0; i < todayStr.length; i++) {
          hash = (hash * 31 + todayStr.charCodeAt(i)) | 0;
        }
        const index = Math.abs(hash) % pool.length;
        challenge = pool[index];
      }
    }

    if (!challenge) {
      return Response.json(
        { error: "No challenge available today" },
        { status: 404 }
      );
    }

    // Check if user already completed today's challenge
    const alreadyCompleted = user.dailyChallengesCompleted.some(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (dc: any) => dc.date === todayStr
    );

    // Check if user has enough chapters completed
    const hasRequiredChapters =
      user.chaptersCompleted.length >= challenge.requiredChaptersCompleted;

    return Response.json({
      _id: challenge._id,
      type: challenge.type,
      title: challenge.title,
      content: challenge.content,
      xpReward: challenge.xpReward,
      requiredChaptersCompleted: challenge.requiredChaptersCompleted,
      alreadyCompleted,
      hasRequiredChapters,
      date: todayStr,
      streak: {
        current: user.currentStreak ?? 0,
        longest: user.longestStreak ?? 0,
      },
    });
  } catch (error) {
    console.error("GET /api/challenges/today error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
