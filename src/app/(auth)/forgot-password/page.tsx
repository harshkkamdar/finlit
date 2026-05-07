import type { Metadata } from "next";
import ForgotPasswordClient from "./ForgotPasswordClient";

export const metadata: Metadata = {
  title: "Reset password",
  description:
    "Request a secure password reset link for your FinoLingo account.",
  alternates: { canonical: "/forgot-password" },
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordClient />;
}
