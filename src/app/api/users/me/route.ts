import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { User } from "@/models";

export async function GET() {
  try {
    await dbConnect();
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(session.user.id)
      .select("-passwordHash")
      .populate("badges.badgeId");

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json(user);
  } catch (error) {
    console.error("GET /api/users/me error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    await dbConnect();
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const allowedFields: Record<string, boolean> = {
      name: true,
      moneyPersonality: true,
      age: true,
      avatarSeed: true,
    };

    const updates: Record<string, unknown> = {};
    for (const key of Object.keys(body)) {
      if (allowedFields[key]) {
        updates[key] = body[key];
      }
    }

    if (Object.keys(updates).length === 0) {
      return Response.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    if (updates.name !== undefined && (typeof updates.name !== "string" || (updates.name as string).trim().length === 0)) {
      return Response.json(
        { error: "Name must be a non-empty string" },
        { status: 400 }
      );
    }

    if (updates.moneyPersonality !== undefined && typeof updates.moneyPersonality !== "string") {
      return Response.json(
        { error: "moneyPersonality must be a string" },
        { status: 400 }
      );
    }

    if (updates.age !== undefined) {
      if (typeof updates.age !== "number" || !Number.isInteger(updates.age) || updates.age < 1) {
        return Response.json(
          { error: "Age must be a positive integer" },
          { status: 400 }
        );
      }
    }

    if (updates.avatarSeed !== undefined) {
      if (typeof updates.avatarSeed !== "string" || (updates.avatarSeed as string).trim().length === 0) {
        return Response.json(
          { error: "avatarSeed must be a non-empty string" },
          { status: 400 }
        );
      }
    }

    const user = await User.findByIdAndUpdate(
      session.user.id,
      { $set: updates },
      { new: true }
    ).select("-passwordHash");

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json(user);
  } catch (error) {
    console.error("PATCH /api/users/me error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
