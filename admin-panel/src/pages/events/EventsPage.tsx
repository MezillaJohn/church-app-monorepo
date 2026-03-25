import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventsApi } from '@/api/events';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable, type Column } from '@/components/shared/DataTable';
import { Pagination } from '@/components/shared/Pagination';
import { SearchInput } from '@/components/shared/SearchInput';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import { toast } from 'sonner';
import { useResourcePage } from '@/hooks/useResourcePage';
import { EventFormDialog } from './EventFormDialog';
import { TableImage } from '@/components/shared/TableImage';
import type { Event } from '@/types';
import { getErrorMessage } from '@/api/client';

const EVENT_TYPES = ['service', 'conference', 'prayer', 'youth', 'children'] as const;

export default function EventsPage() {
  const qc = useQueryClient();
  const [typeFilter, setTypeFilter] = useState('');
  const { page, setPage, search, setSearch, editItem, deleteId, setDeleteId, isFormOpen, openCreate, openEdit, closeForm } =
    useResourcePage<Event>();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-events', page, search, typeFilter],
    queryFn: () =>
      eventsApi.list({
        page,
        search: search || undefined,
        eventType: typeFilter || undefined,
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => eventsApi.delete(id),
    onSuccess: () => {
      toast.success('Event deleted');
      qc.invalidateQueries({ queryKey: ['admin-events'] });
      setDeleteId(null);
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  const columns: Column<Event>[] = [
    {
      key: 'imageUrl',
      header: '',
      className: 'w-14 pl-3 pr-2',
      cell: (e) => <TableImage src={e.imageUrl} alt={e.title} aspectRatio="landscape" />,
    },
    {
      key: 'title',
      header: 'Title',
      cell: (e) => (
        <div>
          <p className="font-medium text-sm">{e.title}</p>
          {e.location && <p className="text-xs text-muted-foreground">{e.location}</p>}
        </div>
      ),
    },
    {
      key: 'eventType',
      header: 'Type',
      cell: (e) => (
        <Badge variant="secondary" className="capitalize">{e.eventType}</Badge>
      ),
    },
    {
      key: 'eventDate',
      header: 'Schedule',
      cell: (e) => (
        <div className="text-sm">
          <p>{formatDateTime(e.eventDate)}</p>
          <p className="text-xs text-muted-foreground">→ {formatDateTime(e.endDate)}</p>
        </div>
      ),
    },
    {
      key: 'isPublished',
      header: 'Published',
      cell: (e) => (
        <Badge variant={e.isPublished ? 'default' : 'outline'}>
          {e.isPublished ? 'Published' : 'Draft'}
        </Badge>
      ),
    },
    {
      key: 'isLive',
      header: 'Status',
      cell: (e) => {
        const now = new Date();
        const start = new Date(e.eventDate);
        const end = new Date(e.endDate);
        const isLive = start <= now && end >= now;
        const isUpcoming = start > now;
        if (isLive) return <Badge className="bg-red-500 hover:bg-red-600 text-white animate-pulse">Live</Badge>;
        if (isUpcoming) return <Badge variant="outline" className="text-blue-400 border-blue-400/30">Upcoming</Badge>;
        return <Badge variant="outline" className="text-muted-foreground border-muted-foreground/30">Ended</Badge>;
      },
    },
    {
      key: 'actions',
      header: '',
      className: 'w-10',
      cell: (e) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => openEdit(e)}>
              <Pencil size={14} /> Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => setDeleteId(e._id)}
            >
              <Trash2 size={14} /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Events"
        description="Manage church events and programmes"
        action={
          <Button onClick={openCreate}>
            <Plus size={16} /> Add Event
          </Button>
        }
      />

      <div className="flex items-center gap-3 mb-4">
        <SearchInput value={search} onChange={setSearch} placeholder="Search events…" />
        <select
          value={typeFilter}
          onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
          className="h-9 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 text-sm text-slate-300 focus:outline-none focus:border-violet-500/40 transition-colors capitalize"
        >
          <option value="">All types</option>
          {EVENT_TYPES.map((t) => (
            <option key={t} value={t} className="capitalize">{t}</option>
          ))}
        </select>
      </div>

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        keyExtractor={(e) => e._id}
      />

      {data?.meta && (
        <Pagination meta={data.meta} onPageChange={setPage} />
      )}

      <EventFormDialog
        open={isFormOpen}
        onClose={closeForm}
        event={editItem}
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(null)}
        title="Delete event?"
        description="This will permanently delete the event and cannot be undone."
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
