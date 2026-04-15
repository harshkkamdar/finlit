import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { Lesson } from "@/models";

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

    if (session.user.role !== "admin") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    const lesson = await Lesson.findById(id);

    if (!lesson) {
      return Response.json({ error: "Lesson not found" }, { status: 404 });
    }

    return Response.json(lesson);
  } catch (error) {
    console.error("GET /api/admin/lessons/[id] error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "admin") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();

    const allowedFields = [
      "title",
      "lessonNumber",
      "content",
      "exercises",
      "estimatedMinutes",
      "order",
    ];

    const updates: Record<string, unknown> = {};
    for (const key of Object.keys(body)) {
      if (allowedFields.includes(key)) {
        updates[key] = body[key];
      }
    }

    if (Object.keys(updates).length === 0) {
      return Response.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    const lesson = await Lesson.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!lesson) {
      return Response.json({ error: "Lesson not found" }, { status: 404 });
    }

    return Response.json(lesson);
  } catch (error) {
    console.error("PUT /api/admin/lessons/[id] error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
