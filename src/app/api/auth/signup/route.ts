import { z } from "zod/v4";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import User from "@/models/User";

const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  age: z.number({ error: "Age must be a number" }),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = signupSchema.safeParse(body);
    if (!result.success) {
      return Response.json(
        { error: "Validation failed", issues: result.error.issues },
        { status: 400 }
      );
    }

    const { name, email, password, age } = result.data;

    await dbConnect();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return Response.json(
        { error: "A user with this email already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const isAdmin = process.env.ADMIN_EMAIL && email === process.env.ADMIN_EMAIL;

    const user = await User.create({
      name,
      email,
      passwordHash,
      age,
      role: isAdmin ? "admin" : "student",
    });

    return Response.json(
      { success: true, userId: user._id.toString(), avatarSeed: user.avatarSeed },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
