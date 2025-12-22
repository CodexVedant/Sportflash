import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '@config';

export const newsApi = createApi({
    reducerPath: 'newsApi',
    baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
    endpoints: (builder) => ({
        getNews: builder.query({
            query: (category = 'all') => `/news?category=${category}`,
        }),
        getTrendingNews: builder.query({
            query: () => '/news/trending',
        }),
        getNewsDetail: builder.query({
            query: (id) => `/news/${id}`,
        }),
    }),
});

export const { useGetNewsQuery, useGetTrendingNewsQuery, useGetNewsDetailQuery } = newsApi;
