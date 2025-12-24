import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import { matchesApi } from '../api/matchesApi';

// 1. Adapter Setup
const matchesAdapter = createEntityAdapter({
    selectId: (match) => match.id || match._id,
    sortComparer: (a, b) => 0
});

const initialState = matchesAdapter.getInitialState({
    loading: false,
    error: null,
});

const liveMatchesSlice = createSlice({
    name: 'liveMatches',
    initialState,
    reducers: {
        // Socket updates use this
        upsertMatches: (state, action) => {
            matchesAdapter.upsertMany(state, action.payload);
        },
        // Handles "Match Finished" events from socket
        removeMatch: (state, action) => {
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
export const {
    selectAll: selectAllLiveMatches,
    selectById: selectMatchById,
    selectIds: selectLiveMatchIds
} = matchesAdapter.getSelectors(state => state.liveMatches);

export default liveMatchesSlice.reducer;
