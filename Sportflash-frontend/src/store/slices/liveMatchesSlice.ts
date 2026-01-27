import { createSlice, createEntityAdapter, PayloadAction } from '@reduxjs/toolkit';
import { matchesApi } from '../api/matchesApi';
import { Match } from '@app-types/models/match';

// 1. Adapter Setup
const matchesAdapter = createEntityAdapter<Match>({
    sortComparer: (a, b) => 0
});

const initialState = matchesAdapter.getInitialState({
    loading: false,
    error: null as string | null,
});

const liveMatchesSlice = createSlice({
    name: 'liveMatches',
    initialState,
    reducers: {
        // Socket updates use this
        upsertMatches: (state, action: PayloadAction<Match[]>) => {
            matchesAdapter.upsertMany(state, action.payload);
        },
        // Handles "Match Finished" events from socket
        removeMatch: (state, action: PayloadAction<string>) => {
            matchesAdapter.removeOne(state, action.payload);
        },
        clearAllMatches: (state) => {
            matchesAdapter.removeAll(state);
        }
    },
    extraReducers: (builder) => {
        // Sync with Initial API Fetch
        builder.addMatcher(
            matchesApi.endpoints.getLiveMatches.matchFulfilled,
            (state, action) => {
                // Replace all current matches
                matchesAdapter.setAll(state, action.payload);
            }
        );
    }
});

export const { upsertMatches, removeMatch, clearAllMatches } = liveMatchesSlice.actions;

// Selectors
// Need to define RootState properly later, for now using any
export const {
    selectAll: selectAllLiveMatches,
    selectById: selectMatchById,
    selectIds: selectLiveMatchIds
} = matchesAdapter.getSelectors((state: any) => state.liveMatches);

export default liveMatchesSlice.reducer;

