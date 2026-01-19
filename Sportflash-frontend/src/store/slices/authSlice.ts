import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '@services/api';
import { User, UserPreferences } from '@app-types/models/user';
import { LoginRequest, RegisterRequest, AuthResponseData } from '@app-types/api/auth';
import { AxiosError } from 'axios';

interface AuthState {
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    token: null,
    loading: true,
    error: null,
};

// Async Thunks
export const loadUser = createAsyncThunk<AuthResponseData | null, void, { rejectValue: string }>(
    'auth/loadUser',
    async (_, { rejectWithValue }) => {
        try {
            const storedToken = await AsyncStorage.getItem('token');
            const storedUser = await AsyncStorage.getItem('user');

            if (storedToken && storedUser) {
                api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
                return { token: storedToken, user: JSON.parse(storedUser) as User };
            }
            return null;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to load user');
        }
    }
);

export const login = createAsyncThunk<AuthResponseData, LoginRequest, { rejectValue: string }>(
    'auth/login',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const response = await api.post<{ data: AuthResponseData }>('/auth/login', { email, password });
            const { token, user } = response.data.data;

            await AsyncStorage.setItem('token', token);
            await AsyncStorage.setItem('user', JSON.stringify(user));
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            return { token, user };
        } catch (error: any) {
            const message = error.response?.data?.message || 'Login failed';
            return rejectWithValue(message);
        }
    }
);

export const register = createAsyncThunk<AuthResponseData, RegisterRequest, { rejectValue: string }>(
    'auth/register',
    async ({ name, email, password }, { rejectWithValue }) => {
        try {
            const response = await api.post<{ data: AuthResponseData }>('/auth/register', { name, email, password });
            const { token, user } = response.data.data;

            await AsyncStorage.setItem('token', token);
            await AsyncStorage.setItem('user', JSON.stringify(user));
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            return { token, user };
        } catch (error: any) {
            const message = error.response?.data?.message || 'Registration failed';
            return rejectWithValue(message);
        }
    }
);

export const logout = createAsyncThunk<void, void>(
    'auth/logout',
    async () => {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('user');
        delete api.defaults.headers.common['Authorization'];
    }
);

export const updateUserPreferences = createAsyncThunk<User, UserPreferences, { rejectValue: string }>(
    'auth/updatePreferences',
    async (preferences, { rejectWithValue }) => {
        try {
            const res = await api.put<{ data: User }>('/auth/preferences', preferences);
            const updatedUser = res.data.data;
            await AsyncStorage.setItem('user', JSON.stringify(updatedUser)); // Update stored user
            return updatedUser;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to update preferences');
        }
    }
);

// Use 'any' or define a subset interface to avoid circular dependency with RootState
// or just use getState() as any safely here since we know the structure.
export const savePushToken = createAsyncThunk<void, string>(
    'auth/savePushToken',
    async (token, { rejectWithValue, getState }) => {
        try {
            const state = getState() as any; // Cast to any to avoid circular import of RootState
            const authToken = state.auth.token;

            console.log('📌 Sending Push Token to Backend:', token);
            console.log('🔑 Auth Token from State:', authToken ? `${authToken.substring(0, 10)}...` : 'NULL/UNDEFINED');

            // Explicitly attach header to avoid race condition with loadUser
            const config = authToken ? {
                headers: { Authorization: `Bearer ${authToken}` }
            } : {};

            await api.put('/auth/pushtoken', { token }, config);
            console.log('✅ Push Token Saved Successfully to Backend');
        } catch (error: any) {
            console.error('❌ Failed to save push token to Backend:', error.response?.data?.message || error.message);
            // Optionally reject, but we mostly fire-and-forget
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setPremiumStatus: (state, action: PayloadAction<boolean>) => {
            if (state.user) {
                state.user.isPremium = action.payload;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            // Load User
            .addCase(loadUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(loadUser.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.token = action.payload.token;
                    state.user = action.payload.user;
                }
            })
            .addCase(loadUser.rejected, (state) => {
                state.loading = false;
            })
            // Login
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.token;
                state.user = action.payload.user;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Login failed';
            })
            // Register
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.token;
                state.user = action.payload.user;
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Registration failed';
            })
            // Logout
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.token = null;
            })
            // Update Preferences
            .addCase(updateUserPreferences.fulfilled, (state, action) => {
                state.user = action.payload;
            });
    },
});

export const { clearError, setPremiumStatus } = authSlice.actions;
export default authSlice.reducer;

