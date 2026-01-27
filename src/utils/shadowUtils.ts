import { Platform, ViewStyle, TextStyle } from 'react-native';

/**
 * Platform-aware shadow utility
 * Converts React Native shadow props to web-compatible boxShadow
 * Suppresses deprecation warnings on web
 */

interface ShadowProps {
    shadowColor?: string;
    shadowOffset?: { width: number; height: number };
    shadowOpacity?: number;
    shadowRadius?: number;
}

export const createShadow = (props: ShadowProps): ViewStyle | TextStyle => {
    const {
        shadowColor = '#000',
        shadowOffset = { width: 0, height: 2 },
        shadowOpacity = 0.25,
        shadowRadius = 3.84,
    } = props;

    if (Platform.OS === 'web') {
        // Convert to web-compatible boxShadow
        const { width, height } = shadowOffset;
        const alpha = Math.round(shadowOpacity * 255).toString(16).padStart(2, '0');
        const color = shadowColor + alpha;

        return {
            boxShadow: `${width}px ${height}px ${shadowRadius}px ${color}`,
        } as any;
    }

    // Native platforms use standard shadow props
    return {
        shadowColor,
        shadowOffset,
        shadowOpacity,
        shadowRadius,
        elevation: shadowRadius, // Android elevation
    };
};

/**
 * Predefined shadow styles
 */
export const shadows = {
    small: createShadow({
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    }),

    medium: createShadow({
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
    }),

    large: createShadow({
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
    }),
};

/**
 * Text shadow utility for web
 */
interface TextShadowProps {
    textShadowColor?: string;
    textShadowOffset?: { width: number; height: number };
    textShadowRadius?: number;
}

export const createTextShadow = (props: TextShadowProps): TextStyle => {
    const {
        textShadowColor = '#000',
        textShadowOffset = { width: 0, height: 1 },
        textShadowRadius = 2,
    } = props;

    if (Platform.OS === 'web') {
        const { width, height } = textShadowOffset;
        return {
            textShadow: `${width}px ${height}px ${textShadowRadius}px ${textShadowColor}`,
        } as any;
    }

    return {
        textShadowColor,
        textShadowOffset,
        textShadowRadius,
    };
};
