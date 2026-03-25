import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PaginationMeta } from '@/types';

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

export function Pagination({ meta, onPageChange }: PaginationProps) {
  const { page, lastPage, total, perPage } = meta;
  const start = (page - 1) * perPage + 1;
  const end = Math.min(page * perPage, total);

  // Build visible page numbers (up to 5 around current)
  const pages: number[] = [];
  const delta = 2;
  for (let i = Math.max(1, page - delta); i <= Math.min(lastPage, page + delta); i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-between px-1 pt-4">
      <p className="text-xs text-slate-600">
        Showing{' '}
        <span className="text-slate-400 font-medium">{start}–{end}</span>
        {' '}of{' '}
        <span className="text-slate-400 font-medium">{total}</span>
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-200 hover:bg-white/[0.06] disabled:opacity-30 disabled:cursor-not-allowed transition-colors border border-white/[0.07]"
        >
          <ChevronLeft size={13} />
          Prev
        </button>

        <div className="flex items-center gap-1 mx-1">
          {pages[0] > 1 && (
            <>
              <button
                onClick={() => onPageChange(1)}
                className="w-7 h-7 rounded-md text-xs font-medium text-slate-500 hover:text-slate-200 hover:bg-white/[0.06] transition-colors"
              >
                1
              </button>
              {pages[0] > 2 && <span className="text-slate-700 text-xs px-1">…</span>}
            </>
          )}

          {pages.map((p) => (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={cn(
                'w-7 h-7 rounded-md text-xs font-medium transition-colors',
                p === page
                  ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                  : 'text-slate-500 hover:text-slate-200 hover:bg-white/[0.06]',
              )}
            >
              {p}
            </button>
          ))}

          {pages[pages.length - 1] < lastPage && (
            <>
              {pages[pages.length - 1] < lastPage - 1 && (
                <span className="text-slate-700 text-xs px-1">…</span>
              )}
              <button
                onClick={() => onPageChange(lastPage)}
                className="w-7 h-7 rounded-md text-xs font-medium text-slate-500 hover:text-slate-200 hover:bg-white/[0.06] transition-colors"
              >
                {lastPage}
              </button>
            </>
          )}
        </div>

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= lastPage}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-200 hover:bg-white/[0.06] disabled:opacity-30 disabled:cursor-not-allowed transition-colors border border-white/[0.07]"
        >
          Next
          <ChevronRight size={13} />
        </button>
      </div>
    </div>
  );
}
