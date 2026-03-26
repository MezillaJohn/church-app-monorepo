import { authenticatedBase } from "@/services";
import { BuyBookresponse, MyBooksResponse } from "@/services/api/library/types";
import { BooksResponse, ViewBookResponse } from "@/services/api/public/types";

export const libraryEndpoints = authenticatedBase.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    books: builder.query<BooksResponse, { page: number; search?: string }>({
      query: ({ search, ...rest }) => ({
        url: "books",
        method: "GET",
        params: {
          ...rest,
          ...(search ? { search } : {}),
        },
      }),

      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        return `${endpointName}-${queryArgs.search ?? ""}`;
      },
      merge: (currentCache, newItems) => {
        if (newItems.meta.current_page === 1) {
          currentCache.data = newItems.data;
        } else {
          const existingIds = new Set(currentCache.data.map((item) => item.id));
          const uniqueNewItems = newItems.data.filter(
            (item) => !existingIds.has(item.id),
          );
          currentCache.data.push(...uniqueNewItems);
        }
        currentCache.meta = newItems.meta;
        currentCache.links = newItems.links;
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.page !== previousArg?.page;
      },
    }),

    featuredBooks: builder.query<MyBooksResponse, null>({
      query: () => ({
        url: "books/featured",
      }),
    }),

    myBooks: builder.query<MyBooksResponse, { page: number }>({
      query: (params) => ({
        url: "library/my-books",
        params,
      }),

      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      merge: (currentCache, newItems) => {
        if (newItems.meta.current_page === 1) {
          currentCache.data = newItems.data;
        } else {
          const existingIds = new Set(currentCache.data.map((item) => item.id));
          const uniqueNewItems = newItems.data.filter(
            (item) => !existingIds.has(item.id),
          );
          currentCache.data.push(...uniqueNewItems);
        }
        currentCache.meta = newItems.meta;
        currentCache.links = newItems.links;
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.page !== previousArg?.page;
      },
    }),

    viewBooksById: builder.query<ViewBookResponse, { id: string }>({
      query: ({ id }) => ({
        url: `books/${id}`,
      }),
      keepUnusedDataFor: 0,
    }),

    checkPurchase: builder.query<
      { success: boolean; data: { purchased: boolean } },
      { id: string }
    >({
      query: ({ id }) => ({
        url: `books/${id}/check-purchase`,
      }),
    }),

    buyBook: builder.mutation<
      BuyBookresponse,
      { id: number | string | undefined }
    >({
      query: ({ id }) => ({
        url: `books/${id}/purchase`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useBooksQuery,
  useFeaturedBooksQuery,
  useMyBooksQuery,
  useViewBooksByIdQuery,
  useCheckPurchaseQuery,
  useBuyBookMutation,
} = libraryEndpoints;
