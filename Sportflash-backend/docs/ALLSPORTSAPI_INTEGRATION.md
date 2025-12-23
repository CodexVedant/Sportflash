# AllSportsAPI Integration Guide

## Overview

Sportflash now uses **AllSportsAPI.com** as the primary data provider for live sports scores, fixtures, standings, and statistics across Football, Basketball, and Cricket.

### API Details
- **Provider**: AllSportsAPI.com
- **API Key**: `655722cb329281a624e579fbb83f4542a6f3d381cfebb41fbdff146179cb1fcc`
- **Trial Period**: Until **2026-01-07**
- **Documentation**: https://allsportsapi.com

---

## Supported Sports

### ⚽ Football (Soccer)
- **Base URL**: `https://apiv2.allsportsapi.com/football/`
- **Coverage**: 400+ leagues worldwide
- **Features**: Live scores, fixtures, standings, top scorers, teams, players, H2H, statistics

### 🏀 Basketball
- **Base URL**: `https://apiv2.allsportsapi.com/basketball/`
- **Coverage**: NBA, international leagues
- **Features**: Live scores, fixtures, standings, teams, player statistics, quarter scores

### 🏏 Cricket
- **Base URL**: `https://apiv2.allsportsapi.com/cricket/`
- **Coverage**: International matches, IPL, BBL, PSL, etc.
- **Features**: Live scores, fixtures, standings, scorecards, commentary, ball-by-ball updates

---

## Key Endpoints Available

### Football
1. **Countries** - Get list of supported countries
2. **Leagues** - Get available competitions
3. **Livescore** - Real-time match data with lineups, statistics, goalscorers
4. **Fixtures** - Upcoming and past matches
5. **Standings** - League tables
6. **Topscorers** - Top goal scorers by league
7. **Teams** - Team information and logos
8. **Players** - Player statistics
9. **H2H** - Head-to-head records
10. **Videos** - Match highlights
11. **Odds** - Betting odds

### Basketball
1. **Countries** - Get list of supported countries
2. **Leagues** - Available competitions
3. **Livescore** - Real-time games with quarter scores, player stats
4. **Fixtures** - Schedule
5. **Standings** - Conference/division standings
6. **Teams** - Team data
7. **H2H** - Head-to-head records
8. **Odds** - Betting odds

### Cricket
1. **Leagues** - Available tournaments
2. **Livescore** - Live matches with scorecards, commentary
3. **Fixtures** - Match schedule
4. **Standings** - Tournament tables
5. **Teams** - Team information
6. **H2H** - Head-to-head records
7. **Odds** - Betting odds

---

## Implementation

### Service Layer
Location: `src/services/allSportsApiService.js`

```javascript
const allSportsApi = require('./services/allSportsApiService');

// Get football live scores
const footballMatches = await allSportsApi.getFootballLiveScores();

// Get basketball fixtures for a specific date
const basketballFixtures = await allSportsApi.getBasketballFixtures({ 
    date: '2025-12-23' 
});

// Get cricket standings
const cricketStandings = await allSportsApi.getCricketStandings(leagueId);

// Get all live scores
const allScores = await allSportsApi.getAllLiveScores();
```

### Data Mappers
Location: `src/utils/dataMappers.js`

Transforms AllSportsAPI responses into a unified format for the frontend:

```javascript
const { mapFootballMatch, mapBasketballMatch, mapCricketMatch } = require('./utils/dataMappers');

const mappedMatch = mapFootballMatch(rawMatch);
```

---

## API Endpoints (Backend)

### Get All Matches
```
GET /api/matches
Query Parameters:
  - sport: football|basketball|cricket (optional)
  - date: YYYY-MM-DD (optional)
  - league: league_id (optional)
```

### Get Live Matches
```
GET /api/matches/live
Query Parameters:
  - sport: football|basketball|cricket (optional)
```

### Get Matches by Sport
```
GET /api/matches/sport/:sport
Path Parameters:
  - sport: football|basketball|cricket
Query Parameters:
  - date: YYYY-MM-DD (optional)
  - league: league_id (optional)
  - team: team_id (optional)
```

### Get Single Match
```
GET /api/matches/:id
Path Parameters:
  - id: match_id
Query Parameters:
  - sport: football|basketball|cricket (required)
```

### Get Upcoming Matches
```
GET /api/matches/upcoming
Query Parameters:
  - sport: football|basketball|cricket (optional)
  - days: number of days ahead (default: 7)
```

