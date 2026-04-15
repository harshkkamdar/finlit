'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, HelpCircle } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface BadgeData {
  name: string;
  description: string;
  icon: string;
  isSecret: boolean;
  category: string;
}

interface BadgeCardProps {
  badge: BadgeData;
  earned: boolean;
  earnedAt?: Date;
}

function getLucideIcon(iconName: string): React.ComponentType<{ className?: string }> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const icons = LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }> | undefined>;
  // Convert kebab-case or snake_case to PascalCase
  const pascalName = iconName
    .split(/[-_]/)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('');

  return icons[pascalName] || LucideIcons.Award;
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
}

export default function BadgeCard({
  badge,
  earned,
  earnedAt,
}: BadgeCardProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const isSecretLocked = badge.isSecret && !earned;
  const Icon = getLucideIcon(badge.icon);

  const ariaLabel = isSecretLocked
    ? 'Secret badge - hidden'
    : earned
      ? `${badge.name} badge - earned${earnedAt ? ` on ${formatDate(earnedAt)}` : ''}`
      : `Locked badge - ${badge.description}`;

  return (
    <motion.div
      role="article"
      aria-label={ariaLabel}
      tabIndex={0}
      whileHover={earned ? { scale: 1.05 } : undefined}
      className="relative flex flex-col items-center text-center focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 outline-none rounded-lg"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Circle badge */}
      <div
        className={`
          w-20 h-20 rounded-full flex items-center justify-center relative
          transition-all duration-300
          ${
            earned
              ? 'bg-accent/15 border-2 border-accent/40 shadow-lg shadow-accent/10'
              : 'bg-gray-100 border-2 border-gray-200 grayscale'
          }
        `}
      >
        {isSecretLocked ? (
          <HelpCircle className="w-8 h-8 text-gray-400" />
        ) : (
          <Icon
            className={`w-8 h-8 ${
              earned ? 'text-accent' : 'text-gray-400'
            }`}
          />
        )}

        {/* Lock overlay for unearned */}
        {!earned && !isSecretLocked && (
          <div className="absolute inset-0 rounded-full flex items-center justify-center bg-white/60">
            <Lock className="w-5 h-5 text-gray-500" />
          </div>
        )}

        {/* Glow ring for earned on hover */}
        {earned && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-accent/30"
            whileHover={{
              boxShadow: '0 0 20px rgba(245,166,35,0.3)',
            }}
          />
        )}
      </div>

      {/* Name */}
      <p
        className={`mt-2.5 text-sm font-display font-semibold leading-tight max-w-[100px] ${
          earned ? 'text-dark' : 'text-gray-400'
        }`}
      >
        {isSecretLocked ? '???' : badge.name}
      </p>

      {/* Earned date */}
      {earned && earnedAt && (
        <p className="text-xs text-muted mt-0.5 font-body">
          {formatDate(earnedAt)}
        </p>
      )}

      {/* Tooltip */}
      {showTooltip && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -bottom-2 translate-y-full z-30 bg-dark text-white text-xs px-3 py-2 rounded-lg shadow-xl max-w-[180px] font-body"
        >
          {isSecretLocked ? (
            <p className="text-white/70">
              This is a secret badge. Keep exploring to unlock it!
            </p>
          ) : earned ? (
            <p>{badge.description}</p>
          ) : (
            <p className="text-white/70">{badge.description}</p>
          )}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-dark rotate-45" />
        </motion.div>
      )}
    </motion.div>
  );
}
