import { authenticatedBase } from "@/services";
import {
  ProfileResponse,
  UpdateProfileRequest,
} from "@/services/api/profile/type";

export const profileEndpoints = authenticatedBase.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    profile: builder.query<ProfileResponse, null>({
      query: (params) => ({
        url: "auth/profile",
        method: "GET",
        params,
      }),
      providesTags: ["profile"],
    }),

    updateProfile: builder.mutation<ProfileResponse, any>({
      query: (data) => ({
        url: "auth/profile",
        method: "PUT",
        body: {
          ...(data.name !== undefined && { name: data.name }),
          ...(data.phone !== undefined && { phone: data.phone }),
          ...(data.gender !== undefined && { gender: data.gender }),
          ...(data.country !== undefined && { country: data.country }),
          ...(data.church_member !== undefined && { churchMember: data.church_member }),
          ...(data.churchMember !== undefined && { churchMember: data.churchMember }),
          ...(data.church_centre !== undefined && { churchCentreId: String(data.church_centre) }),
          ...(data.churchCentreId !== undefined && { churchCentreId: data.churchCentreId }),
        },
      }),
      invalidatesTags: ["profile"],
    }),

    changePassword: builder.mutation<
      any,
      {
        current_password: string;
        new_password: string;
      }
    >({
      query: (data) => ({
        url: "auth/change-password",
        method: "POST",
        body: {
          currentPassword: data.current_password,
          newPassword: data.new_password,
        },
      }),
    }),

    logout: builder.mutation<any, { pushToken?: string | null }>({
      query: (body) => ({
        url: "auth/logout",
        method: "POST",
        body,
      }),
    }),

    deleteAcc: builder.mutation<any, { password: string }>({
      query: (body) => {
        return {
          url: "auth/account",
          method: "DELETE",
          body: body,
        };
      },
    }),

    submitSupportTicket: builder.mutation<
      any,
      { subject: string; message: string }
    >({
      query: (body) => ({
        url: "support-tickets",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useLogoutMutation,
  useDeleteAccMutation,
  useSubmitSupportTicketMutation,
} = profileEndpoints;
