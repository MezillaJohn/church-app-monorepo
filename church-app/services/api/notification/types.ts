// =====================
// NOTIFICATION (Node backend format)
// =====================

export interface Notification {
  _id: string;
  id: string;
  type: 'sermon' | 'book' | 'event' | 'announcement';
  userId: string;
  title: string;
  body: string;
  resourceId?: string | null;
  readAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// =====================
// PAGINATION
// =====================

export interface PaginationMeta {
  total: number;
  page: number;
  perPage: number;
  lastPage: number;
  unreadCount: number;
}

export interface NotificationsResponse {
  success: boolean;
  message: string;
  data: Notification[];
  meta: PaginationMeta;
}
