import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sermonsApi } from '@/api/sermons';
import { categoriesApi } from '@/api/categories';
import { seriesApi } from '@/api/series';
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
import { Plus, MoreHorizontal, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import { useResourcePage } from '@/hooks/useResourcePage';
import { SermonFormDialog } from './SermonFormDialog';
import { TableImage } from '@/components/shared/TableImage';
import type { Sermon, Category, SermonSeries } from '@/types';
import { getErrorMessage } from '@/api/client';

export default function SermonsPage() {
  const qc = useQueryClient();
  const [typeFilter, setTypeFilter] = useState('');
  const { page, setPage, search, setSearch, editItem, deleteId, setDeleteId, isFormOpen, openCreate, openEdit, closeForm } =
    useResourcePage<Sermon>();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-sermons', page, search, typeFilter],
    queryFn: () => sermonsApi.list({ page, search: search || undefined, type: (typeFilter || undefined) as 'audio' | 'video' | undefined }),
  });

  const { data: categories } = useQuery({
    queryKey: ['admin-categories-all', 'sermon'],
    queryFn: () => categoriesApi.list({ perPage: 100, type: 'sermon' }),
    select: (d) => d.data as Category[],
  });

  const { data: seriesList } = useQuery({
    queryKey: ['admin-series-all'],
    queryFn: () => seriesApi.list({ perPage: 100 }),
    select: (d) => d.data as SermonSeries[],
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => sermonsApi.delete(id),
    onSuccess: () => {
      toast.success('Sermon deleted');
      qc.invalidateQueries({ queryKey: ['admin-sermons'] });
      setDeleteId(null);
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  const togglePublishMutation = useMutation({
    mutationFn: (id: string) => sermonsApi.togglePublish(id),
    onSuccess: (s) => {
      toast.success(`Sermon ${s.isPublished ? 'published' : 'unpublished'}`);
      qc.invalidateQueries({ queryKey: ['admin-sermons'] });
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  const columns: Column<Sermon>[] = [
    {
      key: 'thumbnailUrl',
      header: '',
      className: 'w-14 pl-3 pr-2',
      cell: (s) => <TableImage src={s.thumbnailUrl} alt={s.title} aspectRatio="landscape" />,
    },
    {
      key: 'title',
      header: 'Title',
      cell: (s) => (
        <div>
          <p className="font-medium text-sm">{s.title}</p>
          {s.speaker && <p className="text-xs text-muted-foreground">{s.speaker}</p>}
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      cell: (s) => (
        <Badge variant={s.type === 'video' ? 'default' : 'secondary'}>{s.type}</Badge>
      ),
    },
    {
      key: 'date',
      header: 'Date',
      cell: (s) => <span className="text-sm">{formatDate(s.date)}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      cell: (s) => (
        <Badge variant={s.isPublished ? 'default' : 'outline'}>
          {s.isPublished ? 'Published' : 'Draft'}
        </Badge>
      ),
    },
    {
      key: 'featured',
      header: 'Featured',
      cell: (s) => s.isFeatured ? <Badge variant="secondary">Featured</Badge> : null,
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
            <DropdownMenuItem onClick={() => togglePublishMutation.mutate(s._id)}>
              {s.isPublished ? <EyeOff size={14} /> : <Eye size={14} />}
              {s.isPublished ? 'Unpublish' : 'Publish'}
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
        title="Sermons"
        description="Manage sermon audio and video content"
        action={
          <Button onClick={openCreate}>
            <Plus size={16} /> Add Sermon
          </Button>
        }
      />

      <div className="flex items-center gap-3 mb-4">
        <SearchInput value={search} onChange={setSearch} placeholder="Search sermons…" />
        <select
          value={typeFilter}
          onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
          className="h-9 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 text-sm text-slate-300 focus:outline-none focus:border-violet-500/40 transition-colors"
        >
          <option value="">All types</option>
          <option value="audio">Audio</option>
          <option value="video">Video</option>
        </select>
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

      <SermonFormDialog
        open={isFormOpen}
        onClose={closeForm}
        sermon={editItem}
        categories={categories ?? []}
        seriesList={seriesList ?? []}
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(null)}
        title="Delete sermon?"
        description="This will permanently delete the sermon and cannot be undone."
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
