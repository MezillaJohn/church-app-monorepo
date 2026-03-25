import { NavLink } from 'react-router-dom';
import { cn, getInitials } from '@/lib/utils';
import {
  LayoutDashboard,
  Mic2,
  BookOpen,
  Calendar,
  Users,
  Handshake,
  Church,
  Landmark,
  Image,
  Tag,
  Tags,
  Bell,
  Settings,
  LogOut,
  DollarSign,
  List,
  Zap,
  Layers,
  X,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

type NavItem = { label: string; to: string; icon: React.ElementType };

const mainNav: NavItem[] = [
  { label: 'Dashboard', to: '/', icon: LayoutDashboard },
  { label: 'Sermons', to: '/sermons', icon: Mic2 },
  { label: 'Series', to: '/series', icon: List },
  { label: 'Books', to: '/books', icon: BookOpen },
  { label: 'Events', to: '/events', icon: Calendar },
  { label: 'Users', to: '/users', icon: Users },
  { label: 'Donations', to: '/donations', icon: DollarSign },
  { label: 'Partnerships', to: '/partnerships', icon: Handshake },
];

const manageNav: NavItem[] = [
  { label: 'Categories', to: '/categories', icon: Tag },
  { label: 'Donation Types', to: '/donation-types', icon: Tags },
  { label: 'Partnership Types', to: '/partnership-types', icon: Layers },
  { label: 'Church Centres', to: '/church-centres', icon: Church },
  { label: 'Bank Accounts', to: '/bank-accounts', icon: Landmark },
  { label: 'Hero Sliders', to: '/hero-sliders', icon: Image },
];

const systemNav: NavItem[] = [
  { label: 'Notifications', to: '/notifications', icon: Bell },
  { label: 'Settings', to: '/settings', icon: Settings },
];

function NavSection({ title, items, onNavigate }: { title: string; items: NavItem[]; onNavigate?: () => void }) {
  return (
    <div>
      <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-600">
        {title}
      </p>
      <div className="space-y-0.5">
        {items.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-150',
                isActive
                  ? 'bg-violet-500/[0.15] text-violet-300 font-medium'
                  : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-200',
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={16}
                  className={cn(
                    'shrink-0 transition-colors',
                    isActive ? 'text-violet-400' : 'text-slate-500 group-hover:text-slate-300',
                  )}
                />
                <span className="flex-1 truncate">{label}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
}

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const { user, logout } = useAuth();

  const sidebarContent = (
    <aside className="flex h-screen w-[220px] shrink-0 flex-col bg-[#070b14] border-r border-white/[0.06]">
      {/* Logo */}
      <div className="flex h-[58px] items-center gap-2.5 px-4 border-b border-white/[0.06]">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 shrink-0 shadow-[0_0_12px_rgba(139,92,246,0.4)]">
          <Zap size={15} className="text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold text-white leading-none truncate">Church Admin</p>
          <p className="text-[10px] text-slate-600 mt-0.5">Management Portal</p>
        </div>
        {/* Close button — mobile only */}
        <button
          onClick={onClose}
          className="lg:hidden p-1 rounded text-slate-500 hover:text-slate-300 hover:bg-white/[0.06] transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-2.5 space-y-4">
        <NavSection title="Main" items={mainNav} onNavigate={onClose} />
        <NavSection title="Manage" items={manageNav} onNavigate={onClose} />
        <NavSection title="System" items={systemNav} onNavigate={onClose} />
      </nav>

      {/* User */}
      <div className="border-t border-white/[0.06] p-2.5">
        <div className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 hover:bg-white/[0.04] transition-colors group">
          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center shrink-0 text-[10px] font-bold text-white">
            {user ? getInitials(user.name) : 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-slate-300 truncate">{user?.name}</p>
            <p className="text-[10px] text-slate-600 truncate">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            className="p-1 rounded text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 transition-colors opacity-0 group-hover:opacity-100"
            title="Sign out"
          >
            <LogOut size={13} />
          </button>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop sidebar — always visible */}
      <div className="hidden lg:block">
        {sidebarContent}
      </div>

      {/* Mobile sidebar — drawer with overlay */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          {/* Drawer */}
          <div className="relative h-full w-[220px] animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
