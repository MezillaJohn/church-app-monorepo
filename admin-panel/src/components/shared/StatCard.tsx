import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

const colorVariants = {
  purple: {
    bar: 'from-violet-500 via-violet-400 to-transparent',
    icon: 'bg-violet-500/15 text-violet-400',
    value: 'text-white',
    glow: 'hover:shadow-[0_8px_32px_rgba(139,92,246,0.15)]',
    border: 'hover:border-violet-500/20',
  },
  blue: {
    bar: 'from-blue-500 via-blue-400 to-transparent',
    icon: 'bg-blue-500/15 text-blue-400',
    value: 'text-white',
    glow: 'hover:shadow-[0_8px_32px_rgba(59,130,246,0.15)]',
    border: 'hover:border-blue-500/20',
  },
  emerald: {
    bar: 'from-emerald-500 via-emerald-400 to-transparent',
    icon: 'bg-emerald-500/15 text-emerald-400',
    value: 'text-white',
    glow: 'hover:shadow-[0_8px_32px_rgba(16,185,129,0.15)]',
    border: 'hover:border-emerald-500/20',
  },
  orange: {
    bar: 'from-orange-500 via-orange-400 to-transparent',
    icon: 'bg-orange-500/15 text-orange-400',
    value: 'text-white',
    glow: 'hover:shadow-[0_8px_32px_rgba(249,115,22,0.15)]',
    border: 'hover:border-orange-500/20',
  },
  teal: {
    bar: 'from-teal-500 via-teal-400 to-transparent',
    icon: 'bg-teal-500/15 text-teal-400',
    value: 'text-white',
    glow: 'hover:shadow-[0_8px_32px_rgba(20,184,166,0.15)]',
    border: 'hover:border-teal-500/20',
  },
  rose: {
    bar: 'from-rose-500 via-rose-400 to-transparent',
    icon: 'bg-rose-500/15 text-rose-400',
    value: 'text-white',
    glow: 'hover:shadow-[0_8px_32px_rgba(244,63,94,0.15)]',
    border: 'hover:border-rose-500/20',
  },
  indigo: {
    bar: 'from-indigo-500 via-indigo-400 to-transparent',
    icon: 'bg-indigo-500/15 text-indigo-400',
    value: 'text-white',
    glow: 'hover:shadow-[0_8px_32px_rgba(99,102,241,0.15)]',
    border: 'hover:border-indigo-500/20',
  },
} as const;

type ColorVariant = keyof typeof colorVariants;

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  description?: string;
  color?: ColorVariant;
  isLoading?: boolean;
}

function compactNumber(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return n.toLocaleString();
}

export function StatCard({ title, value, icon, description, color = 'purple', isLoading }: StatCardProps) {
  if (isLoading) return <Skeleton className="h-[110px] rounded-2xl" />;

  const v = colorVariants[color];
  const displayValue = typeof value === 'number' ? compactNumber(value) : value;

  return (
    <div
      className={cn(
        'rounded-2xl border border-white/[0.06] bg-[#0d1421] overflow-hidden',
        'transition-all duration-300 hover:-translate-y-1 cursor-default',
        v.glow,
        v.border,
      )}
    >
      {/* Top accent gradient bar */}
      <div className={cn('h-[2px] bg-gradient-to-r', v.bar)} />

      <div className="p-5 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500 mb-2">
            {title}
          </p>
          <p className={cn('text-[2rem] font-bold leading-none tabular-nums', v.value)}>
            {displayValue}
          </p>
          {description && (
            <p className="text-xs text-slate-600 mt-1.5">{description}</p>
          )}
        </div>
        <div className={cn('rounded-xl p-2.5 shrink-0 mt-0.5', v.icon)}>
          {icon}
        </div>
      </div>
    </div>
  );
}
