import { createSlice } from '@reduxjs/toolkit';

const searchSlice = createSlice({
    name: 'search',
    initialState: {
        history: [],
        lastQuery: '',
    },
    reducers: {
        addToHistory: (state, action) => {
            const query = action.payload;
            if (!state.history.includes(query)) {
                state.history = [query, ...state.history].slice(0, 10);
            }
        },
        clearHistory: (state) => {
            state.history = [];
        },
        setLastQuery: (state, action) => {
            state.lastQuery = action.payload;
        },
    },
});

export const { addToHistory, clearHistory, setLastQuery } = searchSlice.actions;
export default searchSlice.reducer;
