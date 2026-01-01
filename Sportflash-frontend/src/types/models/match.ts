import { BaseEntity, Dictionary } from '../common';
import { Team } from './team';

export type MatchStatus = 'live' | 'finished' | 'upcoming' | 'postponed' | 'cancelled' | string;
export type Sport = 'football' | 'basketball' | 'cricket' | 'tennis';

export interface Score {
    home: string | number;
    away: string | number;
    quarters?: string | string[] | any; // handling flexible input
}

export interface League {
    id?: string | number;
    name: string;
    logo?: string;
    country?: string;
}

export interface MatchEvent {
    type: 'goal' | 'card' | string;
    time: string;
    player: string;
    team: 'home' | 'away';
    cardType?: string;
}

export interface Match extends BaseEntity {
    sport: Sport;
    date: string;
    time: string;
    status: MatchStatus;
    displayStatus?: string; // UI specific
    homeTeam: Team;
    awayTeam: Team;
    scores?: Score; // Optional as not always strictly 'scores'
    score?: string; // Center info string for UI
    timer?: string; // UI timer

    league?: League;
    leagueInfo?: any;
    venue?: string;

    // Sport Specific Details
    matchType?: string;
    period?: string;
    toss?: string;
    manOfMatch?: string;
    currentOver?: string;

    // Data containers
    basketballData?: any;
    cricketData?: any;
    scorecard?: any;
    lineups?: any;
    statistics?: any;
    events?: MatchEvent[];
    comments?: any;
}

export interface H2HStats {
    H2H?: any[]; // Raw API response support
    matches?: Match[]; // Past matches
    summary?: {
        total: number;
        homeWins: number;
        awayWins: number;
        draws: number;
    };
}
