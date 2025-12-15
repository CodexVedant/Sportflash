const Match = require('../models/Match');

// Seed mock matches for development
const seedMatches = async () => {
    try {
        // Clear existing matches
        await Match.deleteMany({});

        const mockMatches = [
            {
                sport: 'cricket',
                league: 'ICC World Cup 2026',
                homeTeam: {
                    name: 'India',
                    logo: '🇮🇳',
                    score: '248/3'
                },
                awayTeam: {
                    name: 'Australia',
                    logo: '🇦🇺',
                    score: '--/--'
                },
                status: 'live',
                scheduledAt: new Date(),
                venue: {
                    name: 'Wankhede Stadium',
                    city: 'Mumbai',
                    country: 'India'
                },
                currentMinute: '42.4 overs',
                cricketData: {
                    overs: '42.4',
                    innings: 1,
                    runRate: 5.88
                },
                apiSource: 'manual'
            },
            {
                sport: 'football',
                league: 'Premier League',
                homeTeam: {
                    name: 'Man Utd',
                    logo: '🔴',
                    score: 2
                },
                awayTeam: {
                    name: 'Chelsea',
                    logo: '🔵',
                    score: 1
                },
                status: 'live',
                scheduledAt: new Date(),
                venue: {
                    name: 'Old Trafford',
                    city: 'Manchester',
                    country: 'England'
                },
                currentMinute: '72\'',
                footballData: {
                    halfTime: true,
                    extraTime: false,
                    penalties: false
                },
                apiSource: 'manual'
            },
            {
                sport: 'basketball',
                league: 'NBA',
                homeTeam: {
                    name: 'Lakers',
                    logo: '🟣',
                    score: 102
                },
                awayTeam: {
                    name: 'Warriors',
                    logo: '🌉',
                    score: 98
                },
                status: 'live',
                scheduledAt: new Date(),
                venue: {
                    name: 'Crypto.com Arena',
                    city: 'Los Angeles',
                    country: 'USA'
                },
                currentMinute: 'Q4 4:21',
                basketballData: {
                    quarter: 4,
                    overtime: false
                },
                apiSource: 'manual'
            },
            {
                sport: 'cricket',
                league: 'ODI Series',
                homeTeam: {
                    name: 'England',
                    logo: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
                    score: null
                },
                awayTeam: {
                    name: 'Pakistan',
                    logo: '🇵🇰',
                    score: null
                },
                status: 'upcoming',
                scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
                venue: {
                    name: 'Lord\'s',
                    city: 'London',
                    country: 'England'
                },
                apiSource: 'manual'
            }
        ];

        const created = await Match.insertMany(mockMatches);
        console.log(`✅ Seeded ${created.length} mock matches`);
        return created;
    } catch (error) {
        console.error('❌ Error seeding matches:', error);
        throw error;
    }
};

module.exports = { seedMatches };
