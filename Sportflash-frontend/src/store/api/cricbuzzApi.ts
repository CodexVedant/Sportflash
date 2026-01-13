import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '@config';
import { Match } from '@app-types/models/match';
import { Player } from '@app-types/models/player';
import { Team } from '@app-types/models/team';

interface CricbuzzApiResponse<T> {
    success: boolean;
    data: T;
    count?: number;
    source?: string;
}

interface CricketCommentary {
    text: string;
    timestamp: string;
    over: number;
    ball: number;
    batsman: string;
    batsmanRuns: number;
    batsmanBalls: number;
    bowler: string;
    bowlerOvers: string;
    bowlerRuns: number;
    bowlerWickets: number;
    event: string;
    isWicket: boolean;
    isBoundary: boolean;
}

interface CricketScorecard {
    [key: string]: {
        battingTeam: string;
        score: string;
        batting: Array<{
            player: string;
            dismissal: string;
            runs: number;
            balls: number;
            fours: number;
            sixes: number;
            strikeRate: number;
        }>;
        bowling: Array<{
            player: string;
            overs: number;
            maidens: number;
            runs: number;
            wickets: number;
            economy: number;
            wides: number;
            noBalls: number;
        }>;
        extras: number;
        total: number;
    };
}

interface ICCRanking {
    position: number;
    player: string;
    team: string;
    rating: number;
    points: number;
}

/**
 * Cricbuzz API for Cricket-specific data
 * Uses Cricbuzz API (RapidAPI) for superior cricket features
 */
