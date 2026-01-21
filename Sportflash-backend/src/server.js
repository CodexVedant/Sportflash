const express = require('express');
const http = require('http');
// Restart Trigger 9
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
// Test Endpoint for Manual Push


const { Server } = require('socket.io');
const path = require('path');
const fs = require('fs');

// Load environment variables from multiple possible locations
// Priority: 1) /etc/secrets/.env (Render Secret Files)
//          2) .env in project root
//          3) .env in src directory
const envPaths = [
    '/etc/secrets/.env',
    path.join(__dirname, '..', '.env'),
    path.join(__dirname, '.env')
];

for (const envPath of envPaths) {
    if (fs.existsSync(envPath)) {
        console.log(`📄 Loading environment from: ${envPath}`);
        require('dotenv').config({ path: envPath });
        break;
    }
}

// Fallback to default dotenv behavior if no file found
if (!process.env.ALLSPORTS_API_KEY) {
    require('dotenv').config();
}

const app = express();
const server = http.createServer(app);

// Socket.IO Setup
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || '*',
        methods: ['GET', 'POST']
    }
});

// Import AllSportsAPI Service
const allSportsApi = require('./services/allSportsApiService');
const { mapFootballMatch,
    mapBasketballMatch,
    mapCricketMatch
} = require('./utils/dataMappers');

// ==================== LIVE SCORE FETCHING ====================

const { sendPushNotification } = require('./services/expoPushService');
const LiveMatchState = require('./models/LiveMatchState');
const Notification = require('./models/Notification'); // Import Notification Model

/**
 * Helper to detecting events and sending push
 */
