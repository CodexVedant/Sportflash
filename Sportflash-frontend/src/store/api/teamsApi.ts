import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '@config';
import { Team } from '@app-types/models/team';
import { ApiResponse } from '@app-types/models/user';

export const teamsApi = createApi({
    reducerPath: 'teamsApi',
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
        getTeam: builder.query<Team, { id: string; sport: string }>({
            query: ({ id, sport }) => `/teams/${id}?sport=${sport}`,
            transformResponse: (response: ApiResponse<Team>) => response.data,
        }),
        searchTeams: builder.query<Team[], string>({
            query: (query) => `/teams/search?q=${query}`,
            transformResponse: (response: ApiResponse<Team[]>) => response.data,
        }),
        toggleFollowTeam: builder.mutation<void, string>({
            query: (teamId) => ({
                url: `/teams/${teamId}/follow`,
                method: 'POST',
            }),
        }),
    }),
});

export const { useGetTeamQuery, useSearchTeamsQuery, useToggleFollowTeamMutation } = teamsApi;

