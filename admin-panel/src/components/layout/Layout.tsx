import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Toaster } from '@/components/ui/sonner';
import { Bell, ChevronRight, Menu } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getInitials } from '@/lib/utils';

const PAGE_NAMES: Record<string, string> = {
  '/': 'Dashboard',
  '/sermons': 'Sermons',
  '/series': 'Sermon Series',
  '/books': 'Books',
  '/events': 'Events',
  '/users': 'Users',
  '/donations': 'Donations',
  '/partnerships': 'Partnerships',
  '/categories': 'Categories',
  '/donation-types': 'Donation Types',
  '/partnership-types': 'Partnership Types',
  '/church-centres': 'Church Centres',
  '/bank-accounts': 'Bank Accounts',
  '/hero-sliders': 'Hero Sliders',
  '/notifications': 'Notifications',
  '/settings': 'Settings',
};

export function Layout() {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const pageName = PAGE_NAMES[pathname] ?? 'Admin Panel';
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#080c16]">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        {/* Top header */}
        <header className="h-[58px] shrink-0 border-b border-white/[0.06] bg-[#070b14]/90 backdrop-blur-md flex items-center px-4 sm:px-6 gap-3 sm:gap-4">
          {/* Hamburger — mobile only */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-1.5 -ml-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] transition-colors"
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-1.5 text-sm">
            <span className="text-slate-600 text-xs hidden sm:inline">Admin</span>
            <ChevronRight size={12} className="text-slate-700 hidden sm:inline" />
            <span className="text-slate-300 font-medium text-sm">{pageName}</span>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button className="relative p-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/[0.06] transition-colors">
              <Bell size={16} />
            </button>
            <div className="flex items-center gap-2.5 pl-3 border-l border-white/[0.08]">
              <div className="h-7 w-7 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                {user ? getInitials(user.name) : 'A'}
              </div>
              <span className="text-sm text-slate-300 font-medium hidden md:block truncate max-w-[140px]">
                {user?.name}
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>

      <Toaster richColors position="top-right" />
    </div>
  );
}
