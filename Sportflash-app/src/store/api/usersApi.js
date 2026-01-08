import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '@config';

export const usersApi = createApi({
    reducerPath: 'usersApi',
    baseQuery: fetchBaseQuery({
        baseUrl: API_BASE_URL,
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.token;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getUserProfile: builder.query({
            query: (id) => `/users/${id}`,
        }),
        updateProfile: builder.mutation({
            query: (data) => ({
                url: '/users/profile',
                method: 'PUT',
                body: data,
            }),
        }),
        updatePreferences: builder.mutation({
            query: (data) => ({
                url: '/auth/preferences',
                method: 'PUT',
                body: data,
            }),
        }),
    }),
});

export const { useGetUserProfileQuery, useUpdateProfileMutation, useUpdatePreferencesMutation } = usersApi;
