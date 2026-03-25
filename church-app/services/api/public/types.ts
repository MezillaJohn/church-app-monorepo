export interface SermonsResponse {
  success: boolean;
  message: string;
  data: Sermon[];
  links: PaginationLinks;
  meta: PaginationMeta;
}

export interface PaginationLinks {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
}

export interface PaginationMeta {
  current_page: number;
  from: number | null;
  last_page: number;
  path: string;
  per_page: number;
  to: number | null;
  total: number;
  links: Array<{
    url: string | null;
    label: string;
    page: number | null;
    active: boolean;
  }>;
}


export interface Sermon {
  id: number;
  type: "sermon";
  attributes: SermonAttributes;
  relationships: SermonRelationships;
  meta: Meta;
}

export interface SermonRelationships {
  category: Category | null;
  series: Series | null;
}


export interface Series {
  id: number;
  type: "series";
  attributes: {
    name: string;
    slug: string;
    description: string | null;
    preacher: string | null;
    image: string | null;
    is_active: boolean;
  };
  relationships: any[];
  meta: Meta;
}



export interface SermonAttributes {
  title: string;
  description: string;
  type: "video" | "audio";
  speaker: string;
  date: string; // ISO string, e.g. "2025-10-07"
  audio_file_url: string | null;
  youtube_video_id: string | null;
  youtube_video_url: string | null;
  embed_url: string | null;
  thumbnail_url: string | null;
  duration: number; // in seconds
  series: string | null;
  views: number;
  favorites_count: number;
  is_featured: boolean;
  is_published: boolean;
  is_favorited: boolean;
}

export interface Category {
  id: number;
  type: "category";
  attributes: CategoryAttributes;
  relationships: any[]; // empty in current response, can be replaced later
  meta: Meta;
}

export interface CategoryAttributes {
  name: string;
  slug: string;
  description: string;
  type: "sermon";
  is_active: boolean;
}

export interface Meta {
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

export interface SermonsQueryParams {
  type: string; // e.g. "video" | "audio"
  category_id?: number | string;
  series?: string;
  search?: string;
  sort?: "asc" | "desc";
  page: number;
}

export interface BookCategoryAttributes {
  name: string;
  slug: string;
  description: string;
  type: string;
  is_active: boolean;
}

export interface BookCategory {
  id: number;
  type: "category";
  attributes: BookCategoryAttributes;
  relationships: [];
  meta: {
    created_at: string;
    updated_at: string;
  };
}

export interface BookAttributes {
  title: string;
  author: string;
  description: string;
  price: string;
  cover_image: string;
  preview_pages: string;
  purchases_count: number;
  average_rating: string;
  is_featured: boolean;
  is_published: boolean;
}

export interface BookRelationships {
  category: BookCategory;
  purchases_count: number;
  ratings_count: number;
}

export interface BookMeta {
  created_at: string;
  updated_at: string;
}

export interface Book {
  id: number;
  type: "book";
  attributes: BookAttributes;
  relationships: BookRelationships;
  meta: BookMeta;
}

export interface BooksResponse {
  success: boolean;
  message: string;
  data: Book[];
  links: PaginationLinks;
  meta: PaginationMeta;
}

export interface ViewBookResponse {
  success: boolean;
  message: string;
  data: Book;
}

export interface EventResponse {
  success: true;
  message: "Events retrieved successfully";
  data: EventItem[];
}

export interface EventByIdResponse {
  success: true;
  message: "Events retrieved successfully";
  data: EventItem;
}

export interface EventItem {
  id: number;
  type: "event";
  attributes: EventAttributes;
  relationships: EventRelationships;
  meta: EventMeta;
}

export interface EventAttributes {
  title: string;
  description: string;
  event_date: string; // YYYY-MM-DD
  event_time: string; // HH:mm
  location: string | null;
  event_type: "service" | "prayer" | string;
  image_url: string | null;
  max_attendees: number | null;
  requires_rsvp: boolean;
  is_published: boolean;
  is_recurring: boolean;
  is_recurring_instance: boolean;
  recurrence_pattern: string | null;
  recurrence_interval: number;
  recurrence_end_date: string | null;
  recurrence_count: number | null;
  is_live: boolean;
  broadcast_url: string | null;
}

export interface EventRelationships {
  next_live_event?: NestedEvent | null;
}

export interface NestedEvent {
  id: number;
  type: "event";
  attributes: EventAttributes;
  relationships: any[] | Record<string, unknown>;
  meta: EventMeta;
}

export interface EventMeta {
  created_at: string;
  updated_at: string;
}

export interface ChurchCentreResponse {
  success: boolean;
  message: string;
  data: ChurchCentre[];
}

export interface ChurchCentre {
  id: number;
  type: "church_centre";
  attributes: ChurchCentreAttributes;
  meta: ChurchCentreMeta;
}

export interface ChurchCentreAttributes {
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  contact_phone: string;
  contact_email: string;
  is_active: boolean;
}

export interface ChurchCentreMeta {
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

export interface HeroSliderResponse {
  success: boolean;
  message: string;
  data: HeroSlider[];
}

export interface HeroSlider {
  id: number;
  type: "hero_slider";
  attributes: HeroSliderAttributes;
  relationships: any[]; // or define if needed later
  meta: HeroSliderMeta;
}

export interface HeroSliderAttributes {
  title: string;
  image_url: string;
  link_url: string | null;
  order: number;
}

export interface HeroSliderMeta {
  created_at: string;
  updated_at: string;
}

// Root response type
export interface SermonCategoryResponse {
  success: boolean;
  message: string;
  data: SermonCategory[];
}

// Each category object
export interface SermonCategory {
  id: number;
  type: "category";
  attributes: SermonCategoryAttributes;
  relationships: any[]; // If you later define relationships, replace this type
  meta: SermonCategoryMeta;
}

// Attributes inside each category
export interface SermonCategoryAttributes {
  name: string;
  slug: string;
  description: string;
  type: "sermon"; // From your data, always "sermon"
  is_active: boolean;
}

// Metadata timestamps
export interface SermonCategoryMeta {
  created_at: string;
  updated_at: string;
}
export interface SiteInfoResponse {
  success: boolean;
  message: string;
  data: SiteInfoData;
}

export interface SiteInfoData {
  id: number;
  type: string; // "site_info"
  attributes: SiteInfoAttributes;
}

export interface SiteInfoAttributes {
  social_links: SocialLinks;
  app_info: AppInfo;
}

export interface SocialLinks {
  facebook: string;
  twitter: string;
  instagram: string;
  linkedin: string;
  youtube: string;
}

export interface AppInfo {
  android: AppPlatform;
  ios: AppPlatform;
}

export interface AppPlatform {
  version: string;
  download_url: string;
}
