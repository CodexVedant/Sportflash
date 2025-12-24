import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import matchesReducer from './slices/matchesSlice';
import newsReducer from './slices/newsSlice';
import notificationsReducer from './slices/notificationsSlice';
import searchReducer from './slices/searchSlice';
import themeReducer from './slices/themeSlice';
import userReducer from './slices/userSlice';
import liveMatchesReducer from './slices/liveMatchesSlice';

import { matchesApi } from './api/matchesApi';
import { newsApi } from './api/newsApi';
import { teamsApi } from './api/teamsApi';
import { searchApi } from './api/searchApi';
import { usersApi } from './api/usersApi';
import { authApi } from './api/authApi';
import { playersApi } from './api/playersApi';

export const store = configureStore({
    reducer: {
        // Slices
        auth: authReducer,
        matches: matchesReducer,
        news: newsReducer,
        notifications: notificationsReducer,
        search: searchReducer,
        theme: themeReducer,
        user: userReducer,
        liveMatches: liveMatchesReducer,

        // APIs
        [matchesApi.reducerPath]: matchesApi.reducer,
        [newsApi.reducerPath]: newsApi.reducer,
        [teamsApi.reducerPath]: teamsApi.reducer,
        [searchApi.reducerPath]: searchApi.reducer,
        [usersApi.reducerPath]: usersApi.reducer,
        [authApi.reducerPath]: authApi.reducer,
        [playersApi.reducerPath]: playersApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }).concat(
            matchesApi.middleware,
            newsApi.middleware,
            teamsApi.middleware,
            searchApi.middleware,
            usersApi.middleware,
            authApi.middleware,
            playersApi.middleware
        ),
});

export default store;
