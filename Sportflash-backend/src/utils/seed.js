const { seedMatches } = require('../utils/seedData');

// Run seed script
const runSeed = async () => {
    try {
        console.log('🌱 Starting database seed...');

        // Seed matches
        await seedMatches();

        console.log('✅ Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seed failed:', error);
        process.exit(1);
    }
};

// Only run if this file is executed directly
if (require.main === module) {
    // Load environment variables
    require('dotenv').config();

    // Connect to database
    const connectDB = require('../config/database');
    connectDB().then(() => {
        runSeed();
    });
}

module.exports = runSeed;
