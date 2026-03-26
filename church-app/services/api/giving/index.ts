import { authenticatedBase } from "@/services";
import {
  DonationHistoryResponse,
  DonationRequest,
  DonationResponse,
  GivingCategoriesResponse,
  PartnershipTypeResponse,
  PaymentMethodsResponse,
} from "@/services/api/giving/type";

export const givingEndpoints = authenticatedBase.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    give: builder.mutation<DonationResponse, DonationRequest>({
      query: (body) => ({
        url: "giving/donate",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["giving"],
    }),

    history: builder.query<DonationHistoryResponse, null>({
      query: () => ({
        url: "giving/history",
      }),
      keepUnusedDataFor: 0,
      providesTags: ["giving"],
    }),

    givingCategory: builder.query<GivingCategoriesResponse, null>({
      query: () => ({
        url: "categories",
        params: { type: "giving" },
      }),
    }),

    partnershipType: builder.query<PartnershipTypeResponse, null>({
      query: () => ({
        url: "partnerships/types",
      }),
    }),

    givingMethods: builder.query<PaymentMethodsResponse, null>({
      query: () => ({
        url: "giving/methods",
      }),
    }),

    submitPartnership: builder.mutation<
      any,
      {
        fullname: string;
        phoneNo: string;
        email: string;
        partnershipTypeId: string;
        interval: string;
        amount: number;
        currency?: string;
      }
    >({
      query: (body) => ({
        url: "partnerships",
        method: "POST",
        body: body,
      }),
    }),
  }),
});

export const {
  useGiveMutation,
  useHistoryQuery,
  useGivingCategoryQuery,
  usePartnershipTypeQuery,
  useGivingMethodsQuery,
  useSubmitPartnershipMutation,
} = givingEndpoints;
