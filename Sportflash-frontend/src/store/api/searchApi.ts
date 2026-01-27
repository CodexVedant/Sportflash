import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '@config';
import { Match } from '@app-types/models/match';
import { Team } from '@app-types/models/team';
import { Article } from '@app-types/models/news';
import { ApiResponse } from '@app-types/models/user';

export interface SearchResults {
    matches: Match[];
    teams: Team[];
    news: Article[];
}

export const searchApi = createApi({
    reducerPath: 'searchApi',
    baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
    endpoints: (builder) => ({
        globalSearch: builder.query<SearchResults, string>({
            query: (query) => `/search?q=${query}`,
            transformResponse: (response: ApiResponse<SearchResults>) => response.data,
        }),
    }),
});

export const { useGlobalSearchQuery } = searchApi;

