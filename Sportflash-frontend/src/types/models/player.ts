import { BaseEntity } from '../common';
import { Team } from './team';

export interface Player extends BaseEntity {
    name: string;
    sport: string;
    team?: Team;
    position?: string;
    age?: number;
    nationality?: string;
    image?: string;
    stats?: Dictionary<any>; // Flexible for now
}
