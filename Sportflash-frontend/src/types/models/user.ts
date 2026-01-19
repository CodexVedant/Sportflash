import { BaseEntity } from '../common';

export interface User extends BaseEntity {
    name: string;
    email: string;
    avatar?: string;
    preferences?: UserPreferences;
    isPremium?: boolean;
}

export interface UserPreferences {
    theme?: 'light' | 'dark';
    notifications?: boolean;
    favoriteTeams?: any[]; // string[] | Team[]
    favoriteLeagues?: any[]; // string[] | FavoriteLeague[]
    favoritePlayers?: any[]; // string[] | Player[]
}

export interface FavoriteLeague {
    id: string;
    name: string;
    sport: string;
    country?: string;
    logo?: string;
    season?: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}
