import LessonEditorClient from './LessonEditorClient';

export default async function LessonEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <LessonEditorClient lessonId={id} />;
}
