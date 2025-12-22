import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '@config';

export const searchApi = createApi({
    reducerPath: 'searchApi',
    baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
    endpoints: (builder) => ({
        globalSearch: builder.query({
            query: (query) => `/search?q=${query}`,
        }),
    }),
});

export const { useGlobalSearchQuery } = searchApi;
