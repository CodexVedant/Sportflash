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
        getMatchH2H: builder.query({
            query: ({ sport, team1Id, team2Id }) => `/matches/h2h?sport=${sport}&team1Id=${team1Id}&team2Id=${team2Id}`,
            transformResponse: (response) => response.data
        }),
        getMatchStandings: builder.query({
            query: ({ sport, leagueId }) => `/matches/standings?sport=${sport}&league=${leagueId}`,
            transformResponse: (response) => response.data
        }),
        getUpcomingMatches: builder.query({
            query: ({ sport, date } = {}) => {
                const params = new URLSearchParams();
                if (sport) params.append('sport', sport);
                if (date) params.append('date', date);
                return `/matches/upcoming?${params.toString()}`;
            },
            transformResponse: (response) => response.data
        }),
    }),
});

export const {
    useGetLiveMatchesQuery,
    useGetMatchDetailsQuery,
    useGetMatchH2HQuery,
    useGetMatchStandingsQuery,
    useGetUpcomingMatchesQuery
} = matchesApi;
