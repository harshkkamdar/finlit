'use client';

import { motion } from 'framer-motion';
import Card from '@/components/ui/Card';
import XPDisplay from '@/components/gamification/XPDisplay';
import StreakDisplay from '@/components/gamification/StreakDisplay';
import LeagueBadge from '@/components/gamification/LeagueBadge';
import ChapterRoadmap from '@/components/dashboard/ChapterRoadmap';

interface ChapterStop {
  _id: string;
  number: number;
  title: string;
  subtitle: string;
  colorAccent: string;
  lessonCount: number;
  completedLessonCount: number;
  status: 'completed' | 'current' | 'locked';
}

interface UserData {
  name: string;
  xp: number;
  currentStreak: number;
  league: string;
  avatarSeed: string;
}

interface DashboardClientProps {
  chapters: ChapterStop[];
  user: UserData;
  hasProgress: boolean;
}

export default function DashboardClient({
  chapters,
  user,
  hasProgress,
}: DashboardClientProps) {
  return (
    <div>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 lg:gap-6 mb-8 lg:mb-10">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
        >
          <h1 className="font-display text-2xl lg:text-3xl font-bold text-dark mb-1">
            Your Learning Journey
          </h1>
          <p className="text-muted font-body text-sm lg:text-base">
            Master financial literacy, one chapter at a time
          </p>
        </motion.div>

        {/* Stats bar — hidden on mobile (top bar shows streak + XP already) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.15, ease: [0.25, 1, 0.5, 1] }}
          className="hidden lg:block shrink-0"
        >
          <Card variant="elevated" className="!p-4">
            <div className="flex items-center gap-6">
              {/* XP + League */}
              <div className="flex items-center gap-3">
                <LeagueBadge
                  league={user.league as 'Bronze' | 'Silver' | 'Gold' | 'Diamond'}
                  size="sm"
                />
                <div>
                  <XPDisplay xp={user.xp} size="sm" />
                </div>
              </div>

              {/* Divider */}
              <div className="w-px h-8 bg-border" />

              {/* Streak */}
              <StreakDisplay streak={user.currentStreak} size="sm" />
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Chapter Roadmap */}
      <ChapterRoadmap
        chapters={chapters}
        userName={user.name}
        hasProgress={hasProgress}
      />
    </div>
  );
}
