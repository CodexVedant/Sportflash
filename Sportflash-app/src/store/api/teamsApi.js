import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '@config';

export const teamsApi = createApi({
    reducerPath: 'teamsApi',
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
        getTeam: builder.query({
            query: (id) => `/teams/${id}`,
        }),
        searchTeams: builder.query({
            query: (query) => `/teams/search?q=${query}`,
        }),
        toggleFollowTeam: builder.mutation({
            query: (teamId) => ({
                url: `/teams/${teamId}/follow`,
                method: 'POST',
            }),
        }),
    }),
});

export const { useGetTeamQuery, useSearchTeamsQuery, useToggleFollowTeamMutation } = teamsApi;
