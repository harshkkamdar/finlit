import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { DailyChallenge } from "@/models";

export async function GET() {
  try {
    await dbConnect();
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "admin") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const challenges = await DailyChallenge.find({}).sort({ date: -1 }).lean();

    return Response.json(challenges);
  } catch (error) {
    console.error("GET /api/admin/challenges error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "admin") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();

    const { type, title, content, xpReward, date, requiredChaptersCompleted } =
      body;

    if (!type || !title || !xpReward) {
      return Response.json(
        { error: "type, title, and xpReward are required" },
        { status: 400 }
      );
    }

    const validTypes = ["quiz", "scenario", "mini-simulation"];
    if (!validTypes.includes(type)) {
      return Response.json(
        { error: `type must be one of: ${validTypes.join(", ")}` },
        { status: 400 }
      );
    }

    const challenge = await DailyChallenge.create({
      type,
      title,
      content: content || {},
      xpReward,
      date: date || null,
      requiredChaptersCompleted: requiredChaptersCompleted || 0,
    });

    return Response.json(challenge, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/challenges error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
