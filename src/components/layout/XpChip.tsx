'use client';

import Link from 'next/link';
import { Trophy } from 'lucide-react';

interface XpChipProps {
  xp: number;
  league: string;
}

const leagueColors: Record<string, string> = {
  Bronze: '#CD7F32',
  Silver: '#C0C0C0',
  Gold: '#FFD700',
  Diamond: '#B9F2FF',
};

export default function XpChip({ xp, league }: XpChipProps) {
  const color = leagueColors[league] || leagueColors.Bronze;

  return (
    <Link
      href="/progress"
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border hover:border-border-light hover:bg-fill-subtle transition-all duration-150 group"
    >
      <Trophy
        className="w-3.5 h-3.5 transition-colors"
        style={{ color }}
        strokeWidth={2.2}
      />
      <span className="font-mono text-xs font-semibold text-dark tabular-nums">
        {xp.toLocaleString('en-US')}
      </span>
      <span
        className="text-[10px] font-mono font-medium uppercase tracking-wider"
        style={{ color }}
      >
        {league}
      </span>
    </Link>
  );
}
