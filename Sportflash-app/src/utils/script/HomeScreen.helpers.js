/**
 * Helper functions and constants for HomeScreen
 */

/**
 * Sport tabs configuration
 */
export const SPORT_TABS = [
    { id: 'cricket', label: 'Cricket', icon: 'baseball-outline' },
    { id: 'football', label: 'Football', icon: 'football-outline' },
    { id: 'basketball', label: 'Basketball', icon: 'basketball-outline' },
];

/**
 * Responsive breakpoint for desktop layout
 */
export const DESKTOP_BREAKPOINT = 768;

/**
 * Maximum content width for desktop
 */
export const MAX_CONTENT_WIDTH = 1200;

/**
 * Check if the current width is desktop size
 * @param {number} width - Current window width
 * @returns {boolean} True if desktop size
 */
export const isDesktopSize = (width) => width > DESKTOP_BREAKPOINT;

/**
 * Calculate content width based on screen size
 * @param {number} width - Current window width
 * @returns {number} Calculated content width
 */
export const getContentWidth = (width) => {
    return isDesktopSize(width) ? Math.min(width, MAX_CONTENT_WIDTH) : width;
};

/**
 * Mock notifications data
 * TODO: Replace with actual API call
 */
export const getMockNotifications = () => [
    {
        id: 1,
        type: 'match_start',
        title: 'Match Starting Soon',
        message: 'India vs Australia starts in 15 minutes',
        timestamp: new Date(),
        read: false,
    },
    {
        id: 2,
        type: 'goal',
        title: 'GOAL!',
        message: 'Manchester United scored! 1-0',
        timestamp: new Date(Date.now() - 300000),
        read: false,
    },
];
