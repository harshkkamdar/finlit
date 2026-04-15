'use client';

import { motion } from 'framer-motion';
import { Trophy, Crown, Medal } from 'lucide-react';
import { createAvatar } from '@dicebear/core';
import * as adventurer from '@dicebear/adventurer';
import Card from '@/components/ui/Card';
import LeagueBadge from '@/components/gamification/LeagueBadge';

interface LeaderboardEntry {
  _id: string;
  name: string;
  xp: number;
  league: string;
  avatarSeed: string;
  rank: number;
}

interface LeaderboardClientProps {
  leaderboard: LeaderboardEntry[];
  currentUserId: string;
  currentUserRank: LeaderboardEntry | null;
}

function generateAvatar(seed: string, size: number = 48): string {
  const avatar = createAvatar(adventurer, { seed, size });
  return avatar.toDataUri();
}

const podiumColors = {
  1: {
    bg: 'bg-[#FFD700]/10',
    border: 'border-[#FFD700]/40',
    ring: 'ring-[#FFD700]/20',
    text: 'text-[#FFD700]',
    accent: '#FFD700',
    label: 'Gold',
  },
  2: {
    bg: 'bg-[#C0C0C0]/10',
    border: 'border-[#C0C0C0]/40',
    ring: 'ring-[#C0C0C0]/20',
    text: 'text-[#C0C0C0]',
    accent: '#C0C0C0',
    label: 'Silver',
  },
  3: {
    bg: 'bg-[#CD7F32]/10',
    border: 'border-[#CD7F32]/40',
    ring: 'ring-[#CD7F32]/20',
    text: 'text-[#CD7F32]',
    accent: '#CD7F32',
    label: 'Bronze',
  },
} as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
};

