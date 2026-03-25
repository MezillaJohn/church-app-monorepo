import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '@/api/users';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { getErrorMessage } from '@/api/client';
import type { User } from '@/types';

const createSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phone: z.string().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  country: z.string().optional(),
  churchMember: z.boolean().default(false),
  isAdmin: z.boolean().default(false),
});

const editSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().optional(),
  phone: z.string().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  country: z.string().optional(),
  churchMember: z.boolean().default(false),
  isAdmin: z.boolean().default(false),
});

type CreateFormData = z.infer<typeof createSchema>;
type EditFormData = z.infer<typeof editSchema>;
type FormData = CreateFormData | EditFormData;

interface Props {
  open: boolean;
  onClose: () => void;
  user: User | null;
}

export function UserFormDialog({ open, onClose, user }: Props) {
  const qc = useQueryClient();
  const isEdit = !!user;

  const form = useForm<FormData>({
    resolver: zodResolver(isEdit ? editSchema : createSchema),
    defaultValues: { name: '', email: '', password: '', phone: '', country: '', churchMember: false, isAdmin: false },
  });

  const gender = form.watch('gender');

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        email: user.email,
        password: '',
        phone: user.phone ?? '',
        gender: user.gender,
        country: user.country ?? '',
        churchMember: user.churchMember,
        isAdmin: user.isAdmin,
      });
    } else {
      form.reset({ name: '', email: '', password: '', phone: '', country: '', churchMember: false, isAdmin: false });
    }
  }, [user, form]);

  const mutation = useMutation({
    mutationFn: (data: FormData) => {
      if (user) {
        const { password, ...rest } = data as EditFormData;
        const payload = password ? { ...rest, password } : rest;
        return usersApi.update(user._id, payload);
      }
      return usersApi.create(data as CreateFormData & { password: string });
    },
    onSuccess: () => {
      toast.success(user ? 'User updated' : 'User created');
      qc.invalidateQueries({ queryKey: ['admin-users'] });
      onClose();
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{user ? 'Edit User' : 'Add User'}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Full Name *</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl><Input type="email" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="phone" render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl><Input type="tel" placeholder="+234…" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              {!isEdit && (
                <FormField control={form.control} name="password" render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Password *</FormLabel>
                    <FormControl><Input type="password" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              )}

              {isEdit && (
                <FormField control={form.control} name="password" render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>New Password <span className="text-muted-foreground text-xs">(leave blank to keep)</span></FormLabel>
                    <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              )}

              <FormField control={form.control} name="gender" render={() => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select
                    value={gender ?? ''}
                    onValueChange={(v) => form.setValue('gender', v as 'male' | 'female' | 'other', { shouldDirty: true })}
                  >
                    <FormControl><SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="country" render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl><Input placeholder="e.g. Nigeria" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <div className="flex gap-6">
              <FormField control={form.control} name="churchMember" render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <input type="checkbox" checked={field.value} onChange={field.onChange} className="h-4 w-4" />
                  </FormControl>
                  <FormLabel className="!mt-0 cursor-pointer">Church Member</FormLabel>
                </FormItem>
              )} />
              <FormField control={form.control} name="isAdmin" render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <input type="checkbox" checked={field.value} onChange={field.onChange} className="h-4 w-4" />
                  </FormControl>
                  <FormLabel className="!mt-0 cursor-pointer">Admin</FormLabel>
                </FormItem>
              )} />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending && <Loader2 size={14} className="animate-spin" />}
                {user ? 'Save changes' : 'Create user'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
