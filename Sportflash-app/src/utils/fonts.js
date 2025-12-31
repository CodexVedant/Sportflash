import { Platform } from 'react-native';

/**
 * Get platform-specific monospace font
 * @returns {string} Font family name for monospace text
 */
export const getMonospaceFont = () => {
    if (Platform.OS === 'ios') {
        return 'Menlo';
    } else if (Platform.OS === 'android') {
        return 'monospace';
    } else {
        // Web - use CSS font stack
        return 'Consolas, Monaco, "Courier New", monospace';
    }
};

/**
 * Platform-aware font configuration
 */
export const fonts = {
    mono: getMonospaceFont(),
    // Add other custom fonts here as needed
};