const checkAndNotify = async (sport, newMatches) => {
    // We process matches sequentially to avoid race conditions on DB
    for (const match of newMatches) {
        const matchId = match.id.toString();

        try {
            // 1. Fetch Previous State from DB
            let state = await LiveMatchState.findOne({ matchId });

            // Helper to parse wickets: "123/4" -> 4
            const getWickets = (s) => {
                if (!s) return 0;
                const matchW = s.match(/\/(\d+)/);
                return matchW ? parseInt(matchW[1]) : 0;
            };

            // Helper to parse runs: "123/4" -> 123
            const getRuns = (s) => {
                if (!s) return 0;
                const matchR = s.match(/^(\d+)/);
                return matchR ? parseInt(matchR[1]) : 0;
            };

            if (!state) {
                // First time seeing this match - Init State & Skip Notify
                await LiveMatchState.create({
                    matchId,
                    sport,
                    status: match.status,
                    lastTotalScore: (parseInt(match.homeTeam?.score) || 0) + (parseInt(match.awayTeam?.score) || 0),
                    lastHomeScoreStr: match.homeTeam?.score || '',
                    lastAwayScoreStr: match.awayTeam?.score || '',
                    lastHomeWickets: getWickets(match.homeTeam?.score),
                    lastAwayWickets: getWickets(match.awayTeam?.score),
                    lastStatus: match.status,
                    lastUpdated: new Date()
                });
                continue;
            }

            let title = '';
            let body = '';
            let shouldNotify = false;
            let updates = {};

            // ================= STATUS CHANGE =================
            const statusEvents = ['Innings Break', 'Tea Break', 'Lunch', 'Stumps', 'Rain Delay', 'Finished', 'FT', 'HT', 'Half Time', 'Q1', 'Q2', 'Q3', 'Q4', 'OT'];
            if (state.lastStatus !== match.status && (match.status !== 'NS' && match.status !== 'Not Started')) {
                if (statusEvents.includes(match.status) || match.status === 'Live') {
                    shouldNotify = true;
                    title = `Match Update: ${match.status}`;
                    body = `${match.homeTeam.name} vs ${match.awayTeam.name}`;
                }
                state.lastStatus = match.status;
            }

            // ================= FOOTBALL =================
            if (sport === 'football') {
                const newTotal = (parseInt(match.homeTeam?.score) || 0) + (parseInt(match.awayTeam?.score) || 0);

                if (newTotal > state.lastTotalScore) {
                    shouldNotify = true;
                    title = '⚽ GOAL!';
                    body = `${match.homeTeam.name} ${match.homeTeam.score} - ${match.awayTeam.score} ${match.awayTeam.name}`;
                    state.lastTotalScore = newTotal;
                }
            }

            // ================= BASKETBALL =================
            // User Request: Only notify on Quarter/Status changes, NOT every point.
            // This is handled by the Status Change block above. 
            // We removed the 'Point Scored' logic here to prevent spam.

            // ================= CRICKET =================
            if (sport === 'cricket') {
                const newHomeW = getWickets(match.homeTeam?.score);
                const newAwayW = getWickets(match.awayTeam?.score);

                // Wickets
                if (newHomeW > state.lastHomeWickets || newAwayW > state.lastAwayWickets) {
                    shouldNotify = true;
                    title = '☝️ WICKET!';
                    body = `${match.homeTeam.name} vs ${match.awayTeam.name}: Wicket fell! (${match.homeTeam.score} v ${match.awayTeam.score})`;
                    state.lastHomeWickets = newHomeW;
                    state.lastAwayWickets = newAwayW;
                }

                // 4s and 6s Logic (Runs Diff)
                const newHomeRuns = getRuns(match.homeTeam?.score);
                const oldHomeRuns = getRuns(state.lastHomeScoreStr);
                const diffHome = newHomeRuns - oldHomeRuns;

                const newAwayRuns = getRuns(match.awayTeam?.score);
                const oldAwayRuns = getRuns(state.lastAwayScoreStr);
                const diffAway = newAwayRuns - oldAwayRuns;

                if (diffHome === 4 || diffAway === 4) {
                    shouldNotify = true;
                    // title = 'FOUR! 4️⃣';  // Optional: Uncomment to notify for 4s
                    // body = diffHome === 4 
                    //    ? `${match.homeTeam.name}: ${match.homeTeam.score}` 
                    //    : `${match.awayTeam.name}: ${match.awayTeam.score}`;
                }
                else if (diffHome === 6 || diffAway === 6) {
                    shouldNotify = true;
                    title = 'SIX! 6️⃣';
                    body = diffHome === 6
                        ? `${match.homeTeam.name}: ${match.homeTeam.score}`
                        : `${match.awayTeam.name}: ${match.awayTeam.score}`;
                }

                // Update raw strings
                state.lastHomeScoreStr = match.homeTeam?.score || '';
                state.lastAwayScoreStr = match.awayTeam?.score || '';
            }

            if (shouldNotify) {
                // await sendPushNotification(...)
                // console.log(`🔔 PUSH TRIGGERED: ${title}`);

                await sendPushNotification(title, body, { matchId: match.id, sport: sport, type: 'match_update' }, (user) => {
                    // 1. Check Global Notification Setting
                    if (!user.preferences?.notifications) {
                        return false;
                    }

                    // 2. STRICT: Check if user follows this specific match
                    const matchIdStr = String(match.id);
                    const followedCallback = user.preferences?.followedMatches || [];

                    if (followedCallback.includes(matchIdStr)) {
                        // SAVE to Database for Persistence
                        try {
                            if (title && body) {
                                Notification.create({
                                    user: user._id,
                                    title: title,
                                    body: body,
                                    data: { matchId: match.id, sport: sport, type: 'match_update' },
                                    type: 'match_update'
                                });
                            }
                        } catch (err) { console.error('Error saving notification to DB:', err.message); }

                        return true;
                    }

                    return false;
                });

                state.updatedAt = new Date();
                await state.save();
            } else {
                // Update state silently to prevent stale baselines
                let rawChanged = false;
                if (sport === 'cricket') {
                    if (match.homeTeam?.score !== state.lastHomeScoreStr) rawChanged = true;
                    state.lastHomeScoreStr = match.homeTeam?.score || '';
                    state.lastAwayScoreStr = match.awayTeam?.score || '';
                } else {
                    const currentTotal = (parseInt(match.homeTeam?.score) || 0) + (parseInt(match.awayTeam?.score) || 0);
                    if (currentTotal !== state.lastTotalScore) {
                        state.lastTotalScore = currentTotal;
                        rawChanged = true;
                    }
                }

                if (rawChanged || state.lastStatus !== match.status) {
                    state.lastStatus = match.status;
                    state.updatedAt = new Date();
                    await state.save();
                }
            }

        } catch (e) {
            console.error(`Error processing match ${matchId}:`, e.message);
        }
    }
};

/**
 * Fetch All Live Scores from AllSportsAPI
 */
const fetchAllLiveScores = async () => {
    // console.log('\n🔄 ========== Fetching All Live Scores ==========');

    try {
        const allScores = await allSportsApi.getAllLiveScores();

        const mappedScores = {
            football: (allScores.football || []).map(mapFootballMatch).filter(m => m !== null),
            basketball: (allScores.basketball || []).map(mapBasketballMatch).filter(m => m !== null),
            cricket: (allScores.cricket || []).map(mapCricketMatch).filter(m => m !== null),
        };

        // Broadcast to Socket
        if (mappedScores.football.length > 0) io.emit('football_update', mappedScores.football);
        if (mappedScores.basketball.length > 0) io.emit('basketball_update', mappedScores.basketball);
        if (mappedScores.cricket.length > 0) io.emit('cricket_update', mappedScores.cricket);

        // Unified broadcast
        io.emit('all_scores_update', {
            football: mappedScores.football,
            basketball: mappedScores.basketball,
            cricket: mappedScores.cricket,
            timestamp: new Date().toISOString()
        });

        // CHECK TRIGGERS & SEND PUSH
        await checkAndNotify('football', mappedScores.football);
        await checkAndNotify('basketball', mappedScores.basketball);
        await checkAndNotify('cricket', mappedScores.cricket);

        // const total = mappedScores.football.length + mappedScores.basketball.length + mappedScores.cricket.length;
        // console.log(`📊 Stats: ⚽ ${mappedScores.football.length} | 🏀 ${mappedScores.basketball.length} | 🏏 ${mappedScores.cricket.length}`);

    } catch (error) {
        console.error('❌ Error in fetchAllLiveScores:', error.message);
    }
};

