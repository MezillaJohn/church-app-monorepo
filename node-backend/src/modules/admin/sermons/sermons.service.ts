import { Sermon } from '../../../database/models/sermon.model';
import { AppError } from '../../../shared/middleware/error.middleware';
import { paginate, buildPaginationMeta } from '../../../shared/utils/pagination';
import type { AdminSermonQueryInput, CreateSermonInput, UpdateSermonInput } from './sermons.schema';

const populate = [
  { path: 'categoryId', select: 'name slug' },
  { path: 'seriesId', select: 'name slug' },
];

export const AdminSermonsService = {
  async findAll(query: AdminSermonQueryInput) {
    const { skip, take, page, perPage } = paginate(query);
    const filter: Record<string, unknown> = {};
    if (query.search) filter['$or'] = [
      { title: { $regex: query.search, $options: 'i' } },
      { speaker: { $regex: query.search, $options: 'i' } },
    ];
    if (query.type) filter['type'] = query.type;
    if (query.categoryId) filter['categoryId'] = query.categoryId;
    if (query.seriesId) filter['seriesId'] = query.seriesId;
    if (query.isPublished !== undefined) filter['isPublished'] = query.isPublished;

    const [data, total] = await Promise.all([
      Sermon.find(filter).populate(populate).sort({ createdAt: -1 }).skip(skip).limit(take),
      Sermon.countDocuments(filter),
    ]);
    return { data, meta: buildPaginationMeta(total, page, perPage) };
  },

  async findById(id: string) {
    const sermon = await Sermon.findById(id).populate(populate);
    if (!sermon) throw new AppError('Sermon not found', 404);
    return sermon;
  },

  async create(input: CreateSermonInput) {
    return Sermon.create(input);
  },

  async update(id: string, input: UpdateSermonInput) {
    const sermon = await Sermon.findByIdAndUpdate(id, { $set: input }, { new: true, runValidators: true }).populate(populate);
    if (!sermon) throw new AppError('Sermon not found', 404);
    return sermon;
  },

  async delete(id: string) {
    const sermon = await Sermon.findByIdAndDelete(id);
    if (!sermon) throw new AppError('Sermon not found', 404);
  },

  async togglePublish(id: string) {
    const sermon = await Sermon.findById(id);
    if (!sermon) throw new AppError('Sermon not found', 404);
    sermon.isPublished = !sermon.isPublished;
    await sermon.save();
    return sermon;
  },
};
