import { redirect } from 'next/navigation';
import dbConnect from '@/lib/db';
import { auth } from '@/lib/auth';
import { User, Badge } from '@/models';
import ProgressClient from './ProgressClient';

export default async function ProgressPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  await dbConnect();

  const [dbUser, allBadges] = await Promise.all([
    User.findById(session.user.id)
      .select(
        'name xp league currentStreak longestStreak badges lessonsCompleted chaptersCompleted simulationsCompleted dailyChallengesCompleted avatarSeed'
      )
      .lean(),
    Badge.find({}).sort({ order: 1 }).lean(),
  ]);

  if (!dbUser) {
    redirect('/login');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = dbUser as any;

  // Build earned badge map
  const earnedBadgeMap = new Map<string, string>();
  for (const b of user.badges || []) {
    earnedBadgeMap.set(b.badgeId.toString(), b.earnedAt?.toISOString() || '');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const badges = allBadges.map((badge: any) => ({
    _id: badge._id.toString(),
    name: badge.name,
    description: badge.description,
    icon: badge.icon,
    isSecret: badge.isSecret,
    category: badge.category,
    earned: earnedBadgeMap.has(badge._id.toString()),
    earnedAt: earnedBadgeMap.get(badge._id.toString()) || null,
  }));

  const userData = {
    name: user.name,
    xp: user.xp,
    league: user.league,
    currentStreak: user.currentStreak,
    longestStreak: user.longestStreak,
    avatarSeed: user.avatarSeed,
    lessonsCompletedCount: (user.lessonsCompleted || []).length,
    chaptersCompletedCount: (user.chaptersCompleted || []).length,
    simulationsCompletedCount: (user.simulationsCompleted || []).length,
    dailyChallengesCompletedCount: (user.dailyChallengesCompleted || []).length,
    totalBadgesEarned: (user.badges || []).length,
  };

  return <ProgressClient user={userData} badges={badges} />;
}
