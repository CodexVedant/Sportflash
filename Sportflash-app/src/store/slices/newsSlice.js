import { createSlice } from '@reduxjs/toolkit';

const newsSlice = createSlice({
    name: 'news',
    initialState: {
        category: 'all',
        bookmarks: [],
    },
    reducers: {
        setNewsCategory: (state, action) => {
            state.category = action.payload;
        },
        toggleBookmark: (state, action) => {
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
