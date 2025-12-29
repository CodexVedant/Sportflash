import { theme } from '@utils/theme';

/**
 * Determine the color based on the sport type
 * @param {string} sport - The sport type (cricket, football, basketball, etc.)
 * @returns {string} The corresponding theme color
 */
export const getSportColor = (sport) => {
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
