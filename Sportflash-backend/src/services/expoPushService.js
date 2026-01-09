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
        // Efficiency: In prod, you'd filter by subscription here.
        const users = await User.find({
            pushToken: { $exists: true, $ne: null },
            'preferences.notifications': true
        }).select('pushToken preferences');

        let messages = [];

        for (const user of users) {
            // 2. Apply Custom Filter (e.g. is subscribed to match?)
            if (filterFn && !filterFn(user)) {
                continue;
            }

            if (!Expo.isExpoPushToken(user.pushToken)) {
                console.error(`Push token ${user.pushToken} is not a valid Expo push token`);
                continue;
            }

            messages.push({
                to: user.pushToken,
                sound: 'default',
                title: title,
                body: body,
                data: data,
            });
        }

        // 3. Chuuk Requests
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

        console.log(`🚀 Sent ${messages.length} push notifications: "${title}"`);

    } catch (error) {
        console.error('Error sending push notifications:', error);
    }
};

module.exports = { sendPushNotification };
