const mongoose = require('mongoose');
const User = require('./src/models/User');
require('dotenv').config({ path: '.env' }); // Load .env (ensure sportflash_dev is used)

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        console.log(`📂 Database Name: ${conn.connection.name}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const verifyPreferences = async () => {
    await connectDB();

    const email = process.argv[2];
    if (!email) {
        console.log('⚠️  Usage: node verify_prefs.js <email>');
        process.exit(1);
    }

    try {
        const user = await User.findOne({ email: email });

        if (!user) {
            console.log(`❌ User not found: ${email}`);
        } else {
            console.log(`\n👤 User: ${user.name} (${user.email})`);
            console.log(`----------------------------------------`);
            console.log(`🔔 Global Notifications: ${user.preferences.notifications ? 'ON' : 'OFF'}`);
            console.log(`📋 Followed Matches: [ ${user.preferences.followedMatches.join(', ')} ]`);
            console.log(`🔑 Push Token: ${user.pushToken ? 'Present' : 'MISSING'}`);
            console.log(`----------------------------------------`);
            console.log('✅ If you see match IDs above, they ARE stored in the DB.');
        }

    } catch (error) {
        console.error(error);
    } finally {
        process.exit(0);
    }
};

verifyPreferences();
