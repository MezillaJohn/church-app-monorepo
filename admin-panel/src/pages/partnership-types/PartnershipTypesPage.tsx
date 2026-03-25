import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { partnershipTypesApi } from '@/api/partnership-types';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable, type Column } from '@/components/shared/DataTable';
import { Pagination } from '@/components/shared/Pagination';
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
import { toast } from 'sonner';
import { useResourcePage } from '@/hooks/useResourcePage';
import { PartnershipTypeFormDialog } from './PartnershipTypeFormDialog';
import type { PartnershipType } from '@/types';
import { getErrorMessage } from '@/api/client';

export default function PartnershipTypesPage() {
  const qc = useQueryClient();
  const { page, setPage, editItem, deleteId, setDeleteId, isFormOpen, openCreate, openEdit, closeForm } =
    useResourcePage<PartnershipType>();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-partnership-types', page],
    queryFn: () => partnershipTypesApi.list({ page }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => partnershipTypesApi.delete(id),
    onSuccess: () => {
      toast.success('Partnership type deleted');
      qc.invalidateQueries({ queryKey: ['admin-partnership-types'] });
      setDeleteId(null);
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  const columns: Column<PartnershipType>[] = [
    {
      key: 'name',
      header: 'Name',
      cell: (p) => <p className="font-medium text-sm">{p.name}</p>,
    },
    {
      key: 'description',
      header: 'Description',
      cell: (p) => (
        <span className="text-sm text-muted-foreground line-clamp-2">
          {p.description ?? '—'}
        </span>
      ),
    },
    {
      key: 'isActive',
      header: 'Status',
      cell: (p) => (
        <Badge variant={p.isActive ? 'default' : 'outline'}>
          {p.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: '',
      className: 'w-10',
      cell: (p) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => openEdit(p)}>
              <Pencil size={14} /> Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => setDeleteId(p._id)}
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
        title="Partnership Types"
        description="Manage partnership programme categories"
        action={
          <Button onClick={openCreate}>
            <Plus size={16} /> Add Type
          </Button>
        }
      />

      <div className="mb-4" />

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        keyExtractor={(p) => p._id}
      />

      {data?.meta && (
        <Pagination meta={data.meta} onPageChange={setPage} />
      )}

      <PartnershipTypeFormDialog
        open={isFormOpen}
        onClose={closeForm}
        partnershipType={editItem}
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(null)}
        title="Delete partnership type?"
        description="This will permanently delete the partnership type. Existing partnerships will not be affected."
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
