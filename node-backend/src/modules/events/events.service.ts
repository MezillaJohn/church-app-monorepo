import { Event, type IEvent } from '../../database/models/event.model';
import { EventRsvp } from '../../database/models/event-rsvp.model';
import { AppError } from '../../shared/middleware/error.middleware';
import { paginate, buildPaginationMeta } from '../../shared/utils/pagination';
import type { EventQueryInput } from './events.schema';

/** Attach a computed `isLive` boolean based on current time vs date range */
function withLiveStatus(doc: IEvent) {
  const now = new Date();
  const obj = doc.toJSON();
  obj.isLive = doc.eventDate <= now && doc.endDate >= now;
  return obj;
}

export const EventsService = {
  async findAll(query: EventQueryInput) {
    const { skip, take, page, perPage } = paginate(query);
    const now = new Date();

    const filter: Record<string, unknown> = { isPublished: true };
    if (query.eventType) filter['eventType'] = query.eventType;
    if (query.upcoming) filter['eventDate'] = { $gte: now };
    if (query.search) filter['title'] = { $regex: query.search, $options: 'i' };

    // Live = current time is between eventDate and endDate
    if (query.is_live) {
      filter['eventDate'] = { $lte: now };
      filter['endDate'] = { $gte: now };
    }

    const [docs, total] = await Promise.all([
      Event.find(filter)
        .sort({ eventDate: -1 })
        .skip(skip)
        .limit(take),
      Event.countDocuments(filter),
    ]);

    // Sort by proximity to now — closest events first
    docs.sort((a, b) => {
      const distA = Math.abs(a.eventDate.getTime() - now.getTime());
      const distB = Math.abs(b.eventDate.getTime() - now.getTime());
      return distA - distB;
    });

    return { data: docs.map(withLiveStatus), meta: buildPaginationMeta(total, page, perPage) };
  },

  async findById(id: string) {
    const event = await Event.findOne({ _id: id, isPublished: true });
    if (!event) throw new AppError('Event not found', 404);
    return withLiveStatus(event);
  },

  async getLatestLive() {
    const now = new Date();
    const event = await Event.findOne({
      isPublished: true,
      eventDate: { $lte: now },
      endDate: { $gte: now },
    }).sort({ eventDate: -1 });
    return event ? withLiveStatus(event) : null;
  },

  async rsvp(userId: string, eventId: string) {
    const event = await Event.findOne({ _id: eventId, isPublished: true });
    if (!event) throw new AppError('Event not found', 404);

    const existing = await EventRsvp.findOne({ userId, eventId });
    if (existing) throw new AppError("You have already RSVP'd to this event", 409);

    return EventRsvp.create({ userId, eventId });
  },

  async cancelRsvp(userId: string, eventId: string) {
    const result = await EventRsvp.deleteOne({ userId, eventId });
    if (result.deletedCount === 0) throw new AppError('RSVP not found', 404);
  },

  async myRsvps(userId: string) {
    const rsvps = await EventRsvp.find({ userId }).sort({ createdAt: -1 }).populate('eventId');
    return rsvps.map((r) => r.eventId).filter(Boolean);
  },
};
