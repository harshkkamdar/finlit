import { z } from "zod/v4";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import User from "@/models/User";

const forgotPasswordSchema = z.object({
  email: z.email("Invalid email address"),
  age: z.number({ error: "Age must be a number" }),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = forgotPasswordSchema.safeParse(body);
    if (!result.success) {
      return Response.json(
        { error: "Validation failed", issues: result.error.issues },
        { status: 400 }
      );
    }

    const { email, age, password } = result.data;

    await dbConnect();

    const user = await User.findOne({ email }).select("+passwordHash");

    if (!user || user.age !== age) {
      return Response.json(
        { error: "We couldn't verify those details" },
        { status: 401 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    user.passwordHash = passwordHash;
    await user.save();

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Forgot password error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
