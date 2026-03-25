import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { heroSlidersApi } from '@/api/hero-sliders';
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
import { HeroSliderFormDialog } from './HeroSliderFormDialog';
import { TableImage } from '@/components/shared/TableImage';
import type { HeroSlider } from '@/types';
import { getErrorMessage } from '@/api/client';

export default function HeroSlidersPage() {
  const qc = useQueryClient();
  const { page, setPage, editItem, deleteId, setDeleteId, isFormOpen, openCreate, openEdit, closeForm } =
    useResourcePage<HeroSlider>();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-hero-sliders', page],
    queryFn: () => heroSlidersApi.list({ page }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => heroSlidersApi.delete(id),
    onSuccess: () => {
      toast.success('Slider deleted');
      qc.invalidateQueries({ queryKey: ['admin-hero-sliders'] });
      setDeleteId(null);
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  const columns: Column<HeroSlider>[] = [
    {
      key: 'imageUrl',
      header: '',
      className: 'w-14 pl-3 pr-2',
      cell: (s) => <TableImage src={s.imageUrl} alt={s.title} aspectRatio="landscape" />,
    },
    {
      key: 'title',
      header: 'Title',
      cell: (s) => (
        <div>
          <p className="font-medium text-sm">{s.title ?? '(no title)'}</p>
          {s.subtitle && <p className="text-xs text-muted-foreground">{s.subtitle}</p>}
        </div>
      ),
    },
    {
      key: 'order',
      header: 'Order',
      cell: (s) => (
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-medium">
          {s.order}
        </span>
      ),
    },
    {
      key: 'isFeatured',
      header: 'Featured',
      cell: (s) =>
        s.isFeatured ? <Badge variant="secondary">Featured</Badge> : null,
    },
    {
      key: 'isActive',
      header: 'Status',
      cell: (s) => (
        <Badge variant={s.isActive ? 'default' : 'outline'}>
          {s.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
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
        title="Hero Sliders"
        description="Manage home screen banner slides"
        action={
          <Button onClick={openCreate}>
            <Plus size={16} /> Add Slider
          </Button>
        }
      />

      <div className="mb-4" />

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        keyExtractor={(s) => s._id}
      />

      {data?.meta && (
        <Pagination meta={data.meta} onPageChange={setPage} />
      )}

      <HeroSliderFormDialog
        open={isFormOpen}
        onClose={closeForm}
        slider={editItem}
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(null)}
        title="Delete slider?"
        description="This will permanently delete the hero slider."
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
