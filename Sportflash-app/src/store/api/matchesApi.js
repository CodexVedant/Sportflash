import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '@config';

export const matchesApi = createApi({
    reducerPath: 'matchesApi',
    baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
    endpoints: (builder) => ({
        getLiveMatches: builder.query({
            query: () => '/matches/live',
            transformResponse: (response) => {
                // Transform response to match UI needs if necessary, 
                // keeping it simple for now as per previous HomeScreen logic
                return response.data;
            }
        }),
        getMatchDetails: builder.query({
            query: (id) => `/matches/${id}`,
        }),
    }),
});

export const { useGetLiveMatchesQuery, useGetMatchDetailsQuery } = matchesApi;
