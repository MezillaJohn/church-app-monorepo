import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { churchCentresApi } from '@/api/church-centres';
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
import { toast } from 'sonner';
import { useResourcePage } from '@/hooks/useResourcePage';
import { ChurchCentreFormDialog } from './ChurchCentreFormDialog';
import type { ChurchCentre } from '@/types';
import { getErrorMessage } from '@/api/client';

export default function ChurchCentresPage() {
  const qc = useQueryClient();
  const { page, setPage, search, setSearch, editItem, deleteId, setDeleteId, isFormOpen, openCreate, openEdit, closeForm } =
    useResourcePage<ChurchCentre>();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-church-centres', page, search],
    queryFn: () => churchCentresApi.list({ page, search: search || undefined }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => churchCentresApi.delete(id),
    onSuccess: () => {
      toast.success('Church centre deleted');
      qc.invalidateQueries({ queryKey: ['admin-church-centres'] });
      setDeleteId(null);
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  const columns: Column<ChurchCentre>[] = [
    {
      key: 'name',
      header: 'Name',
      cell: (c) => <p className="font-medium text-sm">{c.name}</p>,
    },
    {
      key: 'city',
      header: 'City',
      cell: (c) => <span className="text-sm">{c.city ?? '—'}</span>,
    },
    {
      key: 'country',
      header: 'Country',
      cell: (c) => <span className="text-sm">{c.country ?? '—'}</span>,
    },
    {
      key: 'phone',
      header: 'Phone',
      cell: (c) => <span className="text-sm text-muted-foreground">{c.phone ?? '—'}</span>,
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
        title="Church Centres"
        description="Manage church branch locations"
        action={
          <Button onClick={openCreate}>
            <Plus size={16} /> Add Centre
          </Button>
        }
      />

      <div className="flex items-center gap-3 mb-4">
        <SearchInput value={search} onChange={setSearch} placeholder="Search church centres…" />
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

      <ChurchCentreFormDialog
        open={isFormOpen}
        onClose={closeForm}
        centre={editItem}
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(null)}
        title="Delete church centre?"
        description="This will permanently delete the church centre."
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
