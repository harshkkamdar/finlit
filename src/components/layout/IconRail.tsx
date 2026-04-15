'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookOpen,
  Zap,
  Trophy,
  TrendingUp,
  User,
} from 'lucide-react';

const navItems = [
  { icon: BookOpen, label: 'Learn', href: '/dashboard' },
  { icon: Zap, label: 'Daily', href: '/daily-challenge' },
  { icon: Trophy, label: 'Board', href: '/leaderboard' },
  { icon: TrendingUp, label: 'Progress', href: '/progress' },
];

function isActive(pathname: string, href: string): boolean {
  if (href === '/dashboard') {
    return (
      pathname === '/dashboard' ||
      pathname.startsWith('/chapter/') ||
      pathname.startsWith('/lesson/') ||
      pathname.startsWith('/simulation/')
    );
  }
  return pathname.startsWith(href);
}

export default function IconRail() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed left-0 top-0 h-screen w-[56px] flex flex-col items-center z-50"
      style={{
        background:
          'linear-gradient(180deg, var(--color-dark) 0%, var(--color-dark-bottom) 100%)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Logo mark */}
      <Link
        href="/dashboard"
        className="mt-4 mb-6 w-9 h-9 rounded-lg flex items-center justify-center font-display text-lg font-bold text-white hover:bg-white/[0.06] transition-colors"
      >
        F<span className="text-accent">.</span>
      </Link>

      {/* Main nav */}
      <div className="flex flex-col items-center gap-1 flex-1">
        {navItems.map(({ icon: Icon, label, href }) => {
          const active = isActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              className={`
                relative w-10 h-10 rounded-lg flex items-center justify-center
                transition-all duration-150 group
                ${active ? 'bg-white/[0.1]' : 'hover:bg-white/[0.06]'}
              `}
              title={label}
            >
              <Icon
                className={`w-[18px] h-[18px] transition-colors ${
                  active ? 'text-white' : 'text-white/40 group-hover:text-white/70'
                }`}
                strokeWidth={active ? 2.2 : 1.8}
              />
              {active && (
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-accent"
                />
              )}
              {/* Tooltip */}
              <div className="absolute left-full ml-2 px-2 py-1 rounded-md bg-dark text-[11px] font-medium text-white/80 whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 shadow-lg">
                {label}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Profile at bottom */}
      <div className="mb-4">
        <Link
          href="/profile"
          className={`
            relative w-10 h-10 rounded-lg flex items-center justify-center
            transition-all duration-150 group
            ${pathname.startsWith('/profile') ? 'bg-white/[0.1]' : 'hover:bg-white/[0.06]'}
          `}
          title="Profile"
        >
          <User
            className={`w-[18px] h-[18px] transition-colors ${
              pathname.startsWith('/profile')
                ? 'text-white'
                : 'text-white/40 group-hover:text-white/70'
            }`}
            strokeWidth={pathname.startsWith('/profile') ? 2.2 : 1.8}
          />
          {pathname.startsWith('/profile') && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-accent" />
          )}
          <div className="absolute left-full ml-2 px-2 py-1 rounded-md bg-dark text-[11px] font-medium text-white/80 whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 shadow-lg">
            Profile
          </div>
        </Link>
      </div>
    </nav>
  );
}
