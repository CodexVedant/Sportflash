import { BaseEntity, Dictionary } from '../common';

export interface Team extends BaseEntity {
    name: string;
    logo?: string;
    sport: string; // 'football' | 'basketball' | 'cricket'
    shortName?: string;
    score?: string | number;
    country?: string;
    founded?: number | string;
    venue?: {
        name: string;
        city?: string;
        capacity?: number;
        [key: string]: any;
    };
}

// For standings
export interface Standing {
    rank: number;
    team: Team;
    played: number;
    won: number;
    drawn: number;
    lost: number;
    goalsFor: number;
    goalsAgainst: number;
    goalDifference: number;
    points: number;
}
