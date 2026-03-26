import { authenticatedBase } from "@/services";
import type {
  Sermon,
  SermonsResponse,
  SermonResponse,
  SermonQueryParams,
  FavoritesResponse,
  FeaturedResponse,
  ToggleFavoriteResponse,
} from "@/services/api/sermon/type";

export type { Sermon } from "@/services/api/sermon/type";

export const sermonEndpoints = authenticatedBase.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    sermons: builder.query<SermonsResponse, SermonQueryParams>({
      query: (params) => {
        const { category_id, search, ...rest } = params;
        return {
          url: "sermons",
          method: "GET",
          params: {
            ...rest,
            ...(search ? { search } : {}),
            ...(category_id ? { category_id } : {}),
          },
        };
      },

      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        const { type, search, sort, category_id, series } = queryArgs;
        return `${endpointName}-${type}-${search ?? ""}-${sort ?? ""}-${category_id ?? ""}-${series ?? ""}`;
      },

      merge: (currentCache, newItems) => {
        const existingIds = new Set(
          currentCache.data.map((s) => s._id)
        );
        newItems.data.forEach((item) => {
          if (!existingIds.has(item._id)) {
            currentCache.data.push(item);
          }
        });
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.page !== previousArg?.page;
      },
    }),

    markAsFavourite: builder.mutation<
      ToggleFavoriteResponse,
      {
        id: string;
        search: string;
        sort: "desc" | "asc";
        category_id: string;
        page?: number;
        type: "audio" | "video";
      }
    >({
      query: ({ id }) => ({
        url: `sermons/${id}/favorite`,
        method: "POST",
      }),

      invalidatesTags: ["favourite"],

      async onQueryStarted(
        { id, search, category_id, sort, page = 1, type },
        { dispatch, queryFulfilled }
      ) {
        const patchResults: ReturnType<typeof dispatch>[] = [];

        const toggleInList = (list: Sermon[] | undefined) => {
          if (!list) return;
          const sermon = list.find((s) => s._id === id);
          if (sermon) {
            sermon.isFavorited = !sermon.isFavorited;
            sermon.favoritesCount += sermon.isFavorited ? 1 : -1;
          }
        };

        // Patch both audio and video sermon list caches
        for (const t of ["audio", "video"] as const) {
          const patch = dispatch(
            sermonEndpoints.util.updateQueryData(
              "sermons",
              { type: t, sort: sort ?? "desc", search, category_id, page },
              (draft) => toggleInList(draft?.data)
            )
          );
          patchResults.push(patch);

          const patchFeatured = dispatch(
            sermonEndpoints.util.updateQueryData(
              "getFeaturedSermon",
              { type: t },
              (draft) => toggleInList(draft?.data)
            )
          );
          patchResults.push(patchFeatured);
        }

        // Optimistically remove from favorites cache when unfavoriting
        const patchFavs = dispatch(
          sermonEndpoints.util.updateQueryData(
            "getFavouriteSermons",
            {},
            (draft) => {
              const idx = draft?.data?.findIndex((s) => s._id === id);
              if (idx !== undefined && idx >= 0) {
                draft.data.splice(idx, 1);
              }
            }
          )
        );
        patchResults.push(patchFavs);

        try {
          await queryFulfilled;
        } catch {
          patchResults.forEach((p) => p.undo());
        }
      },
    }),

    getFavouriteSermons: builder.query<FavoritesResponse, Record<string, never>>({
      query: () => ({
        url: "sermons/favorites",
      }),
      keepUnusedDataFor: 0,
      providesTags: ["favourite"],
    }),

    getSermonById: builder.query<SermonResponse, string>({
      query: (id) => ({
        url: `sermons/${id}`,
        method: "GET",
      }),
    }),

    getFeaturedSermon: builder.query<FeaturedResponse, { type: "audio" | "video" }>({
      query: ({ type }) => ({
        url: `sermons/featured?type=${type}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useSermonsQuery,
  useMarkAsFavouriteMutation,
  useGetFavouriteSermonsQuery,
  useGetSermonByIdQuery,
  useGetFeaturedSermonQuery,
} = sermonEndpoints;