### Get Leagues
```
GET /api/matches/leagues
Query Parameters:
  - sport: football|basketball|cricket (required)
  - country: country_id (optional)
```

### Get Standings
```
GET /api/matches/standings
Query Parameters:
  - sport: football|basketball|cricket (required)
  - league: league_id (required)
```

---

## Socket.IO Events

### Server → Client Events

#### `football_update`
Emitted when football scores are updated
```javascript
socket.on('football_update', (matches) => {
    console.log('Football matches:', matches);
});
```

#### `basketball_update`
Emitted when basketball scores are updated
```javascript
socket.on('basketball_update', (matches) => {
    console.log('Basketball matches:', matches);
});
```

#### `cricket_update`
Emitted when cricket scores are updated
```javascript
socket.on('cricket_update', (matches) => {
    console.log('Cricket matches:', matches);
});
```

#### `all_scores_update`
Emitted when all sports scores are updated
```javascript
socket.on('all_scores_update', (allScores) => {
    console.log('All scores:', allScores);
    // allScores = { football: [...], basketball: [...], cricket: [...], timestamp: '...' }
});
```

#### `connection_established`
Emitted when client connects
```javascript
socket.on('connection_established', (data) => {
    console.log('Connected:', data.message);
});
```

### Client → Server Events

#### `join_match`
Join a specific match room for updates
```javascript
socket.emit('join_match', matchId);
```

#### `leave_match`
Leave a match room
```javascript
socket.emit('leave_match', matchId);
```

#### `request_scores`
Request immediate score update
```javascript
socket.emit('request_scores', 'football'); // or 'basketball', 'cricket', 'all'
```

---

## Data Format

### Football Match Object
```javascript
{
    id: "11205",
    sport: "football",
    status: "live|finished|upcoming",
    date: "2021-05-21",
    time: "11:05",
    league: {
        id: "49",
        name: "Premier League",
        logo: "https://...",
        country: "England",
        countryLogo: "https://...",
        round: "22",
        season: "2021/2022"
    },
    homeTeam: {
        id: "1056",
        name: "Manchester United",
        logo: "https://...",
        score: "2",
        formation: "4-3-3"
    },
    awayTeam: {
        id: "399",
        name: "Liverpool",
        logo: "https://...",
        score: "1",
        formation: "4-2-3-1"
    },
    venue: {
        name: "Old Trafford",
        referee: "Michael Oliver"
    },
    score: {
        halftime: "1 - 0",
        fulltime: "2 - 1",
        penalty: null
    },
    currentMinute: "90+2",
    isLive: true,
    goalscorers: [...],
    cards: [...],
    substitutes: [...],
    lineups: {...},
    statistics: [...]
}
```

### Basketball Match Object
```javascript
{
    id: "41223",
    sport: "basketball",
    status: "Finished|In Progress",
    date: "2022-04-21",
    time: "01:00",
    league: {
        id: "766",
        name: "NBA",
        country: "USA",
        season: "2021/2022"
    },
    homeTeam: {
        id: "7",
        name: "Boston Celtics",
        logo: "https://...",
        score: "114"
    },
    awayTeam: {
        id: "2",
        name: "Brooklyn Nets",
        logo: "https://...",
        score: "107"
    },
    score: {
        final: "114 - 107",
        quarters: {
            "1stQuarter": [{ score_home: "24", score_away: "33" }],
            "2ndQuarter": [{ score_home: "31", score_away: "32" }],
            "3rdQuarter": [{ score_home: "30", score_away: "25" }],
            "4thQuarter": [{ score_home: "29", score_away: "17" }]
        }
    },
    currentQuarter: "4th",
    isLive: false,
    lineups: {...},
    statistics: [...],
    playerStatistics: {...}
}
```

### Cricket Match Object
```javascript
{
    id: "490",
    sport: "cricket",
    status: "In Progress|Finished",
    statusInfo: "Day 1 - Session 1: England chose to bat.",
    dateStart: "2022-03-16",
    dateStop: "2022-03-20",
    time: "15:00",
    league: {
        id: "741",
        name: "England tour of West Indies",
        country: "Cricket",
        season: "2021/22"
    },
    homeTeam: {
        id: "135",
        name: "England",
        logo: "https://...",
        score: "29/1",
        runRate: "1.80"
    },
    awayTeam: {
        id: "134",
        name: "West Indies",
        logo: "https://...",
        score: "",
        runRate: null
    },
    venue: {
        name: "Kensington Oval, Bridgetown, Barbados"
    },
    matchType: "TEST",
    toss: "England, elected to bat first",
    manOfMatch: "",
    isLive: true,
    scorecard: {...},
    comments: {...},
    wickets: {...},
    extra: {...},
    lineups: {...}
}
```

