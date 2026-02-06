import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface ContactUsData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const authBaseQuery = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_API_URL}/auth`,
  prepareHeaders: (headers, { endpoint }) => {
    headers.set('Content-Type', 'application/json');
    // Don't add auth header for register, login, forgot password, and reset password endpoints
    if (endpoint !== 'register' && endpoint !== 'login' && endpoint !== 'forgotPassword' && endpoint !== 'verifyOtp' && endpoint !== 'resetPassword') {
      const token = localStorage.getItem('access_token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    }
    return headers;
  },
});

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  password_confirm: string;
  full_name: string;
  phone: string;
  your_country: string;
  gender: string;
}

interface ResetPasswordData {
  email: string;
  otp_code: string;
  new_password: string;
  confirm_password: string;
}
export interface User {
  id: string;
  name: string;
  email: string;
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: authBaseQuery,
  endpoints: (builder) => ({
    login: builder.mutation<any, LoginCredentials>({
      query: (credentials) => ({
        url: '/login/',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: credentials,
      }),
    }),
    
    register: builder.mutation<any, RegisterData>({
      query: (userData) => ({
        url: '/register/',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: userData,
      }),
    }),
    
    logout: builder.mutation<any, void>({
      query: () => ({
        url: '/logout/',
        method: 'POST',
      }),
    }),
    
    refreshToken: builder.mutation<any, { refreshToken: string }>({
      query: (data) => ({
        url: '/refresh/',
        method: 'POST',
        body: data,
      }),
    }),
    
    forgotPassword: builder.mutation<any, { email: string }>({
      query: (data) => ({
        url: '/request_password_otp/',
        method: 'POST',
        body: data,
      }),
    }),
    
    verifyOtp: builder.mutation<any, { email: string; otp_code: string }>({      query: (data) => ({        url: '/verify_otp/',        method: 'POST',        body: data,      }),    }),
    
    resetPassword: builder.mutation<any, ResetPasswordData>({
      query: (data) => ({
        url: '/reset_password_with_otp/',
        method: 'POST',
        body: data,
      }),
    }),
    
    verifyEmail: builder.mutation<any, { token: string }>({
      query: (data) => ({
        url: '/verify-email/',
        method: 'POST',
        body: data,
      }),
    }),
    
    getProfile: builder.query<any, void>({
      query: () => '/profile/',
    }),
    
    getMe: builder.query<any, void>({
      query: () => '/me/',
    }),
    getUserDetails: builder.query<User, number>({
      query: (id) => `/user/${id}/get_user/`,
    }),
    
    createUser: builder.mutation<any, {
      email: string;
      full_name: string;
      password: string;
      role: string;
      phone: string;
      your_country: string;
    }>({
      query: (userData) => ({
        url: '/admin/create_user/',
        method: 'POST',
        body: userData,
      }),
    }),
    
    getUsersList: builder.query<any, void>({
      query: () => '/admin/users_list/',
    }),
    
    contactUs: builder.mutation<any, ContactUsData>({
      query: (data) => ({
        url: '/user/contact_us/',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
  useForgotPasswordMutation,
  useVerifyOtpMutation,
  useResetPasswordMutation,
  useVerifyEmailMutation,
  useGetProfileQuery,
  useGetUserDetailsQuery,
  useGetMeQuery,
  useCreateUserMutation,
  useGetUsersListQuery,
  useContactUsMutation,
} = authApi;