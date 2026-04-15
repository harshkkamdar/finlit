import { redirect } from 'next/navigation';
import dbConnect from '@/lib/db';
import { auth } from '@/lib/auth';
import { User } from '@/models';
import LeaderboardClient from './LeaderboardClient';

export default async function LeaderboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  await dbConnect();

  const topUsers = await User.find({})
    .select('name xp league avatarSeed')
    .sort({ xp: -1 })
    .limit(100)
    .lean();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const leaderboard = topUsers.map((u: any, index: number) => ({
    _id: u._id.toString(),
    name: u.name,
    xp: u.xp,
    league: u.league,
    avatarSeed: u.avatarSeed,
    rank: index + 1,
  }));

  // Check if current user is in top 100
  const currentUserInTop = leaderboard.find(
    (u) => u._id === session.user.id
  );

  let currentUserRank = null;

  if (!currentUserInTop) {
    const currentUser = await User.findById(session.user.id)
      .select('name xp league avatarSeed')
      .lean();

    if (currentUser) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const cu = currentUser as any;
      const rank = await User.countDocuments({ xp: { $gt: cu.xp } });
      currentUserRank = {
        _id: cu._id.toString(),
        name: cu.name,
        xp: cu.xp,
        league: cu.league,
        avatarSeed: cu.avatarSeed,
        rank: rank + 1,
      };
    }
  }

  return (
    <LeaderboardClient
      leaderboard={leaderboard}
      currentUserId={session.user.id}
      currentUserRank={currentUserRank}
    />
  );
}
