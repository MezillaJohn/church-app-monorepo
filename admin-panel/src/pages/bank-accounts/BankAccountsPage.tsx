import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bankAccountsApi } from '@/api/bank-accounts';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable, type Column } from '@/components/shared/DataTable';
import { Pagination } from '@/components/shared/Pagination';
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
import { BankAccountFormDialog } from './BankAccountFormDialog';
import type { BankAccount } from '@/types';
import { getErrorMessage } from '@/api/client';

export default function BankAccountsPage() {
  const qc = useQueryClient();
  const { page, setPage, editItem, deleteId, setDeleteId, isFormOpen, openCreate, openEdit, closeForm } =
    useResourcePage<BankAccount>();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-bank-accounts', page],
    queryFn: () => bankAccountsApi.list({ page }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => bankAccountsApi.delete(id),
    onSuccess: () => {
      toast.success('Bank account deleted');
      qc.invalidateQueries({ queryKey: ['admin-bank-accounts'] });
      setDeleteId(null);
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  const columns: Column<BankAccount>[] = [
    {
      key: 'title',
      header: 'Title',
      cell: (b) => <p className="font-medium text-sm">{b.title}</p>,
    },
    {
      key: 'bankName',
      header: 'Bank',
      cell: (b) => <span className="text-sm">{b.bankName}</span>,
    },
    {
      key: 'accountName',
      header: 'Account Name',
      cell: (b) => <span className="text-sm">{b.accountName}</span>,
    },
    {
      key: 'accountNumber',
      header: 'Account Number',
      cell: (b) => (
        <code className="text-xs bg-muted px-1.5 py-0.5 rounded tracking-wider">{b.accountNumber}</code>
      ),
    },
    {
      key: 'currency',
      header: 'Currency',
      cell: (b) => <span className="text-sm font-medium">{b.currency}</span>,
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
        title="Bank Accounts"
        description="Manage church bank accounts for donations"
        action={
          <Button onClick={openCreate}>
            <Plus size={16} /> Add Account
          </Button>
        }
      />

      <div className="mb-4" />

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        keyExtractor={(b) => b._id}
      />

      {data?.meta && (
        <Pagination meta={data.meta} onPageChange={setPage} />
      )}

      <BankAccountFormDialog
        open={isFormOpen}
        onClose={closeForm}
        account={editItem}
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(null)}
        title="Delete bank account?"
        description="This will permanently delete the bank account."
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
