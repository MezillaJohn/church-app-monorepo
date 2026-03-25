// =====================
// API RESPONSE
// =====================

export interface PaginatedResponse<T> {
    data: T[];
    links: PaginationLinks;
    meta: PaginationMeta;
}

export interface PaginationLinks {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
}

export interface PaginationMeta {
    current_page: number;
    from: number;
    last_page: number;
    path: string;
    per_page: number;
    to: number;
    total: number;
    links: PaginationMetaLink[];
}

export interface PaginationMetaLink {
    url: string | null;
    label: string;
    page: number | null;
    active: boolean;
}

// =====================
// NOTIFICATIONS
// =====================

export type Notification =
    | SermonNotification
    | EventNotification
    | BookNotification
    | AnnouncementNotification;

export interface BaseNotification {
    id: number;
    type: string;
    event_type: "audio" | "video" | "event" | "book" | "announcement";
    event_id: number;
    data: NotificationData;
    event: { title: string }
    read_status: boolean;
    read_at: string | null;
    created_at: string;
    created_at_human: string;
}

// ---------------------
// Notification payload
// ---------------------

export interface NotificationData {
    message: string;
    action_url: string;
}

// =====================
// SERMON NOTIFICATIONS
// =====================

export interface SermonNotification extends BaseNotification {
    type: "App\\Notifications\\NewSermonNotification";
    event_type: "audio" | "video";
    event: Sermon;
}

// =====================
// EVENT NOTIFICATIONS
// =====================

export interface EventNotification extends BaseNotification {
    type: "App\\Notifications\\EventNotification";
    event_type: "event";
    event: ChurchEvent;
}

// =====================
// BOOK NOTIFICATIONS
// =====================

export interface BookNotification extends BaseNotification {
    event_type: "book";
    // Define event structure if known, otherwise generic or omitted if not used beyond ID
}

// =====================
// ANNOUNCEMENT NOTIFICATIONS
// =====================

export interface AnnouncementNotification extends BaseNotification {
    event_type: "announcement";
}

// =====================
// SERMON
// =====================

export interface Sermon {
    id: number;
    title: string;
    description: string;
    type: "audio" | "video";
    speaker: string;
    date: string;

    audio_file_url: string | null;
    youtube_video_id: string | null;
    youtube_video_url: string | null;

    thumbnail_url: string;
    duration: number; // seconds
    category_id: number;
    series_id: number | null;

    views: number;
    favorites_count: number;
    is_featured: boolean;
    is_published: boolean;

    created_at: string;
    updated_at: string;
}

// =====================
// CHURCH EVENT
// =====================

export interface ChurchEvent {
    id: number;
    title: string;
    description: string;

    event_date: string;
    event_time: string;
    location: string;

    event_type:
    | "service"
    | "prayer"
    | "conference"
    | "youth";

    image_url: string;
    broadcast_url: string | null;

    max_attendees: number;
    requires_rsvp: boolean;

    is_published: boolean;
    is_recurring: boolean;

    recurrence_pattern: "weekly" | "monthly" | null;
    recurrence_interval: number | null;
    recurrence_end_date: string | null;
    recurrence_count: number | null;

    parent_event_id: number | null;

    created_at: string;
    updated_at: string;
}

// =====================
// FINAL RESPONSE TYPE
// =====================

export type NotificationsResponse =
    PaginatedResponse<Notification>;
