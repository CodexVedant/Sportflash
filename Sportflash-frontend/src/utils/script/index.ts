/**
 * Central export file for all helper functions
 * Import helpers using: import { helperFunction } from '@utils/script';
 */

// MatchCard helpers
export { getSportColor } from './MatchCard.helpers';

// BasketballMatchCard helpers
export { parseQuarters, getQuarterScore } from './BasketballMatchCard.helpers';

// HomeScreen helpers
export {
    SPORT_TABS,
    DESKTOP_BREAKPOINT,
    MAX_CONTENT_WIDTH,
    isDesktopSize,
    getContentWidth,
    getMockNotifications
} from './HomeScreen.helpers';

// Sidebar helpers
export {
    MENU_SECTIONS,
    TAB_ROUTES,
    handleSidebarNavigation
} from './Sidebar.helpers';

// UpcomingMatchesScreen helpers
export {
    formatMatchDateTime,
    groupMatchesByDate,
    filterMatchesBySport,
    getNextSevenDays,
    isMatchSoon,
    getMatchCountdown
} from './UpcomingMatchesScreen.helpers';

// Add more helper exports here as needed
