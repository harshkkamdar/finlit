import { redirect } from 'next/navigation';
import dbConnect from '@/lib/db';
import { auth } from '@/lib/auth';
import { User, Badge, Chapter, Lesson } from '@/models';
import ProfileClient from './ProfileClient';

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  await dbConnect();

  const [dbUser, allBadges, chapters] = await Promise.all([
    User.findById(session.user.id)
      .select('-passwordHash')
      .lean(),
    Badge.find({}).sort({ order: 1 }).lean(),
    Chapter.find()
      .sort({ order: 1 })
      .select('number title colorAccent lessons')
      .lean(),
  ]);

  if (!dbUser) {
    redirect('/login');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = dbUser as any;

  // Build earned badge IDs set
  const earnedBadgeMap = new Map<string, Date>();
  for (const b of user.badges || []) {
    earnedBadgeMap.set(b.badgeId.toString(), b.earnedAt);
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
    earnedAt: earnedBadgeMap.get(badge._id.toString())?.toISOString() || null,
  }));

  // Build completed sets
  const completedLessonIds = new Set(
    (user.lessonsCompleted || []).map((id: { toString(): string }) =>
      id.toString()
    )
  );
  const completedChapterIds = new Set(
    (user.chaptersCompleted || []).map((id: { toString(): string }) =>
      id.toString()
    )
  );

  // Per-chapter lesson progress
  const allLessons = await Lesson.find({
    chapterId: { $in: chapters.map((ch) => ch._id) },
  })
    .select('_id chapterId')
    .lean();

  const chapterLessonMap = new Map<string, string[]>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for (const lesson of allLessons as any[]) {
    const chId = lesson.chapterId.toString();
    if (!chapterLessonMap.has(chId)) {
      chapterLessonMap.set(chId, []);
    }
    chapterLessonMap.get(chId)!.push(lesson._id.toString());
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chapterProgress = chapters.map((ch: any) => {
    const chId = ch._id.toString();
    const lessonIds = chapterLessonMap.get(chId) || [];
    const completedCount = lessonIds.filter((lid) =>
      completedLessonIds.has(lid)
    ).length;
    const totalLessons = lessonIds.length;

    return {
      _id: chId,
      number: ch.number,
      title: ch.title,
      colorAccent: ch.colorAccent,
      completedLessons: completedCount,
      totalLessons,
      isCompleted: completedChapterIds.has(chId),
    };
  });

  const allChaptersCompleted =
    chapters.length > 0 &&
    chapters.every((ch: { _id: { toString(): string } }) =>
      completedChapterIds.has(ch._id.toString())
    );

  const userData = {
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
    age: user.age,
    avatarSeed: user.avatarSeed,
    xp: user.xp,
    currentStreak: user.currentStreak,
    longestStreak: user.longestStreak,
    league: user.league,
    moneyPersonality: user.moneyPersonality,
    lessonsCompletedCount: (user.lessonsCompleted || []).length,
    createdAt: user.createdAt?.toISOString() || new Date().toISOString(),
    certificateId: user.certificateId,
  };

  return (
    <ProfileClient
      user={userData}
      badges={badges}
      chapterProgress={chapterProgress}
      allChaptersCompleted={allChaptersCompleted}
    />
  );
}
