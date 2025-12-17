const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const axios = require('axios');

// Socket.IO Setup
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || '*',
        methods: ['GET', 'POST']
    }
});

// Fetch Cricket Live Scores (Cricbuzz)
const fetchCricketScores = async () => {
    console.log('Fetching cricket live scores...');
    const options = {
        method: 'GET',
        url: 'https://cricbuzz-cricket.p.rapidapi.com/matches/v1/live',
        headers: {
            'x-rapidapi-key': process.env.RAPIDAPI_KEY || '862dfe30b0msh36b3afa6b8fed96p1bc544jsnfa5dce3dce15',
            'x-rapidapi-host': 'cricbuzz-cricket.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        const cricketMatches = response.data;

        if (cricketMatches) {
            io.emit('cricket_update', cricketMatches);
            console.log('Cricket scores updated:', cricketMatches.typeMatches?.length || 0, 'matches');
            return cricketMatches;
        }
    } catch (error) {
        console.error('Error fetching cricket scores:', error.response?.data?.message || error.message);
        return null;
    }
};

// Fetch Football Live Scores (API-Football)
const fetchFootballScores = async () => {
    console.log('Fetching football live scores...');

    // Get today's date for live fixtures
    const today = new Date().toISOString().split('T')[0];

    const options = {
        method: 'GET',
        url: 'https://api-football-v1.p.rapidapi.com/v3/fixtures',
        params: {
            live: 'all', // Get all live matches
            // Alternatively, you can use: date: today, status: 'LIVE'
        },
        headers: {
            'x-rapidapi-key': process.env.RAPIDAPI_KEY || '862dfe30b0msh36b3afa6b8fed96p1bc544jsnfa5dce3dce15',
            'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        const footballMatches = response.data;

        if (footballMatches?.response) {
            io.emit('football_update', footballMatches);
            console.log('Football scores updated:', footballMatches.response.length, 'matches');
            return footballMatches;
        }
    } catch (error) {
        console.error('Error fetching football scores:', error.response?.data?.message || error.message);
        return null;
    }
};

// Fetch Basketball Live Scores (API-NBA)
const fetchBasketballScores = async () => {
    console.log('   Fetching basketball live scores...');

    // Get today's date
    const today = new Date().toISOString().split('T')[0];

    const options = {
        method: 'GET',
        url: 'https://api-nba-v1.p.rapidapi.com/games',
        params: {
            date: today,
            // You can also use: live: 'all' for only live games
        },
        headers: {
            'x-rapidapi-key': process.env.RAPIDAPI_KEY || '862dfe30b0msh36b3afa6b8fed96p1bc544jsnfa5dce3dce15',
            'x-rapidapi-host': 'api-nba-v1.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        const basketballMatches = response.data;

        if (basketballMatches?.response) {
            io.emit('basketball_update', basketballMatches);
            console.log('Basketball scores updated:', basketballMatches.response.length, 'games');
            return basketballMatches;
        }
    } catch (error) {
        console.error('Error fetching basketball scores:', error.response?.data?.message || error.message);
        return null;
    }
};

// Fetch all live scores
const fetchAllLiveScores = async () => {
    console.log('\n ========== Fetching All Live Scores ==========');

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
        console.log('All scores broadcasted successfully\n');

    } catch (error) {
        console.error('Error in fetchAllLiveScores:', error.message);
    }
};

// Fetch scores immediately on server start
fetchAllLiveScores();

// Fetch scores every 30 seconds
setInterval(fetchAllLiveScores, 30000);

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
        environment: process.env.NODE_ENV
    });
});

// API Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date(),
        environment: process.env.NODE_ENV,
        message: 'SportFlash API is running'
    });
});

// Import Routes
const authRoutes = require('./routes/authRoutes');
const matchRoutes = require('./routes/matchRoutes');

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/matches', matchRoutes);


// Socket.IO Connection Handler
io.on('connection', (socket) => {
    console.log(` Client connected: ${socket.id}`);

    // Join match room
    socket.on('join_match', (matchId) => {
        socket.join(`match_${matchId}`);
        console.log(` Client ${socket.id} joined match_${matchId}`);
    });

    // Leave match room
    socket.on('leave_match', (matchId) => {
        socket.leave(`match_${matchId}`);
        console.log(` Client ${socket.id} left match_${matchId}`);
    });

    socket.on('disconnect', () => {
        console.log(` Client disconnected: ${socket.id}`);
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
server.listen(PORT, () => {
    console.log(` Server running on http://localhost:${PORT}`);
    console.log(` Health check: http://localhost:${PORT}/health`);
    console.log(` Socket.IO ready for connections`);
    console.log(` Environment: ${process.env.NODE_ENV}`);
});