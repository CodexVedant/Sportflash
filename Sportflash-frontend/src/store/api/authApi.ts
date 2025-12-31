import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '@config';
import { ApiResponse } from '@app-types/models/user';

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
    endpoints: (builder) => ({
        forgotPassword: builder.mutation<ApiResponse<void>, string>({
            query: (email) => ({
                url: '/auth/forgot-password',
                method: 'POST',
                body: { email },
            }),
        }),
        resetPassword: builder.mutation<ApiResponse<void>, { token: string; password: string }>({
            query: ({ token, password }) => ({
                url: '/auth/reset-password',
                method: 'POST',
                body: { token, password },
            }),
        }),
    }),
});

export const { useForgotPasswordMutation, useResetPasswordMutation } = authApi;

