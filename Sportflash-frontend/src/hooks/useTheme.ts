import { useAppSelector } from './redux';
import { darkTheme, lightTheme, Theme } from '@utils/theme';

export const useTheme = (): Theme => {
    const mode = useAppSelector(state => state.theme.mode);
    return mode === 'dark' ? darkTheme : lightTheme;
};
