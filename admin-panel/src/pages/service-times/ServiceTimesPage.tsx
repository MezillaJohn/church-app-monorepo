import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { serviceTimesApi } from '@/api/service-times';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable, type Column } from '@/components/shared/DataTable';
import { Pagination } from '@/components/shared/Pagination';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, MoreHorizontal, Pencil, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useResourcePage } from '@/hooks/useResourcePage';
import { getErrorMessage } from '@/api/client';
import type { ServiceTime } from '@/types';

const formSchema = z.object({
  day: z.string().min(1, 'Day is required'),
  time: z.string().min(1, 'Time is required'),
  label: z.string().min(1, 'Label is required'),
  order: z.coerce.number().int().default(0),
  isActive: z.boolean().default(true),
});

type FormData = z.infer<typeof formSchema>;

function ServiceTimeFormDialog({
  open,
  onClose,
  serviceTime,
}: {
  open: boolean;
  onClose: () => void;
  serviceTime: ServiceTime | null;
}) {
  const qc = useQueryClient();
  const isEdit = !!serviceTime;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    values: serviceTime
      ? { day: serviceTime.day, time: serviceTime.time, label: serviceTime.label, order: serviceTime.order, isActive: serviceTime.isActive }
      : { day: '', time: '', label: '', order: 0, isActive: true },
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      isEdit ? serviceTimesApi.update(serviceTime!._id, data) : serviceTimesApi.create(data),
    onSuccess: () => {
      toast.success(isEdit ? 'Service time updated' : 'Service time created');
      qc.invalidateQueries({ queryKey: ['admin-service-times'] });
      onClose();
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Service Time' : 'Add Service Time'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
            <FormField control={form.control} name="day" render={({ field }) => (
              <FormItem>
                <FormLabel>Day</FormLabel>
                <FormControl><Input placeholder="e.g. Sunday" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="time" render={({ field }) => (
              <FormItem>
                <FormLabel>Time</FormLabel>
                <FormControl><Input placeholder="e.g. 9:00 AM & 11:00 AM" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="label" render={({ field }) => (
              <FormItem>
                <FormLabel>Label</FormLabel>
                <FormControl><Input placeholder="e.g. Main Service" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="order" render={({ field }) => (
              <FormItem>
                <FormLabel>Order</FormLabel>
                <FormControl><Input type="number" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="isActive" render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-3">
                <FormLabel>Active</FormLabel>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )} />
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending && <Loader2 size={14} className="animate-spin mr-1" />}
                {isEdit ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default function ServiceTimesPage() {
  const qc = useQueryClient();
  const { page, setPage, editItem, deleteId, setDeleteId, isFormOpen, openCreate, openEdit, closeForm } =
    useResourcePage<ServiceTime>();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-service-times', page],
    queryFn: () => serviceTimesApi.list({ page }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => serviceTimesApi.delete(id),
    onSuccess: () => {
      toast.success('Service time deleted');
      qc.invalidateQueries({ queryKey: ['admin-service-times'] });
      setDeleteId(null);
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  const columns: Column<ServiceTime>[] = [
    { key: 'day', header: 'Day', cell: (s) => <span className="font-medium">{s.day}</span> },
    { key: 'time', header: 'Time', cell: (s) => s.time },
    { key: 'label', header: 'Label', cell: (s) => s.label },
    {
      key: 'order', header: 'Order',
      cell: (s) => (
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-medium">{s.order}</span>
      ),
    },
    {
      key: 'isActive', header: 'Status',
      cell: (s) => <Badge variant={s.isActive ? 'default' : 'outline'}>{s.isActive ? 'Active' : 'Inactive'}</Badge>,
    },
    {
      key: 'actions', header: '', className: 'w-10',
      cell: (s) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><MoreHorizontal size={16} /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => openEdit(s)}><Pencil size={14} /> Edit</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={() => setDeleteId(s._id)}>
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
        title="Service Times"
        description="Manage church service schedules"
        action={<Button onClick={openCreate}><Plus size={16} /> Add Service Time</Button>}
      />
      <div className="mb-4" />
      <DataTable columns={columns} data={data?.data ?? []} isLoading={isLoading} keyExtractor={(s) => s._id} />
      {data?.meta && <Pagination meta={data.meta} onPageChange={setPage} />}
      <ServiceTimeFormDialog open={isFormOpen} onClose={closeForm} serviceTime={editItem} />
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(null)}
        title="Delete service time?"
        description="This will permanently delete this service time."
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
