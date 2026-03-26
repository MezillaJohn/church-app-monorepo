import { Sermon } from '../../database/models/sermon.model';
import { Favorite } from '../../database/models/favorite.model';
import { WatchLater } from '../../database/models/watch-later.model';
import { SermonProgress } from '../../database/models/sermon-progress.model';
import { AppError } from '../../shared/middleware/error.middleware';
import { paginate, buildPaginationMeta } from '../../shared/utils/pagination';
import type { SermonQueryInput, UpdateProgressInput } from './sermons.schema';

const sermonPopulate = [
  { path: 'categoryId', select: 'name slug' },
  { path: 'seriesId', select: 'name slug' },
];

/** Attach `isFavorited` to each sermon based on the user's favorites */
async function attachFavoriteStatus(sermons: any[], userId?: string) {
  if (!userId || sermons.length === 0) return sermons;

  const sermonIds = sermons.map((s) => s._id);
  const favs = await Favorite.find({ userId, sermonId: { $in: sermonIds } }).select('sermonId').lean();
  const favSet = new Set(favs.map((f) => String(f.sermonId)));

  return sermons.map((s) => {
    const obj = s.toJSON ? s.toJSON() : { ...s };
    obj.isFavorited = favSet.has(String(obj._id));
    return obj;
  });
}

export const SermonsService = {
  async findAll(query: SermonQueryInput, userId?: string) {
    const { skip, take, page, perPage } = paginate(query);

    const filter: Record<string, unknown> = { isPublished: true };
    if (query.categoryId) filter['categoryId'] = query.categoryId;
    if (query.category_id) filter['categoryId'] = query.category_id;
    if (query.seriesId) filter['seriesId'] = query.seriesId;
    if (query.type) filter['type'] = query.type;
    if (query.speaker) filter['speaker'] = { $regex: query.speaker, $options: 'i' };
    if (query.search) {
      const re = new RegExp(query.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filter['$or'] = [{ title: re }, { speaker: re }];
    }

    const [rawData, total] = await Promise.all([
      Sermon.find(filter).populate(sermonPopulate).sort({ date: -1 }).skip(skip).limit(take),
      Sermon.countDocuments(filter),
    ]);

    const data = await attachFavoriteStatus(rawData, userId);
    return { data, meta: buildPaginationMeta(total, page, perPage) };
  },

  async findById(id: string, userId?: string) {
    const sermon = await Sermon.findOne({ _id: id, isPublished: true }).populate(sermonPopulate);
    if (!sermon) throw new AppError('Sermon not found', 404);

    await Sermon.updateOne({ _id: id }, { $inc: { views: 1 } });

    const [enriched] = await attachFavoriteStatus([sermon], userId);
    return enriched;
  },

  async getFeatured(type?: string, userId?: string) {
    const filter: Record<string, any> = { isFeatured: true, isPublished: true };
    if (type === 'audio' || type === 'video') {
      filter['type'] = type;
    }
    const rawData = await Sermon.find(filter)
      .populate(sermonPopulate)
      .sort({ date: -1 })
      .limit(10);

    return attachFavoriteStatus(rawData, userId);
  },

  async toggleFavorite(userId: string, sermonId: string) {
    const sermon = await Sermon.findOne({ _id: sermonId, isPublished: true });
    if (!sermon) throw new AppError('Sermon not found', 404);

    const existing = await Favorite.findOne({ userId, sermonId });

    if (existing) {
      await Promise.all([
        Favorite.deleteOne({ _id: existing._id }),
        Sermon.updateOne({ _id: sermonId }, { $inc: { favoritesCount: -1 } }),
      ]);
      return { favorited: false };
    }

    await Promise.all([
      Favorite.create({ userId, sermonId }),
      Sermon.updateOne({ _id: sermonId }, { $inc: { favoritesCount: 1 } }),
    ]);
    return { favorited: true };
  },

  async getFavorites(userId: string) {
    const rows = await Favorite.find({ userId })
      .sort({ createdAt: -1 })
      .populate({ path: 'sermonId', populate: sermonPopulate });

    return rows.map((r) => r.sermonId).filter(Boolean);
  },

  async toggleWatchLater(userId: string, sermonId: string) {
    const sermon = await Sermon.findOne({ _id: sermonId, isPublished: true });
    if (!sermon) throw new AppError('Sermon not found', 404);

    const existing = await WatchLater.findOne({ userId, sermonId });

    if (existing) {
      await WatchLater.deleteOne({ _id: existing._id });
      return { added: false };
    }

    await WatchLater.create({ userId, sermonId });
    return { added: true };
  },

  async getWatchLater(userId: string) {
    const rows = await WatchLater.find({ userId })
      .sort({ createdAt: -1 })
      .populate({ path: 'sermonId', populate: sermonPopulate });

    return rows.map((r) => r.sermonId).filter(Boolean);
  },

  async updateProgress(userId: string, sermonId: string, input: UpdateProgressInput) {
    const sermon = await Sermon.findOne({ _id: sermonId, isPublished: true });
    if (!sermon) throw new AppError('Sermon not found', 404);

    return SermonProgress.findOneAndUpdate(
      { userId, sermonId },
      {
        $set: {
          progressSeconds: input.progressSeconds,
          ...(input.completed !== undefined && { completed: input.completed }),
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
  },

  async getProgress(userId: string, sermonId: string) {
    return SermonProgress.findOne({ userId, sermonId });
  },
};
