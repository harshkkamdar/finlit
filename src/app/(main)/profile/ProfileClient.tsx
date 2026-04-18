'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User as UserIcon,
  Calendar,
  Pencil,
  Check,
  X,
  BookOpen,
  Sparkles,
  Download,
  Brain,
  ArrowRight,
  LogOut,
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { createAvatar } from '@dicebear/core';
import * as adventurer from '@dicebear/adventurer';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import XPDisplay from '@/components/gamification/XPDisplay';
import StreakDisplay from '@/components/gamification/StreakDisplay';
import LeagueBadge from '@/components/gamification/LeagueBadge';
import ProgressBar from '@/components/gamification/ProgressBar';
import BadgeCard from '@/components/gamification/BadgeCard';

interface UserData {
  _id: string;
  name: string;
  email: string;
  age: number;
  avatarSeed: string;
  xp: number;
  currentStreak: number;
  longestStreak: number;
  league: string;
  moneyPersonality: string | null;
  lessonsCompletedCount: number;
  createdAt: string;
  certificateId: string | null;
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

interface ChapterProgress {
  _id: string;
  number: number;
  title: string;
  colorAccent: string;
  completedLessons: number;
  totalLessons: number;
  isCompleted: boolean;
}

interface ProfileClientProps {
  user: UserData;
  badges: BadgeData[];
  chapterProgress: ChapterProgress[];
  allChaptersCompleted: boolean;
}

const personalityDescriptions: Record<string, { label: string; description: string; variant: 'success' | 'warning' | 'info' | 'error' }> = {
  saver: {
    label: 'The Saver',
    description: 'You love watching your bank balance grow. Security is your superpower, but remember -- sometimes smart risks pay off!',
    variant: 'success',
  },
  spender: {
    label: 'The Spender',
    description: 'You believe money is meant to be enjoyed! Your generosity is admirable -- just make sure future-you is taken care of too.',
    variant: 'warning',
  },
  investor: {
    label: 'The Investor',
    description: 'You see money as a tool for growth. Compounding is your best friend and you are always thinking long-term.',
    variant: 'info',
  },
  avoider: {
    label: 'The Avoider',
    description: 'Money talk makes you uneasy, and that is okay! The fact that you are here learning shows real courage.',
    variant: 'error',
  },
  planner: {
    label: 'The Planner',
    description: 'Spreadsheets are your love language. You have got budgets for your budgets, and every rupee has a purpose.',
    variant: 'info',
  },
};

function generateAvatar(seed: string): string {
  const avatar = createAvatar(adventurer, {
    seed,
    size: 120,
  });
  return avatar.toDataUri();
}

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateStr));
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

