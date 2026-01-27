import { theme } from '@utils/theme';

/**
 * Determine the color based on the sport type
 * @param sport - The sport type (cricket, football, basketball, etc.)
 * @returns The corresponding theme color
 */
export const getSportColor = (sport?: string): string => {
    switch (sport?.toLowerCase()) {
        case 'cricket':
            return theme.colors.cricket;
        case 'football':
            return theme.colors.football;
        case 'basketball':
            return theme.colors.basketball;
        default:
            return theme.colors.primary;
    }
};