export const cricbuzzApi = createApi({
    reducerPath: 'cricbuzzApi',
    baseQuery: fetchBaseQuery({ baseUrl: `${API_BASE_URL}/cricket` }),
    tagTypes: ['CricketMatch', 'CricketTeam', 'CricketPlayer', 'CricketRankings'],
    endpoints: (builder) => ({
        // === MATCHES ===

        getCricketLiveMatches: builder.query<Match[], void>({
            query: () => '/matches/live',
            transformResponse: (response: CricbuzzApiResponse<Match[]>) => response.data,
            providesTags: ['CricketMatch'],
        }),

        getCricketRecentMatches: builder.query<Match[], void>({
            query: () => '/matches/recent',
            transformResponse: (response: CricbuzzApiResponse<Match[]>) => response.data,
            providesTags: ['CricketMatch'],
        }),

        getCricketUpcomingMatches: builder.query<Match[], void>({
            query: () => '/matches/upcoming',
            transformResponse: (response: CricbuzzApiResponse<Match[]>) => response.data,
            providesTags: ['CricketMatch'],
        }),

        getCricketMatchDetails: builder.query<any, string>({
            query: (matchId) => `/matches/${matchId}`,
            transformResponse: (response: CricbuzzApiResponse<any>) => response.data,
            providesTags: (result, error, matchId) => [{ type: 'CricketMatch', id: matchId }],
        }),

        getCricketMatchScorecard: builder.query<CricketScorecard, string>({
            query: (matchId) => `/matches/${matchId}/scorecard`,
            transformResponse: (response: CricbuzzApiResponse<CricketScorecard>) => response.data,
        }),

        getCricketMatchCommentary: builder.query<CricketCommentary[], string>({
            query: (matchId) => `/matches/${matchId}/commentary`,
            transformResponse: (response: CricbuzzApiResponse<CricketCommentary[]>) => response.data,
        }),

        // === TEAMS ===

        getCricketTeams: builder.query<Team[], { type?: 'international' | 'domestic' | 'league' }>({
            query: ({ type = 'international' }) => `/teams?type=${type}`,
            transformResponse: (response: CricbuzzApiResponse<Team[]>) => response.data,
            providesTags: ['CricketTeam'],
        }),

        // === PLAYERS ===

        searchCricketPlayer: builder.query<Player[], string>({
            query: (searchQuery) => `/players/search?q=${encodeURIComponent(searchQuery)}`,
            transformResponse: (response: CricbuzzApiResponse<Player[]>) => response.data,
        }),

        getCricketPlayerDetails: builder.query<Player, string>({
            query: (playerId) => `/players/${playerId}`,
            transformResponse: (response: CricbuzzApiResponse<Player>) => response.data,
            providesTags: (result, error, playerId) => [{ type: 'CricketPlayer', id: playerId }],
        }),

        // === RANKINGS ===

        getICCRankings: builder.query<ICCRanking[], {
            type?: 'batsmen' | 'bowlers' | 'allrounders' | 'teams';
            format?: 'test' | 'odi' | 't20';
        }>({
            query: ({ type = 'batsmen', format = 'test' }) =>
                `/rankings?type=${type}&format=${format}`,
            transformResponse: (response: CricbuzzApiResponse<ICCRanking[]>) => response.data,
            providesTags: ['CricketRankings'],
        }),

        // === NEWS ===

        getCricketNews: builder.query<any[], void>({
            query: () => '/news',
            transformResponse: (response: CricbuzzApiResponse<any[]>) => response.data,
        }),

        // === SERIES ===

        getCricketSeries: builder.query<any[], { type?: 'international' | 'domestic' | 'league' }>({
            query: ({ type = 'international' }) => `/series?type=${type}`,
            transformResponse: (response: CricbuzzApiResponse<any[]>) => response.data,
        }),

        // === ENHANCED ENDPOINTS ===

        // Enhanced match scorecard (v2)
        getCricketMatchScorecardV2: builder.query<any, string>({
            query: (matchId) => `/matches/${matchId}/scorecard-v2`,
            transformResponse: (response: CricbuzzApiResponse<any>) => response.data,
        }),

        // Enhanced match info
        getCricketMatchInfo: builder.query<any, string>({
            query: (matchId) => `/matches/${matchId}/info`,
            transformResponse: (response: CricbuzzApiResponse<any>) => response.data,
            providesTags: (result, error, matchId) => [{ type: 'CricketMatch', id: matchId }],
        }),

        // Player career stats (enhanced)
        getCricketPlayerCareer: builder.query<any, string>({
            query: (playerId) => `/players/${playerId}/career`,
            transformResponse: (response: CricbuzzApiResponse<any>) => response.data,
        }),

        // Trending players
        getTrendingCricketPlayers: builder.query<Player[], void>({
            query: () => '/players/trending',
            transformResponse: (response: CricbuzzApiResponse<Player[]>) => response.data,
        }),

        // Series points table (CRITICAL)
        getSeriesPointsTable: builder.query<any, string>({
            query: (seriesId) => `/series/${seriesId}/points-table`,
            transformResponse: (response: CricbuzzApiResponse<any>) => response.data,
        }),

        // Cricket schedules
        getCricketSchedules: builder.query<any[], void>({
            query: () => '/schedules',
            transformResponse: (response: CricbuzzApiResponse<any[]>) => response.data,
        }),
    }),
});

export const {
    useGetCricketLiveMatchesQuery,
    useGetCricketRecentMatchesQuery,
    useGetCricketUpcomingMatchesQuery,
    useGetCricketMatchDetailsQuery,
    useGetCricketMatchScorecardQuery,
    useGetCricketMatchCommentaryQuery,
    useGetCricketTeamsQuery,
    useSearchCricketPlayerQuery,
    useGetCricketPlayerDetailsQuery,
    useGetICCRankingsQuery,
    useGetCricketNewsQuery,
    useGetCricketSeriesQuery,
    // Enhanced endpoints
    useGetCricketMatchScorecardV2Query,
    useGetCricketMatchInfoQuery,
    useGetCricketPlayerCareerQuery,
    useGetTrendingCricketPlayersQuery,
    useGetSeriesPointsTableQuery,
    useGetCricketSchedulesQuery,
} = cricbuzzApi;
