import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { DailyChallenge } from "@/models";

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

    const challenge = await DailyChallenge.findById(id);

    if (!challenge) {
      return Response.json(
        { error: "Challenge not found" },
        { status: 404 }
      );
    }

    return Response.json(challenge);
  } catch (error) {
    console.error("GET /api/admin/challenges/[id] error:", error);
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
      "type",
      "title",
      "content",
      "xpReward",
      "date",
      "requiredChaptersCompleted",
    ];

    const updates: Record<string, unknown> = {};
    for (const key of Object.keys(body)) {
      if (allowedFields.includes(key)) {
        updates[key] = body[key];
      }
    }

    if (updates.type) {
      const validTypes = ["quiz", "scenario", "mini-simulation"];
      if (!validTypes.includes(updates.type as string)) {
        return Response.json(
          { error: `type must be one of: ${validTypes.join(", ")}` },
          { status: 400 }
        );
      }
    }

    if (Object.keys(updates).length === 0) {
      return Response.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    const challenge = await DailyChallenge.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!challenge) {
      return Response.json(
        { error: "Challenge not found" },
        { status: 404 }
      );
    }

    return Response.json(challenge);
  } catch (error) {
    console.error("PUT /api/admin/challenges/[id] error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
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

    const challenge = await DailyChallenge.findByIdAndDelete(id);

    if (!challenge) {
      return Response.json(
        { error: "Challenge not found" },
        { status: 404 }
      );
    }

    return Response.json({ success: true, message: "Challenge deleted" });
  } catch (error) {
    console.error("DELETE /api/admin/challenges/[id] error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
