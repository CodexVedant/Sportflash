const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

// Mock live matches endpoint
app.get('/api/matches/live', (req, res) => {
    res.json({
        success: true,
        data: [
            {
                _id: '1',
                sport: 'cricket',
                homeTeam: { name: 'India', logo: '🇮🇳', score: '245/6' },
                awayTeam: { name: 'Australia', logo: '🇦🇺', score: '198/10' },
                status: 'live',
                league: 'World Cup 2024',
                currentMinute: '45.2 overs'
            },
            {
                _id: '2',
                sport: 'football',
                homeTeam: { name: 'Real Madrid', logo: '⚪', score: 2 },
                awayTeam: { name: 'Barcelona', logo: '🔵', score: 1 },
                status: 'live',
                league: 'La Liga',
                currentMinute: '67\''
            }
        ]
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(` Server running on http://localhost:${PORT}`);
    console.log(` Health check: http://localhost:${PORT}/health`);
});