'use client';

import { Trophy } from 'lucide-react';

type League = 'Bronze' | 'Silver' | 'Gold' | 'Diamond';

interface LeagueBadgeProps {
  league: League;
  size?: 'sm' | 'md' | 'lg';
}

const leagueConfig: Record<
  League,
  { color: string; bg: string; border: string; glow: string }
> = {
  Bronze: {
    color: '#CD7F32',
    bg: 'bg-[#CD7F32]/15',
    border: 'border-[#CD7F32]/40',
    glow: 'shadow-[#CD7F32]/20',
  },
  Silver: {
    color: '#C0C0C0',
    bg: 'bg-[#C0C0C0]/15',
    border: 'border-[#C0C0C0]/40',
    glow: 'shadow-[#C0C0C0]/20',
  },
  Gold: {
    color: '#FFD700',
    bg: 'bg-[#FFD700]/15',
    border: 'border-[#FFD700]/40',
    glow: 'shadow-[#FFD700]/20',
  },
  Diamond: {
    color: '#B9F2FF',
    bg: 'bg-[#B9F2FF]/15',
    border: 'border-[#B9F2FF]/40',
    glow: 'shadow-[#B9F2FF]/20',
  },
};

const sizeConfig = {
  sm: { circle: 'w-10 h-10', icon: 'w-4 h-4', text: 'text-xs' },
  md: { circle: 'w-14 h-14', icon: 'w-6 h-6', text: 'text-sm' },
  lg: { circle: 'w-20 h-20', icon: 'w-8 h-8', text: 'text-base' },
};

export default function LeagueBadge({
  league,
  size = 'md',
}: LeagueBadgeProps) {
  const config = leagueConfig[league];
  const sizes = sizeConfig[size];

  return (
    <div className="flex flex-col items-center gap-1.5" aria-label={`${league} league`}>
      <div
        className={`
          ${sizes.circle} rounded-full flex items-center justify-center
          ${config.bg} border-2 ${config.border}
          shadow-lg ${config.glow}
        `}
      >
        <Trophy className={sizes.icon} style={{ color: config.color }} />
      </div>
      <span
        className={`font-display font-semibold ${sizes.text}`}
        style={{ color: config.color }}
      >
        {league}
      </span>
    </div>
  );
}
