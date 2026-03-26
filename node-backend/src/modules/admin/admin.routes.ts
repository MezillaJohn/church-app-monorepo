import { Router } from 'express';
import { authenticate, requireAdmin } from '../../shared/middleware/auth.middleware';

// ─── Admin sub-routers ────────────────────────────────────────────────────────
import dashboardRoutes from './dashboard/dashboard.routes';
import adminSermonsRoutes from './sermons/sermons.routes';
import adminBooksRoutes from './books/books.routes';
import adminEventsRoutes from './events/events.routes';
import adminSeriesRoutes from './series/series.routes';
import adminCategoriesRoutes from './categories/categories.routes';
import adminHeroSlidersRoutes from './hero-sliders/hero-sliders.routes';
import adminChurchCentresRoutes from './church-centres/church-centres.routes';
import adminBankAccountsRoutes from './bank-accounts/bank-accounts.routes';
import adminDonationTypesRoutes from './donation-types/donation-types.routes';
import adminPartnershipTypesRoutes from './partnership-types/partnership-types.routes';
import adminUsersRoutes from './users/users.routes';
import adminDonationsRoutes from './donations/donations.routes';
import adminPartnershipsRoutes from './partnerships/partnerships.routes';
import adminSettingsRoutes from './settings/settings.routes';
import adminNotificationsRoutes from './notifications/notifications.routes';
import adminUploadsRoutes from './uploads/uploads.routes';
import adminSupportTicketsRoutes from './support-tickets/support-tickets.routes';

const router = Router();

// All admin routes require authentication + admin role
router.use(authenticate, requireAdmin);

router.use('/dashboard', dashboardRoutes);
router.use('/sermons', adminSermonsRoutes);
router.use('/books', adminBooksRoutes);
router.use('/events', adminEventsRoutes);
router.use('/series', adminSeriesRoutes);
router.use('/categories', adminCategoriesRoutes);
router.use('/hero-sliders', adminHeroSlidersRoutes);
router.use('/church-centres', adminChurchCentresRoutes);
router.use('/bank-accounts', adminBankAccountsRoutes);
router.use('/donation-types', adminDonationTypesRoutes);
router.use('/partnership-types', adminPartnershipTypesRoutes);
router.use('/users', adminUsersRoutes);
router.use('/donations', adminDonationsRoutes);
router.use('/partnerships', adminPartnershipsRoutes);
router.use('/settings', adminSettingsRoutes);
router.use('/notifications', adminNotificationsRoutes);
router.use('/uploads', adminUploadsRoutes);
router.use('/support-tickets', adminSupportTicketsRoutes);

export default router;
