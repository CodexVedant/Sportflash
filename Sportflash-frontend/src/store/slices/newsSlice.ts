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
            if (state.bookmarks.includes(articleId)) {
                state.bookmarks = state.bookmarks.filter(id => id !== articleId);
            } else {
                state.bookmarks.push(articleId);
            }
        },
    },
});

export const { setNewsCategory, toggleBookmark } = newsSlice.actions;
export default newsSlice.reducer;

