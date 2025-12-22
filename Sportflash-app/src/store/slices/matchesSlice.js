import { createSlice } from '@reduxjs/toolkit';

const matchesSlice = createSlice({
    name: 'matches',
    initialState: {
        filter: 'all', // all, live, upcoming, finished
        selectedSport: 'all',
        favorites: [],
    },
    reducers: {
        setFilter: (state, action) => {
            state.filter = action.payload;
        },
        setSelectedSport: (state, action) => {
            state.selectedSport = action.payload;
        },
        toggleFavoriteMatch: (state, action) => {
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
