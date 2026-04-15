import { redirect } from 'next/navigation';
import dbConnect from '@/lib/db';
import { auth } from '@/lib/auth';
import User from '@/models/User';
import Chapter from '@/models/Chapter';
import Lesson from '@/models/Lesson';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  await dbConnect();

  const [dbUser, chapters] = await Promise.all([
    User.findById(session.user.id)
      .select(
        'name xp currentStreak league avatarSeed lessonsCompleted chaptersCompleted'
      )
      .lean(),
    Chapter.find()
      .sort({ order: 1 })
      .select('number title subtitle colorAccent lessons simulationId order')
      .lean(),
  ]);

  if (!dbUser) {
    redirect('/login');
  }

  // Build lesson count per chapter
  const chapterIds = chapters.map((ch) =>
    (ch._id as { toString(): string }).toString()
  );

  // Get lesson counts in bulk
  const lessonCounts = await Lesson.aggregate([
    { $match: { chapterId: { $in: chapters.map((ch) => ch._id) } } },
    { $group: { _id: '$chapterId', count: { $sum: 1 } } },
  ]);

  const lessonCountMap = new Map<string, number>();
  for (const lc of lessonCounts) {
    lessonCountMap.set(lc._id.toString(), lc.count);
  }

  // Build completed sets
  const completedChapterIds = new Set(
    (dbUser.chaptersCompleted || []).map((id: { toString(): string }) =>
      id.toString()
    )
  );
  const completedLessonIds = new Set(
    (dbUser.lessonsCompleted || []).map((id: { toString(): string }) =>
      id.toString()
    )
  );

  // Calculate per-chapter completed lesson count
  const allLessons = await Lesson.find({
    chapterId: { $in: chapters.map((ch) => ch._id) },
  })
    .select('_id chapterId')
    .lean();

  const chapterLessonMap = new Map<string, string[]>();
  for (const lesson of allLessons) {
    const chId = (lesson.chapterId as { toString(): string }).toString();
    if (!chapterLessonMap.has(chId)) {
      chapterLessonMap.set(chId, []);
    }
    chapterLessonMap
      .get(chId)!
      .push((lesson._id as { toString(): string }).toString());
  }

  // Determine chapter statuses
  const chapterStops = chapters.map((ch, index) => {
    const chId = (ch._id as { toString(): string }).toString();
    const lessonIds = chapterLessonMap.get(chId) || [];
    const completedCount = lessonIds.filter((lid) =>
      completedLessonIds.has(lid)
    ).length;
    const totalLessons = lessonCountMap.get(chId) || ch.lessons?.length || 0;

    let status: 'completed' | 'current' | 'locked' = 'locked';
    if (completedChapterIds.has(chId)) {
      status = 'completed';
    } else if (
      index === 0 ||
      completedChapterIds.has(
        (chapters[index - 1]._id as { toString(): string }).toString()
      )
    ) {
      status = 'current';
    }

    return {
      _id: chId,
      number: ch.number,
      title: ch.title,
      subtitle: ch.subtitle,
      colorAccent: ch.colorAccent,
      lessonCount: totalLessons,
      completedLessonCount: completedCount,
      status,
    };
  });

  const hasProgress =
    completedLessonIds.size > 0 || completedChapterIds.size > 0;

  const userData = {
    name: dbUser.name,
    xp: dbUser.xp,
    currentStreak: dbUser.currentStreak,
    league: dbUser.league,
    avatarSeed: dbUser.avatarSeed,
  };

  return (
    <DashboardClient
      chapters={chapterStops}
      user={userData}
      hasProgress={hasProgress}
    />
  );
}
