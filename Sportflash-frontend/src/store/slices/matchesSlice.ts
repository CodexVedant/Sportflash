import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export type FilterType = 'all' | 'live' | 'upcoming' | 'finished';
export type SportType = 'all' | 'football' | 'basketball' | 'cricket' | 'tennis';

export interface MatchesState {
    filter: FilterType;
    selectedSport: SportType;
    favorites: string[]; // List of Match IDs
}

const initialState: MatchesState = {
    filter: 'all',
    selectedSport: 'all',
    favorites: [],
};

const matchesSlice = createSlice({
    name: 'matches',
    initialState,
    reducers: {
        setFilter: (state, action: PayloadAction<FilterType>) => {
            state.filter = action.payload;
        },
        setSelectedSport: (state, action: PayloadAction<SportType>) => {
            state.selectedSport = action.payload;
        },
        toggleFavoriteMatch: (state, action: PayloadAction<string>) => {
            const matchId = action.payload;
            if (state.favorites.includes(matchId)) {
                state.favorites = state.favorites.filter(id => id !== matchId);
            } else {
                state.favorites.push(matchId);
            }
        },
    },
});

export const { setFilter, setSelectedSport, toggleFavoriteMatch } = matchesSlice.actions;
export default matchesSlice.reducer;
