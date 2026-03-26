import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supportTicketsApi } from '@/api/support-tickets';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable, type Column } from '@/components/shared/DataTable';
import { Pagination } from '@/components/shared/Pagination';
import { SearchInput } from '@/components/shared/SearchInput';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MessageSquareReply, MoreHorizontal, Trash2, Eye } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import { toast } from 'sonner';
import { getErrorMessage } from '@/api/client';
import type { SupportTicket, User } from '@/types';

const statusColors: Record<string, string> = {
  open: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'in-progress': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  resolved: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
};

// ─── Respond Dialog ──────────────────────────────────────────────────────────

const respondSchema = z.object({
  adminResponse: z.string().min(1, 'Response is required'),
  status: z.enum(['open', 'in-progress', 'resolved']),
});

type RespondFormData = z.infer<typeof respondSchema>;

function RespondDialog({
  ticket,
  open,
  onClose,
}: {
  ticket: SupportTicket | null;
  open: boolean;
  onClose: () => void;
}) {
  const qc = useQueryClient();
  const form = useForm<RespondFormData>({
    resolver: zodResolver(respondSchema),
    defaultValues: { adminResponse: '', status: 'resolved' },
  });

  const mutation = useMutation({
    mutationFn: (data: RespondFormData) =>
      supportTicketsApi.respond(ticket!._id, data),
    onSuccess: () => {
      toast.success('Response sent to user via email');
      qc.invalidateQueries({ queryKey: ['admin-support-tickets'] });
      form.reset();
      onClose();
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  if (!ticket) return null;

  const user = ticket.userId as User;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Respond to Ticket</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 mb-4">
          <div>
            <p className="text-xs text-muted-foreground">From</p>
            <p className="text-sm font-medium">{user?.name ?? 'Unknown'}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Subject</p>
            <p className="text-sm font-medium">{ticket.subject}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Message</p>
            <p className="text-sm whitespace-pre-wrap bg-muted/30 rounded-lg p-3">
              {ticket.message}
            </p>
          </div>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((d) => mutation.mutate(d))}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="adminResponse"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Response *</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={4}
                      placeholder="Type your response... This will be emailed to the user."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Update Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? 'Sending...' : 'Send Response'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// ─── View Dialog ─────────────────────────────────────────────────────────────

function ViewDialog({
  ticket,
  open,
  onClose,
}: {
  ticket: SupportTicket | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!ticket) return null;
  const user = ticket.userId as User;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{ticket.subject}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="text-xs text-muted-foreground">From</p>
            <p className="text-sm font-medium">{user?.name ?? 'Unknown'}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-1">Message</p>
            <p className="text-sm whitespace-pre-wrap bg-muted/30 rounded-lg p-3">
              {ticket.message}
            </p>
          </div>

          {ticket.adminResponse && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Admin Response</p>
              <p className="text-sm whitespace-pre-wrap bg-emerald-500/10 rounded-lg p-3 border border-emerald-500/20">
                {ticket.adminResponse}
              </p>
              {ticket.respondedAt && (
                <p className="text-xs text-muted-foreground mt-1">
                  Responded {formatDateTime(ticket.respondedAt)}
                </p>
              )}
            </div>
          )}

          <div className="flex justify-between items-center">
            <Badge className={statusColors[ticket.status]}>
              {ticket.status}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {formatDateTime(ticket.createdAt)}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function SupportTicketsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [respondTicket, setRespondTicket] = useState<SupportTicket | null>(null);
  const [viewTicket, setViewTicket] = useState<SupportTicket | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-support-tickets', page, search, statusFilter],
    queryFn: () =>
      supportTicketsApi.list({
        page,
        search: search || undefined,
        status: statusFilter !== 'all' ? (statusFilter as any) : undefined,
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => supportTicketsApi.delete(id),
    onSuccess: () => {
      toast.success('Ticket deleted');
      qc.invalidateQueries({ queryKey: ['admin-support-tickets'] });
      setDeleteId(null);
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  const columns: Column<SupportTicket>[] = [
    {
      key: 'user',
      header: 'User',
      cell: (t) => {
        const user = t.userId as User;
        if (typeof user === 'object') {
          return (
            <div>
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          );
        }
        return <span className="text-sm text-muted-foreground">{String(user)}</span>;
      },
    },
    {
      key: 'subject',
      header: 'Subject',
      cell: (t) => <span className="text-sm font-medium">{t.subject}</span>,
    },
    {
      key: 'message',
      header: 'Message',
      cell: (t) => (
        <span className="text-sm text-muted-foreground line-clamp-2 max-w-[250px]">
          {t.message}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      cell: (t) => (
        <Badge className={statusColors[t.status]}>{t.status}</Badge>
      ),
    },
    {
      key: 'createdAt',
      header: 'Date',
      cell: (t) => (
        <span className="text-sm text-muted-foreground">
          {formatDateTime(t.createdAt)}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      cell: (t) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal size={14} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setViewTicket(t)}>
              <Eye size={14} className="mr-2" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setRespondTicket(t)}>
              <MessageSquareReply size={14} className="mr-2" />
              Respond
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setDeleteId(t._id)}
              className="text-red-400 focus:text-red-400"
            >
              <Trash2 size={14} className="mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      className: 'w-[50px]',
    },
  ];

  return (
    <div>
      <PageHeader
        title="Support Tickets"
        description="View and respond to user support requests"
      />

      <div className="flex items-center gap-3 mt-4 mb-4">
        <SearchInput
          value={search}
          onChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          placeholder="Search tickets..."
          className="max-w-xs"
        />
        <Select
          value={statusFilter}
          onValueChange={(v) => {
            setStatusFilter(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        keyExtractor={(t) => t._id}
        emptyMessage="No support tickets found."
      />

      {data?.meta && <Pagination meta={data.meta} onPageChange={setPage} />}

      <RespondDialog
        ticket={respondTicket}
        open={!!respondTicket}
        onClose={() => setRespondTicket(null)}
      />

      <ViewDialog
        ticket={viewTicket}
        open={!!viewTicket}
        onClose={() => setViewTicket(null)}
      />

      <ConfirmDialog
        open={!!deleteId}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        onCancel={() => setDeleteId(null)}
        title="Delete ticket?"
        description="This will permanently remove this support ticket."
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
