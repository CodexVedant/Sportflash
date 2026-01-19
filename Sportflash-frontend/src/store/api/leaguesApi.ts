import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '@config';
import { ApiResponse } from '@app-types/models/user';

export interface League {
    id: string;
    name: string;
    sport: 'football' | 'basketball' | 'cricket';
    country: {
        id: string;
        name: string;
        logo: string | null;
        iso2: string | null;
    };
    logo: string | null;
    season: string | null;
}

export const leaguesApi = createApi({
    reducerPath: 'leaguesApi',
    baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
    endpoints: (builder) => ({
        getLeagues: builder.query<League[], { sport?: string; country?: string }>({
            query: ({ sport, country }) => {
                const params = new URLSearchParams();
                if (sport) params.append('sport', sport);
                if (country) params.append('country', country);
                return `/matches/leagues?${params.toString()}`;
            },
            transformResponse: (response: ApiResponse<League[]>) => response.data,
            keepUnusedDataFor: 21600, // 6 hours
        }),

        getLeagueMatches: builder.query<any[], { leagueId: string; sport: string; status?: string }>({
            query: ({ leagueId, sport, status }) => {
                const params = new URLSearchParams({ sport });
                if (status) params.append('status', status);
                return `/matches/league/${leagueId}?${params.toString()}`;
            },
            transformResponse: (response: ApiResponse<any[]>) => response.data,
            keepUnusedDataFor: 3600, // 1 hour
        }),

        getLeagueTopScorers: builder.query<any[], { leagueId: string; sport: string }>({
            query: ({ leagueId, sport }) => ({
                url: `/matches/league/${leagueId}/topscorers`,
                params: { sport }
            }),
            transformResponse: (response: ApiResponse<any[]>) => response.data,
            keepUnusedDataFor: 43200, // 12 hours
        }),
    }),
});

export const {
    useGetLeaguesQuery,
    useGetLeagueMatchesQuery,
    useGetLeagueTopScorersQuery,
} = leaguesApi;
