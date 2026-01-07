import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '@config';
import { Article, NewsCategory } from '@app-types/models/news';
import { ApiResponse } from '@app-types/models/user';

export const newsApi = createApi({
    reducerPath: 'newsApi',
    baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
    endpoints: (builder) => ({
        getNews: builder.query<Article[], NewsCategory | void>({
            query: (category = 'all') => `/news?category=${category}`,
            transformResponse: (response: ApiResponse<Article[]>) => response.data,
            keepUnusedDataFor: 0, // Don't cache - always fetch fresh news
        }),
        getTrendingNews: builder.query<Article[], void>({
            query: () => '/news/trending',
            transformResponse: (response: ApiResponse<Article[]>) => response.data,
            keepUnusedDataFor: 0, // Don't cache - always fetch fresh news
        }),
        getNewsDetail: builder.query<Article, string>({
            query: (id) => `/news/${id}`,
            transformResponse: (response: ApiResponse<Article>) => response.data,
        }),
    }),
});

export const { useGetNewsQuery, useGetTrendingNewsQuery, useGetNewsDetailQuery } = newsApi;

