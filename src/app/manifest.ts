import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FinoLingo — Learn Money. For Real.",
    short_name: "FinoLingo",
    description:
      "A gamified financial literacy platform for young Indian adults. Master budgeting, investing, and personal finance through interactive lessons and challenges.",
    start_url: "/",
    display: "standalone",
    background_color: "#FAFAF8",
    theme_color: "#1B6B4A",
    icons: [
      {
        src: "/icon",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
