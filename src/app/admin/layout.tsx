import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import Link from 'next/link';
import {
  Shield,
  Users,
  BookOpen,
  Swords,
  BarChart3,
  Home,
} from 'lucide-react';

const navItems = [
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/content', label: 'Content', icon: BookOpen },
  { href: '/admin/challenges', label: 'Challenges', icon: Swords },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  if (session.user.role !== 'admin') {
    redirect('/dashboard');
  }

  return (
    <div className="flex min-h-screen bg-bg">
      {/* Admin Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-[240px] bg-dark flex flex-col z-40">
        {/* Header */}
        <div className="px-5 pt-6 pb-4">
          <div className="flex items-center gap-2.5">
            <Shield className="w-6 h-6 text-accent" />
            <h1 className="font-display text-xl font-bold text-white tracking-tight">
              Fino<span className="text-accent">Lingo</span>{' '}
              <span className="text-white/50 text-sm font-normal">Admin</span>
            </h1>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-4 border-t border-white/10" />

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors font-body text-sm"
            >
              <item.icon className="w-4.5 h-4.5 shrink-0" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Divider */}
        <div className="mx-4 border-t border-white/10" />

        {/* Back to app */}
        <div className="px-3 py-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-colors font-body text-sm"
          >
            <Home className="w-4.5 h-4.5 shrink-0" />
            <span>Back to App</span>
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-[240px]">
        <div className="max-w-[1100px] mx-auto px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
