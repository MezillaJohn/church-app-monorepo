import { Event } from '../../../database/models/event.model';
import { AppError } from '../../../shared/middleware/error.middleware';
import { paginate, buildPaginationMeta } from '../../../shared/utils/pagination';
import type { AdminEventQueryInput, CreateEventInput, UpdateEventInput } from './events.schema';

export const AdminEventsService = {
  async findAll(query: AdminEventQueryInput) {
    const { skip, take, page, perPage } = paginate(query);
    const filter: Record<string, unknown> = {};
    if (query.search) filter['title'] = { $regex: query.search, $options: 'i' };
    if (query.eventType) filter['eventType'] = query.eventType;
    if (query.isPublished !== undefined) filter['isPublished'] = query.isPublished;

    const [data, total] = await Promise.all([
      Event.find(filter).sort({ eventDate: -1 }).skip(skip).limit(take),
      Event.countDocuments(filter),
    ]);
    return { data, meta: buildPaginationMeta(total, page, perPage) };
  },

  async findById(id: string) {
    const event = await Event.findById(id);
    if (!event) throw new AppError('Event not found', 404);
    return event;
  },

  async create(input: CreateEventInput) {
    return Event.create(input);
  },

  async update(id: string, input: UpdateEventInput) {
    const event = await Event.findByIdAndUpdate(id, { $set: input }, { new: true, runValidators: true });
    if (!event) throw new AppError('Event not found', 404);
    return event;
  },

  async delete(id: string) {
    const event = await Event.findByIdAndDelete(id);
    if (!event) throw new AppError('Event not found', 404);
  },
};
