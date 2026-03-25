import { useQuery } from '@tanstack/react-query';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { dashboardApi } from '@/api/dashboard';
import { StatCard } from '@/components/shared/StatCard';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate, formatCurrency, getInitials } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import {
  Users,
  Mic2,
  BookOpen,
  Calendar,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import type { Sermon, Donation, User } from '@/types';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

// ─── Custom chart tooltip ─────────────────────────────────────────────────────

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/[0.1] bg-[#0f1829] px-3.5 py-2.5 shadow-xl">
      <p className="text-[11px] text-slate-500 mb-0.5">{label}</p>
      <p className="text-sm font-semibold text-violet-300">
        {payload[0].value} <span className="text-slate-500 font-normal">new users</span>
      </p>
    </div>
  );
}

// ─── Activity card ────────────────────────────────────────────────────────────

function ActivityCard({
  title, barClass, icon, children,
}: {
  title: string; barClass: string; icon: React.ReactNode; children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#0d1421] overflow-hidden flex flex-col">
      <div className={`h-[2px] bg-gradient-to-r ${barClass}`} />
      <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-white/[0.05]">
        <span className="text-slate-500">{icon}</span>
        <h3 className="text-[13px] font-semibold text-slate-200 tracking-tight">{title}</h3>
      </div>
      <div className="flex-1 divide-y divide-white/[0.04]">{children}</div>
    </div>
  );
}

function RowSkeleton({ avatar = false }: { avatar?: boolean }) {
  return (
    <div className="flex items-center gap-3 px-5 py-3.5">
      <Skeleton className={avatar ? 'h-8 w-8 rounded-full shrink-0' : 'h-8 w-8 rounded-lg shrink-0'} />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-3 w-3/4 rounded" />
        <Skeleton className="h-2.5 w-1/2 rounded" />
      </div>
      <Skeleton className="h-5 w-12 rounded-full shrink-0" />
    </div>
  );
}

