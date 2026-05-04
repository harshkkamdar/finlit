import type { Metadata } from "next";
import SignupClient from "./SignupClient";

export const metadata: Metadata = {
  title: "Sign up",
  description:
    "Create a free FinoLingo account and start Chapter 1: What Even is Money?",
  alternates: { canonical: "/signup" },
};

export default function SignupPage() {
  return <SignupClient />;
}
