'use client';

import { useMemo } from 'react';
import {
  Trophy,
  Flame,
  BookOpen,
  Zap,
  Star,
  Lock,
  Target,
  Layers,
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';

// ── Types ───────────────────────────────────────────────────────────────

interface ProgressUser {
  name: string;
  xp: number;
  league: string;
  currentStreak: number;
  longestStreak: number;
  avatarSeed: string;
  lessonsCompletedCount: number;
  chaptersCompletedCount: number;
  simulationsCompletedCount: number;
  dailyChallengesCompletedCount: number;
  totalBadgesEarned: number;
}

interface BadgeData {
  _id: string;
  name: string;
  description: string;
  icon: string;
  isSecret: boolean;
  category: string;
  earned: boolean;
  earnedAt: string | null;
}

interface ProgressClientProps {
  user: ProgressUser;
  badges: BadgeData[];
}

// ── League Config ───────────────────────────────────────────────────────

const LEAGUES = [
  { name: 'Bronze', min: 0, max: 499, color: '#CD7F32' },
  { name: 'Silver', min: 500, max: 1499, color: '#C0C0C0' },
  { name: 'Gold', min: 1500, max: 3999, color: '#FFD700' },
  { name: 'Diamond', min: 4000, max: Infinity, color: '#B9F2FF' },
];

function getLeagueInfo(xp: number) {
  const current = LEAGUES.find((l) => xp >= l.min && xp <= l.max) || LEAGUES[0];
  const currentIndex = LEAGUES.indexOf(current);
  const next = currentIndex < LEAGUES.length - 1 ? LEAGUES[currentIndex + 1] : null;

  const progressInLeague = xp - current.min;
  const leagueRange = (next ? next.min : current.max + 1) - current.min;
  const percent = next ? Math.min((progressInLeague / leagueRange) * 100, 100) : 100;
  const xpToNext = next ? next.min - xp : 0;

  return { current, next, percent, xpToNext };
}

// ── Icon Helper ─────────────────────────────────────────────────────────

function kebabToPascal(str: string): string {
  return str
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('');
}

function BadgeIcon({
  iconName,
  className,
}: {
  iconName: string;
  className?: string;
}) {
  const pascalName = kebabToPascal(iconName);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Icon = (LucideIcons as any)[pascalName];
  if (!Icon) return <Star className={className} />;
  return <Icon className={className} />;
}

// ── Main Component ──────────────────────────────────────────────────────

export default function ProgressClient({ user, badges }: ProgressClientProps) {
  const leagueInfo = getLeagueInfo(user.xp);

  // Group badges by category
  const badgesByCategory = useMemo(() => {
    const map = new Map<string, BadgeData[]>();
    for (const badge of badges) {
      const cat = badge.category || 'Other';
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(badge);
    }
    return map;
  }, [badges]);

  const earnedCount = badges.filter((b) => b.earned).length;
  const totalCount = badges.filter((b) => !b.isSecret || b.earned).length;

  return (
    <div className="space-y-8">
      {/* ── League & XP Section ─────────────────────────────────────────── */}
      <div className="flex items-start gap-8">
        {/* League progress */}
        <div className="flex-1 bg-surface border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${leagueInfo.current.color}18` }}
            >
              <Trophy
                className="w-5 h-5"
                style={{ color: leagueInfo.current.color }}
              />
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold text-dark leading-tight">
                {leagueInfo.current.name} League
              </h2>
              <p className="text-sm text-muted">
                {user.xp.toLocaleString()} XP total
              </p>
            </div>
          </div>

          {/* Progress bar to next league */}
          {leagueInfo.next ? (
            <div>
              <div className="flex items-center justify-between text-xs text-muted mb-2">
                <span>{leagueInfo.current.name}</span>
                <span>{leagueInfo.next.name}</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-fill-muted overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${leagueInfo.percent}%`,
                    backgroundColor: leagueInfo.current.color,
                  }}
                />
              </div>
              <p className="text-xs text-muted mt-2">
                <span className="font-mono font-semibold text-dark">
                  {leagueInfo.xpToNext.toLocaleString()}
                </span>{' '}
                XP to {leagueInfo.next.name}
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted">
              You&apos;ve reached the highest league!
            </p>
          )}

          {/* League tiers visual */}
          <div className="flex items-center gap-2 mt-5 pt-5 border-t border-border-light">
            {LEAGUES.map((league) => {
              const isCurrentOrPast = user.xp >= league.min;
              return (
                <div
                  key={league.name}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                    league.name === leagueInfo.current.name
                      ? 'outline outline-1'
                      : ''
                  }`}
                  style={{
                    backgroundColor: isCurrentOrPast
                      ? `${league.color}15`
                      : undefined,
                    color: isCurrentOrPast ? league.color : undefined,
                    outlineColor:
                      league.name === leagueInfo.current.name
                        ? `${league.color}40`
                        : undefined,
                    opacity: isCurrentOrPast ? 1 : 0.35,
                  }}
                >
                  <Trophy className="w-3 h-3" />
                  {league.name}
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick stats */}
        <div className="w-[200px] space-y-3 shrink-0">
          <StatCard
            icon={<Flame className="w-4 h-4 text-orange-500" />}
            label="Current streak"
            value={`${user.currentStreak} day${user.currentStreak !== 1 ? 's' : ''}`}
          />
          <StatCard
            icon={<Target className="w-4 h-4 text-primary" />}
            label="Longest streak"
            value={`${user.longestStreak} day${user.longestStreak !== 1 ? 's' : ''}`}
          />
          <StatCard
            icon={<BookOpen className="w-4 h-4 text-info" />}
            label="Lessons done"
            value={String(user.lessonsCompletedCount)}
          />
          <StatCard
            icon={<Zap className="w-4 h-4 text-accent" />}
            label="Daily challenges"
            value={String(user.dailyChallengesCompletedCount)}
          />
          <StatCard
            icon={<Layers className="w-4 h-4 text-purple-500" />}
            label="Simulations"
            value={String(user.simulationsCompletedCount)}
          />
        </div>
      </div>

      {/* ── Badges Section ──────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-semibold text-dark">
            Badges
          </h2>
          <span className="text-sm text-muted font-mono tabular-nums">
            {earnedCount}/{totalCount}
          </span>
        </div>

        <div className="space-y-6">
          {Array.from(badgesByCategory.entries()).map(([category, categoryBadges]) => (
            <div key={category}>
              <h3 className="text-xs font-medium text-muted uppercase tracking-wider mb-3">
                {category}
              </h3>
              <div className="grid grid-cols-4 gap-3">
                {categoryBadges.map((badge) => {
                  // Hide secret badges that haven't been earned
                  if (badge.isSecret && !badge.earned) {
                    return (
                      <div
                        key={badge._id}
                        className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border-light bg-fill-subtle"
                      >
                        <div className="w-10 h-10 rounded-full bg-fill-muted flex items-center justify-center">
                          <Lock className="w-4 h-4 text-text-disabled" />
                        </div>
                        <span className="text-xs font-medium text-text-disabled text-center">
                          Secret
                        </span>
                        <span className="text-[11px] text-text-disabled text-center leading-snug">
                          Keep exploring to unlock
                        </span>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={badge._id}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                        badge.earned
                          ? 'border-border bg-surface shadow-sm'
                          : 'border-border-light bg-fill-subtle'
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          badge.earned
                            ? 'bg-accent/10'
                            : 'bg-fill-muted'
                        }`}
                      >
                        <BadgeIcon
                          iconName={badge.icon}
                          className={`w-5 h-5 ${
                            badge.earned
                              ? 'text-accent'
                              : 'text-text-disabled'
                          }`}
                        />
                      </div>
                      <span
                        className={`text-xs font-medium text-center leading-tight ${
                          badge.earned ? 'text-dark' : 'text-dark/70'
                        }`}
                      >
                        {badge.name}
                      </span>
                      <span
                        className={`text-[11px] text-center leading-snug ${
                          badge.earned ? 'text-muted' : 'text-muted/70'
                        }`}
                      >
                        {badge.description}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Stat Card ───────────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-surface">
      <div className="shrink-0">{icon}</div>
      <div className="min-w-0">
        <p className="font-mono text-sm font-semibold text-dark leading-tight tabular-nums">
          {value}
        </p>
        <p className="text-[11px] text-muted leading-tight">{label}</p>
      </div>
    </div>
  );
}
