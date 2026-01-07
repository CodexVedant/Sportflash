import { StyleSheet } from 'react-native';
import { theme } from '@utils/theme';

export const styles = StyleSheet.create({

    tabBar: {
        position: 'absolute',
        bottom: 0,
        backgroundColor: 'transparent',
        borderTopWidth: 0,
        height: 80, // Taller tab bar
        paddingBottom: 20,
        elevation: 0,
    }
});
