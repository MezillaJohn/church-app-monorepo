import { authenticatedBase } from "@/services";
import { NotificationsResponse } from "@/services/api/notification/types";
import * as Device from "expo-device";

export const notificationEndpoints = authenticatedBase.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    sendFCMToken: builder.mutation<
      any,
      {
        token: string;
        platform: string;
        device_info: {
          brand: string | null;
          manufacturer: string | null;
          modelName: string | null;
          osName: string | null;
          osVersion: string | null;
          deviceType: Device.DeviceType | null;
        }[];
      }
    >({
      query: (body) => ({
        url: "push-tokens",
        method: "POST",
        body,
      }),
    }),

    getNotifications: builder.query<NotificationsResponse, { page: number } | void>({
      query: (arg) => ({
        url: "notifications",
        method: "GET",
        params: { page: arg?.page ?? 1, perPage: 20 },
      }),
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      merge: (currentCache, newItems) => {
        if (!newItems.data) return;
        const existingIds = new Set(currentCache.data.map((n) => n._id));
        newItems.data.forEach((item) => {
          if (!existingIds.has(item._id)) {
            currentCache.data.push(item);
          }
        });
        currentCache.meta = newItems.meta;
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.page !== previousArg?.page;
      },
      providesTags: ["notifications"],
    }),

    markNotificationAsRead: builder.mutation<any, string>({
      query: (id) => ({
        url: `notifications/${id}/read`,
        method: "PATCH",
      }),
      invalidatesTags: ["notifications"],
    }),

    markAllNotificationsAsRead: builder.mutation<any, void>({
      query: () => ({
        url: "notifications/read-all",
        method: "PATCH",
      }),
      invalidatesTags: ["notifications"],
    }),
  }),
});

export const {
  useSendFCMTokenMutation,
  useGetNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
} = notificationEndpoints;

export * from "./types";
