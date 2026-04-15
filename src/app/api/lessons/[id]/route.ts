import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { Lesson, User } from "@/models";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const lesson = await Lesson.findById(id);

    if (!lesson) {
      return Response.json({ error: "Lesson not found" }, { status: 404 });
    }

    const user = await User.findById(session.user.id).select(
      "lessonsCompleted"
    );

    const isCompleted = user?.lessonsCompleted.some(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (lid: any) => lid.toString() === lesson._id.toString()
    );

    return Response.json({
      _id: lesson._id,
      chapterId: lesson.chapterId,
      lessonNumber: lesson.lessonNumber,
      title: lesson.title,
      content: lesson.content,
      exercises: lesson.exercises,
      estimatedMinutes: lesson.estimatedMinutes,
      order: lesson.order,
      isCompleted: !!isCompleted,
    });
  } catch (error) {
    console.error("GET /api/lessons/[id] error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
