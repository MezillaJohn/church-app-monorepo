// ─── Pagination ───────────────────────────────────────────────────────────────
export interface PaginationMeta {
  total: number;
  page: number;
  perPage: number;
  lastPage: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// ─── Auth ──────────────────────────────────────────────────────────────────────
export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  gender?: 'male' | 'female' | 'other';
  country?: string;
  churchMember: boolean;
  isAdmin: boolean;
  emailVerifiedAt?: string | null;
  churchCentreId?: ChurchCentre | string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

// ─── Sermon ───────────────────────────────────────────────────────────────────
export interface Category {
  _id: string;
  name: string;
  slug: string;
  type: 'sermon' | 'book' | 'giving';
  description?: string;
  isActive: boolean;
  createdAt: string;
}

export interface SermonSeries {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  preacher?: string;
  imageUrl?: string;
  createdAt: string;
}

export interface Sermon {
  _id: string;
  title: string;
  description?: string;
  type: 'audio' | 'video';
  speaker?: string;
  date: string;
  audioFileUrl?: string;
  youtubeVideoId?: string;
  youtubeVideoUrl?: string;
  thumbnailUrl?: string;
  duration?: number;
  categoryId?: Category | string;
  seriesId?: SermonSeries | string;
  isFeatured: boolean;
  isPublished: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Book ─────────────────────────────────────────────────────────────────────
export interface Book {
  _id: string;
  title: string;
  author: string;
  description?: string;
  coverImage?: string;
  fileUrl?: string;
  price: number;
  currency: string;
  isFree: boolean;
  isPublished: boolean;
  categoryId?: Category | string;
  purchasesCount: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Event ────────────────────────────────────────────────────────────────────
export interface Event {
  _id: string;
  title: string;
  description?: string;
  eventType: string;
  eventDate: string;  // start datetime ISO string
  endDate: string;    // end datetime ISO string
  location?: string;
  imageUrl?: string;
  broadcastUrl?: string;
  isRecurring: boolean;
  recurrencePattern?: string;
  isPublished: boolean;
  isLive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Donation ─────────────────────────────────────────────────────────────────
export interface DonationType {
  _id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Donation {
  _id: string;
  userId: User | string;
  donationTypeId?: DonationType | string;
  amount: number;
  currency: string;
  paymentMethod: 'paystack' | 'manual';
  transactionReference?: string;
  status: 'pending' | 'completed' | 'failed';
  note?: string;
  isAnonymous: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Partnership ──────────────────────────────────────────────────────────────
export interface PartnershipType {
  _id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Partnership {
  _id: string;
  fullname: string;
  phoneNo: string;
  email: string;
  partnershipTypeId: PartnershipType | string;
  interval: 'daily' | 'weekly' | 'monthly' | 'yearly';
  amount: number;
  currency: string;
  userId?: User | string;
  createdAt: string;
  updatedAt: string;
}

// ─── Church Centre ────────────────────────────────────────────────────────────
export interface ChurchCentre {
  _id: string;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  phone?: string;
  email?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Bank Account ─────────────────────────────────────────────────────────────
export interface BankAccount {
  _id: string;
  title: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  sortCode?: string;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Hero Slider ──────────────────────────────────────────────────────────────
export interface HeroSlider {
  _id: string;
  title?: string;
  subtitle?: string;
  imageUrl: string;
  linkUrl?: string;
  isFeatured: boolean;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Setting ──────────────────────────────────────────────────────────────────
export interface Setting {
  _id: string;
  key: string;
  value?: string;
  type: 'string' | 'integer' | 'boolean';
  group: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Notification ─────────────────────────────────────────────────────────────
export interface Notification {
  _id: string;
  type: string;
  userId: User | string;
  data: Record<string, unknown>;
  readAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export interface DashboardStats {
  counts: {
    users: number;
    sermons: number;
    books: number;
    events: number;
    donations: number;
    partnerships: number;
    categories: number;
  };
  userGrowth: { month: string; users: number }[];
  recentSermons: Sermon[];
  recentDonations: Donation[];
  recentUsers: User[];
}

// ─── Support Ticket ──────────────────────────────────────────────────────
export interface SupportTicket {
  _id: string;
  userId: User | string;
  subject: string;
  message: string;
  status: 'open' | 'in-progress' | 'resolved';
  adminResponse?: string;
  respondedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

// ─── Upload ───────────────────────────────────────────────────────────────────
export interface UploadResult {
  url: string;
  publicId: string;
  resourceType: string;
}
