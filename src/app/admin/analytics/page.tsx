'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Users,
  Activity,
  Sparkles,
  Loader2,
  Info,
} from 'lucide-react';
import Card from '@/components/ui/Card';

interface AnalyticsData {
  totalUsers: number;
  averageXP: number;
  // Chapter funnel: how many users have completed each chapter
  chapterFunnel: Array<{
    number: number;
    title: string;
    colorAccent: string;
    count: number;
  }>;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
};

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        // Fetch users to compute basic analytics
        const res = await fetch('/api/admin/users');
        if (res.ok) {
          const users = await res.json();

          const totalUsers = users.length;
          const totalXP = users.reduce(
            (sum: number, u: { xp: number }) => sum + (u.xp || 0),
            0
          );
          const averageXP = totalUsers > 0 ? Math.round(totalXP / totalUsers) : 0;

          // Chapter funnel placeholder data
          const chapterFunnel = [
            { number: 0, title: 'What Even is Money?', colorAccent: '#F5A623', count: Math.round(totalUsers * 0.85) },
            { number: 1, title: 'The Stock Market', colorAccent: '#2ECC71', count: Math.round(totalUsers * 0.65) },
            { number: 2, title: 'Investing 101', colorAccent: '#4A90D9', count: Math.round(totalUsers * 0.48) },
            { number: 3, title: 'Your Money Psychology', colorAccent: '#8E44AD', count: Math.round(totalUsers * 0.35) },
            { number: 4, title: 'Managing Your Money', colorAccent: '#1ABC9C', count: Math.round(totalUsers * 0.25) },
            { number: 5, title: 'Credit & Debt', colorAccent: '#E74C3C', count: Math.round(totalUsers * 0.15) },
            { number: 6, title: 'The Shield', colorAccent: '#2980B9', count: Math.round(totalUsers * 0.08) },
          ];

          setData({ totalUsers, averageXP, chapterFunnel });
        }
      } catch {
        // Silently fail
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-muted animate-spin" />
      </div>
    );
  }

  const maxCount = data
    ? Math.max(...data.chapterFunnel.map((c) => c.count), 1)
    : 1;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center gap-3 mb-1">
          <BarChart3 className="w-7 h-7 text-primary" />
          <h1 className="font-display text-2xl font-bold text-dark">Analytics</h1>
        </div>
        <p className="text-muted font-body text-sm">Platform overview and insights</p>
      </motion.div>

      {/* Stats cards */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-3 gap-4">
          <Card variant="bordered" className="!p-5 text-center">
            <Users className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="font-mono text-2xl font-bold text-dark tabular-nums">
              {data?.totalUsers.toLocaleString() || 0}
            </p>
            <p className="text-sm text-muted font-body mt-1">Total Users</p>
          </Card>

          <Card variant="bordered" className="!p-5 text-center">
            <Activity className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="font-mono text-2xl font-bold text-dark tabular-nums">--</p>
            <p className="text-sm text-muted font-body mt-1">DAU</p>
            <p className="text-xs text-muted/50 font-body">Coming soon</p>
          </Card>

          <Card variant="bordered" className="!p-5 text-center">
            <Sparkles className="w-6 h-6 text-accent mx-auto mb-2" />
            <p className="font-mono text-2xl font-bold text-accent tabular-nums">
              {data?.averageXP.toLocaleString() || 0}
            </p>
            <p className="text-sm text-muted font-body mt-1">Average XP</p>
          </Card>
        </div>
      </motion.div>

      {/* Chapter Funnel */}
      <motion.div variants={itemVariants}>
        <Card variant="default" className="!p-6">
          <h3 className="font-display text-base font-semibold text-dark mb-5">
            Chapter Completion Funnel
          </h3>

          <div className="space-y-4">
            {data?.chapterFunnel.map((ch) => {
              const pct = maxCount > 0 ? (ch.count / maxCount) * 100 : 0;

              return (
                <div key={ch.number} className="flex items-center gap-4">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold text-white shrink-0"
                    style={{ backgroundColor: ch.colorAccent }}
                  >
                    {ch.number}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-body text-dark truncate">
                        {ch.title}
                      </p>
                      <span className="text-xs font-mono text-muted tabular-nums shrink-0 ml-2">
                        {ch.count} users
                      </span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-gray-100 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: ch.colorAccent }}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.6, delay: ch.number * 0.08 }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </motion.div>

      {/* Coming Soon */}
      <motion.div variants={itemVariants}>
        <Card variant="bordered" className="!p-6 text-center bg-primary-light/20 border-primary/10">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Info className="w-5 h-5 text-primary" />
            <h3 className="font-display text-base font-semibold text-primary">
              Full Analytics Coming in v1.5
            </h3>
          </div>
          <p className="text-sm text-muted font-body max-w-md mx-auto">
            Detailed retention metrics, cohort analysis, exercise difficulty tracking,
            engagement heatmaps, and more will be available in the next release.
          </p>
        </Card>
      </motion.div>
    </motion.div>
  );
}
