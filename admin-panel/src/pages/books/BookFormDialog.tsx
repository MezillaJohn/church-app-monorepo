import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { booksApi } from '@/api/books';
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
import type { Book, Category } from '@/types';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  description: z.string().optional(),
  price: z.coerce.number().min(0, 'Price must be 0 or more').default(0),
  isFree: z.boolean().default(false),
  categoryId: z.string().optional(),
  coverImage: z.string().optional(),
  fileUrl: z.string().optional(),
  isPublished: z.boolean().default(true),
});

type FormData = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
  book: Book | null;
  categories: Category[];
}

export function BookFormDialog({ open, onClose, book, categories }: Props) {
  const qc = useQueryClient();
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { price: 0, isFree: false, isPublished: true },
  });

  const isFree = form.watch('isFree');
  const bookCategoryId = form.watch('categoryId');

  useEffect(() => {
    if (book) {
      form.reset({
        title: book.title,
        author: book.author,
        description: book.description ?? '',
        price: book.price,
        isFree: book.isFree,
        categoryId: typeof book.categoryId === 'object' ? book.categoryId._id : (book.categoryId ?? ''),
        coverImage: book.coverImage ?? '',
        fileUrl: book.fileUrl ?? '',
        isPublished: book.isPublished,
      });
    } else {
      form.reset({ price: 0, isFree: false, isPublished: true });
    }
  }, [book, form]);

  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      book ? booksApi.update(book._id, data) : booksApi.create(data),
    onSuccess: () => {
      toast.success(book ? 'Book updated' : 'Book created');
      qc.invalidateQueries({ queryKey: ['admin-books'] });
      onClose();
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{book ? 'Edit Book' : 'Add Book'}</DialogTitle>
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

              <FormField control={form.control} name="author" render={({ field }) => (
                <FormItem>
                  <FormLabel>Author *</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="categoryId" render={() => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    value={bookCategoryId ?? ''}
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

              <FormField control={form.control} name="price" render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} step={0.01} disabled={isFree} {...field} />
                  </FormControl>
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

            <FormField control={form.control} name="coverImage" render={({ field }) => (
              <FormItem>
                <FormLabel>Cover Image</FormLabel>
                <FormControl>
                  <FileUpload
                    value={field.value}
                    onChange={field.onChange}
                    accept="image/*"
                    folder="church-app/books/covers"
                    label="Upload cover image"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="fileUrl" render={({ field }) => (
              <FormItem>
                <FormLabel>Book File (PDF)</FormLabel>
                <FormControl>
                  <FileUpload
                    value={field.value}
                    onChange={field.onChange}
                    accept=".pdf,application/pdf"
                    folder="church-app/books/files"
                    label="Upload PDF"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <div className="flex gap-6">
              <FormField control={form.control} name="isFree" render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={(e) => {
                        field.onChange(e);
                        if (e.target.checked) form.setValue('price', 0);
                      }}
                      className="h-4 w-4"
                    />
                  </FormControl>
                  <FormLabel className="!mt-0 cursor-pointer">Free</FormLabel>
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
                {book ? 'Save changes' : 'Create book'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
