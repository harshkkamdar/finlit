import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { User } from "@/models";

export async function GET() {
  try {
    await dbConnect();
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const topUsers = await User.find({})
      .select("name xp league avatarSeed")
      .sort({ xp: -1 })
      .limit(100)
      .lean();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const leaderboard = topUsers.map((u: any, index: number) => ({
      _id: u._id,
      name: u.name,
      xp: u.xp,
      league: u.league,
      avatarSeed: u.avatarSeed,
      rank: index + 1,
    }));

    // Check if current user is in top 100
    const currentUserInTop = leaderboard.find(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (u: any) => u._id.toString() === session.user.id
    );

    let currentUserRank = null;
    if (!currentUserInTop) {
      // Count how many users have more XP than the current user
      const currentUser = await User.findById(session.user.id)
        .select("name xp league avatarSeed")
        .lean();

      if (currentUser) {
        const rank = await User.countDocuments({
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          xp: { $gt: (currentUser as any).xp },
        });
        currentUserRank = {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          _id: (currentUser as any)._id,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          name: (currentUser as any).name,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          xp: (currentUser as any).xp,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          league: (currentUser as any).league,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          avatarSeed: (currentUser as any).avatarSeed,
          rank: rank + 1,
        };
      }
    }

    return Response.json({
      leaderboard,
      currentUserRank,
    });
  } catch (error) {
    console.error("GET /api/leaderboard error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
