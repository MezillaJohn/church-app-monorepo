import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { partnershipTypesApi } from '@/api/partnership-types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { getErrorMessage } from '@/api/client';
import type { PartnershipType } from '@/types';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

type FormData = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
  partnershipType: PartnershipType | null;
}

export function PartnershipTypeFormDialog({ open, onClose, partnershipType }: Props) {
  const qc = useQueryClient();
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', description: '', isActive: true },
  });

  useEffect(() => {
    if (partnershipType) {
      form.reset({
        name: partnershipType.name,
        description: partnershipType.description ?? '',
        isActive: partnershipType.isActive,
      });
    } else {
      form.reset({ name: '', description: '', isActive: true });
    }
  }, [partnershipType, form]);

  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      partnershipType
        ? partnershipTypesApi.update(partnershipType._id, data)
        : partnershipTypesApi.create(data),
    onSuccess: () => {
      toast.success(partnershipType ? 'Partnership type updated' : 'Partnership type created');
      qc.invalidateQueries({ queryKey: ['admin-partnership-types'] });
      onClose();
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{partnershipType ? 'Edit Partnership Type' : 'Add Partnership Type'}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>Name *</FormLabel>
                <FormControl><Input placeholder="e.g. Gold Partner, Silver Partner" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl><Textarea rows={3} placeholder="Optional description…" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="isActive" render={({ field }) => (
              <FormItem className="flex items-center gap-2">
                <FormControl>
                  <input type="checkbox" checked={field.value} onChange={field.onChange} className="h-4 w-4" />
                </FormControl>
                <FormLabel className="!mt-0 cursor-pointer">Active</FormLabel>
              </FormItem>
            )} />

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending && <Loader2 size={14} className="animate-spin" />}
                {partnershipType ? 'Save changes' : 'Create type'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
