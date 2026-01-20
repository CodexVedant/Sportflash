const mongoose = require('mongoose');
const Notification = require('./src/models/Notification');
const User = require('./src/models/User');
require('dotenv').config({ path: '.env' });

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.name}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const createTestNotification = async () => {
    await connectDB();

    const email = process.argv[2];
    if (!email) {
        console.log('⚠️  Usage: node test_notification_db.js <email>');
        process.exit(1);
    }

    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            console.log(`❌ User not found: ${email}`);
            process.exit(1);
        }

        console.log(`👤 Found User: ${user.email}`);

        // Create a fake notification
        const notif = await Notification.create({
            user: user._id,
            title: 'Welcome to SportFlash!',
            body: 'This is a test notification to create your Database Collection.',
            type: 'system',
            data: { test: true }
        });

        console.log(`✅ Notification Saved! ID: ${notif._id}`);
        console.log(`🎉 The 'notifications' collection should now be visible in MongoDB!`);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        process.exit(0);
    }
};

createTestNotification();
