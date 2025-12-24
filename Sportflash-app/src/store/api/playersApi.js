import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '@config';

export const playersApi = createApi({
    reducerPath: 'playersApi',
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
        getPlayerDetails: builder.query({
            query: ({ id, sport }) => `/players/${id}?sport=${sport}`,
            transformResponse: (response) => response.data,
        }),
    }),
});

export const { useGetPlayerDetailsQuery } = playersApi;
