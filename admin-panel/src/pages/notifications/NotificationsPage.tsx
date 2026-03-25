import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation } from '@tanstack/react-query';
import { notificationsApi } from '@/api/notifications';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable, type Column } from '@/components/shared/DataTable';
import { Pagination } from '@/components/shared/Pagination';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Send, Bell } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import { toast } from 'sonner';
import { getErrorMessage } from '@/api/client';
import type { Notification, User } from '@/types';

// ─── Send Push Form ────────────────────────────────────────────────────────────

const pushSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  body: z.string().min(1, 'Body is required'),
  targetType: z.enum(['all', 'user']),
  userId: z.string().optional(),
}).refine(
  (data) => data.targetType !== 'user' || (data.userId && data.userId.trim().length > 0),
  { message: 'User ID is required when targeting a specific user', path: ['userId'] },
);

type PushFormData = z.infer<typeof pushSchema>;

function SendPushTab() {
  const form = useForm<PushFormData>({
    resolver: zodResolver(pushSchema),
    defaultValues: { title: '', body: '', targetType: 'all', userId: '' },
  });

  const targetType = form.watch('targetType');

  const mutation = useMutation({
    mutationFn: (data: PushFormData) =>
      notificationsApi.sendPush({
        title: data.title,
        body: data.body,
        targetType: data.targetType,
        userId: data.targetType === 'user' ? data.userId : undefined,
      }),
    onSuccess: (result) => {
      toast.success(`Push notification sent to ${result.sent} device(s)`);
      form.reset({ title: '', body: '', targetType: 'all', userId: '' });
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell size={18} />
          Send Push Notification
        </CardTitle>
        <CardDescription>
          Send a push notification to all users or a specific user.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
            <FormField control={form.control} name="title" render={({ field }) => (
              <FormItem>
                <FormLabel>Title *</FormLabel>
                <FormControl>
                  <Input placeholder="Notification title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="body" render={({ field }) => (
              <FormItem>
                <FormLabel>Message *</FormLabel>
                <FormControl>
                  <Textarea rows={4} placeholder="Notification body…" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="targetType" render={({ field }) => (
              <FormItem>
                <FormLabel>Target</FormLabel>
                <FormControl>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="all"
                        checked={field.value === 'all'}
                        onChange={() => field.onChange('all')}
                        className="h-4 w-4"
                      />
                      <span className="text-sm">All users</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="user"
                        checked={field.value === 'user'}
                        onChange={() => field.onChange('user')}
                        className="h-4 w-4"
                      />
                      <span className="text-sm">Specific user</span>
                    </label>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {targetType === 'user' && (
              <FormField control={form.control} name="userId" render={({ field }) => (
                <FormItem>
                  <FormLabel>User ID *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter the user's ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            )}

            <div className="pt-2">
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending
                  ? <Loader2 size={14} className="animate-spin" />
                  : <Send size={14} />
                }
                {mutation.isPending ? 'Sending…' : 'Send notification'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

// ─── History Tab ──────────────────────────────────────────────────────────────

function HistoryTab() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-notifications', page],
    queryFn: () => notificationsApi.list({ page }),
  });

  const columns: Column<Notification>[] = [
    {
      key: 'type',
      header: 'Type',
      cell: (n) => (
        <Badge variant="secondary" className="font-mono text-xs">{n.type}</Badge>
      ),
    },
    {
      key: 'user',
      header: 'User',
      cell: (n) => {
        const user = n.userId as User | string;
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
      key: 'readAt',
      header: 'Read',
      cell: (n) =>
        n.readAt ? (
          <Badge variant="default">Read</Badge>
        ) : (
          <Badge variant="outline">Unread</Badge>
        ),
    },
    {
      key: 'createdAt',
      header: 'Sent At',
      cell: (n) => (
        <span className="text-sm text-muted-foreground">{formatDateTime(n.createdAt)}</span>
      ),
    },
  ];

  return (
    <div>
      <DataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        keyExtractor={(n) => n._id}
        emptyMessage="No notification history found."
      />
      {data?.meta && (
        <Pagination meta={data.meta} onPageChange={setPage} />
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function NotificationsPage() {
  return (
    <div>
      <PageHeader
        title="Notifications"
        description="Send push notifications and view notification history"
      />

      <Tabs defaultValue="send" className="mt-2">
        <TabsList>
          <TabsTrigger value="send">Send Push</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="send" className="mt-4">
          <SendPushTab />
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <HistoryTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
