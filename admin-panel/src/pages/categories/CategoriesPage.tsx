import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoriesApi } from '@/api/categories';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable, type Column } from '@/components/shared/DataTable';
import { Pagination } from '@/components/shared/Pagination';
import { SearchInput } from '@/components/shared/SearchInput';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import { CategoryFormDialog } from './CategoryFormDialog';
import type { Category } from '@/types';
import { getErrorMessage } from '@/api/client';

const typeLabels: Record<string, string> = {
  sermon: 'Sermon',
  book: 'Book',
  giving: 'Giving',
};

const typeBadgeColors: Record<string, string> = {
  sermon: 'bg-blue-500/15 text-blue-400',
  book: 'bg-amber-500/15 text-amber-400',
  giving: 'bg-emerald-500/15 text-emerald-400',
};

export default function CategoriesPage() {
  const qc = useQueryClient();
  const { page, setPage, search, setSearch, editItem, deleteId, setDeleteId, isFormOpen, openCreate, openEdit, closeForm } =
    useResourcePage<Category>();
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-categories', page, search, typeFilter],
    queryFn: () =>
      categoriesApi.list({
        page,
        search: search || undefined,
        type: typeFilter !== 'all' ? (typeFilter as 'sermon' | 'book' | 'giving') : undefined,
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => categoriesApi.delete(id),
    onSuccess: () => {
      toast.success('Category deleted');
      qc.invalidateQueries({ queryKey: ['admin-categories'] });
      setDeleteId(null);
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  const columns: Column<Category>[] = [
    {
      key: 'name',
      header: 'Name',
      cell: (c) => <p className="font-medium text-sm">{c.name}</p>,
    },
    {
      key: 'type',
      header: 'Type',
      cell: (c) => (
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${typeBadgeColors[c.type] ?? ''}`}>
          {typeLabels[c.type] ?? c.type}
        </span>
      ),
    },
    {
      key: 'slug',
      header: 'Slug',
      cell: (c) => (
        <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{c.slug}</code>
      ),
    },
    {
      key: 'isActive',
      header: 'Status',
      cell: (c) => (
        <span className={`text-xs font-medium ${c.isActive ? 'text-emerald-400' : 'text-muted-foreground'}`}>
          {c.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Created',
      cell: (c) => <span className="text-sm text-muted-foreground">{formatDate(c.createdAt)}</span>,
    },
    {
      key: 'actions',
      header: '',
      className: 'w-10',
      cell: (c) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => openEdit(c)}>
              <Pencil size={14} /> Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => setDeleteId(c._id)}
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
        title="Categories"
        description="Manage content categories for sermons, giving, and books"
        action={
          <Button onClick={openCreate}>
            <Plus size={16} /> Add Category
          </Button>
        }
      />

      <div className="flex items-center gap-3 mb-4">
        <SearchInput value={search} onChange={setSearch} placeholder="Search categories..." />
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="sermon">Sermon</SelectItem>
            <SelectItem value="giving">Giving</SelectItem>
            <SelectItem value="book">Book</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        keyExtractor={(c) => c._id}
      />

      {data?.meta && (
        <Pagination meta={data.meta} onPageChange={setPage} />
      )}

      <CategoryFormDialog
        open={isFormOpen}
        onClose={closeForm}
        category={editItem}
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(null)}
        title="Delete category?"
        description="This will permanently delete the category. Content in this category will not be deleted."
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
