import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { donationsApi } from '@/api/donations';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable, type Column } from '@/components/shared/DataTable';
import { Pagination } from '@/components/shared/Pagination';
import { SearchInput } from '@/components/shared/SearchInput';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useResourcePage } from '@/hooks/useResourcePage';
import type { Donation, User, DonationType } from '@/types';

type StatusVariant = 'default' | 'secondary' | 'destructive' | 'outline';

function getStatusBadge(status: Donation['status']): { label: string; variant: StatusVariant } {
  switch (status) {
    case 'completed':
      return { label: 'Completed', variant: 'default' };
    case 'pending':
      return { label: 'Pending', variant: 'secondary' };
    case 'failed':
      return { label: 'Failed', variant: 'destructive' };
    default:
      return { label: status, variant: 'outline' };
  }
}

export default function DonationsPage() {
  const [statusFilter, setStatusFilter] = useState('');
  const { page, setPage, search, setSearch } = useResourcePage<Donation>();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-donations', page, search, statusFilter],
    queryFn: () =>
      donationsApi.list({
        page,
        search: search || undefined,
        status: statusFilter || undefined,
      }),
  });

  const columns: Column<Donation>[] = [
    {
      key: 'user',
      header: 'Donor',
      cell: (d) => {
        const user = d.userId as User | string;
        if (typeof user === 'object') {
          return (
            <div>
              <p className="font-medium text-sm">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          );
        }
        return <span className="text-sm text-muted-foreground">{d.isAnonymous ? 'Anonymous' : user}</span>;
      },
    },
    {
      key: 'amount',
      header: 'Amount',
      cell: (d) => (
        <span className="font-medium text-sm">{formatCurrency(d.amount, d.currency)}</span>
      ),
    },
    {
      key: 'donationType',
      header: 'Type',
      cell: (d) => {
        const dt = d.donationTypeId as DonationType | string | undefined;
        if (typeof dt === 'object' && dt) return <span className="text-sm">{dt.name}</span>;
        return <span className="text-sm text-muted-foreground">—</span>;
      },
    },
    {
      key: 'paymentMethod',
      header: 'Method',
      cell: (d) => (
        <Badge variant="outline" className="capitalize">{d.paymentMethod}</Badge>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      cell: (d) => {
        const { label, variant } = getStatusBadge(d.status);
        return <Badge variant={variant}>{label}</Badge>;
      },
    },
    {
      key: 'createdAt',
      header: 'Date',
      cell: (d) => <span className="text-sm text-muted-foreground">{formatDate(d.createdAt)}</span>,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Donations"
        description="View and monitor all donations"
      />

      <div className="flex items-center gap-3 mb-4">
        <SearchInput value={search} onChange={setSearch} placeholder="Search donations…" />
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="h-9 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 text-sm text-slate-300 focus:outline-none focus:border-violet-500/40 transition-colors"
        >
          <option value="">All statuses</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        keyExtractor={(d) => d._id}
        emptyMessage="No donations found."
      />

      {data?.meta && (
        <Pagination meta={data.meta} onPageChange={setPage} />
      )}
    </div>
  );
}
