import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sermonsApi } from '@/api/sermons';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileUpload } from '@/components/shared/FileUpload';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { getErrorMessage } from '@/api/client';
import type { Sermon, Category, SermonSeries } from '@/types';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  type: z.enum(['audio', 'video']),
  speaker: z.string().optional(),
  date: z.string().min(1, 'Date is required'),
  audioFileUrl: z.string().optional(),
  youtubeVideoId: z.string().optional(),
  youtubeVideoUrl: z.string().optional(),
  thumbnailUrl: z.string().optional(),
  categoryId: z.string().optional(),
  seriesId: z.string().optional(),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(true),
});

type FormData = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
  sermon: Sermon | null;
  categories: Category[];
  seriesList: SermonSeries[];
}

export function SermonFormDialog({ open, onClose, sermon, categories, seriesList }: Props) {
  const qc = useQueryClient();
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { type: 'audio', isFeatured: false, isPublished: true },
  });

  const type = form.watch('type');
  const categoryId = form.watch('categoryId');
  const seriesId = form.watch('seriesId');

  // Tracks whether the user has manually set/changed the thumbnail.
  // When true, series selection won't override it.
  const thumbnailManuallySet = useRef(false);

  useEffect(() => {
    if (sermon) {
      // Existing sermon with its own thumbnail → treat as manually set so we don't clobber it
      thumbnailManuallySet.current = !!sermon.thumbnailUrl;
      form.reset({
        title: sermon.title,
        description: sermon.description ?? '',
        type: sermon.type,
        speaker: sermon.speaker ?? '',
        date: sermon.date.slice(0, 10),
        audioFileUrl: sermon.audioFileUrl ?? '',
        youtubeVideoId: sermon.youtubeVideoId ?? '',
        youtubeVideoUrl: sermon.youtubeVideoUrl ?? '',
        thumbnailUrl: sermon.thumbnailUrl ?? '',
        categoryId: typeof sermon.categoryId === 'object' ? sermon.categoryId._id : (sermon.categoryId ?? ''),
        seriesId: typeof sermon.seriesId === 'object' ? sermon.seriesId._id : (sermon.seriesId ?? ''),
        isFeatured: sermon.isFeatured,
        isPublished: sermon.isPublished,
      });
    } else {
      thumbnailManuallySet.current = false;
      form.reset({ type: 'audio', isFeatured: false, isPublished: true });
    }
  }, [sermon, form]);

  // Auto-fill thumbnail from selected series (unless user has set their own)
  useEffect(() => {
    if (!seriesId) return;
    if (thumbnailManuallySet.current) return;
    const series = seriesList.find((s) => s._id === seriesId);
    if (series?.imageUrl) {
      form.setValue('thumbnailUrl', series.imageUrl, { shouldDirty: true });
    }
  }, [seriesId, seriesList, form]);

  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      sermon ? sermonsApi.update(sermon._id, data) : sermonsApi.create(data),
    onSuccess: () => {
      toast.success(sermon ? 'Sermon updated' : 'Sermon created');
      qc.invalidateQueries({ queryKey: ['admin-sermons'] });
      onClose();
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{sermon ? 'Edit Sermon' : 'Add Sermon'}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Title *</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="type" render={({ field }) => (
                <FormItem>
                  <FormLabel>Type *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="audio">Audio</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="speaker" render={({ field }) => (
                <FormItem>
                  <FormLabel>Speaker</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="date" render={({ field }) => (
                <FormItem>
                  <FormLabel>Date *</FormLabel>
                  <FormControl><Input type="date" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="categoryId" render={() => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    value={categoryId ?? ''}
                    onValueChange={(v) => form.setValue('categoryId', v, { shouldDirty: true })}
                  >
                    <FormControl><SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="seriesId" render={() => (
                <FormItem>
                  <FormLabel>Series</FormLabel>
                  <Select
                    value={seriesId ?? ''}
                    onValueChange={(v) => form.setValue('seriesId', v, { shouldDirty: true })}
                  >
                    <FormControl><SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {seriesList.map((s) => (
                        <SelectItem key={s._id} value={s._id}>{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl><Textarea rows={3} {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {type === 'audio' && (
              <FormField control={form.control} name="audioFileUrl" render={({ field }) => (
                <FormItem>
                  <FormLabel>Audio File</FormLabel>
                  <FormControl>
                    <FileUpload
                      value={field.value}
                      onChange={field.onChange}
                      accept="audio/*"
                      folder="church-app/audio"
                      label="Upload audio"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            )}

            {type === 'video' && (
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="youtubeVideoId" render={({ field }) => (
                  <FormItem>
                    <FormLabel>YouTube Video ID</FormLabel>
                    <FormControl><Input placeholder="dQw4w9WgXcQ" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="youtubeVideoUrl" render={({ field }) => (
                  <FormItem>
                    <FormLabel>YouTube URL</FormLabel>
                    <FormControl><Input placeholder="https://youtube.com/watch?v=…" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            )}

            <FormField control={form.control} name="thumbnailUrl" render={({ field }) => (
              <FormItem>
                <FormLabel>Thumbnail</FormLabel>
                <FormControl>
                  <FileUpload
                    value={field.value}
                    onChange={(url) => {
                      thumbnailManuallySet.current = true;
                      field.onChange(url);
                    }}
                    accept="image/*"
                    folder="church-app/images"
                    label="Upload thumbnail"
                  />
                </FormControl>
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
              <FormField control={form.control} name="isPublished" render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <input type="checkbox" checked={field.value} onChange={field.onChange} className="h-4 w-4" />
                  </FormControl>
                  <FormLabel className="!mt-0 cursor-pointer">Published</FormLabel>
                </FormItem>
              )} />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending && <Loader2 size={14} className="animate-spin" />}
                {sermon ? 'Save changes' : 'Create sermon'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