// Fetch scores immediately on server start
fetchAllLiveScores();

// Fetch scores every 5 seconds (Reduced from 15s to catch events faster)
setInterval(fetchAllLiveScores, 5000);

// Connect to Database
const connectDB = require('./config/database');
connectDB();

// Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Global Request Logger
// Global Request Logger - Removed
app.use((req, res, next) => {
    next();
});

// Make io accessible to routes
app.set('io', io);

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date(),
        environment: process.env.NODE_ENV,
        api: 'AllSportsAPI'
    });
});

// API Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date(),
        environment: process.env.NODE_ENV,
        message: 'SportFlash API is running',
        apiProvider: 'AllSportsAPI.com',
        trialExpiry: '2026-01-07'
    });
});

// Import Routes
const authRoutes = require('./routes/authRoutes');
const matchRoutes = require('./routes/matchRoutes');
const newsRoutes = require('./routes/newsRoutes');

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/teams', require('./routes/teamRoutes'));
app.use('/api/players', require('./routes/playerRoutes'));
app.use('/api/news', newsRoutes);
app.use('/api/notifications', require('./routes/notificationRoutes')); // Add Notification Routes

// Test Endpoint for Manual Push (GET for easy browser test)
app.get('/api/test-push', async (req, res) => {
    const { email } = req.query; // Use query for GET
    console.log('🧪 Manual Push Triggered for:', email || 'All Users');

    try {
        const User = require('./models/User');
        const { sendRawPushNotification } = require('./services/expoPushService');

        const filter = email ? { email } : {};
        const users = await User.find(filter);

        let sentCount = 0;
        for (const user of users) {
            if (user.pushToken) {
                await sendRawPushNotification(
                    user.pushToken,
                    '🔔 Match Update',
                    'Australia 390/6 (This is a Backend Push)',
                    { type: 'test', score: '390/6' } // Data payload
                );
                sentCount++;
            }
        }
        res.json({ success: true, message: `Sent test push to ${sentCount} users.` });
    } catch (e) {
        console.error('Test Push Error:', e);
        res.status(500).json({ error: e.message });
    }
});
// Socket.IO Connection Handler
io.on('connection', (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    // Send current scores immediately on connection
    socket.emit('connection_established', {
        message: 'Connected to SportFlash Live Scores',
        timestamp: new Date().toISOString()
    });

    // Join match room
    socket.on('join_match', (matchId) => {
        socket.join(`match_${matchId}`);
        console.log(`📍 Client ${socket.id} joined match_${matchId}`);
    });

    // Leave match room
    socket.on('leave_match', (matchId) => {
        socket.leave(`match_${matchId}`);
        console.log(`📍 Client ${socket.id} left match_${matchId}`);
    });

    // Request immediate score update
    socket.on('request_scores', async (sport) => {
        console.log(`🔄 Client ${socket.id} requested ${sport || 'all'} scores`);

        if (!sport || sport === 'all') {
            await fetchAllLiveScores();
        } else {
            switch (sport.toLowerCase()) {
                case 'football':
                case 'soccer':
                    await fetchFootballScores();
                    break;
                case 'basketball':
                    await fetchBasketballScores();
                    break;
                case 'cricket':
                    await fetchCricketScores();
                    break;
            }
        }
    });

    socket.on('disconnect', () => {
        console.log(`🔌 Client disconnected: ${socket.id}`);
    });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
    console.log('\n' + '='.repeat(60));
    console.log(' SportFlash Server Started');
    console.log('='.repeat(60));
    console.log(` Server running on http://localhost:${PORT}`);
    console.log(` Network access: http://192.168.1.5:${PORT}`);
    console.log(` Health check: http://localhost:${PORT}/health`);
    console.log(` Socket.IO ready for connections`);
    console.log(` Environment: ${process.env.NODE_ENV}`);
    console.log(` API Provider: AllSportsAPI.com`);
    console.log(` Trial expires: 2026-01-07`);
    console.log('='.repeat(60) + '\n');
});