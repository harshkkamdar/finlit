import { redirect, notFound } from 'next/navigation';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db';
import { auth } from '@/lib/auth';
import User from '@/models/User';
import Chapter from '@/models/Chapter';
import Lesson from '@/models/Lesson';
import Simulation from '@/models/Simulation';
import ChapterDetailClient from './ChapterDetailClient';

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    notFound();
  }

  await dbConnect();

  const [chapter, dbUser] = await Promise.all([
    Chapter.findById(id).lean(),
    User.findById(session.user.id)
      .select('lessonsCompleted simulationsCompleted chaptersCompleted')
      .lean(),
  ]);

  if (!chapter || !dbUser) {
    notFound();
  }

  // Get lessons for this chapter
  const lessons = await Lesson.find({ chapterId: chapter._id })
    .sort({ order: 1 })
    .select('_id lessonNumber title estimatedMinutes order exercises')
    .lean();

  const completedLessonIds = new Set(
    (dbUser.lessonsCompleted || []).map((lid: { toString(): string }) =>
      lid.toString()
    )
  );

  // Determine lesson statuses
  const lessonsWithStatus = lessons.map((lesson, index) => {
    const lessonId = (lesson._id as { toString(): string }).toString();
    const isCompleted = completedLessonIds.has(lessonId);

    // A lesson is unlocked if: first lesson OR all previous lessons are completed
    let isUnlocked = false;
    if (index === 0) {
      isUnlocked = true;
    } else {
      const prevLessonId = (
        lessons[index - 1]._id as { toString(): string }
      ).toString();
      isUnlocked = completedLessonIds.has(prevLessonId);
    }

    let status: 'completed' | 'in-progress' | 'locked' = 'locked';
    if (isCompleted) {
      status = 'completed';
    } else if (isUnlocked) {
      status = 'in-progress';
    }

    return {
      _id: lessonId,
      lessonNumber: lesson.lessonNumber,
      title: lesson.title,
      estimatedMinutes: lesson.estimatedMinutes,
      order: lesson.order,
      exerciseCount: lesson.exercises?.length || 0,
      status,
    };
  });

  // Get simulation info
  let simulation = null;
  if (chapter.simulationId) {
    const sim = await Simulation.findById(chapter.simulationId)
      .select('_id title description')
      .lean();
    if (sim) {
      const simCompleted = (dbUser.simulationsCompleted || []).some(
        (s: { simulationId: { toString(): string } }) =>
          s.simulationId.toString() ===
          (sim._id as { toString(): string }).toString()
      );
      const allLessonsCompleted = lessonsWithStatus.every(
        (l) => l.status === 'completed'
      );
      simulation = {
        _id: (sim._id as { toString(): string }).toString(),
        title: sim.title,
        description: sim.description,
        isCompleted: simCompleted,
        isUnlocked: allLessonsCompleted,
      };
    }
  }

  // Calculate progress
  const completedCount = lessonsWithStatus.filter(
    (l) => l.status === 'completed'
  ).length;
  const totalCount = lessonsWithStatus.length;
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const chapterData = {
    _id: (chapter._id as { toString(): string }).toString(),
    number: chapter.number,
    title: chapter.title,
    subtitle: chapter.subtitle,
    description: chapter.description,
    colorAccent: chapter.colorAccent,
  };

  return (
    <ChapterDetailClient
      chapter={chapterData}
      lessons={lessonsWithStatus}
      simulation={simulation}
      progress={progress}
      completedCount={completedCount}
      totalCount={totalCount}
    />
  );
}