function StatusBadge({ label, variant }: { label: string; variant: 'green' | 'red' | 'yellow' | 'slate' }) {
  const cls = {
    green: 'bg-emerald-500/15 text-emerald-400',
    red: 'bg-red-500/15 text-red-400',
    yellow: 'bg-yellow-500/15 text-yellow-400',
    slate: 'bg-slate-700/60 text-slate-500',
  }[variant];
  return (
    <span className={`shrink-0 inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold capitalize ${cls}`}>
      {label}
    </span>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const { user } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: dashboardApi.getStats,
  });

  const stats = data?.counts;
  const firstName = user?.name?.split(' ')[0] ?? 'Admin';
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const totalNewUsers = data?.userGrowth?.reduce((s, m) => s + m.users, 0) ?? 0;

  return (
    <div className="space-y-5">

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="relative rounded-2xl overflow-hidden border border-white/[0.07] bg-[#0d1421]">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 right-20 w-56 h-56 rounded-full bg-violet-600/10 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-40 h-40 rounded-full bg-blue-600/8 blur-2xl" />
        </div>
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.016]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-7 py-5">
          <div>
            <p className="text-slate-500 text-sm">{getGreeting()},</p>
            <h1 className="text-2xl font-bold text-white tracking-tight mt-0.5">
              {firstName}{' '}
              <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">Church</span>
            </h1>
          </div>
          <p className="text-xs text-slate-600 hidden sm:block">{today}</p>
        </div>
      </div>

      {/* ── 4 primary stat cards ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard title="Total Users"  value={stats?.users ?? 0}    icon={<Users size={17} />}    color="purple"  isLoading={isLoading} />
        <StatCard title="Sermons"      value={stats?.sermons ?? 0}  icon={<Mic2 size={17} />}     color="blue"    isLoading={isLoading} />
        <StatCard title="Books"        value={stats?.books ?? 0}    icon={<BookOpen size={17} />} color="emerald" isLoading={isLoading} />
        <StatCard title="Events"       value={stats?.events ?? 0}   icon={<Calendar size={17} />} color="orange"  isLoading={isLoading} />
      </div>

      {/* ── Chart ───────────────────────────────────────────────────────────── */}
      <div className="grid gap-4">

        {/* User Growth Chart — full width */}
        <div className="rounded-2xl border border-white/[0.06] bg-[#0d1421] overflow-hidden">
          <div className="h-[2px] bg-gradient-to-r from-violet-500 via-violet-400 to-transparent" />
          <div className="px-5 pt-4 pb-2 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-violet-500/15 p-1.5">
                  <TrendingUp size={14} className="text-violet-400" />
                </div>
                <h3 className="text-[13px] font-semibold text-slate-200">User Growth</h3>
              </div>
              <p className="text-[11px] text-slate-600 mt-1 ml-0.5">Monthly new registrations · last 12 months</p>
            </div>
            {!isLoading && (
              <div className="text-right">
                <p className="text-2xl font-bold text-white tabular-nums">{totalNewUsers.toLocaleString()}</p>
                <p className="text-[10px] text-slate-600 mt-0.5">total this year</p>
              </div>
            )}
          </div>

          <div className="px-2 pb-4 pt-1">
            {isLoading ? (
              <Skeleton className="h-44 w-full rounded-xl mx-3" />
            ) : (
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={data?.userGrowth ?? []} margin={{ top: 8, right: 16, left: -16, bottom: 0 }}>
                  <defs>
                    <linearGradient id="userGrowthGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.04)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: '#475569', fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fill: '#475569', fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                    width={32}
                  />
                  <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'rgba(139,92,246,0.2)', strokeWidth: 1 }} />
                  <Area
                    type="monotone"
                    dataKey="users"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    fill="url(#userGrowthGrad)"
                    dot={false}
                    activeDot={{ r: 4, fill: '#8b5cf6', strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

      </div>

      {/* ── Activity section ─────────────────────────────────────────────────── */}
      <div className="grid gap-4 lg:grid-cols-3">

        {/* Recent Sermons */}
        <ActivityCard title="Recent Sermons" barClass="from-blue-500 via-blue-400 to-transparent" icon={<Mic2 size={14} />}>
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => <RowSkeleton key={i} />)
            : (data?.recentSermons ?? []).map((s: Sermon) => (
                <div key={s._id} className="flex items-center gap-3 px-5 py-3 hover:bg-white/[0.02] transition-colors">
                  <div className="h-8 w-8 rounded-lg bg-blue-500/15 flex items-center justify-center shrink-0">
                    <Mic2 size={13} className="text-blue-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-medium text-slate-200 truncate">{s.title}</p>
                    <p className="text-[11px] text-slate-600 mt-0.5">{formatDate(s.createdAt)}</p>
                  </div>
                  <StatusBadge label={s.isPublished ? 'Live' : 'Draft'} variant={s.isPublished ? 'green' : 'slate'} />
                </div>
              ))}
        </ActivityCard>

        {/* Recent Donations */}
        <ActivityCard title="Recent Donations" barClass="from-teal-500 via-teal-400 to-transparent" icon={<DollarSign size={14} />}>
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => <RowSkeleton key={i} />)
            : (data?.recentDonations ?? []).map((d: Donation) => (
                <div key={d._id} className="flex items-center gap-3 px-5 py-3 hover:bg-white/[0.02] transition-colors">
                  <div className="h-8 w-8 rounded-lg bg-teal-500/15 flex items-center justify-center shrink-0">
                    <DollarSign size={13} className="text-teal-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-semibold text-slate-100 tabular-nums">{formatCurrency(d.amount, d.currency)}</p>
                    <p className="text-[11px] text-slate-600 mt-0.5">{formatDate(d.createdAt)}</p>
                  </div>
                  <StatusBadge
                    label={d.status}
                    variant={d.status === 'completed' ? 'green' : d.status === 'failed' ? 'red' : 'yellow'}
                  />
                </div>
              ))}
        </ActivityCard>

        {/* Recent Users */}
        <ActivityCard title="Recent Users" barClass="from-violet-500 via-violet-400 to-transparent" icon={<Users size={14} />}>
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => <RowSkeleton key={i} avatar />)
            : (data?.recentUsers ?? []).map((u: User) => (
                <div key={u._id} className="flex items-center gap-3 px-5 py-3 hover:bg-white/[0.02] transition-colors">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-500/80 to-blue-500/80 flex items-center justify-center text-[10px] font-bold text-white shrink-0 ring-1 ring-white/10">
                    {getInitials(u.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-medium text-slate-200 truncate">{u.name}</p>
                    <p className="text-[11px] text-slate-600 truncate mt-0.5">{u.email}</p>
                  </div>
                  {u.isAdmin && (
                    <span className="shrink-0 inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold bg-violet-500/15 text-violet-400">Admin</span>
                  )}
                </div>
              ))}
        </ActivityCard>

      </div>
    </div>
  );
}
