import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { Simulation } from "@/models";

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

    const simulation = await Simulation.findById(id);

    if (!simulation) {
      return Response.json(
        { error: "Simulation not found" },
        { status: 404 }
      );
    }

    return Response.json(simulation);
  } catch (error) {
    console.error("GET /api/simulations/[id] error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
