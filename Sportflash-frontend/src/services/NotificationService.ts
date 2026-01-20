import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import Constants, { ExecutionEnvironment } from 'expo-constants'; // Added import

// 1. Configure how notifications behave when the app is in Foreground
// 1. Configure how notifications behave when the app is in Foreground
// Skip this in STANDARD Expo Go on Android to avoid "Remote Notifications removed" error
// Development Builds (Custom Expo Go) have appOwnership 'guest' or null, so they will pass this check.
const isExpoGo = Constants.appOwnership === 'expo';

if (!isExpoGo || Platform.OS !== 'android') {
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowBanner: true,
            shouldPlaySound: true,
            shouldSetBadge: false,
            shouldShowList: true,
        }),
    });
} else {
    // Optional: Log that we are skipping handler setup
    console.log('ℹ️ Skipping Notification Handler setup in Expo Go (Android).');
}

// 2. Register for Push Notifications (Get Token & Permissions)
export async function registerForPushNotificationsAsync(): Promise<string | undefined> {
    let token;

    // Check for Expo Go environment to avoid "Remote Notifications removed" error
    // const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient; // Already defined above
    if (isExpoGo && Platform.OS === 'android') {
        console.log('ℹ️ Skipping Remote Push Registration in Expo Go (Android). Use a Development Build for Push.');
        return undefined;
    }

    if (Platform.OS === 'web') {
        console.log('Push notifications not supported on Web yet.');
        return undefined;
    }

    // Ensure channel is set up before getting token
    await setupNotificationChannel();

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            console.log('Failed to get push token for push notification!');
            return;
        }

        // Get the token
        try {
            // Explicitly pass projectId from app.json to avoid auto-detection failure
            const tokenData = await Notifications.getExpoPushTokenAsync({
                projectId: '7e213f86-8d39-4bba-af75-70e6e1ff2b39'
            });
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
            } else {
                console.error('Error getting push token:', error);
            }
        }
    } else {
        console.log('Must use physical device for Push Notifications');
    }

    return token;
}

// Separate function to ensure Channel is always created
export async function setupNotificationChannel() {
    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('sportflash-notifications', {
            name: 'SportFlash Alerts',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
            sound: 'default', // explicit sound
            enableVibrate: true,
        });
    }
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
