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

const rootReducer = combineReducers({
    auth: authReducer,
    matches: matchesReducer,
    news: newsReducer,
    notifications: persistReducer(
        { key: 'notifications', storage: AsyncStorage, whitelist: ['preferences'] },
        notificationsReducer
    ),
    search: searchReducer,
    theme: themeReducer,
    user: userReducer,
    liveMatches: liveMatchesReducer,
    [matchesApi.reducerPath]: matchesApi.reducer,
    [newsApi.reducerPath]: newsApi.reducer,
    [teamsApi.reducerPath]: teamsApi.reducer,
    [searchApi.reducerPath]: searchApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [playersApi.reducerPath]: playersApi.reducer,
});

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
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

export const persistor = persistStore(store);

export default store;
