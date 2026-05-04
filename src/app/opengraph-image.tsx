import { ImageResponse } from "next/og";

export const alt = "FinoLingo. Learn money. For real.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#FAFAF8",
          padding: 80,
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Brand mark */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 12,
              background: "#1B6B4A",
              color: "white",
              fontSize: 32,
              fontWeight: 700,
              letterSpacing: "-1px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            FL
          </div>
          <span
            style={{
              fontSize: 36,
              fontWeight: 700,
              color: "#1A1A2E",
              letterSpacing: "-1px",
            }}
          >
            FinoLingo
          </span>
        </div>

        {/* Headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <span
            style={{
              fontSize: 84,
              fontWeight: 700,
              color: "#1A1A2E",
              letterSpacing: "-3px",
              lineHeight: 1.05,
              maxWidth: 980,
            }}
          >
            Learn money.{" "}
            <span style={{ color: "#1B6B4A" }}>For real.</span>
          </span>
          <span
            style={{
              fontSize: 30,
              color: "#5C5C73",
              maxWidth: 880,
              lineHeight: 1.35,
            }}
          >
            Seven chapters. Interactive lessons, real-world simulations, and zero
            jargon. Built for young adults figuring out money in India.
          </span>
        </div>

        {/* Footer strip with chapter colors as a small visual signature */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", gap: 6 }}>
            {[
              "#F5A623",
              "#2ECC71",
              "#4A90D9",
              "#8E44AD",
              "#1ABC9C",
              "#E74C3C",
              "#2980B9",
            ].map((c) => (
              <div
                key={c}
                style={{
                  width: 36,
                  height: 8,
                  borderRadius: 2,
                  background: c,
                }}
              />
            ))}
          </div>
          <span style={{ fontSize: 22, color: "#5C5C73" }}>finolingo.com</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
