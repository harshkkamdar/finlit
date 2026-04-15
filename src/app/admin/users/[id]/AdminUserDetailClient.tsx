'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  User as UserIcon,
  Calendar,
  Sparkles,
  Flame,
  Trophy,
  BookOpen,
  Award,
  Target,
  Clock,
  Loader2,
} from 'lucide-react';
import { createAvatar } from '@dicebear/core';
import * as adventurer from '@dicebear/adventurer';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import LeagueBadge from '@/components/gamification/LeagueBadge';

interface UserDetail {
  _id: string;
  name: string;
  email: string;
  age: number;
  role: string;
  avatarSeed: string;
  xp: number;
  currentStreak: number;
  longestStreak: number;
  league: string;
  moneyPersonality: string | null;
  chaptersCompleted: Array<{ _id: string; number: number; title: string }>;
  lessonsCompleted: Array<{ _id: string; title: string; lessonNumber: string }>;
  badges: Array<{
    badgeId: { _id: string; name: string; icon: string; description: string };
    earnedAt: string;
  }>;
  exerciseResults: Array<{
    lessonId: string;
    score: number;
    maxScore: number;
    xpEarned: number;
    completedAt: string;
  }>;
  simulationsCompleted: Array<{
    simulationId: string;
    score: number;
    walletFinal: number;
    path: string[];
  }>;
  dailyChallengesCompleted: Array<{
    challengeId: string;
    date: string;
    score: number;
  }>;
  createdAt: string;
  updatedAt: string;
}

function generateAvatar(seed: string): string {
  const avatar = createAvatar(adventurer, { seed, size: 80 });
  return avatar.toDataUri();
}

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateStr));
}

function formatDateTime(dateStr: string): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateStr));
}

