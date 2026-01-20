const mongoose = require('mongoose');
const User = require('./src/models/User');
require('dotenv').config();

const connectDB = require('./src/config/database');

const clearToken = async () => {
    try {
        await connectDB();
        console.log('🔌 Connected to DB');

        const email = 'shyamdarji1604@gmail.com';
        const user = await User.findOne({ email });

        if (user) {
            console.log(`👤 Found user: ${user.name}`);
            console.log(`🔑 Current Token: ${user.pushToken ? 'EXISTS' : 'NULL'}`);

            user.pushToken = null;
            await user.save();
            console.log('✅ Push Token cleared successfully!');
        } else {
            console.log('❌ User not found');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

clearToken();
