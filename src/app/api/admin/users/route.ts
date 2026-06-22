import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { User } from "@/models";

export async function GET(request: Request) {
  try {
    await dbConnect();
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "admin") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query: any = {};
    if (search) {
      const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query = {
        $or: [
          { name: { $regex: escaped, $options: "i" } },
          { email: { $regex: escaped, $options: "i" } },
        ],
      };
    }

    const users = await User.find(query)
      .select("name email xp league currentStreak createdAt role avatarSeed isTestAccount")
      .sort({ createdAt: -1 })
      .lean();

    return Response.json(users);
  } catch (error) {
    console.error("GET /api/admin/users error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
