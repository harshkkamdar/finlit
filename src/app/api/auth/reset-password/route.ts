import crypto from "node:crypto";
import { z } from "zod/v4";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import PasswordResetToken from "@/models/PasswordResetToken";

const schema = z.object({
  token: z.string().min(1, "Token is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const INVALID_TOKEN_ERROR = {
  error: "This reset link is invalid or has expired. Please request a new one.",
};

function hashToken(raw: string) {
  return crypto.createHash("sha256").update(raw).digest("hex");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = schema.safeParse(body);
    if (!result.success) {
      return Response.json(
        { error: "Validation failed", issues: result.error.issues },
        { status: 400 }
      );
    }

    const { token, password } = result.data;

    await dbConnect();

    const tokenHash = hashToken(token);
    const record = await PasswordResetToken.findOne({ tokenHash });

    if (!record || record.expiresAt.getTime() < Date.now()) {
      return Response.json(INVALID_TOKEN_ERROR, { status: 400 });
    }

    const user = await User.findById(record.userId).select("+passwordHash");
    if (!user) {
      await PasswordResetToken.deleteOne({ _id: record._id });
      return Response.json(INVALID_TOKEN_ERROR, { status: 400 });
    }

    user.passwordHash = await bcrypt.hash(password, 12);
    await user.save();

    await PasswordResetToken.deleteMany({ userId: user._id });

    return Response.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Reset password error:", err);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
