import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation } from '@tanstack/react-query';
import { notificationsApi } from '@/api/notifications';
import { usersApi } from '@/api/users';
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
import { Loader2, Send, Bell, Search, X, UserIcon } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import { toast } from 'sonner';
import { getErrorMessage } from '@/api/client';
import type { Notification, User } from '@/types';

// ─── User Picker ─────────────────────────────────────────────────────────────

function UserPicker({
  onChange,
}: {
  value?: string;
  onChange: (userId: string, user?: User) => void;
}) {
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users-picker', search],
    queryFn: () => usersApi.list({ search, perPage: 8 }),
    enabled: search.length >= 2,
  });

  const users = data?.data ?? [];

  const handleSelect = (user: User) => {
    setSelectedUser(user);
    onChange(user._id, user);
    setSearch('');
    setIsOpen(false);
  };

  const handleClear = () => {
    setSelectedUser(null);
    onChange('');
    setSearch('');
  };

  if (selectedUser) {
    return (
      <div className="flex items-center gap-3 p-3 rounded-lg border border-white/10 bg-muted/30">
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center shrink-0">
          <UserIcon size={14} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{selectedUser.name}</p>
          <p className="text-xs text-muted-foreground truncate">{selectedUser.email}</p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7 shrink-0"
          onClick={handleClear}
        >
          <X size={14} />
        </Button>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => search.length >= 2 && setIsOpen(true)}
          className="pl-9"
        />
      </div>

      {isOpen && search.length >= 2 && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-white/10 bg-[#0d1421] shadow-xl max-h-[250px] overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 size={16} className="animate-spin text-muted-foreground" />
            </div>
          ) : users.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No users found
            </p>
          ) : (
            users.map((user) => (
              <button
                key={user._id}
                type="button"
                onClick={() => handleSelect(user)}
                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/[0.04] transition-colors text-left"
              >
                <div className="h-7 w-7 rounded-full bg-violet-500/20 flex items-center justify-center shrink-0">
                  <UserIcon size={12} className="text-violet-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ─── Send Push Form ────────────────────────────────────────────────────────────

const pushSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  body: z.string().min(1, 'Body is required'),
  targetType: z.enum(['all', 'user']),
  userId: z.string().optional(),
}).refine(
  (data) => data.targetType !== 'user' || (data.userId && data.userId.trim().length > 0),
  { message: 'Please select a user', path: ['userId'] },
);

type PushFormData = z.infer<typeof pushSchema>;

function SendPushTab() {
  const form = useForm<PushFormData>({
    resolver: zodResolver(pushSchema),
    defaultValues: { title: '', body: '', targetType: 'all', userId: '' },
  });

  const targetType = form.watch('targetType');

  // Clear userId when switching to "all"
  useEffect(() => {
    if (targetType === 'all') {
      form.setValue('userId', '');
    }
  }, [targetType, form]);

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
                  <FormLabel>Select User *</FormLabel>
                  <FormControl>
                    <UserPicker
                      value={field.value ?? ''}
                      onChange={(userId) => field.onChange(userId)}
                    />
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
      key: 'data',
      header: 'Content',
      cell: (n) => {
        const d = n.data as { title?: string; body?: string };
        return (
          <div className="max-w-[250px]">
            {d?.title && <p className="text-sm font-medium truncate">{d.title}</p>}
            {d?.body && <p className="text-xs text-muted-foreground truncate">{d.body}</p>}
          </div>
        );
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
