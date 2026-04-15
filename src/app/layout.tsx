import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";

export const metadata: Metadata = {
  title: "FinLit - Gamified Financial Literacy",
  description:
    "Level up your financial knowledge with interactive lessons, simulations, and challenges. Master budgeting, investing, and more through a gamified learning experience.",
  openGraph: {
    title: "FinLit - Gamified Financial Literacy",
    description:
      "Level up your financial knowledge with interactive lessons, simulations, and challenges.",
    type: "website",
    siteName: "FinLit",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1B6B4A",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-body">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
