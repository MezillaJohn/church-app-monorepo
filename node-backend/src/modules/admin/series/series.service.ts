import { SermonSeries } from '../../../database/models/sermon-series.model';
import { AppError } from '../../../shared/middleware/error.middleware';
import { paginate, buildPaginationMeta } from '../../../shared/utils/pagination';
import type { AdminSeriesQueryInput, CreateSeriesInput, UpdateSeriesInput } from './series.schema';

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export const AdminSeriesService = {
  async findAll(query: AdminSeriesQueryInput) {
    const { skip, take, page, perPage } = paginate(query);
    const filter: Record<string, unknown> = {};
    if (query.search) filter['name'] = { $regex: query.search, $options: 'i' };

    const [data, total] = await Promise.all([
      SermonSeries.find(filter).sort({ createdAt: -1 }).skip(skip).limit(take),
      SermonSeries.countDocuments(filter),
    ]);
    return { data, meta: buildPaginationMeta(total, page, perPage) };
  },

  async findById(id: string) {
    const series = await SermonSeries.findById(id);
    if (!series) throw new AppError('Series not found', 404);
    return series;
  },

  async create(input: CreateSeriesInput) {
    const slug = input.slug || slugify(input.name);
    return SermonSeries.create({ ...input, slug });
  },

  async update(id: string, input: UpdateSeriesInput) {
    const series = await SermonSeries.findByIdAndUpdate(id, { $set: input }, { new: true, runValidators: true });
    if (!series) throw new AppError('Series not found', 404);
    return series;
  },

  async delete(id: string) {
    const series = await SermonSeries.findByIdAndDelete(id);
    if (!series) throw new AppError('Series not found', 404);
  },
};
