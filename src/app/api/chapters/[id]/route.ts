import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { Chapter, User, Simulation } from "@/models";

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

    const chapter = await Chapter.findById(id).populate("lessons");

    if (!chapter) {
      return Response.json({ error: "Chapter not found" }, { status: 404 });
    }

    const user = await User.findById(session.user.id).select(
      "lessonsCompleted simulationsCompleted"
    );

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const completedLessonIds = new Set(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      user.lessonsCompleted.map((id: any) => id.toString())
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lessonsWithProgress = chapter.lessons.map((lesson: any) => ({
      _id: lesson._id,
      lessonNumber: lesson.lessonNumber,
      title: lesson.title,
      estimatedMinutes: lesson.estimatedMinutes,
      order: lesson.order,
      exerciseCount: lesson.exercises?.length || 0,
      isCompleted: completedLessonIds.has(lesson._id.toString()),
    }));

    let simulation = null;
    if (chapter.simulationId) {
      const sim = await Simulation.findById(chapter.simulationId).select(
        "_id title description"
      );
      if (sim) {
        const simCompleted = user.simulationsCompleted.some(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (s: any) => s.simulationId.toString() === sim._id.toString()
        );
        simulation = {
          _id: sim._id,
          title: sim.title,
          description: sim.description,
          isCompleted: simCompleted,
        };
      }
    }

    return Response.json({
      _id: chapter._id,
      number: chapter.number,
      title: chapter.title,
      subtitle: chapter.subtitle,
      description: chapter.description,
      colorAccent: chapter.colorAccent,
      iconUrl: chapter.iconUrl,
      lessons: lessonsWithProgress,
      simulation,
    });
  } catch (error) {
    console.error("GET /api/chapters/[id] error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
