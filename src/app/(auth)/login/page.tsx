import type { Metadata } from "next";
import LoginClient from "./LoginClient";

export const metadata: Metadata = {
  title: "Log in",
  description:
    "Log in to FinoLingo and pick up your financial literacy journey where you left off.",
  alternates: { canonical: "/login" },
};

export default function LoginPage() {
  return <LoginClient />;
}
