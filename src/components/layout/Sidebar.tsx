"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Lock,
  Check,
  ChevronRight,
} from "lucide-react";

interface SidebarChapter {
  _id: string;
  number: number;
  title: string;
  colorAccent: string;
  status: "completed" | "active" | "locked";
}

interface SidebarProps {
  chapters: SidebarChapter[];
}

/* ------------------------------------------------------------------ */
/*  Inline SVG Progress Ring                                          */
/* ------------------------------------------------------------------ */
function ProgressRing({
  percent,
  color,
  size = 16,
  strokeWidth = 2,
  muted = false,
  children,
}: {
  percent: number;
  color: string;
  size?: number;
  strokeWidth?: number;
  muted?: boolean;
  children?: React.ReactNode;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div
      className="relative flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
        className="absolute inset-0"
      >
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={muted ? "rgba(255,255,255,0.1)" : `${color}30`}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress arc */}
        {percent > 0 && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={muted ? "rgba(255,255,255,0.2)" : color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            className="progress-ring-circle"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: offset,
            }}
          />
        )}
      </svg>
      {/* Center content (checkmark, etc.) */}
      {children && (
        <div className="relative z-10 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Sidebar Component                                            */
/* ------------------------------------------------------------------ */
export default function Sidebar({ chapters }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className="fixed left-[56px] top-0 h-screen w-[220px] flex flex-col z-40"
      style={{
        background: "linear-gradient(180deg, var(--color-dark) 0%, var(--color-dark-bottom) 100%)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Section label */}
      <div className="px-5 pt-5 pb-3">
        <span className="text-xs font-body font-medium text-white/50">
          Learn
        </span>
      </div>

      {/* Chapter list */}
      <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-1">
        <p className="px-3 mb-3 text-[11px] font-mono font-semibold text-white/30 uppercase tracking-widest">
          Chapters
        </p>
        {chapters.map((chapter) => {
          const isActive = pathname.includes(`/chapter/${chapter._id}`);
          const isCompleted = chapter.status === "completed";
          const isLocked = chapter.status === "locked";

          // Simulated progress based on status
          const progressPercent = isCompleted ? 100 : isLocked ? 0 : 60;

          return (
            <Link
              key={chapter._id}
              href={isLocked ? "#" : `/chapter/${chapter._id}`}
              className={`
                relative flex items-center gap-3 px-3 py-2.5 rounded-lg
                transition-all duration-200 group outline-none
                focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-inset
                ${isActive ? "" : "hover:bg-white/[0.04]"}
                ${isLocked ? "cursor-not-allowed" : "cursor-pointer"}
              `}
              style={
                isActive
                  ? {
                      backgroundColor: `${chapter.colorAccent}14`,
                      borderLeft: `3px solid ${chapter.colorAccent}`,
                      paddingLeft: "9px",
                    }
                  : undefined
              }
              onClick={(e) => {
                if (isLocked) e.preventDefault();
              }}
            >
              {/* Progress ring indicator */}
              {isCompleted ? (
                <ProgressRing
                  percent={100}
                  color={chapter.colorAccent}
                  size={16}
                  strokeWidth={2}
                >
                  <div
                    className="w-[10px] h-[10px] rounded-full flex items-center justify-center"
                    style={{ backgroundColor: chapter.colorAccent }}
                  >
                    <Check className="w-[7px] h-[7px] text-white" strokeWidth={3} />
                  </div>
                </ProgressRing>
              ) : isLocked ? (
                <ProgressRing
                  percent={0}
                  color={chapter.colorAccent}
                  size={16}
                  strokeWidth={2}
                  muted
                />
              ) : (
                <div className="relative">
                  <ProgressRing
                    percent={progressPercent}
                    color={chapter.colorAccent}
                    size={16}
                    strokeWidth={2}
                  />
                  {/* Subtle pulse for active chapter ring */}
                  {isActive && (
                    <div
                      className="absolute inset-0 rounded-full animate-ping opacity-20"
                      style={{
                        backgroundColor: chapter.colorAccent,
                        width: 16,
                        height: 16,
                      }}
                    />
                  )}
                </div>
              )}

              {/* Title */}
              <span
                className={`
                  text-sm font-body truncate flex-1 transition-colors duration-150
                  ${isLocked ? "text-white/25" : "text-white/70 group-hover:text-white/90"}
                  ${isActive ? "!text-white font-medium" : ""}
                `}
              >
                {chapter.title}
              </span>

              {/* Right indicator */}
              {isLocked && (
                <Lock className="w-3.5 h-3.5 text-white/15 shrink-0" />
              )}
              {isActive && (
                <ChevronRight
                  className="w-3.5 h-3.5 shrink-0 transition-colors"
                  style={{ color: chapter.colorAccent }}
                />
              )}
            </Link>
          );
        })}
      </nav>

    </aside>
  );
}
