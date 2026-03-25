import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { seriesApi } from '@/api/series';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable, type Column } from '@/components/shared/DataTable';
import { Pagination } from '@/components/shared/Pagination';
import { SearchInput } from '@/components/shared/SearchInput';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import { useResourcePage } from '@/hooks/useResourcePage';
import { SeriesFormDialog } from './SeriesFormDialog';
import { TableImage } from '@/components/shared/TableImage';
import type { SermonSeries } from '@/types';
import { getErrorMessage } from '@/api/client';

export default function SeriesPage() {
  const qc = useQueryClient();
  const { page, setPage, search, setSearch, editItem, deleteId, setDeleteId, isFormOpen, openCreate, openEdit, closeForm } =
    useResourcePage<SermonSeries>();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-series', page, search],
    queryFn: () => seriesApi.list({ page, search: search || undefined }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => seriesApi.delete(id),
    onSuccess: () => {
      toast.success('Series deleted');
      qc.invalidateQueries({ queryKey: ['admin-series'] });
      setDeleteId(null);
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  const columns: Column<SermonSeries>[] = [
    {
      key: 'imageUrl',
      header: '',
      className: 'w-14 pl-3 pr-2',
      cell: (s) => <TableImage src={s.imageUrl} alt={s.name} />,
    },
    {
      key: 'name',
      header: 'Name',
      cell: (s) => (
        <div>
          <p className="font-medium text-sm">{s.name}</p>
          {s.description && (
            <p className="text-xs text-muted-foreground line-clamp-1">{s.description}</p>
          )}
        </div>
      ),
    },
    {
      key: 'preacher',
      header: 'Preacher',
      cell: (s) => <span className="text-sm">{s.preacher ?? '—'}</span>,
    },
    {
      key: 'createdAt',
      header: 'Created',
      cell: (s) => <span className="text-sm text-muted-foreground">{formatDate(s.createdAt)}</span>,
    },
    {
      key: 'actions',
      header: '',
      className: 'w-10',
      cell: (s) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => openEdit(s)}>
              <Pencil size={14} /> Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => setDeleteId(s._id)}
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
        title="Sermon Series"
        description="Manage sermon series and collections"
        action={
          <Button onClick={openCreate}>
            <Plus size={16} /> Add Series
          </Button>
        }
      />

      <div className="flex items-center gap-3 mb-4">
        <SearchInput value={search} onChange={setSearch} placeholder="Search series…" />
      </div>

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        keyExtractor={(s) => s._id}
      />

      {data?.meta && (
        <Pagination meta={data.meta} onPageChange={setPage} />
      )}

      <SeriesFormDialog
        open={isFormOpen}
        onClose={closeForm}
        series={editItem}
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(null)}
        title="Delete series?"
        description="This will permanently delete the series. Sermons in this series will not be deleted."
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
