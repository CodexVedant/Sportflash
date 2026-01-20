import { User, UserPreferences } from '../models/user';

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

export interface AuthResponseData {
    token: string;
    user: User;
    requireOtp?: boolean; // For registration flow
    email?: string;       // For registration flow
    message?: string;     // For registration flow
}

export interface UpdatePreferencesRequest {
    preferences: UserPreferences;
}
