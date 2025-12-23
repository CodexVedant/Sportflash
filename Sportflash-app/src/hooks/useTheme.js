import { useSelector } from 'react-redux';
import { darkTheme, lightTheme } from '@utils/theme';

export const useTheme = () => {
    const mode = useSelector(state => state.theme.mode);
    return mode === 'dark' ? darkTheme : lightTheme;
};
