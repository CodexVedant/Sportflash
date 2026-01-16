import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
import { leaguesApi } from './api/leaguesApi';

// Persist Configs
const newsPersistConfig = {
    key: 'news',
    storage: AsyncStorage,
    whitelist: ['bookmarks'] // Only persist bookmarks
};

const themePersistConfig = {
    key: 'theme',
    storage: AsyncStorage,
};

// Root Reducer
const rootReducer = combineReducers({
    // Slices (some persisted)
    auth: authReducer,
    matches: matchesReducer,
    news: persistReducer(newsPersistConfig, newsReducer),
    notifications: notificationsReducer,
    search: searchReducer,
    theme: persistReducer(themePersistConfig, themeReducer),
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
    [leaguesApi.reducerPath]: leaguesApi.reducer,
});

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
            immutableCheck: { warnAfter: 100 },
        }).concat(
            matchesApi.middleware,
            newsApi.middleware,
            teamsApi.middleware,
            searchApi.middleware,
            usersApi.middleware,
            authApi.middleware,
            playersApi.middleware,
            leaguesApi.middleware
        ),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
