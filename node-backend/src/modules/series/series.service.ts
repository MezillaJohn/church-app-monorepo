import { SermonSeries } from '../../database/models/sermon-series.model';
import { Sermon } from '../../database/models/sermon.model';
import { AppError } from '../../shared/middleware/error.middleware';
import { paginate, buildPaginationMeta } from '../../shared/utils/pagination';
import type { SeriesQueryInput } from './series.schema';

export const SeriesService = {
  async findAll(query: SeriesQueryInput) {
    const { skip, take, page, perPage } = paginate(query);

    const [data, total] = await Promise.all([
      SermonSeries.aggregate([
        { $match: { isActive: true } },
        {
          $lookup: {
            from: 'sermons',
            let: { sid: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [{ $eq: ['$seriesId', '$$sid'] }, { $eq: ['$isPublished', true] }],
                  },
                },
              },
              { $count: 'n' },
            ],
            as: 'sc',
          },
        },
        {
          $addFields: {
            sermonsCount: { $ifNull: [{ $first: '$sc.n' }, 0] },
            id: { $toString: '$_id' },
          },
        },
        { $project: { sc: 0, _id: 0, __v: 0 } },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: take },
      ]),
      SermonSeries.countDocuments({ isActive: true }),
    ]);

    return { data, meta: buildPaginationMeta(total, page, perPage) };
  },

  async findById(id: string) {
    const series = await SermonSeries.findOne({ _id: id, isActive: true });
    if (!series) throw new AppError('Series not found', 404);

    const sermons = await Sermon.find({ seriesId: id, isPublished: true })
      .populate({ path: 'categoryId', select: 'name slug' })
      .sort({ date: -1 });

    return { ...series.toJSON(), sermons };
  },
};
