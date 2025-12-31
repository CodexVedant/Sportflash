import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '@config';
import { Match, H2HStats } from '@app-types/models/match';
import { Standing } from '@app-types/models/team';
import { ApiResponse } from '@app-types/models/user';

export const matchesApi = createApi({
    reducerPath: 'matchesApi',
    baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
    endpoints: (builder) => ({
        getLiveMatches: builder.query<Match[], void>({
            query: () => '/matches/live',
            transformResponse: (response: ApiResponse<Match[]>) => {
                return response.data;
            }
        }),
        getMatchDetails: builder.query<Match, string>({
            query: (id) => `/matches/${id}`,
            transformResponse: (response: ApiResponse<Match>) => {
                return response.data;
            }
        }),
        getMatchH2H: builder.query<H2HStats, { sport: string; team1Id: string; team2Id: string }>({
            query: ({ sport, team1Id, team2Id }) => `/matches/h2h?sport=${sport}&team1Id=${team1Id}&team2Id=${team2Id}`,
            transformResponse: (response: ApiResponse<H2HStats>) => response.data
        }),
        getMatchStandings: builder.query<Standing[], { sport: string; leagueId: string }>({
            query: ({ sport, leagueId }) => `/matches/standings?sport=${sport}&league=${leagueId}`,
            transformResponse: (response: ApiResponse<Standing[]>) => response.data
        }),
        getUpcomingMatches: builder.query<Match[], { sport?: string; date?: string } | void>({
            query: (args) => {
                const { sport, date } = args || {};
                const params = new URLSearchParams();
                if (sport) params.append('sport', sport);
                if (date) params.append('date', date);
                return `/matches/upcoming?${params.toString()}`;
            },
            transformResponse: (response: ApiResponse<Match[]>) => response.data
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

