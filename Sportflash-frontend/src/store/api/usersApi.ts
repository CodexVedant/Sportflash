import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '@config';
import { User, ApiResponse } from '@app-types/models/user';

export const usersApi = createApi({
    reducerPath: 'usersApi',
    baseQuery: fetchBaseQuery({
        baseUrl: API_BASE_URL,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as any).auth.token;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getUserProfile: builder.query<User, string>({
            query: (id) => `/users/${id}`,
        }),
        updateProfile: builder.mutation<User, Partial<User>>({
            query: (data) => ({
                url: '/users/profile',
                method: 'PUT',
                body: data,
            }),
        }),
        updatePreferences: builder.mutation<User, any>({
            query: (prefs) => ({
                url: '/auth/preferences',
                method: 'PUT',
                body: prefs,
            }),
        }),
    }),
});

export const { useGetUserProfileQuery, useUpdateProfileMutation, useUpdatePreferencesMutation } = usersApi;

