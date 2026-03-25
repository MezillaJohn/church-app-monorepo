import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '@/api/users';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable, type Column } from '@/components/shared/DataTable';
import { Pagination } from '@/components/shared/Pagination';
import { SearchInput } from '@/components/shared/SearchInput';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, MoreHorizontal, Pencil, Trash2, ShieldCheck, ShieldOff } from 'lucide-react';
import { formatDate, getInitials } from '@/lib/utils';
import { toast } from 'sonner';
import { useResourcePage } from '@/hooks/useResourcePage';
import { UserFormDialog } from './UserFormDialog';
import type { User } from '@/types';
import { getErrorMessage } from '@/api/client';

export default function UsersPage() {
  const qc = useQueryClient();
  const [isAdminFilter, setIsAdminFilter] = useState('');
  const { page, setPage, search, setSearch, editItem, deleteId, setDeleteId, isFormOpen, openCreate, openEdit, closeForm } =
    useResourcePage<User>();

  const isAdminParam = isAdminFilter === 'true' ? true : isAdminFilter === 'false' ? false : undefined;

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', page, search, isAdminFilter],
    queryFn: () =>
      usersApi.list({
        page,
        search: search || undefined,
        isAdmin: isAdminParam,
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => usersApi.delete(id),
    onSuccess: () => {
      toast.success('User deleted');
      qc.invalidateQueries({ queryKey: ['admin-users'] });
      setDeleteId(null);
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  const toggleAdminMutation = useMutation({
    mutationFn: (id: string) => usersApi.toggleAdmin(id),
    onSuccess: (u) => {
      toast.success(`${u.name} is now ${u.isAdmin ? 'an admin' : 'a regular user'}`);
      qc.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  const columns: Column<User>[] = [
    {
      key: 'user',
      header: 'User',
      cell: (u) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs">{getInitials(u.name)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-sm">{u.name}</p>
            <p className="text-xs text-muted-foreground">{u.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'gender',
      header: 'Gender',
      cell: (u) => (
        <span className="text-sm capitalize">{u.gender ?? '—'}</span>
      ),
    },
    {
      key: 'churchMember',
      header: 'Member',
      cell: (u) => (
        <Badge variant={u.churchMember ? 'default' : 'outline'}>
          {u.churchMember ? 'Member' : 'Visitor'}
        </Badge>
      ),
    },
    {
      key: 'isAdmin',
      header: 'Role',
      cell: (u) => (
        <Badge variant={u.isAdmin ? 'secondary' : 'outline'}>
          {u.isAdmin ? 'Admin' : 'User'}
        </Badge>
      ),
    },
    {
      key: 'emailVerified',
      header: 'Verified',
      cell: (u) => (
        <Badge variant={u.emailVerifiedAt ? 'default' : 'outline'}>
          {u.emailVerifiedAt ? 'Verified' : 'Unverified'}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      header: 'Joined',
      cell: (u) => <span className="text-sm text-muted-foreground">{formatDate(u.createdAt)}</span>,
    },
    {
      key: 'actions',
      header: '',
      className: 'w-10',
      cell: (u) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => openEdit(u)}>
              <Pencil size={14} /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toggleAdminMutation.mutate(u._id)}>
              {u.isAdmin ? <ShieldOff size={14} /> : <ShieldCheck size={14} />}
              {u.isAdmin ? 'Remove admin' : 'Make admin'}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => setDeleteId(u._id)}
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
        title="Users"
        description="Manage registered app users"
        action={
          <Button onClick={openCreate}>
            <Plus size={16} /> Add User
          </Button>
        }
      />

      <div className="flex items-center gap-3 mb-4">
        <SearchInput value={search} onChange={setSearch} placeholder="Search users…" />
        <select
          value={isAdminFilter}
          onChange={(e) => { setIsAdminFilter(e.target.value); setPage(1); }}
          className="h-9 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 text-sm text-slate-300 focus:outline-none focus:border-violet-500/40 transition-colors"
        >
          <option value="">All roles</option>
          <option value="true">Admins only</option>
          <option value="false">Users only</option>
        </select>
      </div>

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        keyExtractor={(u) => u._id}
      />

      {data?.meta && (
        <Pagination meta={data.meta} onPageChange={setPage} />
      )}

      <UserFormDialog
        open={isFormOpen}
        onClose={closeForm}
        user={editItem}
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(null)}
        title="Delete user?"
        description="This will permanently delete the user account and all their data. This cannot be undone."
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
