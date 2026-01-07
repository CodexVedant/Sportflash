import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NewsCategory } from '@app-types/models/news';

export interface NewsState {
    category: NewsCategory;
    bookmarks: string[]; // List of article IDs
}

const initialState: NewsState = {
    category: 'all',
    bookmarks: [],
};

const newsSlice = createSlice({
    name: 'news',
    initialState,
    reducers: {
        setNewsCategory: (state, action: PayloadAction<NewsCategory>) => {
            state.category = action.payload;
        },
        toggleBookmark: (state, action: PayloadAction<string>) => {
            const articleId = action.payload;
            console.log('toggleBookmark called with ID:', articleId);
            console.log('Current bookmarks:', state.bookmarks);

            if (state.bookmarks.includes(articleId)) {
                state.bookmarks = state.bookmarks.filter(id => id !== articleId);
                console.log('Removed bookmark. New bookmarks:', state.bookmarks);
            } else {
                state.bookmarks.push(articleId);
                console.log('Added bookmark. New bookmarks:', state.bookmarks);
            }
        },
    },
});

export const { setNewsCategory, toggleBookmark } = newsSlice.actions;
export default newsSlice.reducer;

