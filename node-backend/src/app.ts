import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import { env } from './config/env';
import { logger } from './shared/utils/logger';
import { errorHandler, notFoundHandler } from './shared/middleware/error.middleware';

// ─── Route imports ────────────────────────────────────────────────────────────
import authRoutes from './modules/auth/auth.routes';
import sermonRoutes from './modules/sermons/sermons.routes';
import bookRoutes from './modules/books/books.routes';
import eventRoutes from './modules/events/events.routes';
import donationRoutes from './modules/donations/donations.routes';
import partnershipRoutes from './modules/partnerships/partnerships.routes';
import categoryRoutes from './modules/categories/categories.routes';
import notificationRoutes from './modules/notifications/notifications.routes';
import heroSliderRoutes from './modules/hero-sliders/hero-sliders.routes';
import churchCentreRoutes from './modules/church-centres/church-centres.routes';
import seriesRoutes from './modules/series/series.routes';
import pushTokenRoutes from './modules/push-tokens/push-tokens.routes';
import paymentRoutes from './modules/payments/payments.routes';
import siteInfoRoutes from './modules/site-info/site-info.routes';
import adminRoutes from './modules/admin/admin.routes';
import supportTicketRoutes from './modules/support-tickets/support-tickets.routes';

const app = express();

// ─── Security ─────────────────────────────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin:
      env.NODE_ENV === 'production'
        ? (process.env['ALLOWED_ORIGINS'] ?? '').split(',').filter(Boolean)
        : '*',
    credentials: true,
  }),
);

// ─── Rate limiting ────────────────────────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: env.NODE_ENV === 'development' ? 1000 : 20,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => env.NODE_ENV === 'development',
  message: { success: false, message: 'Too many auth attempts, please try again later.' },
});

app.use('/api', globalLimiter);

// ─── Parsing ──────────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── Request logging ──────────────────────────────────────────────────────────
app.use(
  morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev', {
    stream: { write: (msg) => logger.http(msg.trim()) },
  }),
);

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', environment: env.NODE_ENV, timestamp: new Date().toISOString() });
});

// ─── API v1 routes ────────────────────────────────────────────────────────────
const v1 = '/api/v1';

app.use(`${v1}/auth`, authLimiter, authRoutes);
app.use(`${v1}/sermons`, sermonRoutes);
app.use(`${v1}/books`, bookRoutes);
app.use(`${v1}/events`, eventRoutes);
app.use(`${v1}/giving`, donationRoutes);
app.use(`${v1}/partnerships`, partnershipRoutes);
app.use(`${v1}/categories`, categoryRoutes);
app.use(`${v1}/notifications`, notificationRoutes);
app.use(`${v1}/hero-sliders`, heroSliderRoutes);
app.use(`${v1}/church-centres`, churchCentreRoutes);
app.use(`${v1}/series`, seriesRoutes);
app.use(`${v1}/push-tokens`, pushTokenRoutes);
app.use(`${v1}/payments`, paymentRoutes);
app.use(`${v1}/site-info`, siteInfoRoutes);
app.use(`${v1}/support-tickets`, supportTicketRoutes);
app.use(`${v1}/admin`, adminRoutes);

// ─── Error handling ───────────────────────────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
