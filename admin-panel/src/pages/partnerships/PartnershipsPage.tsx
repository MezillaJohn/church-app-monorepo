import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { partnershipsApi } from '@/api/partnerships';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable, type Column } from '@/components/shared/DataTable';
import { Pagination } from '@/components/shared/Pagination';
import { SearchInput } from '@/components/shared/SearchInput';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useResourcePage } from '@/hooks/useResourcePage';
import type { Partnership, PartnershipType } from '@/types';

type IntervalColor = {
  className: string;
  label: string;
};

function getIntervalStyle(interval: Partnership['interval']): IntervalColor {
  switch (interval) {
    case 'daily':
      return { className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', label: 'Daily' };
    case 'weekly':
      return { className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', label: 'Weekly' };
    case 'monthly':
      return { className: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200', label: 'Monthly' };
    case 'yearly':
      return { className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', label: 'Yearly' };
    default:
      return { className: '', label: interval };
  }
}

export default function PartnershipsPage() {
  const [intervalFilter, setIntervalFilter] = useState('');
  const { page, setPage, search, setSearch } = useResourcePage<Partnership>();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-partnerships', page, search, intervalFilter],
    queryFn: () =>
      partnershipsApi.list({
        page,
        search: search || undefined,
        interval: intervalFilter || undefined,
      }),
  });

  const columns: Column<Partnership>[] = [
    {
      key: 'partner',
      header: 'Partner',
      cell: (p) => (
        <div>
          <p className="font-medium text-sm">{p.fullname}</p>
          <p className="text-xs text-muted-foreground">{p.email}</p>
        </div>
      ),
    },
    {
      key: 'partnershipType',
      header: 'Type',
      cell: (p) => {
        const pt = p.partnershipTypeId as PartnershipType | string;
        if (typeof pt === 'object') return <span className="text-sm">{pt.name}</span>;
        return <span className="text-sm text-muted-foreground">—</span>;
      },
    },
    {
      key: 'interval',
      header: 'Interval',
      cell: (p) => {
        const { className, label } = getIntervalStyle(p.interval);
        return (
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}>
            {label}
          </span>
        );
      },
    },
    {
      key: 'amount',
      header: 'Amount',
      cell: (p) => (
        <span className="font-medium text-sm">{formatCurrency(p.amount, p.currency)}</span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Date',
      cell: (p) => <span className="text-sm text-muted-foreground">{formatDate(p.createdAt)}</span>,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Partnerships"
        description="View and monitor all partnership commitments"
      />

      <div className="flex items-center gap-3 mb-4">
        <SearchInput value={search} onChange={setSearch} placeholder="Search partnerships…" />
        <select
          value={intervalFilter}
          onChange={(e) => { setIntervalFilter(e.target.value); setPage(1); }}
          className="h-9 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 text-sm text-slate-300 focus:outline-none focus:border-violet-500/40 transition-colors"
        >
          <option value="">All intervals</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        keyExtractor={(p) => p._id}
        emptyMessage="No partnerships found."
      />

      {data?.meta && (
        <Pagination meta={data.meta} onPageChange={setPage} />
      )}
    </div>
  );
}
