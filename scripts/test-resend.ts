import { config } from "dotenv";
import { Resend } from "resend";

config({ path: ".env.local" });

async function main() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY missing");

  const resend = new Resend(apiKey);

  const { data, error } = await resend.emails.send({
    from: process.env.EMAIL_FROM ?? "onboarding@resend.dev",
    to: "harshkkamdar@gmail.com",
    subject: "FinoLingo Resend smoke test",
    html: "<p>Resend is wired up. <strong>It works.</strong></p>",
  });

  if (error) {
    console.error("Failed:", error);
    process.exit(1);
  }
  console.log("Sent:", data);
}

main();
