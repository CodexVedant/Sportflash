import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// 1. Configure how notifications behave when the app is in Foreground
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

// 2. Register for Push Notifications (Get Token & Permissions)
export async function registerForPushNotificationsAsync(): Promise<string | undefined> {
    let token;

    if (Platform.OS === 'web') {
        console.log('Push notifications not supported on Web yet.');
        return undefined;
    }

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            // alert('Failed to get push token for push notification!');
            console.log('Failed to get push token for push notification!');
            return;
        }

        // Get the token
        try {
            // Check project ID if needed, but usually defaults work in Expo Go/Dev Client unless configured in app.json
            const tokenData = await Notifications.getExpoPushTokenAsync();
            if (tokenData) {
                token = tokenData.data;
                console.log('Push Token:', token);
            }
        } catch (error: any) {
            const errorMessage = error.message || '';
            if (errorMessage.includes('No "projectId" found')) {
                console.log('⚠️ Push Notifications: Missing EAS Project ID in app.json. Run "eas init" to configure.');
            } else if (errorMessage.includes('removed from Expo Go') || errorMessage.includes('development build')) {
                console.log('⚠️ Push Notifications: Remote Push is NOT supported in Expo Go (SDK 53+). Please use a Development Build.');
                // Optional: Set a dummy token if you want to bypass backend checks, or handle graceful degradation
            } else {
                console.error('Error getting push token:', error);
            }
        }
    } else {
        console.log('Must use physical device for Push Notifications');
    }

    return token;
}

// 3. Helper to Schedule Local Notification (Fallback)
export async function scheduleLocalNotification(title: string, body: string, data = {}) {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: title || "SportFlash Update",
            body: body || "Check out the latest score!",
            data: data,
            sound: true,
        },
        trigger: null, // IMMEDIATE
    });
}
