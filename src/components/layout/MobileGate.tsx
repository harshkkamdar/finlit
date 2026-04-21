"use client";

import { useState, useEffect } from "react";

const BREAKPOINT = 1024;

export default function MobileGate() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < BREAKPOINT);
    check();

    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (!isMobile) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white flex items-center justify-center p-8">
      <div className="text-center max-w-sm">
        <div className="text-7xl mb-6">&#x1FA99;</div>
        <h1 className="font-display text-2xl font-bold text-dark mb-3">
          FinoLingo is best experienced on a desktop
        </h1>
        <p className="font-body text-muted text-base leading-relaxed">
          Please switch to a larger screen for the full experience. We promise
          it&apos;s worth it!
        </p>
      </div>
    </div>
  );
}
