import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";

export const metadata: Metadata = {
  title: "FinoLingo — Learn Money. For Real.",
  description:
    "FinoLingo is a gamified financial literacy platform for young Indian adults (18-25). Master budgeting, investing, taxes, and personal finance through interactive lessons, simulations, and challenges.",
  keywords: [
    "financial literacy",
    "FinoLingo",
    "personal finance India",
    "money management",
    "budgeting app",
    "investing for beginners",
    "gamified learning",
    "financial education",
    "young adults finance",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "FinoLingo — Learn Money. For Real.",
    description:
      "A gamified financial literacy platform for young Indian adults. Master budgeting, investing, and personal finance through interactive lessons and challenges.",
    type: "website",
    siteName: "FinoLingo",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "FinoLingo — Learn Money. For Real.",
    description:
      "A gamified financial literacy platform for young Indian adults. Master budgeting, investing, and personal finance through interactive lessons and challenges.",
  },
  metadataBase: new URL("https://finolingo.com"),
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
