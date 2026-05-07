import crypto from "node:crypto";
import { z } from "zod/v4";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import PasswordResetToken from "@/models/PasswordResetToken";
import { sendPasswordResetEmail } from "@/lib/email";

const schema = z.object({
  email: z.email("Invalid email address"),
});

const GENERIC_RESPONSE = {
  message:
    "If an account exists for that email, we've sent a password reset link. Check your inbox.",
};

const TOKEN_TTL_MS = 60 * 60 * 1000;

function hashToken(raw: string) {
  return crypto.createHash("sha256").update(raw).digest("hex");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = schema.safeParse(body);
    if (!result.success) {
      return Response.json(GENERIC_RESPONSE, { status: 200 });
    }

    const email = result.data.email.toLowerCase().trim();

    await dbConnect();
    const user = await User.findOne({ email }).select("_id email");

    if (!user) {
      return Response.json(GENERIC_RESPONSE, { status: 200 });
    }

    await PasswordResetToken.deleteMany({ userId: user._id });

    const rawToken = crypto.randomBytes(32).toString("base64url");
    const tokenHash = hashToken(rawToken);
    const expiresAt = new Date(Date.now() + TOKEN_TTL_MS);

    await PasswordResetToken.create({
      userId: user._id,
      tokenHash,
      expiresAt,
    });

    const appUrl =
      process.env.APP_URL ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000";
    const resetUrl = `${appUrl}/reset-password?token=${rawToken}`;

    try {
      await sendPasswordResetEmail(user.email, resetUrl);
    } catch (err) {
      console.error("Failed to send password reset email:", err);
    }

    return Response.json(GENERIC_RESPONSE, { status: 200 });
  } catch (err) {
    console.error("Forgot password error:", err);
    return Response.json(GENERIC_RESPONSE, { status: 200 });
  }
}
