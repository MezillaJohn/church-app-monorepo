// ─── Populated subdocuments (from Mongoose .populate()) ─────────────────────

export interface PopulatedCategory {
  _id: string;
  name: string;
  slug: string;
}

export interface PopulatedSeries {
  _id: string;
  name: string;
  slug: string;
}

// ─── Core sermon shape returned by the Node backend ─────────────────────────

export interface Sermon {
  _id: string;
  title: string;
  description?: string;
  type: "audio" | "video";
  speaker?: string;
  date: string;
  audioFileUrl?: string;
  youtubeVideoId?: string;
  youtubeVideoUrl?: string;
  thumbnailUrl?: string;
  duration?: number;
  categoryId?: PopulatedCategory | string;
  seriesId?: PopulatedSeries | string;
  views: number;
  favoritesCount: number;
  isFeatured: boolean;
  isPublished: boolean;
  isFavorited?: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Query params ───────────────────────────────────────────────────────────

export interface SermonQueryParams {
  type: "audio" | "video";
  search?: string;
  sort?: "asc" | "desc";
  category_id?: string;
  series?: string;
  page: number;
}

// ─── API response wrappers ──────────────────────────────────────────────────

export interface PaginationMeta {
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface SermonsResponse {
  success: boolean;
  message: string;
  data: Sermon[];
  meta: PaginationMeta;
}

export interface SermonResponse {
  success: boolean;
  message: string;
  data: Sermon;
}

export interface FavoritesResponse {
  success: boolean;
  message: string;
  data: Sermon[];
}

export interface FeaturedResponse {
  success: boolean;
  message: string;
  data: Sermon[];
}

export interface ToggleFavoriteResponse {
  success: boolean;
  data: { favorited: boolean };
}

// ─── Shared param shape used by sermon list cards ───────────────────────────

export interface SermonListParams {
  search: string;
  sort: "desc" | "asc";
  category_id: string;
}
