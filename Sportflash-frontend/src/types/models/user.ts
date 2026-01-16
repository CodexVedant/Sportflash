import { BaseEntity } from '../common';

export interface User extends BaseEntity {
    name: string;
    email: string;
    avatar?: string;
    preferences?: UserPreferences;
}

export interface UserPreferences {
    theme?: 'light' | 'dark';
    notifications?: boolean;
    favoriteSports?: string[];
    favoriteTeams?: string[];
    favoriteLeagues?: FavoriteLeague[];
}

export interface FavoriteLeague {
    id: string;
    name: string;
    sport: string;
    country?: string;
    logo?: string;
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
