import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '@services/api';

// Async Thunks
export const loadUser = createAsyncThunk('auth/loadUser', async (_, { rejectWithValue }) => {
    try {
        const storedToken = await AsyncStorage.getItem('token');
        const storedUser = await AsyncStorage.getItem('user');

        if (storedToken && storedUser) {
            api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
            return { token: storedToken, user: JSON.parse(storedUser) };
        }
        return null;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const login = createAsyncThunk('auth/login', async ({ email, password }, { rejectWithValue }) => {
    try {
        const response = await api.post('/auth/login', { email, password });
        const { token, user } = response.data.data;

        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('user', JSON.stringify(user));
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        return { token, user };
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
});

export const register = createAsyncThunk('auth/register', async ({ name, email, password }, { rejectWithValue }) => {
    try {
        const response = await api.post('/auth/register', { name, email, password });
        const { token, user } = response.data.data;

        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('user', JSON.stringify(user));
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        return { token, user };
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
});

export const logout = createAsyncThunk('auth/logout', async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
});

export const updateUserPreferences = createAsyncThunk('auth/updatePreferences', async (preferences, { rejectWithValue }) => {
    try {
        const res = await api.put('/auth/preferences', preferences);
        const updatedUser = res.data.data;
        await AsyncStorage.setItem('user', JSON.stringify(updatedUser)); // Update stored user
        return updatedUser;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        token: null,
        loading: true,
        error: null,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setPremiumStatus: (state, action) => {
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
                state.error = action.payload;
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
                state.error = action.payload;
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
