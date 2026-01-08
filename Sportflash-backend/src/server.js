const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
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

/**
 * Fetch Football Live Scores from AllSportsAPI
 */
const fetchFootballScores = async () => {
    console.log('⚽ Fetching football live scores...');

    try {
        const matches = await allSportsApi.getFootballLiveScores();

        if (matches && matches.length > 0) {
            // Map to unified format
            const mappedMatches = matches.map(mapFootballMatch).filter(m => m !== null);

            // Broadcast global list update
            io.emit('football_update', mappedMatches);

            // Broadcast specific match updates to rooms
            mappedMatches.forEach(match => {
                if (match?.id) {
                    io.to(`match_${match.id}`).emit('score_update', match);
                }
            });

            console.log(`✅ Football scores updated: ${mappedMatches.length} matches`);
            return mappedMatches;
        } else {
            console.log('ℹ️  No live football matches at the moment');
            io.emit('football_update', []);
            return [];
        }
    } catch (error) {
        console.error('❌ Error fetching football scores:', error.message);
        return null;
    }
};

/**
 * Fetch Basketball Live Scores from AllSportsAPI
 */
const fetchBasketballScores = async () => {
    console.log('🏀 Fetching basketball live scores...');

    try {
        const matches = await allSportsApi.getBasketballLiveScores();

        if (matches && matches.length > 0) {
            // Map to unified format
            const mappedMatches = matches.map(mapBasketballMatch).filter(m => m !== null);

            // Broadcast global list update
            io.emit('basketball_update', mappedMatches);

            // Broadcast specific match updates to rooms
            mappedMatches.forEach(match => {
                if (match?.id) {
                    io.to(`match_${match.id}`).emit('score_update', match);
                }
            });

            console.log(`✅ Basketball scores updated: ${mappedMatches.length} games`);
            return mappedMatches;
        } else {
            console.log('ℹ️  No live basketball games at the moment');
            io.emit('basketball_update', []);
            return [];
        }
    } catch (error) {
        console.error('❌ Error fetching basketball scores:', error.message);
        return null;
    }
};

/**
 * Fetch Cricket Live Scores from AllSportsAPI
 */
const fetchCricketScores = async () => {
    console.log('🏏 Fetching cricket live scores...');

    try {
        const matches = await allSportsApi.getCricketLiveScores();

        if (matches && matches.length > 0) {
            // Map to unified format
            const mappedMatches = matches.map(mapCricketMatch).filter(m => m !== null);

            // Broadcast global list update
            io.emit('cricket_update', mappedMatches);

            // Broadcast specific match updates to rooms
            mappedMatches.forEach(match => {
                if (match?.id) {
                    io.to(`match_${match.id}`).emit('score_update', match);
                }
            });

            console.log(`✅ Cricket scores updated: ${mappedMatches.length} matches`);
            return mappedMatches;
        } else {
            console.log('ℹ️  No live cricket matches at the moment');
            io.emit('cricket_update', []);
            return [];
        }
    } catch (error) {
        console.error('❌ Error fetching cricket scores:', error.message);
        return null;
    }
};

/**
 * Fetch all live scores
 */
const fetchAllLiveScores = async () => {
    console.log('\n🔄 ========== Fetching All Live Scores ==========');

    try {
        // Fetch all sports in parallel
        const [cricket, football, basketball] = await Promise.allSettled([
            fetchCricketScores(),
            fetchFootballScores(),
            fetchBasketballScores()
        ]);

        // Combine all scores
        const allScores = {
            cricket: cricket.status === 'fulfilled' ? cricket.value : null,
            football: football.status === 'fulfilled' ? football.value : null,
            basketball: basketball.status === 'fulfilled' ? basketball.value : null,
            timestamp: new Date().toISOString()
        };

        // Broadcast combined scores
        io.emit('all_scores_update', allScores);
        console.log('✅ All scores broadcasted successfully');
        console.log(`📊 Total matches: ${(allScores.cricket?.length || 0) +
            (allScores.football?.length || 0) +
            (allScores.basketball?.length || 0)
            }`);
        console.log('='.repeat(50) + '\n');

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