export default function AdminUserDetailClient({
  userId,
}: {
  userId: string;
}) {
  const router = useRouter();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(`/api/admin/users/${userId}`);
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          setError('Failed to load user');
        }
      } catch {
        setError('Failed to load user');
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-muted animate-spin" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="text-center py-20">
        <p className="text-error font-body">{error || 'User not found'}</p>
        <Button
          variant="ghost"
          className="mt-4"
          onClick={() => router.push('/admin/users')}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Users
        </Button>
      </div>
    );
  }

  // Build a timeline of all activity
  const timeline: Array<{
    type: string;
    label: string;
    detail: string;
    date: string;
  }> = [];

  // Add badge earnings
  for (const b of user.badges || []) {
    if (b.badgeId) {
      timeline.push({
        type: 'badge',
        label: 'Badge Earned',
        detail: b.badgeId.name,
        date: b.earnedAt,
      });
    }
  }

  // Add exercise results
  for (const ex of user.exerciseResults || []) {
    timeline.push({
      type: 'exercise',
      label: 'Exercise Completed',
      detail: `Score: ${ex.score}/${ex.maxScore} (+${ex.xpEarned} XP)`,
      date: ex.completedAt,
    });
  }

  // Add daily challenges
  for (const dc of user.dailyChallengesCompleted || []) {
    timeline.push({
      type: 'challenge',
      label: 'Daily Challenge',
      detail: `Score: ${dc.score} on ${dc.date}`,
      date: dc.date,
    });
  }

  // Sort timeline by date descending
  timeline.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const timelineIcons: Record<string, typeof Award> = {
    badge: Award,
    exercise: Target,
    challenge: Sparkles,
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Back button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push('/admin/users')}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Users
      </Button>

      {/* User Header Card */}
      <Card variant="elevated" className="!p-6">
        <div className="flex items-center gap-6">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-primary-light shrink-0">
            <img
              src={generateAvatar(user.avatarSeed)}
              alt={user.name}
              width={80}
              height={80}
              className="w-full h-full"
            />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <h2 className="font-display text-xl font-bold text-dark truncate">
                {user.name}
              </h2>
              {user.role === 'admin' && (
                <Badge variant="info">Admin</Badge>
              )}
            </div>
            <p className="text-sm text-muted font-body">{user.email}</p>
            <div className="flex items-center gap-4 mt-2 text-xs text-muted font-body">
              <span className="flex items-center gap-1">
                <UserIcon className="w-3.5 h-3.5" />
                {user.age} years old
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Joined {formatDate(user.createdAt)}
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 shrink-0">
            <div className="text-center">
              <p className="font-mono text-xl font-bold text-accent tabular-nums">
                {user.xp.toLocaleString()}
              </p>
              <p className="text-xs text-muted font-body">XP</p>
            </div>
            <div className="text-center">
              <LeagueBadge
                league={user.league as 'Bronze' | 'Silver' | 'Gold' | 'Diamond'}
                size="sm"
              />
            </div>
            <div className="text-center">
              <div className="flex items-center gap-1 justify-center">
                <Flame className="w-5 h-5 text-orange-500" />
                <span className="font-mono text-xl font-bold text-dark tabular-nums">
                  {user.currentStreak}
                </span>
              </div>
              <p className="text-xs text-muted font-body">Streak</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Progress Summary */}
      <div className="grid grid-cols-3 gap-4">
        {/* Chapters */}
        <Card variant="bordered" className="!p-4">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-display font-semibold text-dark">
              Chapters Completed
            </h3>
          </div>
          {(user.chaptersCompleted || []).length > 0 ? (
            <div className="space-y-1.5">
              {user.chaptersCompleted.map((ch) => (
                <p key={ch._id} className="text-sm text-muted font-body">
                  Ch {ch.number}: {ch.title}
                </p>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted/60 font-body">None yet</p>
          )}
        </Card>

        {/* Badges */}
        <Card variant="bordered" className="!p-4">
          <div className="flex items-center gap-2 mb-3">
            <Award className="w-4 h-4 text-accent" />
            <h3 className="text-sm font-display font-semibold text-dark">
              Badges Earned ({(user.badges || []).length})
            </h3>
          </div>
          {(user.badges || []).length > 0 ? (
            <div className="space-y-1.5">
              {user.badges.map((b, i) => (
                <div key={i} className="flex items-center justify-between">
                  <p className="text-sm text-muted font-body truncate">
                    {b.badgeId?.name || 'Unknown Badge'}
                  </p>
                  <span className="text-xs text-muted/60 font-mono shrink-0 ml-2">
                    {formatDate(b.earnedAt)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted/60 font-body">None yet</p>
          )}
        </Card>

        {/* Simulations */}
        <Card variant="bordered" className="!p-4">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-display font-semibold text-dark">
              Simulations ({(user.simulationsCompleted || []).length})
            </h3>
          </div>
          {(user.simulationsCompleted || []).length > 0 ? (
            <div className="space-y-1.5">
              {user.simulationsCompleted.map((sim, i) => (
                <div key={i} className="text-sm text-muted font-body">
                  Score: {sim.score} | Wallet: ${sim.walletFinal.toLocaleString()}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted/60 font-body">None yet</p>
          )}
        </Card>
      </div>

      {/* Exercise Results */}
      {(user.exerciseResults || []).length > 0 && (
        <Card variant="default" className="!p-5">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-display font-semibold text-dark">
              Exercise Results
            </h3>
            <Badge variant="default">{user.exerciseResults.length} total</Badge>
          </div>

          <div className="overflow-hidden rounded-lg border border-gray-100">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-2 font-mono text-xs font-medium text-muted uppercase">
                    Lesson
                  </th>
                  <th className="text-left px-4 py-2 font-mono text-xs font-medium text-muted uppercase">
                    Score
                  </th>
                  <th className="text-left px-4 py-2 font-mono text-xs font-medium text-muted uppercase">
                    XP Earned
                  </th>
                  <th className="text-left px-4 py-2 font-mono text-xs font-medium text-muted uppercase">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {user.exerciseResults.map((ex, i) => (
                  <tr key={i} className="hover:bg-gray-50/50">
                    <td className="px-4 py-2 font-body text-dark truncate max-w-[200px]">
                      {ex.lessonId}
                    </td>
                    <td className="px-4 py-2 font-mono text-dark tabular-nums">
                      {ex.score}/{ex.maxScore}
                    </td>
                    <td className="px-4 py-2 font-mono text-accent tabular-nums">
                      +{ex.xpEarned}
                    </td>
                    <td className="px-4 py-2 font-body text-muted">
                      {formatDateTime(ex.completedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Activity Timeline */}
      {timeline.length > 0 && (
        <Card variant="default" className="!p-5">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-display font-semibold text-dark">
              Activity Timeline
            </h3>
          </div>

          <div className="space-y-0">
            {timeline.slice(0, 20).map((item, i) => {
              const Icon = timelineIcons[item.type] || Clock;

              return (
                <div key={i} className="flex items-start gap-4 py-3 border-b border-gray-50 last:border-0">
                  <div className="mt-0.5 shrink-0">
                    <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center">
                      <Icon className="w-3.5 h-3.5 text-muted" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-body font-medium text-dark">
                      {item.label}
                    </p>
                    <p className="text-xs text-muted font-body mt-0.5">
                      {item.detail}
                    </p>
                  </div>
                  <span className="text-xs text-muted/60 font-mono shrink-0">
                    {formatDate(item.date)}
                  </span>
                </div>
              );
            })}
            {timeline.length > 20 && (
              <p className="text-xs text-muted font-body text-center pt-3">
                Showing most recent 20 of {timeline.length} activities
              </p>
            )}
          </div>
        </Card>
      )}
    </motion.div>
  );
}