export default function ProfileClient({
  user,
  badges,
  chapterProgress,
  allChaptersCompleted,
}: ProfileClientProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [currentName, setCurrentName] = useState(user.name);
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const avatarUri = generateAvatar(user.avatarSeed);

  const earnedCount = badges.filter((b) => b.earned).length;
  const totalCount = badges.length;

  // Sort: earned first, then locked
  const sortedBadges = [...badges].sort((a, b) => {
    if (a.earned && !b.earned) return -1;
    if (!a.earned && b.earned) return 1;
    return 0;
  });

  async function handleSaveName() {
    if (!editName.trim() || editName.trim() === currentName) {
      setIsEditingName(false);
      setEditName(currentName);
      return;
    }

    setSaving(true);
    setNameError(null);
    try {
      const res = await fetch('/api/users/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName.trim() }),
      });

      if (res.ok) {
        setCurrentName(editName.trim());
      } else {
        setNameError('Failed to update name. Please try again.');
        setEditName(currentName);
      }
    } catch {
      setNameError('Network error. Please check your connection and try again.');
      setEditName(currentName);
    } finally {
      setSaving(false);
      setIsEditingName(false);
    }
  }

  async function handleDownloadCertificate() {
    setDownloading(true);
    setDownloadError(null);
    try {
      const res = await fetch('/api/certificate');
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'FinLit-Certificate.pdf';
        a.click();
        URL.revokeObjectURL(url);
      } else {
        setDownloadError('Failed to download certificate. Please try again.');
      }
    } catch {
      setDownloadError('Network error. Please check your connection and try again.');
    } finally {
      setDownloading(false);
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-10"
    >
      {/* Page header */}
      <motion.div variants={itemVariants}>
        <h1 className="font-display text-3xl font-bold text-dark">Your Profile</h1>
        <p className="text-muted font-body mt-1">Track your progress and achievements</p>
      </motion.div>

      {/* Top section: User info card */}
      <motion.div variants={itemVariants}>
        <Card variant="elevated" className="!p-8">
          <div className="flex items-start gap-8 relative">
            {/* Avatar */}
            <div className="shrink-0">
              <div className="w-[120px] h-[120px] rounded-full overflow-hidden border-4 border-primary-light shadow-lg">
                <img
                  src={avatarUri}
                  alt="Your avatar"
                  width={120}
                  height={120}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              {/* Name row */}
              <div className="flex items-center gap-3 mb-2">
                {isEditingName ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="!py-1.5 !text-xl font-display font-bold max-w-[280px]"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveName();
                        if (e.key === 'Escape') {
                          setIsEditingName(false);
                          setEditName(currentName);
                        }
                      }}
                      autoFocus
                    />
                    <button
                      onClick={handleSaveName}
                      disabled={saving}
                      aria-label="Save name"
                      className="min-w-[44px] min-h-[44px] p-2 rounded-md bg-primary text-white hover:bg-primary/90 transition-colors flex items-center justify-center"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingName(false);
                        setEditName(currentName);
                      }}
                      aria-label="Cancel editing"
                      className="min-w-[44px] min-h-[44px] p-2 rounded-md bg-fill-muted text-muted hover:bg-border transition-colors flex items-center justify-center"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <h2 className="font-display text-2xl font-bold text-dark truncate">
                      {currentName}
                    </h2>
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="min-w-[44px] min-h-[44px] p-2 rounded-md text-muted hover:bg-fill-muted hover:text-dark transition-colors shrink-0 flex items-center justify-center"
                      title="Edit name"
                      aria-label="Edit name"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>

              {/* Name error */}
              {nameError && (
                <p className="text-sm text-error font-body mb-1">{nameError}</p>
              )}

              {/* Meta info */}
              <div className="flex items-center gap-4 text-sm text-muted font-body">
                <div className="flex items-center gap-1.5">
                  <UserIcon className="w-4 h-4" />
                  <span>{user.age} years old</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>Member since {formatDate(user.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Logout button */}
            <button
              onClick={() => signOut({ redirectTo: '/login' })}
              className="absolute top-0 right-0 flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-muted hover:text-error hover:bg-error/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Log out
            </button>
          </div>
        </Card>
      </motion.div>

      {/* Stats row */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-4 gap-5">
          {/* Total XP */}
          <Card variant="bordered" className="!p-5 text-center">
            <Sparkles className="w-6 h-6 text-accent mx-auto mb-2" />
            <p className="font-mono text-2xl font-bold text-accent tabular-nums">
              {user.xp.toLocaleString()}
            </p>
            <p className="text-sm text-muted font-body mt-1">Total XP</p>
          </Card>

          {/* Current League */}
          <Card variant="bordered" className="!p-5 flex flex-col items-center justify-center">
            <LeagueBadge
              league={user.league as 'Bronze' | 'Silver' | 'Gold' | 'Diamond'}
              size="sm"
            />
            <p className="text-sm text-muted font-body mt-2">Current League</p>
          </Card>

          {/* Current Streak */}
          <Card variant="bordered" className="!p-5 text-center">
            <div className="flex justify-center mb-2">
              <StreakDisplay streak={user.currentStreak} size="lg" />
            </div>
            <p className="text-sm text-muted font-body mt-1">Day Streak</p>
            <p className="text-xs text-muted/60 font-body">
              Best: {user.longestStreak} days
            </p>
          </Card>

          {/* Lessons Completed */}
          <Card variant="bordered" className="!p-5 text-center">
            <BookOpen className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="font-mono text-2xl font-bold text-dark tabular-nums">
              {user.lessonsCompletedCount}
            </p>
            <p className="text-sm text-muted font-body mt-1">Lessons Done</p>
          </Card>
        </div>
      </motion.div>

      {/* Money Personality */}
      <motion.div variants={itemVariants}>
        <Card variant="default" className="!p-6">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="w-5 h-5 text-primary" />
            <h3 className="font-display text-lg font-semibold text-dark">
              Money Personality
            </h3>
          </div>

          {user.moneyPersonality &&
          personalityDescriptions[user.moneyPersonality] ? (
            <div className="flex items-start gap-4">
              <Badge
                variant={
                  personalityDescriptions[user.moneyPersonality].variant
                }
                className="!px-4 !py-1.5 !text-sm font-semibold shrink-0"
              >
                {personalityDescriptions[user.moneyPersonality].label}
              </Badge>
              <p className="text-sm text-muted font-body leading-relaxed">
                {personalityDescriptions[user.moneyPersonality].description}
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-between bg-primary-light/50 rounded-lg px-5 py-4">
              <div>
                <p className="text-sm font-medium text-dark font-body">
                  Discover your money personality!
                </p>
                <p className="text-xs text-muted font-body mt-0.5">
                  Take the quiz in Chapter 3, Lesson 5
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-primary shrink-0" />
            </div>
          )}
        </Card>
      </motion.div>

      {/* Badges Grid */}
      <motion.div variants={itemVariants}>
        <Card variant="default" className="!p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display text-lg font-semibold text-dark">
              Your Badges
            </h3>
            <Badge variant="default" className="!text-sm">
              {earnedCount} / {totalCount} earned
            </Badge>
          </div>

          <div className="grid grid-cols-4 gap-5 sm:grid-cols-5">
            {sortedBadges.map((badge) => (
              <BadgeCard
                key={badge._id}
                badge={{
                  name: badge.name,
                  description: badge.description,
                  icon: badge.icon,
                  isSecret: badge.isSecret,
                  category: badge.category,
                }}
                earned={badge.earned}
                earnedAt={badge.earnedAt ? new Date(badge.earnedAt) : undefined}
              />
            ))}
          </div>

          {sortedBadges.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted font-body">
                No badges available yet. Keep learning to unlock them!
              </p>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Chapter Progress */}
      <motion.div variants={itemVariants}>
        <Card variant="default" className="!p-6">
          <h3 className="font-display text-lg font-semibold text-dark mb-5">
            Chapter Progress
          </h3>

          <div className="space-y-3">
            {chapterProgress.map((ch) => {
              const pct =
                ch.totalLessons > 0
                  ? Math.round((ch.completedLessons / ch.totalLessons) * 100)
                  : 0;

              return (
                <div key={ch._id} className="flex items-center gap-4">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-mono font-bold text-white"
                    style={{ backgroundColor: ch.colorAccent }}
                  >
                    {ch.number}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-body font-medium text-dark truncate">
                        {ch.title}
                      </p>
                      <span className="text-xs font-mono text-muted tabular-nums shrink-0 ml-3">
                        {ch.completedLessons}/{ch.totalLessons}
                      </span>
                    </div>
                    <ProgressBar
                      value={pct}
                      color={ch.colorAccent}
                      size="sm"
                    />
                  </div>
                  {ch.isCompleted && (
                    <Check className="w-5 h-5 text-primary shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      </motion.div>

      {/* Certificate Button */}
      {allChaptersCompleted && (
        <motion.div variants={itemVariants} className="pb-4">
          <Card variant="elevated" className="!p-6 bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg font-semibold text-dark">
                  Congratulations! You have completed all chapters.
                </h3>
                <p className="text-sm text-muted font-body mt-1">
                  Download your official FinLit certificate of completion.
                </p>
              </div>
              <Button
                variant="primary"
                size="lg"
                loading={downloading}
                onClick={handleDownloadCertificate}
              >
                <Download className="w-5 h-5" />
                Download Certificate
              </Button>
            </div>
            {downloadError && (
              <p className="text-sm text-error font-body mt-3">{downloadError}</p>
            )}
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
