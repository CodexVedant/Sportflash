import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Appearance, ColorSchemeName } from 'react-native';

export interface ThemeState {
    mode: ColorSchemeName | 'light' | 'dark';
}

const initialState: ThemeState = {
    mode: Appearance.getColorScheme() || 'dark',
};

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        toggleTheme: (state) => {
            state.mode = state.mode === 'dark' ? 'light' : 'dark';
        },
        setTheme: (state, action: PayloadAction<ColorSchemeName>) => {
            state.mode = action.payload;
        },
    },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
