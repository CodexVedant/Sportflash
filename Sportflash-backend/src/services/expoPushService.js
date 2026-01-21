const { Expo } = require('expo-server-sdk');
const User = require('../models/User');

const expo = new Expo();

/**
 * Send push notifications to users
 * @param {string[]} userIds - List of User IDs (optional, if null, send to ALL with preference)
 * @param {string} title 
 * @param {string} body 
 * @param {object} data 
 * @param {Function} filterFn - Optional filter function (user => boolean)
 */
const sendPushNotification = async (title, body, data = {}, filterFn = null) => {
    try {
        // 1. Fetch Users with Push Tokens
        const users = await User.find({
            pushToken: { $exists: true, $ne: null },
            // Removed strict preference check for debugging to ensure we find the user first
            // 'preferences.notifications': true 
        }).select('pushToken preferences email');



        let messages = [];

        for (const user of users) {
            // 2. Apply Custom Filter (e.g. is subscribed to match?)
            if (filterFn) {
                const shouldSend = filterFn(user);
                if (!shouldSend) continue;
            }

            if (!Expo.isExpoPushToken(user.pushToken)) {
                console.error(`   - Invalid Token for ${user.email}: ${user.pushToken}`);
                continue;
            }

            messages.push({
                to: user.pushToken,
                sound: 'default',
                title: title,
                body: body,
                data: data,
                priority: 'high',
                channelId: 'sportflash-notifications',
            });
        }

        // ... sending logic ...

        // ... (rest of sending logic)
        let chunks = expo.chunkPushNotifications(messages);
        let tickets = [];

        for (let chunk of chunks) {
            try {
                let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
                tickets.push(...ticketChunk);
            } catch (error) {
                console.error('Error sending chunk', error);
            }
        }



    } catch (error) {
        console.error('Error sending push notifications:', error);
    }
};

const sendRawPushNotification = async (token, title, body, data = {}) => {
    if (!Expo.isExpoPushToken(token)) return;

    const message = {
        to: token,
        sound: 'default',
        title,
        body,
        data,
        priority: 'high',
        channelId: 'sportflash-notifications',
    };

    try {
        await expo.sendPushNotificationsAsync([message]);
        console.log(`🚀 Sent RAW push to ${token}`);
    } catch (error) {
        console.error('Error sending raw push:', error);
    }
};

module.exports = { sendPushNotification, sendRawPushNotification };
