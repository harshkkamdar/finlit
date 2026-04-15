import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { User } from "@/models";

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

    const user = await User.findById(id)
      .select("-passwordHash")
      .populate("badges.badgeId")
      .populate("chaptersCompleted")
      .populate("lessonsCompleted")
      .lean();

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json(user);
  } catch (error) {
    console.error("GET /api/admin/users/[id] error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
