import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// 1. Configure how notifications behave when the app is in Foreground
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true, // Show the banner even if app is open
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

// 2. Register for Push Notifications (Get Token & Permissions)
export async function registerForPushNotificationsAsync() {
    let token;

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
            alert('Failed to get push token for push notification!');
            return;
        }
        // In a real push setup, we would get the token here:
        // token = (await Notifications.getExpoPushTokenAsync()).data;
    } else {
        // alert('Must use physical device for Push Notifications');
    }

    return token;
}

// 3. Helper to Schedule Local Notification
export async function scheduleLocalNotification(title, body, data = {}) {
    if (Platform.OS === 'web') {
        console.log('🔔 Web Notification:', title, body);
        return;
    }
    await Notifications.scheduleNotificationAsync({
        content: {
            title: title || "SportFlash Update",
            body: body || "Check out the latest score!",
            data: data,
            sound: true, // Play default sound
        },
        trigger: null, // null means "show immediately"
    });
}
