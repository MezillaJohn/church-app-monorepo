import { User } from '../../../database/models/user.model';
import { Sermon } from '../../../database/models/sermon.model';
import { Book } from '../../../database/models/book.model';
import { Event } from '../../../database/models/event.model';
import { Donation } from '../../../database/models/donation.model';
import { Partnership } from '../../../database/models/partnership.model';
import { Category } from '../../../database/models/category.model';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function buildLast12Months() {
  const months: { year: number; month: number; label: string }[] = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ year: d.getFullYear(), month: d.getMonth() + 1, label: MONTH_NAMES[d.getMonth()]! });
  }
  return months;
}

export const DashboardService = {
  async getStats() {
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
    twelveMonthsAgo.setDate(1);
    twelveMonthsAgo.setHours(0, 0, 0, 0);

    const [
      totalUsers,
      totalSermons,
      totalBooks,
      totalEvents,
      totalDonations,
      totalPartnerships,
      totalCategories,
      recentSermons,
      recentDonations,
      recentUsers,
      userGrowthRaw,
    ] = await Promise.all([
      User.countDocuments(),
      Sermon.countDocuments(),
      Book.countDocuments(),
      Event.countDocuments(),
      Donation.countDocuments(),
      Partnership.countDocuments(),
      Category.countDocuments(),
      Sermon.find().sort({ createdAt: -1 }).limit(5).select('title speaker type isPublished createdAt'),
      Donation.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('userId', 'name email')
        .populate('donationTypeId', 'name')
        .select('amount currency status paymentMethod createdAt'),
      User.find().sort({ createdAt: -1 }).limit(5).select('name email isAdmin emailVerifiedAt createdAt'),
      User.aggregate([
        { $match: { createdAt: { $gte: twelveMonthsAgo } } },
        { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, count: { $sum: 1 } } },
      ]),
    ]);

    // Build a full 12-month series, filling 0 for months with no signups
    const growthMap = new Map(
      (userGrowthRaw as { _id: { year: number; month: number }; count: number }[]).map(
        (d) => [`${d._id.year}-${d._id.month}`, d.count],
      ),
    );
    const userGrowth = buildLast12Months().map(({ year, month, label }) => ({
      month: label,
      users: growthMap.get(`${year}-${month}`) ?? 0,
    }));

    return {
      counts: {
        users: totalUsers,
        sermons: totalSermons,
        books: totalBooks,
        events: totalEvents,
        donations: totalDonations,
        partnerships: totalPartnerships,
        categories: totalCategories,
      },
      userGrowth,
      recentSermons,
      recentDonations,
      recentUsers,
    };
  },
};
