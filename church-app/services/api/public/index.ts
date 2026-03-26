import { unAuthenticatedBase } from "@/services";
import {
  ChurchCentreResponse,
  EventByIdResponse,
  EventResponse,
  HeroSliderResponse,
  SermonCategoryResponse,
  SiteInfoResponse,
} from "@/services/api/public/types";

export const publicEndpoints = unAuthenticatedBase.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    events: builder.query<
      EventResponse,
      {
        search: string;
        upcoming?: boolean | undefined;
        is_live?: boolean | undefined;
        page?: number;
      }
    >({
      query: (params) => ({
        url: "events",
        params,
      }),
    }),

    eventById: builder.query<EventByIdResponse, { id: string }>({
      query: ({ id }) => ({
        url: `events/${id}`,
      }),
    }),

    churchCenters: builder.query<ChurchCentreResponse, null>({
      query: () => ({
        url: "church-centres",
      }),
    }),

    heroSlide: builder.query<HeroSliderResponse, null>({
      query: () => ({
        url: "hero-sliders",
      }),
    }),

    getCategory: builder.query<SermonCategoryResponse, { type?: string } | null>({
      query: (params) => ({
        url: "categories",
        params: params ?? { type: "sermon" },
      }),
    }),

    getSocialLinks: builder.query<SiteInfoResponse, null>({
      query: () => ({
        url: "site-info",
      }),
    }),

    serviceTimes: builder.query<{ success: boolean; data: ServiceTime[] }, null>({
      query: () => ({
        url: "service-times",
      }),
    }),
  }),
});

export interface ServiceTime {
  _id: string;
  day: string;
  time: string;
  label: string;
  order: number;
  isActive: boolean;
}

export const {
  useEventsQuery,
  useChurchCentersQuery,
  useHeroSlideQuery,
  useGetCategoryQuery,
  useEventByIdQuery,
  useGetSocialLinksQuery,
  useServiceTimesQuery,
} = publicEndpoints;
