'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Zap, Trophy, TrendingUp, User } from 'lucide-react';

const tabs = [
  { icon: BookOpen, label: 'Learn', href: '/dashboard' },
  { icon: Zap, label: 'Daily', href: '/daily-challenge' },
  { icon: Trophy, label: 'Board', href: '/leaderboard' },
  { icon: TrendingUp, label: 'Progress', href: '/progress' },
  { icon: User, label: 'Profile', href: '/profile' },
] as const;

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

/**
 * Sticky bottom navigation for mobile/tablet (< lg). 5 tabs.
 * Hidden at lg+, where the IconRail takes over.
 */
export default function MobileTabBar() {
  const pathname = usePathname();

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 safe-bottom bg-surface border-t border-border"
      aria-label="Primary navigation"
    >
      <ul className="flex items-stretch justify-around">
        {tabs.map(({ icon: Icon, label, href }) => {
          const active = isActive(pathname, href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className="relative flex flex-col items-center justify-center gap-0.5 min-h-[56px] py-2 outline-none focus-visible:bg-fill-subtle"
                aria-current={active ? 'page' : undefined}
              >
                <Icon
                  className={`w-5 h-5 transition-colors ${
                    active ? 'text-primary' : 'text-muted'
                  }`}
                  strokeWidth={active ? 2.4 : 1.8}
                />
                <span
                  className={`text-[10px] font-body font-medium leading-none tracking-wide transition-colors ${
                    active ? 'text-primary' : 'text-muted'
                  }`}
                >
                  {label}
                </span>
                {active && (
                  <span
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[3px] rounded-b-full bg-primary"
                    aria-hidden
                  />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
