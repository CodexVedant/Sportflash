/**
 * Helper functions and constants for Sidebar
 */

export const MENU_SECTIONS = [
    {
        title: "MENU",
        data: [
            { icon: 'home', label: 'Home', route: 'Home' },
            { icon: 'calendar', label: 'Matches', route: 'Matches' },
            { icon: 'newspaper', label: 'News', route: 'News' },
            { icon: 'trophy', label: 'Series', route: 'Series' },
        ]
    },
    {
        title: "MY ZONE",
        data: [
            { icon: 'star', label: 'Following', route: 'Following' },
            { icon: 'bookmark', label: 'Bookmarks', route: 'Bookmarks' },
        ]
    },
    {
        title: "PREFERENCES",
        data: [
            { icon: 'settings', label: 'Settings', route: 'Settings' },
        ]
    }
];

/**
 * Tab routes that require special navigation handling
 */
export const TAB_ROUTES = ['Home', 'Matches', 'News', 'Profile'];

/**
 * Handle navigation to a route with proper tab/stack navigation
 * @param {Object} navigation - React Navigation object
 * @param {string} targetRoute - Target route name
 * @param {Function} onClose - Callback to close sidebar
 */
export const handleSidebarNavigation = (navigation, targetRoute, onClose) => {
    if (onClose) onClose();

    if (TAB_ROUTES.includes(targetRoute)) {
        // If target is a tab, navigate to Main navigator first
        navigation.navigate('Main', { screen: targetRoute });
    } else {
        // Otherwise navigate directly (for Stack screens)
        navigation.navigate(targetRoute);
    }
};
