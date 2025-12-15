const express = require('express');
const http = require('http');
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

// Import Routes
const authRoutes = require('./routes/authRoutes');
const matchRoutes = require('./routes/matchRoutes');

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/matches', matchRoutes);


// Socket.IO Connection Handler
io.on('connection', (socket) => {
    console.log(`✅ Client connected: ${socket.id}`);

    // Join match room
    socket.on('join_match', (matchId) => {
        socket.join(`match_${matchId}`);
        console.log(`📺 Client ${socket.id} joined match_${matchId}`);
    });

    // Leave match room
    socket.on('leave_match', (matchId) => {
        socket.leave(`match_${matchId}`);
        console.log(`👋 Client ${socket.id} left match_${matchId}`);
    });

    socket.on('disconnect', () => {
        console.log(`❌ Client disconnected: ${socket.id}`);
    });
});

// Simulate live score updates (for demo purposes)
setInterval(() => {
    io.emit('score_update', {
        matchId: '1',
        homeScore: '248/3',
        awayScore: '--/--',
        currentMinute: '46.1 overs',
        commentary: 'FOUR! Kohli drives through covers for a boundary!'
    });
}, 10000); // Every 10 seconds

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
    console.log(`⚡ Server running on http://localhost:${PORT}`);
    console.log(`🏥 Health check: http://localhost:${PORT}/health`);
    console.log(`🔌 Socket.IO ready for connections`);
    console.log(`📊 Environment: ${process.env.NODE_ENV}`);
});