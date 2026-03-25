import { unAuthenticatedBase } from "@/services";
import {
  EmailRequest,
  LoginRequest,
  RegistrationRequest,
  RequestCodeRequest,
  SetPassowrd,
  unAuthResponse,
  VerifyEmailRequest,
  VerifyEmailRes,
} from "@/services/api/unAuth/type";

export const unAuthEndpoints = unAuthenticatedBase.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    register: builder.mutation<unAuthResponse, RegistrationRequest>({
      query: (data) => {
        return {
          url: "auth/register",
          method: "POST",
          body: data,
        };
      },
    }),

    requestCode: builder.mutation<unAuthResponse, RequestCodeRequest>({
      query: (data) => {
        return {
          url: "auth/register/request-code",
          method: "POST",
          body: data,
        };
      },
    }),

    login: builder.mutation<unAuthResponse, LoginRequest>({
      query: (data) => {
        return {
          url: "auth/login",
          method: "POST",
          body: data,
        };
      },
    }),

    validateEmail: builder.mutation<any, EmailRequest>({
      query: (data) => {
        return {
          url: "auth/validate-email",
          method: "POST",
          body: data,
        };
      },
    }),

    resendCode: builder.mutation<any, EmailRequest>({
      query: (data) => {
        return {
          url: "auth/register/resend-code",
          method: "POST",
          body: data,
        };
      },
    }),

    verifyEmail: builder.mutation<VerifyEmailRes, VerifyEmailRequest>({
      query: (data) => {
        return {
          url: "auth/register/verify-code",
          method: "POST",
          body: data,
        };
      },
    }),

    setPassword: builder.mutation<any, SetPassowrd>({
      query: (data) => {
        return {
          url: "auth/register/set-password",
          method: "POST",
          body: data,
        };
      },
    }),
    forgetPassword: builder.mutation<any, { email: string }>({
      query: (data) => {
        return {
          url: "auth/forgot-password",
          method: "POST",
          body: data,
        };
      },
    }),
    resetPassword: builder.mutation<
      any,
      {
        email: string;
        code: string;
        password: string;
        password_confirmation: string;
      }
    >({
      query: (data) => {
        return {
          url: "auth/reset-password",
          method: "POST",
          body: data,
        };
      },
    }),
  }),
});

export const {
  useRegisterMutation,
  useRequestCodeMutation,
  useLoginMutation,
  useValidateEmailMutation,
  useResendCodeMutation,
  useVerifyEmailMutation,
  useSetPasswordMutation,
  useForgetPasswordMutation,
  useResetPasswordMutation,
} = unAuthEndpoints;
