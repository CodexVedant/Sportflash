// // Seed script for SportFlash backend
// // Currently no seed data is configured

// const runSeed = async () => {
//     try {
//         console.log('Starting database seed...');
//         console.log('No seed data available. Add seed data to populate the database.');
//         console.log('Database seed completed.');
//         process.exit(0);
//     } catch (error) {
//         console.error('Seed failed:', error);
//         process.exit(1);
//     }
// };

// // Only run if this file is executed directly
// if (require.main === module) {
//     require('dotenv').config();
//     const connectDB = require('../config/database');

//     connectDB()
//         .then(runSeed)
//         .catch(err => {
//             console.error("DB connection failed:", err);
//             process.exit(1);
//         });
// }

// module.exports = runSeed;