---

## Update Frequency

- **Live Scores**: Updated every **2 minutes** (120000ms)
- **On-Demand**: Clients can request immediate updates via Socket.IO `request_scores` event

---

## Rate Limits

AllSportsAPI has generous rate limits. The current implementation:
- Fetches all sports every 2 minutes
- Supports on-demand requests from clients
- No specific rate limit mentioned in trial plan

---

## Error Handling

All API calls include comprehensive error handling:

```javascript
try {
    const matches = await allSportsApi.getFootballLiveScores();
    // Process matches
} catch (error) {
    console.error('Error fetching football scores:', error.message);
    // Fallback or retry logic
}
```

---

## Testing the Integration

### 1. Test API Connection
```bash
# Start the backend server
npm run dev
```

### 2. Check Health Endpoint
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
    "status": "ok",
    "timestamp": "2025-12-23T...",
    "environment": "development",
    "message": "SportFlash API is running",
    "apiProvider": "AllSportsAPI.com",
    "trialExpiry": "2026-01-07"
}
```

### 3. Test Live Scores
```bash
# Get all live matches
curl http://localhost:5000/api/matches/live

# Get football live matches
curl http://localhost:5000/api/matches/live?sport=football

# Get basketball live matches
curl http://localhost:5000/api/matches/live?sport=basketball

# Get cricket live matches
curl http://localhost:5000/api/matches/live?sport=cricket
```

### 4. Test Socket.IO Connection
```javascript
// In browser console or Node.js
const socket = io('http://localhost:5000');

socket.on('connection_established', (data) => {
    console.log('Connected:', data);
});

socket.on('all_scores_update', (scores) => {
    console.log('Scores updated:', scores);
});

// Request immediate update
socket.emit('request_scores', 'all');
```

---

## Migration from Previous APIs

### Changes from RapidAPI
- **Football**: Migrated from `api-football-v1.p.rapidapi.com` to AllSportsAPI
- **Basketball**: Migrated from `api-nba-v1.p.rapidapi.com` to AllSportsAPI
- **Cricket**: Migrated from `api.cricapi.com` to AllSportsAPI

### Benefits
1. **Unified API**: Single provider for all sports
2. **Better Coverage**: More leagues and competitions
3. **Richer Data**: More detailed statistics and lineups
4. **Consistent Format**: Similar response structure across sports
5. **Better Rate Limits**: More generous limits
6. **Cost Effective**: Single subscription instead of multiple APIs

---

## Important Notes

1. **API Key Security**: The API key is stored in `.env` file and should never be committed to version control
2. **Trial Expiry**: Current trial expires on **2026-01-07** - plan for renewal or alternative
3. **Data Mapping**: All API responses are mapped to a unified format for consistency
4. **Error Handling**: All endpoints include proper error handling and fallbacks
5. **Logging**: Comprehensive logging for debugging and monitoring

---

## Future Enhancements

1. **Caching**: Implement Redis caching to reduce API calls
2. **Database Storage**: Store historical match data
3. **Webhooks**: Implement webhooks for real-time updates (if supported by AllSportsAPI)
4. **Analytics**: Track API usage and performance
5. **Additional Sports**: Add Tennis, Hockey, Baseball when needed

---

## Support & Documentation

- **AllSportsAPI Docs**: https://allsportsapi.com
- **Football API**: https://allsportsapi.com/soccer-football-api-documentation
- **Basketball API**: https://allsportsapi.com/basketball-api-documentation
- **Cricket API**: https://allsportsapi.com/cricket-api-documentation
- **Support**: https://allsportsapi.com/contact

---

## Troubleshooting

### Issue: No live matches returned
**Solution**: Check if there are actually live matches happening. Try different sports or check upcoming fixtures.

### Issue: API key not working
**Solution**: Verify the API key in `.env` file matches the one from AllSportsAPI dashboard.

### Issue: Socket.IO not connecting
**Solution**: Check CORS settings and ensure client URL is allowed.

### Issue: Data format mismatch
**Solution**: Check the data mappers in `src/utils/dataMappers.js` and update as needed.

---

## License & Terms

Please review AllSportsAPI's terms of service and ensure compliance with their usage policies.
