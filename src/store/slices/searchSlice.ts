import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SearchState {
    history: string[];
    lastQuery: string;
}

const initialState: SearchState = {
    history: [],
    lastQuery: '',
};

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        addToHistory: (state, action: PayloadAction<string>) => {
            const query = action.payload;
            if (!state.history.includes(query)) {
                state.history = [query, ...state.history].slice(0, 10);
            }
        },
        clearHistory: (state) => {
            state.history = [];
        },
        setLastQuery: (state, action: PayloadAction<string>) => {
            state.lastQuery = action.payload;
        },
    },
});

export const { addToHistory, clearHistory, setLastQuery } = searchSlice.actions;
export default searchSlice.reducer;
