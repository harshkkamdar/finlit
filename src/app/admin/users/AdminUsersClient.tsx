'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Search,
  Users,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { createAvatar } from '@dicebear/core';
import * as adventurer from '@dicebear/adventurer';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  xp: number;
  league: string;
  currentStreak: number;
  createdAt: string;
  role: string;
  avatarSeed: string;
}

function generateAvatar(seed: string): string {
  const avatar = createAvatar(adventurer, { seed, size: 36 });
  return avatar.toDataUri();
}

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateStr));
}

const leagueVariant: Record<string, 'default' | 'success' | 'warning' | 'info' | 'error'> = {
  Bronze: 'warning',
  Silver: 'default',
  Gold: 'warning',
  Diamond: 'info',
};

export default function AdminUsersClient() {
  const router = useRouter();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = debouncedSearch
        ? `?search=${encodeURIComponent(debouncedSearch)}`
        : '';
      const res = await fetch(`/api/admin/users${params}`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <Users className="w-7 h-7 text-primary" />
          <h1 className="font-display text-2xl font-bold text-dark">
            User Management
          </h1>
        </div>
        <p className="text-muted font-body text-sm">
          {users.length} user{users.length !== 1 ? 's' : ''} registered
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="!pl-10"
        />
      </div>

      {/* Table */}
      <Card variant="default" className="!p-0 overflow-hidden">
        {/* Header row */}
        <div className="grid grid-cols-[2.5fr_1fr_1fr_1fr_1.2fr_40px] gap-4 px-6 py-3 bg-gray-50 border-b border-gray-100">
          <span className="text-xs font-mono font-medium text-muted uppercase tracking-wider">
            User
          </span>
          <span className="text-xs font-mono font-medium text-muted uppercase tracking-wider">
            XP
          </span>
          <span className="text-xs font-mono font-medium text-muted uppercase tracking-wider">
            League
          </span>
          <span className="text-xs font-mono font-medium text-muted uppercase tracking-wider">
            Streak
          </span>
          <span className="text-xs font-mono font-medium text-muted uppercase tracking-wider">
            Joined
          </span>
          <span />
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 text-muted animate-spin" />
          </div>
        )}

        {/* Rows */}
        {!loading && users.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted font-body text-sm">
              {debouncedSearch ? 'No users match your search.' : 'No users found.'}
            </p>
          </div>
        )}

        {!loading && (
          <div className="divide-y divide-gray-50">
            {users.map((user) => (
              <motion.div
                key={user._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-[2.5fr_1fr_1fr_1fr_1.2fr_40px] gap-4 items-center px-6 py-3 hover:bg-gray-50/80 cursor-pointer transition-colors"
                onClick={() => router.push(`/admin/users/${user._id}`)}
              >
                {/* User info */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 border border-gray-100">
                    <img
                      src={generateAvatar(user.avatarSeed)}
                      alt={user.name}
                      width={36}
                      height={36}
                      className="w-full h-full"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-body font-medium text-dark truncate">
                      {user.name}
                      {user.role === 'admin' && (
                        <Badge variant="info" className="ml-2 !text-[10px]">
                          Admin
                        </Badge>
                      )}
                    </p>
                    <p className="text-xs text-muted font-body truncate">
                      {user.email}
                    </p>
                  </div>
                </div>

                {/* XP */}
                <span className="font-mono text-sm font-semibold text-accent tabular-nums">
                  {user.xp.toLocaleString()}
                </span>

                {/* League */}
                <Badge variant={leagueVariant[user.league] || 'default'}>
                  {user.league}
                </Badge>

                {/* Streak */}
                <span className="font-mono text-sm text-dark tabular-nums">
                  {user.currentStreak} days
                </span>

                {/* Joined */}
                <span className="text-sm text-muted font-body">
                  {formatDate(user.createdAt)}
                </span>

                {/* Arrow */}
                <ChevronRight className="w-4 h-4 text-muted/40" />
              </motion.div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
