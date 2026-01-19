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
    favoriteSports?: string[];
<<<<<<< HEAD
    favoriteTeams?: any[]; // string[] or Team[]
    favoriteLeagues?: string[];
    favoritePlayers?: any[]; // string[] or Player[]
=======
    favoriteTeams?: string[];
    favoriteLeagues?: FavoriteLeague[];
}

export interface FavoriteLeague {
    id: string;
    name: string;
    sport: string;
    country?: string;
    logo?: string;
>>>>>>> origin/main
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
