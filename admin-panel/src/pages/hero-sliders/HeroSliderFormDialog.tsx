import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { heroSlidersApi } from '@/api/hero-sliders';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FileUpload } from '@/components/shared/FileUpload';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { getErrorMessage } from '@/api/client';
import type { HeroSlider } from '@/types';

const schema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  imageUrl: z.string().min(1, 'Image is required'),
  linkUrl: z.string().optional(),
  order: z.coerce.number().int().min(0).default(0),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

type FormData = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
  slider: HeroSlider | null;
}

export function HeroSliderFormDialog({ open, onClose, slider }: Props) {
  const qc = useQueryClient();
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { order: 0, isFeatured: false, isActive: true, imageUrl: '' },
  });

  useEffect(() => {
    if (slider) {
      form.reset({
        title: slider.title ?? '',
        subtitle: slider.subtitle ?? '',
        imageUrl: slider.imageUrl,
        linkUrl: slider.linkUrl ?? '',
        order: slider.order,
        isFeatured: slider.isFeatured,
        isActive: slider.isActive,
      });
    } else {
      form.reset({ order: 0, isFeatured: false, isActive: true, imageUrl: '' });
    }
  }, [slider, form]);

  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      slider ? heroSlidersApi.update(slider._id, data) : heroSlidersApi.create(data),
    onSuccess: () => {
      toast.success(slider ? 'Slider updated' : 'Slider created');
      qc.invalidateQueries({ queryKey: ['admin-hero-sliders'] });
      onClose();
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{slider ? 'Edit Slider' : 'Add Slider'}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
            <FormField control={form.control} name="title" render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl><Input placeholder="e.g. Welcome to Our Church" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="subtitle" render={({ field }) => (
              <FormItem>
                <FormLabel>Subtitle</FormLabel>
                <FormControl><Input placeholder="e.g. Join us every Sunday" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="imageUrl" render={({ field }) => (
              <FormItem>
                <FormLabel>Image *</FormLabel>
                <FormControl>
                  <FileUpload
                    value={field.value}
                    onChange={field.onChange}
                    accept="image/*"
                    folder="church-app/sliders"
                    label="Upload image"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="linkUrl" render={({ field }) => (
              <FormItem>
                <FormLabel>Link URL</FormLabel>
                <FormControl><Input placeholder="https://…" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="order" render={({ field }) => (
              <FormItem>
                <FormLabel>Display Order</FormLabel>
                <FormControl><Input type="number" min={0} {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <div className="flex gap-6">
              <FormField control={form.control} name="isFeatured" render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <input type="checkbox" checked={field.value} onChange={field.onChange} className="h-4 w-4" />
                  </FormControl>
                  <FormLabel className="!mt-0 cursor-pointer">Featured</FormLabel>
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
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending && <Loader2 size={14} className="animate-spin" />}
                {slider ? 'Save changes' : 'Create slider'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
