import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const from = process.env.EMAIL_FROM ?? "onboarding@resend.dev";

let client: Resend | null = null;
function getClient(): Resend {
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }
  if (!client) client = new Resend(apiKey);
  return client;
}

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  const resend = getClient();

  const text = [
    "Someone (hopefully you) requested a password reset for your FinoLingo account.",
    "",
    "Click the link below to set a new password. The link expires in 1 hour and can only be used once.",
    "",
    resetUrl,
    "",
    "If you didn't request this, you can safely ignore this email — your password won't change.",
  ].join("\n");

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; color: #1a1a1a;">
      <h1 style="font-size: 24px; margin: 0 0 16px;">
        <span style="color: #166534;">Fino</span><span style="color: #f59e0b;">Lingo</span>
      </h1>
      <p style="font-size: 15px; line-height: 1.6; margin: 0 0 16px;">
        Someone (hopefully you) requested a password reset for your FinoLingo account.
      </p>
      <p style="margin: 24px 0;">
        <a href="${resetUrl}" style="display: inline-block; background: #166534; color: #fff; text-decoration: none; padding: 12px 20px; border-radius: 8px; font-weight: 600;">
          Reset password
        </a>
      </p>
      <p style="font-size: 13px; color: #555; line-height: 1.6; margin: 0 0 12px;">
        This link expires in 1 hour and can only be used once. If the button doesn't work, paste this URL into your browser:
      </p>
      <p style="font-size: 12px; color: #888; word-break: break-all; margin: 0 0 24px;">
        ${resetUrl}
      </p>
      <p style="font-size: 13px; color: #555; line-height: 1.6; margin: 0;">
        If you didn't request this, you can safely ignore this email — your password won't change.
      </p>
    </div>
  `;

  return resend.emails.send({
    from,
    to,
    subject: "Reset your FinoLingo password",
    html,
    text,
  });
}
