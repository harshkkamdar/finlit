'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import IconRail from './IconRail';
import Sidebar from './Sidebar';
import XpChip from './XpChip';
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

export default function AppShell({ user, chapters, children }: AppShellProps) {
  const pathname = usePathname();
  const showChapterSidebar = LEARN_PREFIXES.some((p) => pathname.startsWith(p));

  // Icon rail = 56px, chapter sidebar = 220px
  const mainMarginLeft = showChapterSidebar ? 276 : 56;

  return (
    <div className="flex min-h-screen">
      <IconRail />
      {showChapterSidebar && (
        <aside aria-label="Chapter navigation">
          <Sidebar chapters={chapters} />
        </aside>
      )}
      <main
        className="flex-1 min-w-0"
        style={{ marginLeft: mainMarginLeft }}
        aria-label="Main content"
      >
        {/* Top bar with XP chip */}
        <div className="flex items-center justify-end px-8 pt-5 pb-0">
          <XpChip xp={user.xp} league={user.league} />
        </div>
        <div className="max-w-[1200px] mx-auto px-8 py-6">
          <PageTransition>{children}</PageTransition>
        </div>
      </main>
    </div>
  );
}
