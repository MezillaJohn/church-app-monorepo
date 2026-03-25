import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { donationTypesApi } from '@/api/donation-types';
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
import { DonationTypeFormDialog } from './DonationTypeFormDialog';
import type { DonationType } from '@/types';
import { getErrorMessage } from '@/api/client';

export default function DonationTypesPage() {
  const qc = useQueryClient();
  const { page, setPage, editItem, deleteId, setDeleteId, isFormOpen, openCreate, openEdit, closeForm } =
    useResourcePage<DonationType>();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-donation-types', page],
    queryFn: () => donationTypesApi.list({ page }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => donationTypesApi.delete(id),
    onSuccess: () => {
      toast.success('Donation type deleted');
      qc.invalidateQueries({ queryKey: ['admin-donation-types'] });
      setDeleteId(null);
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  const columns: Column<DonationType>[] = [
    {
      key: 'name',
      header: 'Name',
      cell: (d) => <p className="font-medium text-sm">{d.name}</p>,
    },
    {
      key: 'description',
      header: 'Description',
      cell: (d) => (
        <span className="text-sm text-muted-foreground line-clamp-2">
          {d.description ?? '—'}
        </span>
      ),
    },
    {
      key: 'isActive',
      header: 'Status',
      cell: (d) => (
        <Badge variant={d.isActive ? 'default' : 'outline'}>
          {d.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: '',
      className: 'w-10',
      cell: (d) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => openEdit(d)}>
              <Pencil size={14} /> Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => setDeleteId(d._id)}
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
        title="Donation Types"
        description="Manage categories of donations (e.g. tithe, offering)"
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
        keyExtractor={(d) => d._id}
      />

      {data?.meta && (
        <Pagination meta={data.meta} onPageChange={setPage} />
      )}

      <DonationTypeFormDialog
        open={isFormOpen}
        onClose={closeForm}
        donationType={editItem}
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(null)}
        title="Delete donation type?"
        description="This will permanently delete the donation type. Existing donations with this type will not be affected."
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
