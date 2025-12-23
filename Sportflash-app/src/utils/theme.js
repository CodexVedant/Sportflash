const palette = {
    dark: {
        background: '#0f172a',
        surface: 'rgba(30, 41, 59, 0.7)',
        text: '#f8fafc',
        textMuted: '#94a3b8',
        border: 'rgba(255, 255, 255, 0.1)',
        danger: '#ef4444',
        tabBarActive: '#3b82f6',
        tabBarInactive: '#94a3b8',
        glass: 'rgba(30, 41, 59, 0.7)',
    },
    light: {
        background: '#f8fafc',
        surface: '#ffffff',
        text: '#1e293b',
        textMuted: '#64748b',
        border: 'rgba(0, 0, 0, 0.1)',
        danger: '#ef4444',
        tabBarActive: '#2563eb', // slightly darker blue for contrast
        tabBarInactive: '#94a3b8',
        glass: 'rgba(255, 255, 255, 0.9)',
    }
};

const sharedColors = {
    primary: '#3b82f6',
    secondary: '#64748b',
    success: '#10b981',
    warning: '#f59e0b',
    football: '#22c55e',
    basketball: '#f97316',
    cricket: '#3b82f6',
    overlay: 'rgba(0, 0, 0, 0.5)',
    active: '#3b82f6', // Added active color
};

export const darkTheme = {
    colors: { ...palette.dark, ...sharedColors },

    // Typography mapping - Fallback to system fonts
    fonts: {
        regular: 'System',
        medium: 'System',
        semiBold: 'System',
        bold: 'System',
        display: 'System',
        displayMedium: 'System',
    },

    sizes: {
        xs: 12,
        sm: 14,
        md: 16,
        lg: 18,
        xl: 20,
        xxl: 24,
        display: 32,
        hero: 48,
    },

    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        xxl: 48,
    },

    borderRadius: {
        sm: 8,
        md: 12,
        lg: 16,
        xl: 20,
        round: 9999,
    },

    shadows: {
        sm: {
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 2,
        },
        md: {
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.30,
            shadowRadius: 4.65,
            elevation: 4,
        },
        glow: (color) => ({
            shadowColor: color,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.8,
            shadowRadius: 10,
            elevation: 10,
        })
    }
};

export const lightTheme = {
    ...darkTheme,
    colors: { ...palette.light, ...sharedColors },
};

// Default export for backward compatibility (defaults to dark for now)
export const theme = darkTheme;

export default theme;
