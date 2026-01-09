const express = require('express');
const http = require('http');
// Restart Trigger 9
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { Server } = require('socket.io');
require('dotenv').config();

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

// State Cache for Diffing
let previousLiveMatches = {
    football: {},
    basketball: {},
    cricket: {}
};

/**
 * Helper to detecting events and sending push
 */
const checkAndNotify = async (sport, newMatches) => {
    const oldMatches = previousLiveMatches[sport] || {};
    const updatedCache = { ...oldMatches };

    for (const match of newMatches) {
        const matchId = match.id.toString();
        const oldMatch = oldMatches[matchId];

        // Update Cache
        updatedCache[matchId] = match;

        if (!oldMatch) continue; // First load, no notify

        let title = '';
        let body = '';
        let shouldNotify = false;

        // 1. Status Change (e.g. NS -> Live, Live -> FT)
        if (oldMatch.status !== match.status && match.status !== 'NS') {
            shouldNotify = true;
            title = `${match.homeTeam.name} vs ${match.awayTeam.name}`;
            body = `Match Status: ${match.status}`;
        }

        // 2. Score Change / Goal (Football)
        if (sport === 'football') {
            const oldScore = (oldMatch.homeTeam?.score || 0) + (oldMatch.awayTeam?.score || 0);
            const newScore = (match.homeTeam?.score || 0) + (match.awayTeam?.score || 0);
            if (newScore > oldScore) {
                shouldNotify = true;
                title = 'Goal!';
                body = `${match.homeTeam.name} ${match.homeTeam.score} - ${match.awayTeam.score} ${match.awayTeam.name}`;
            }
        }

        // 3. Wicket (Cricket)
        if (sport === 'cricket') {
            // simplified logic, need detailed comparison if scores string is complex
            // Assuming score string changes in a major way or 'wickets' count increases if available
            // For now, rely on status or just Major score updates (e.g. every 5 overs? Hard to track without specialized parser)
            if (oldMatch.status !== match.status) {
                // Covered above
            }
        }

        if (shouldNotify) {
            console.log(`🔔 Triggering Push: ${title}`);
            // Send to Users who follow these teams
            await sendPushNotification(title, body, { matchId: match.id, type: 'match_update' }, (user) => {
                const prefs = user.preferences || {};
                const favTeams = (prefs.favoriteTeams || []).map(t => typeof t === 'string' ? t : t.id);
                // Check if user follows Home or Away team
                return favTeams.includes(match.homeTeam.id.toString()) ||
                    favTeams.includes(match.awayTeam.id.toString());
            });
        }
    }

    // Save minimal cache to save memory
    previousLiveMatches[sport] = updatedCache;
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

        const total = mappedScores.football.length + mappedScores.basketball.length + mappedScores.cricket.length;
        // if (total === 0) console.log('ℹ️  No live matches');
        // console.log(`📊 Stats: ⚽ ${mappedScores.football.length} | 🏀 ${mappedScores.basketball.length} | 🏏 ${mappedScores.cricket.length}`);

    } catch (error) {
        console.error('❌ Error in fetchAllLiveScores:', error.message);
    }
};

// Fetch scores immediately on server start
fetchAllLiveScores();

// Fetch scores every 15 seconds
setInterval(fetchAllLiveScores, 15000);

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
app.use((req, res, next) => {
    const fs = require('fs');
    const path = require('path');
    const logFile = path.resolve('debug_requests.log');
    const msg = `[${new Date().toISOString()}] ${req.method} ${req.url}\n`;
    try {
        fs.appendFileSync(logFile, msg);
    } catch (e) { }
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
    console.log(` Health check: http://localhost:${PORT}/health`);
    console.log(` Socket.IO ready for connections`);
    console.log(` Environment: ${process.env.NODE_ENV}`);
    console.log(` API Provider: AllSportsAPI.com`);
    console.log(` Trial expires: 2026-01-07`);
    console.log('='.repeat(60) + '\n');
});