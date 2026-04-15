import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { Chapter, User } from "@/models";

export async function GET() {
  try {
    await dbConnect();
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(session.user.id).select(
      "lessonsCompleted simulationsCompleted chaptersCompleted"
    );

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const chapters = await Chapter.find({}).sort({ number: 1 });

    const completedLessonIds = new Set(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      user.lessonsCompleted.map((id: any) => id.toString())
    );
    const completedSimIds = new Set(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      user.simulationsCompleted.map((s: any) => s.simulationId.toString())
    );

    const chaptersWithProgress = chapters.map((chapter) => {
      const lessonIds = chapter.lessons.map((l: { toString(): string }) =>
        l.toString()
      );
      const completedLessonCount = lessonIds.filter((id: string) =>
        completedLessonIds.has(id)
      ).length;

      const allLessonsDone = completedLessonCount === lessonIds.length;
      const simDone =
        !chapter.simulationId ||
        completedSimIds.has(chapter.simulationId.toString());
      const isCompleted = allLessonsDone && simDone && lessonIds.length > 0;

      return {
        _id: chapter._id,
        number: chapter.number,
        title: chapter.title,
        subtitle: chapter.subtitle,
        description: chapter.description,
        colorAccent: chapter.colorAccent,
        iconUrl: chapter.iconUrl,
        lessons: chapter.lessons,
        simulationId: chapter.simulationId,
        isCompleted,
        lessonCount: lessonIds.length,
        completedLessonCount,
      };
    });

    return Response.json(chaptersWithProgress);
  } catch (error) {
    console.error("GET /api/chapters error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
