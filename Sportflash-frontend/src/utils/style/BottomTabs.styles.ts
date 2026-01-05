import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({

    tabBar: {
        position: 'absolute' as const,
        bottom: 0,
        backgroundColor: 'rgb(15, 23, 42)', // Semi-transparent dark background
        borderTopWidth: 0,
        height: 80, // Taller tab bar
        paddingBottom: 20,
        elevation: 0,
    }
});
