import { BaseEntity, Dictionary } from '../common';
import { Team } from './team';

export interface Player extends BaseEntity {
    name: string;
    sport: string;
    number?: string | number | null;
    position?: string | null;
    age?: number | null;
    nationality?: string | null;
    photo?: string | null;
    image?: string; // Backward compatibility
    team?: {
        id: string;
        name: string;
        logo?: string;
    } | Team;
    statistics?: {
        // Football specific
        goals?: number;
        assists?: number;
        yellowCards?: number;
        redCards?: number;
        // Basketball specific
        points?: number | null;
        rebounds?: number | null;
        blocks?: number | null;
        steals?: number | null;
        // Cricket specific
        runs?: number | null;
        wickets?: number | null;
        strikeRate?: number | null;
        // Additional fields
        [key: string]: any;
    };
    stats?: Dictionary<any>; // Backward compatibility
}
