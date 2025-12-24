import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_URL } from '@config/config';

export const playersApi = createApi({
    reducerPath: 'playersApi',
    baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
    endpoints: (builder) => ({
        getPlayerDetails: builder.query({
            query: ({ id, sport }) => `players/${id}?sport=${sport}`,
        }),
    }),
});

export const { useGetPlayerDetailsQuery } = playersApi;
