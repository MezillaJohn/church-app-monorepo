import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { booksApi } from '@/api/books';
import { categoriesApi } from '@/api/categories';
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
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
import { useResourcePage } from '@/hooks/useResourcePage';
import { BookFormDialog } from './BookFormDialog';
import { TableImage } from '@/components/shared/TableImage';
import type { Book, Category } from '@/types';
import { getErrorMessage } from '@/api/client';

export default function BooksPage() {
  const qc = useQueryClient();
  const [categoryFilter, setCategoryFilter] = useState('');
  const { page, setPage, search, setSearch, editItem, deleteId, setDeleteId, isFormOpen, openCreate, openEdit, closeForm } =
    useResourcePage<Book>();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-books', page, search, categoryFilter],
    queryFn: () =>
      booksApi.list({
        page,
        search: search || undefined,
        categoryId: categoryFilter || undefined,
      }),
  });

  const { data: categories } = useQuery({
    queryKey: ['admin-categories-all', 'book'],
    queryFn: () => categoriesApi.list({ perPage: 100, type: 'book' }),
    select: (d) => d.data as Category[],
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => booksApi.delete(id),
    onSuccess: () => {
      toast.success('Book deleted');
      qc.invalidateQueries({ queryKey: ['admin-books'] });
      setDeleteId(null);
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  const togglePublishMutation = useMutation({
    mutationFn: (id: string) => booksApi.togglePublish(id),
    onSuccess: (b) => {
      toast.success(`Book ${b.isPublished ? 'published' : 'unpublished'}`);
      qc.invalidateQueries({ queryKey: ['admin-books'] });
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  const columns: Column<Book>[] = [
    {
      key: 'coverImage',
      header: '',
      className: 'w-14 pl-3 pr-2',
      cell: (b) => <TableImage src={b.coverImage} alt={b.title} />,
    },
    {
      key: 'title',
      header: 'Title',
      cell: (b) => (
        <div>
          <p className="font-medium text-sm">{b.title}</p>
          <p className="text-xs text-muted-foreground">{b.author}</p>
        </div>
      ),
    },
    {
      key: 'price',
      header: 'Price',
      cell: (b) =>
        b.isFree ? (
          <Badge variant="secondary">Free</Badge>
        ) : (
          <span className="text-sm font-medium">{formatCurrency(b.price, b.currency)}</span>
        ),
    },
    {
      key: 'status',
      header: 'Status',
      cell: (b) => (
        <Badge variant={b.isPublished ? 'default' : 'outline'}>
          {b.isPublished ? 'Published' : 'Draft'}
        </Badge>
      ),
    },
    {
      key: 'purchases',
      header: 'Purchases',
      cell: (b) => <span className="text-sm text-muted-foreground">{b.purchasesCount}</span>,
    },
    {
      key: 'actions',
      header: '',
      className: 'w-10',
      cell: (b) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => openEdit(b)}>
              <Pencil size={14} /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => togglePublishMutation.mutate(b._id)}>
              {b.isPublished ? <EyeOff size={14} /> : <Eye size={14} />}
              {b.isPublished ? 'Unpublish' : 'Publish'}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => setDeleteId(b._id)}
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
        title="Books"
        description="Manage e-books and digital resources"
        action={
          <Button onClick={openCreate}>
            <Plus size={16} /> Add Book
          </Button>
        }
      />

      <div className="flex items-center gap-3 mb-4">
        <SearchInput value={search} onChange={setSearch} placeholder="Search books…" />
        <select
          value={categoryFilter}
          onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
          className="h-9 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 text-sm text-slate-300 focus:outline-none focus:border-violet-500/40 transition-colors"
        >
          <option value="">All categories</option>
          {categories?.map((c) => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>
      </div>

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        keyExtractor={(b) => b._id}
      />

      {data?.meta && (
        <Pagination meta={data.meta} onPageChange={setPage} />
      )}

      <BookFormDialog
        open={isFormOpen}
        onClose={closeForm}
        book={editItem}
        categories={categories ?? []}
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(null)}
        title="Delete book?"
        description="This will permanently delete the book and cannot be undone."
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
