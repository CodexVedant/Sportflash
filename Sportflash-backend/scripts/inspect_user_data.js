// Run this script to see the actual data stored in the database for a user
// Usage: node scripts/inspect_user_data.js <email>

const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

// Load Env
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const User = require('../src/models/User');

const emailToFind = process.argv[2] || 'shyamdarji1604@gmail.com'; // Default email if none provided

const inspectUser = async () => {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected.');

        console.log(`\n🔍 Searching for user: ${emailToFind}...`);
        const user = await User.findOne({ email: emailToFind });

        if (!user) {
            console.log('❌ User not found!');
        } else {
            console.log(`\n👤 User Found: ${user.name} (${user.email})`);
            console.log('------------------------------------------------');
            console.log('🔔 Push Token:', user.pushToken ? 'Active ✅' : 'None ❌');
            console.log('\n❤️  PREFERENCES (Stored in DB):');
            console.log('------------------------------------------------');

            console.log('🏏 Followed Matches (IDs):', user.preferences.followedMatches);

            console.log('\n🏆 Favorite Teams:');
            if (user.preferences.favoriteTeams.length === 0) console.log('   (None)');
            user.preferences.favoriteTeams.forEach(t => {
                console.log(`   - [${t.sport.toUpperCase()}] ${t.name} (ID: ${t.id})`);
            });

            console.log('\n🏅 Favorite Leagues:');
            if (user.preferences.favoriteLeagues.length === 0) console.log('   (None)');
            user.preferences.favoriteLeagues.forEach(l => {
                console.log(`   - [${l.sport.toUpperCase()}] ${l.name}`);
            });
            console.log('------------------------------------------------\n');
        }

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
};

inspectUser();