export default function LeaderboardClient({
  leaderboard,
  currentUserId,
  currentUserRank,
}: LeaderboardClientProps) {
  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center gap-3 mb-1">
          <Trophy className="w-8 h-8 text-accent" />
          <h1 className="font-display text-3xl font-bold text-dark">
            Leaderboard
          </h1>
        </div>
        <p className="text-muted font-body">
          Top learners ranked by XP
        </p>
      </motion.div>

      {/* Top 3 Podium */}
      {top3.length >= 3 && (
        <motion.div variants={itemVariants}>
          <div className="grid grid-cols-3 gap-4 items-end">
            {/* Rank 2 - Left */}
            <PodiumCard
              entry={top3[1]}
              rank={2}
              isCurrentUser={top3[1]._id === currentUserId}
            />

            {/* Rank 1 - Center (elevated) */}
            <PodiumCard
              entry={top3[0]}
              rank={1}
              isCurrentUser={top3[0]._id === currentUserId}
              elevated
            />

            {/* Rank 3 - Right */}
            <PodiumCard
              entry={top3[2]}
              rank={3}
              isCurrentUser={top3[2]._id === currentUserId}
            />
          </div>
        </motion.div>
      )}

      {/* If fewer than 3 users, show them in a simple list */}
      {top3.length > 0 && top3.length < 3 && (
        <motion.div variants={itemVariants}>
          <div className="grid grid-cols-3 gap-4 items-end">
            {top3.map((entry, i) => (
              <PodiumCard
                key={entry._id}
                entry={entry}
                rank={(i + 1) as 1 | 2 | 3}
                isCurrentUser={entry._id === currentUserId}
                elevated={i === 0}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* Ranks 4-100 Table */}
      {rest.length > 0 && (
        <motion.div variants={itemVariants}>
          <Card variant="default" className="!p-0 overflow-hidden">
            <div className="divide-y divide-border-light" role="table" aria-label="Leaderboard rankings">
              <div className="sr-only" role="row">
                <span role="columnheader">Rank</span>
                <span role="columnheader">Avatar</span>
                <span role="columnheader">Name</span>
                <span role="columnheader">XP</span>
                <span role="columnheader">League</span>
              </div>
              {rest.map((entry) => {
                const isCurrentUser = entry._id === currentUserId;

                return (
                  <motion.div
                    key={entry._id}
                    role="row"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`
                      flex items-center gap-4 px-6 py-3.5 transition-colors
                      ${isCurrentUser ? 'bg-primary-light/50' : 'hover:bg-fill-subtle'}
                      ${entry.rank % 2 === 0 && !isCurrentUser ? 'bg-fill-subtle/50' : ''}
                    `}
                  >
                    {/* Rank */}
                    <span role="cell" className="w-8 text-center font-mono text-sm font-bold text-muted tabular-nums">
                      {entry.rank}
                    </span>

                    {/* Avatar */}
                    <div role="cell" className="w-9 h-9 rounded-full overflow-hidden shrink-0 border-2 border-border-light">
                      <img
                        src={generateAvatar(entry.avatarSeed, 36)}
                        alt={entry.name}
                        width={36}
                        height={36}
                        className="w-full h-full"
                      />
                    </div>

                    {/* Name */}
                    <span
                      role="cell"
                      className={`flex-1 text-sm font-body truncate ${
                        isCurrentUser ? 'font-semibold text-primary' : 'text-dark'
                      }`}
                    >
                      {entry.name}
                      {isCurrentUser && (
                        <span className="text-xs text-primary/60 ml-2">(You)</span>
                      )}
                    </span>

                    {/* XP */}
                    <span role="cell" className="font-mono text-sm font-bold text-accent tabular-nums shrink-0">
                      {entry.xp.toLocaleString()} XP
                    </span>

                    {/* League */}
                    <div role="cell" className="shrink-0">
                      <LeagueBadge
                        league={entry.league as 'Bronze' | 'Silver' | 'Gold' | 'Diamond'}
                        size="sm"
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Current user not in top 100 */}
      {currentUserRank && (
        <motion.div variants={itemVariants}>
          <div className="flex flex-col items-center gap-2 py-2">
            <div className="flex items-center gap-2 text-muted">
              <div className="w-8 h-px bg-border" />
              <span className="text-sm font-mono">...</span>
              <div className="w-8 h-px bg-border" />
            </div>
          </div>

          <Card variant="elevated" className="!p-0 overflow-hidden border-2 border-primary/20">
            <div className="flex items-center gap-4 px-6 py-4 bg-primary-light/30">
              {/* Rank */}
              <span className="w-8 text-center font-mono text-sm font-bold text-primary tabular-nums">
                #{currentUserRank.rank}
              </span>

              {/* Avatar */}
              <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border-2 border-primary/30">
                <img
                  src={generateAvatar(currentUserRank.avatarSeed, 40)}
                  alt={currentUserRank.name}
                  width={40}
                  height={40}
                  className="w-full h-full"
                />
              </div>

              {/* Name */}
              <span className="flex-1 text-sm font-body font-semibold text-primary truncate">
                {currentUserRank.name}
                <span className="text-xs text-primary/60 ml-2">(You)</span>
              </span>

              {/* XP */}
              <span className="font-mono text-sm font-bold text-accent tabular-nums shrink-0">
                {currentUserRank.xp.toLocaleString()} XP
              </span>

              {/* League */}
              <div className="shrink-0">
                <LeagueBadge
                  league={currentUserRank.league as 'Bronze' | 'Silver' | 'Gold' | 'Diamond'}
                  size="sm"
                />
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Empty state */}
      {leaderboard.length === 0 && (
        <motion.div variants={itemVariants}>
          <Card variant="default" className="!p-12 text-center">
            <Trophy className="w-12 h-12 text-muted/30 mx-auto mb-4" />
            <p className="text-lg font-display font-semibold text-dark mb-1">
              No learners yet
            </p>
            <p className="text-sm text-muted font-body">
              Be the first to earn XP and claim the top spot!
            </p>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}

/* ── Podium Card Component ── */

function PodiumCard({
  entry,
  rank,
  isCurrentUser,
  elevated = false,
}: {
  entry: LeaderboardEntry;
  rank: 1 | 2 | 3;
  isCurrentUser: boolean;
  elevated?: boolean;
}) {
  const config = podiumColors[rank];
  const avatarSize = elevated ? 80 : 64;
  const RankIcon = rank === 1 ? Crown : Medal;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`${elevated ? 'mb-4' : ''}`}
    >
      <Card
        variant="elevated"
        className={`
          !p-5 text-center relative overflow-hidden
          ${config.bg} border-2 ${config.border}
          ${isCurrentUser ? 'ring-2 ' + config.ring : ''}
        `}
      >
        {/* Rank icon */}
        <div className="flex justify-center mb-3">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center`}
            style={{ backgroundColor: config.accent + '30' }}
          >
            <RankIcon
              className="w-4 h-4"
              style={{ color: config.accent }}
            />
          </div>
        </div>

        {/* Avatar */}
        <div className="flex justify-center mb-3">
          <div
            className="rounded-full overflow-hidden border-4 shadow-lg"
            style={{
              width: avatarSize,
              height: avatarSize,
              borderColor: config.accent + '60',
            }}
          >
            <img
              src={generateAvatar(entry.avatarSeed, avatarSize)}
              alt={entry.name}
              width={avatarSize}
              height={avatarSize}
              className="w-full h-full"
            />
          </div>
        </div>

        {/* Rank number */}
        <div
          className="font-mono text-xs font-bold mb-1"
          style={{ color: config.accent }}
        >
          #{rank}
        </div>

        {/* Name */}
        <p
          className={`font-display text-sm font-semibold truncate ${
            isCurrentUser ? 'text-primary' : 'text-dark'
          }`}
        >
          {entry.name}
          {isCurrentUser && (
            <span className="text-xs text-primary/60 ml-1">(You)</span>
          )}
        </p>

        {/* XP */}
        <p className="font-mono text-lg font-bold text-accent tabular-nums mt-1">
          {entry.xp.toLocaleString()} XP
        </p>

        {/* League */}
        <div className="flex justify-center mt-2">
          <LeagueBadge
            league={entry.league as 'Bronze' | 'Silver' | 'Gold' | 'Diamond'}
            size="sm"
          />
        </div>
      </Card>
    </motion.div>
  );
}
