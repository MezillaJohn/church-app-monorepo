import { storage } from "@/storage";
import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { Mutex } from "async-mutex";

const BASE_URL_RENDER = "https://church-app-monorepo.onrender.com/api/v1/";

const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL_RENDER,
  prepareHeaders: async (headers) => {
    const token = storage.getString("AuthProvider.authToken");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // Wait if another refresh is in progress
  await mutex.waitForUnlock();

  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Try to refresh the token
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const refreshToken = storage.getString("AuthProvider.refreshToken");
        if (refreshToken) {
          const refreshResult = await baseQuery(
            {
              url: "auth/refresh-token",
              method: "POST",
              body: { refreshToken },
            },
            api,
            extraOptions
          );

          if (refreshResult.data) {
            const data = refreshResult.data as {
              success: boolean;
              data: { accessToken: string; refreshToken: string };
            };
            if (data.success) {
              // Store the new tokens (rolling refresh keeps user logged in)
              storage.set("AuthProvider.authToken", data.data.accessToken);
              if (data.data.refreshToken) {
                storage.set("AuthProvider.refreshToken", data.data.refreshToken);
              }
              // Retry the original request
              result = await baseQuery(args, api, extraOptions);
            } else {
              // Refresh failed — clear auth state
              storage.delete("AuthProvider.authToken");
              storage.delete("AuthProvider.refreshToken");
            }
          } else {
            // Refresh request failed — clear auth state
            storage.delete("AuthProvider.authToken");
            storage.delete("AuthProvider.refreshToken");
          }
        }
      } finally {
        release();
      }
    } else {
      // Another refresh is in progress, wait and retry
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};

export const authenticatedBase = createApi({
  reducerPath: "Auth",
  baseQuery: baseQueryWithReauth,
  refetchOnReconnect: true,
  refetchOnFocus: true,
  tagTypes: ["profile", "giving", "favourite", "notifications"],
  endpoints: () => ({}),
});

export const unAuthenticatedBase = createApi({
  reducerPath: "unAuth",
  baseQuery: async (args: any, api: any, extraOptions: any) => {
    const result = await fetchBaseQuery({
      baseUrl: BASE_URL_RENDER,
    })(args, api, extraOptions);
    return result;
  },
  refetchOnReconnect: true,
  endpoints: () => ({}),
});
