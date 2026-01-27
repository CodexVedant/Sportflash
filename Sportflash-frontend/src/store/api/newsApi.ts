import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '@config';
import { Article, NewsCategory } from '@app-types/models/news';
import { ApiResponse } from '@app-types/models/user';

export const newsApi = createApi({
    reducerPath: 'newsApi',
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
    tagTypes: ['News'], // Define tag types here
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
        toggleBookmark: builder.mutation<{ success: boolean; isBookmarked: boolean }, { articleId: string; articleData: any }>({
            query: (body) => ({
                url: '/news/bookmark',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['News'],
        }),
        getBookmarks: builder.query<Article[], void>({
            query: () => '/news/bookmarks',
            transformResponse: (response: ApiResponse<Article[]>) => response.data,
            providesTags: ['News'], // Re-fetch on toggle
        }),
    }),
});

export const { useGetNewsQuery, useGetTrendingNewsQuery, useGetNewsDetailQuery, useToggleBookmarkMutation, useGetBookmarksQuery } = newsApi;

