'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import IconRail from './IconRail';
import Sidebar from './Sidebar';
import XpChip from './XpChip';
import MobileTopBar from './MobileTopBar';
import MobileTabBar from './MobileTabBar';
import PageTransition from './PageTransition';

interface SidebarChapter {
  _id: string;
  number: number;
  title: string;
  colorAccent: string;
  status: 'completed' | 'active' | 'locked';
}

interface AppShellUser {
  name: string;
  email: string;
  xp: number;
  currentStreak: number;
  avatarSeed: string;
  league: string;
}

interface AppShellProps {
  user: AppShellUser;
  chapters: SidebarChapter[];
  children: ReactNode;
}

const LEARN_PREFIXES = ['/dashboard', '/chapter/', '/lesson/', '/simulation/'];

// Routes that take over the full mobile viewport (no top bar / tab bar).
// Lesson and simulation players run their own chrome.
const FULLSCREEN_PREFIXES = ['/lesson/', '/simulation/'];

export default function AppShell({ user, chapters, children }: AppShellProps) {
  const pathname = usePathname();
  const showChapterSidebar = LEARN_PREFIXES.some((p) => pathname.startsWith(p));
  const isFullscreenMobile = FULLSCREEN_PREFIXES.some((p) =>
    pathname.startsWith(p)
  );

  return (
    <div className="flex min-h-[100dvh]">
      {/* Desktop sidebars — hidden below lg */}
      <IconRail />
      {showChapterSidebar && (
        <aside aria-label="Chapter navigation">
          <Sidebar chapters={chapters} />
        </aside>
      )}

      {/* Mobile chrome — hidden at lg+ via internal lg:hidden */}
      {!isFullscreenMobile && (
        <MobileTopBar
          xp={user.xp}
          league={user.league}
          currentStreak={user.currentStreak}
        />
      )}

      <main
        className={`flex-1 min-w-0 ${
          showChapterSidebar
            ? 'lg:ml-[276px]'
            : 'lg:ml-14'
        } ${isFullscreenMobile ? '' : 'mobile-top-pad mobile-bottom-pad'}`}
        aria-label="Main content"
      >
        {/* Desktop top bar with XP chip — shown only at lg+ */}
        <div className="hidden lg:flex items-center justify-end px-8 pt-5 pb-0">
          <XpChip xp={user.xp} league={user.league} />
        </div>

        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
          <PageTransition>{children}</PageTransition>
        </div>
      </main>

      {/* Mobile bottom tabs — hidden at lg+ via internal lg:hidden */}
      {!isFullscreenMobile && <MobileTabBar />}
    </div>
  );
}
