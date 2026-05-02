'use client';

import Link from 'next/link';
import { Trophy, Flame } from 'lucide-react';

interface MobileTopBarProps {
  xp: number;
  league: string;
  currentStreak: number;
}

const leagueColors: Record<string, string> = {
  Bronze: '#CD7F32',
  Silver: '#C0C0C0',
  Gold: '#FFD700',
  Diamond: '#B9F2FF',
};

/**
 * Sticky 56px top bar for mobile/tablet (< lg). Shows logo + streak + XP.
 * Hidden at lg+, where the IconRail/Sidebar take over.
 */
export default function MobileTopBar({
  xp,
  league,
  currentStreak,
}: MobileTopBarProps) {
  const leagueColor = leagueColors[league] || leagueColors.Bronze;
  const streakActive = currentStreak > 0;

  return (
    <header
      className="lg:hidden sticky top-0 z-40 safe-top bg-bg/90 backdrop-blur-md border-b border-border"
      role="banner"
    >
      <div className="flex items-center justify-between h-14 px-4">
        {/* Logo */}
        <Link
          href="/dashboard"
          className="font-display text-xl font-bold text-dark"
          aria-label="FinoLingo home"
        >
          Fino<span className="text-primary">Lingo</span>
        </Link>

        {/* Streak + XP chips */}
        <div className="flex items-center gap-2">
          <Link
            href="/progress"
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border min-h-[36px]"
            aria-label={`Current streak: ${currentStreak} days`}
          >
            <Flame
              className={`w-3.5 h-3.5 ${
                streakActive ? 'text-orange-500' : 'text-border'
              }`}
              fill={streakActive ? 'currentColor' : 'none'}
            />
            <span
              className={`font-mono text-xs font-bold tabular-nums ${
                streakActive ? 'text-dark' : 'text-text-disabled'
              }`}
            >
              {currentStreak}
            </span>
          </Link>

          <Link
            href="/progress"
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border min-h-[36px]"
            aria-label={`${xp} XP, ${league} league`}
          >
            <Trophy
              className="w-3.5 h-3.5"
              style={{ color: leagueColor }}
              strokeWidth={2.2}
            />
            <span className="font-mono text-xs font-semibold text-dark tabular-nums">
              {xp.toLocaleString('en-US')}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
