export interface MenuItem {
    icon: any; // Ionicons name
    label: string;
    route: string;
}

export interface MenuSection {
    title: string;
    data: MenuItem[];
}

export const MENU_SECTIONS: MenuSection[] = [
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

export const TAB_ROUTES = ['Home', 'Matches', 'News', 'Profile'];

export const handleSidebarNavigation = (navigation: any, targetRoute: string, onClose?: () => void) => {
    if (onClose) onClose();

    if (TAB_ROUTES.includes(targetRoute)) {
        // If target is a tab, navigate to Main navigator first
        navigation.navigate('Main', { screen: targetRoute });
    } else {
        // Otherwise navigate directly (for Stack screens)
        navigation.navigate(targetRoute as any); // Cast avoiding complex nav types for this helper
    }
};
