import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { eventsApi } from '@/api/events';
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
import type { Event } from '@/types';

const EVENT_TYPES = ['service', 'conference', 'prayer', 'youth', 'children'] as const;

const schema = z
  .object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    eventType: z.enum(EVENT_TYPES, { errorMap: () => ({ message: 'Select a valid event type' }) }),
    startDate: z.string().min(1, 'Start date is required'),
    startTime: z.string().min(1, 'Start time is required'),
    endDate: z.string().min(1, 'End date is required'),
    endTime: z.string().min(1, 'End time is required'),
    location: z.string().optional(),
    imageUrl: z.string().optional(),
    broadcastUrl: z.string().optional(),
    isPublished: z.boolean().default(true),
  })
  .superRefine((data, ctx) => {
    if (data.startDate && data.startTime && data.endDate && data.endTime) {
      const start = new Date(`${data.startDate}T${data.startTime}`);
      const end = new Date(`${data.endDate}T${data.endTime}`);
      if (end <= start) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'End must be after start',
          path: ['endDate'],
        });
      }
    }
  });

type FormData = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
  event: Event | null;
}

function splitDatetime(iso: string): { date: string; time: string } {
  const d = new Date(iso);
  return {
    date: d.toISOString().slice(0, 10),
    time: d.toISOString().slice(11, 16),
  };
}

export function EventFormDialog({ open, onClose, event }: Props) {
  const qc = useQueryClient();
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      eventType: 'service',
      isPublished: true,
    },
  });

  useEffect(() => {
    if (event) {
      const start = splitDatetime(event.eventDate);
      const end = splitDatetime(event.endDate);
      form.reset({
        title: event.title,
        description: event.description ?? '',
        eventType: event.eventType as (typeof EVENT_TYPES)[number],
        startDate: start.date,
        startTime: start.time,
        endDate: end.date,
        endTime: end.time,
        location: event.location ?? '',
        imageUrl: event.imageUrl ?? '',
        broadcastUrl: event.broadcastUrl ?? '',
        isPublished: event.isPublished,
      });
    } else {
      form.reset({ eventType: 'service', isPublished: true });
    }
  }, [event, form]);

  const mutation = useMutation({
    mutationFn: ({ startDate, startTime, endDate, endTime, ...rest }: FormData) =>
      event
        ? eventsApi.update(event._id, {
            ...rest,
            eventDate: `${startDate}T${startTime}`,
            endDate: `${endDate}T${endTime}`,
          })
        : eventsApi.create({
            ...rest,
            eventDate: `${startDate}T${startTime}`,
            endDate: `${endDate}T${endTime}`,
          }),
    onSuccess: () => {
      toast.success(event ? 'Event updated' : 'Event created');
      qc.invalidateQueries({ queryKey: ['admin-events'] });
      onClose();
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{event ? 'Edit Event' : 'Add Event'}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit((d) => mutation.mutate(d))} className="space-y-4">

            {/* Title */}
            <FormField control={form.control} name="title" render={({ field }) => (
              <FormItem>
                <FormLabel>Title *</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/* Type + Location */}
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="eventType" render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Type *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      {EVENT_TYPES.map((t) => (
                        <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="location" render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl><Input placeholder="e.g. Main Auditorium" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            {/* Start Date + Start Time */}
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="startDate" render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date *</FormLabel>
                  <FormControl><Input type="date" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="startTime" render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Time *</FormLabel>
                  <FormControl><Input type="time" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            {/* End Date + End Time */}
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="endDate" render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date *</FormLabel>
                  <FormControl><Input type="date" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="endTime" render={({ field }) => (
                <FormItem>
                  <FormLabel>End Time *</FormLabel>
                  <FormControl><Input type="time" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            {/* Description */}
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl><Textarea rows={3} {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/* Image */}
            <FormField control={form.control} name="imageUrl" render={({ field }) => (
              <FormItem>
                <FormLabel>Event Image</FormLabel>
                <FormControl>
                  <FileUpload
                    value={field.value}
                    onChange={field.onChange}
                    accept="image/*"
                    folder="church-app/events"
                    label="Upload image"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/* Broadcast URL */}
            <FormField control={form.control} name="broadcastUrl" render={({ field }) => (
              <FormItem>
                <FormLabel>Broadcast URL</FormLabel>
                <FormControl><Input placeholder="https://youtube.com/live/…" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/* Toggles */}
            <div className="flex gap-6">
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
                {event ? 'Save changes' : 'Create event'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
