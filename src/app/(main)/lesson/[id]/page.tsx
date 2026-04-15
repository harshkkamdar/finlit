import { redirect, notFound } from 'next/navigation';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db';
import { auth } from '@/lib/auth';
import User from '@/models/User';
import Lesson from '@/models/Lesson';
import Chapter from '@/models/Chapter';
import LessonPageClient from '@/components/lesson/LessonPage';
import type { ContentBlock, Exercise } from '@/types';

export default async function LessonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  // Validate that id is a valid MongoDB ObjectId before querying
  if (!mongoose.Types.ObjectId.isValid(id)) {
    notFound();
  }

  await dbConnect();

  const lesson = await Lesson.findById(id).lean();

  if (!lesson) {
    notFound();
  }

  const [dbUser, chapter] = await Promise.all([
    User.findById(session.user.id)
      .select('lessonsCompleted')
      .lean(),
    Chapter.findById(lesson.chapterId)
      .select('_id number title colorAccent lessons')
      .lean(),
  ]);

  if (!dbUser || !chapter) {
    notFound();
  }

  const isCompleted = (dbUser.lessonsCompleted || []).some(
    (lid: { toString(): string }) =>
      lid.toString() === (lesson._id as { toString(): string }).toString()
  );

  // Find next lesson in the chapter
  const chapterLessons = await Lesson.find({ chapterId: chapter._id })
    .sort({ order: 1 })
    .select('_id order')
    .lean();

  const currentIndex = chapterLessons.findIndex(
    (l) =>
      (l._id as { toString(): string }).toString() ===
      (lesson._id as { toString(): string }).toString()
  );

  const nextLesson =
    currentIndex >= 0 && currentIndex < chapterLessons.length - 1
      ? chapterLessons[currentIndex + 1]
      : null;

  const lessonData = {
    _id: (lesson._id as { toString(): string }).toString(),
    lessonNumber: lesson.lessonNumber as string,
    title: lesson.title as string,
    content: lesson.content as unknown as { blocks: ContentBlock[] },
    exercises: lesson.exercises as unknown as Exercise[],
    estimatedMinutes: lesson.estimatedMinutes as number,
    order: lesson.order as number,
    isCompleted: !!isCompleted,
  };

  const chapterData = {
    _id: (chapter._id as { toString(): string }).toString(),
    number: chapter.number,
    title: chapter.title,
    colorAccent: chapter.colorAccent,
  };

  const nextLessonId = nextLesson
    ? (nextLesson._id as { toString(): string }).toString()
    : null;

  const totalLessons = chapterLessons.length;
  const lessonIndex = currentIndex + 1;

  return (
    <LessonPageClient
      lesson={lessonData}
      chapter={chapterData}
      nextLessonId={nextLessonId}
      lessonIndex={lessonIndex}
      totalLessons={totalLessons}
    />
  );
}
