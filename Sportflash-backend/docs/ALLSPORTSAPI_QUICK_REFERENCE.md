# AllSportsAPI Quick Reference

## 🚀 Quick Start

### 1. Environment Setup
```bash
# .env file
ALLSPORTS_API_KEY=655722cb329281a624e579fbb83f4542a6f3d381cfebb41fbdff146179cb1fcc
```

### 2. Import Service
```javascript
const allSportsApi = require('./services/allSportsApiService');
```

### 3. Get Live Scores
```javascript
// Football
const footballMatches = await allSportsApi.getFootballLiveScores();

// Basketball
const basketballGames = await allSportsApi.getBasketballLiveScores();

// Cricket
const cricketMatches = await allSportsApi.getCricketLiveScores();

// All Sports
const allScores = await allSportsApi.getAllLiveScores();
```

---

## 📋 Common Use Cases

### Get Today's Fixtures
```javascript
const today = new Date().toISOString().split('T')[0];

// Football fixtures
const footballFixtures = await allSportsApi.getFootballFixtures({ date: today });

// Basketball fixtures
const basketballFixtures = await allSportsApi.getBasketballFixtures({ date: today });

// Cricket fixtures
const cricketFixtures = await allSportsApi.getCricketFixtures({ date: today });
```

### Get League Standings
```javascript
// Football standings (e.g., Premier League)
const standings = await allSportsApi.getFootballStandings('152'); // 152 = Premier League

// Basketball standings (e.g., NBA)
const nbaStandings = await allSportsApi.getBasketballStandings('766'); // 766 = NBA
```

### Get Team Information
```javascript
// Football team
const team = await allSportsApi.getFootballTeam('33'); // 33 = Manchester United

// Basketball team
const nbaTeam = await allSportsApi.getBasketballTeam('7'); // 7 = Boston Celtics
```

### Get Head-to-Head
```javascript
// Football H2H
const h2h = await allSportsApi.getFootballH2H('33', '34'); // Man Utd vs Man City

// Basketball H2H
const nbaH2H = await allSportsApi.getBasketballH2H('7', '2'); // Celtics vs Nets
```

---

## 🎯 Popular League IDs

### Football
- **152** - Premier League (England)
- **302** - La Liga (Spain)
- **207** - Serie A (Italy)
- **175** - Bundesliga (Germany)
- **168** - Ligue 1 (France)
- **3** - UEFA Champions League

### Basketball
- **766** - NBA (USA)
- **812** - CBI (USA)
- **813** - CIT (USA)

### Cricket
- **729** - Pakistan Super League
- **727** - Plunket Shield
- **741** - International Tours

---

## 🔄 Real-time Updates

### Socket.IO Events
```javascript
// Listen for football updates
socket.on('football_update', (matches) => {
    console.log('Football:', matches);
});

// Listen for basketball updates
socket.on('basketball_update', (games) => {
    console.log('Basketball:', games);
});

// Listen for cricket updates
socket.on('cricket_update', (matches) => {
    console.log('Cricket:', matches);
});

// Listen for all updates
socket.on('all_scores_update', (allScores) => {
    console.log('All Sports:', allScores);
});

// Request immediate update
socket.emit('request_scores', 'football'); // or 'basketball', 'cricket', 'all'
```

---

## 🧪 Testing

### Run Test Suite
```bash
node src/tests/testAllSportsApi.js
```

### Test Individual Sport
```javascript
// In Node.js REPL or script
const allSportsApi = require('./src/services/allSportsApiService');

// Test football
allSportsApi.getFootballLiveScores()
    .then(matches => console.log('Football:', matches))
    .catch(err => console.error(err));
```

### Test API Endpoint
```bash
# Get all live matches
curl http://localhost:5000/api/matches/live

# Get football matches
curl http://localhost:5000/api/matches/sport/football

# Get basketball matches
curl http://localhost:5000/api/matches/sport/basketball

# Get cricket matches
curl http://localhost:5000/api/matches/sport/cricket
```

---

## 📊 Response Format

### Match Status Values
- `live` - Match is currently in progress
- `finished` - Match has ended
- `upcoming` - Match hasn't started yet
- `postponed` - Match postponed
- `cancelled` - Match cancelled

### Sport Values
- `football` or `soccer`
- `basketball`
- `cricket`

---

## ⚡ Performance Tips

1. **Use Caching**: Cache responses for non-live data
2. **Batch Requests**: Use `getAllLiveScores()` instead of individual calls
3. **Filter Client-Side**: Get all data once, filter on frontend
4. **Socket.IO**: Use real-time updates instead of polling
5. **Rate Limiting**: Respect API limits (current: 2-minute intervals)

---

## 🐛 Common Issues

### Issue: Empty Response
```javascript
// Check if there are actually live matches
const matches = await allSportsApi.getFootballLiveScores();
if (!matches || matches.length === 0) {
    console.log('No live matches at the moment');
}
```

### Issue: API Key Error
```javascript
// Verify API key is set
console.log('API Key:', process.env.ALLSPORTS_API_KEY ? 'Set' : 'Missing');
```

### Issue: Timeout
```javascript
// The service has 30-second timeout built-in
// If needed, you can implement retry logic
async function fetchWithRetry(fn, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            return await fn();
        } catch (error) {
            if (i === retries - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        }
    }
}
```

---

## 📚 Additional Resources

- **Full Documentation**: `docs/ALLSPORTSAPI_INTEGRATION.md`
- **Football API Docs**: https://allsportsapi.com/soccer-football-api-documentation
- **Basketball API Docs**: https://allsportsapi.com/basketball-api-documentation
- **Cricket API Docs**: https://allsportsapi.com/cricket-api-documentation

---

## 🔑 Important Notes

- **API Key**: Never commit to version control
- **Trial Expiry**: 2026-01-07
- **Update Frequency**: Every 2 minutes
- **Rate Limits**: Generous (no specific limit mentioned)
- **Support**: https://allsportsapi.com/contact
