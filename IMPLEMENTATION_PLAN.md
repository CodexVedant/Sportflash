# SportFlash - Complete Implementation Plan
## React Native + Expo Frontend | Node.js + Express + MongoDB Backend


## Project Overview

**Goal**: Build a multi-sport live score mobile application with real-time updates, news, and user personalization.

**Tech Stack**:
- **Frontend**: React Native + Expo
- **Backend**: Node.js + Express.js
- **Database**: MongoDB (Mongoose)
- **Real-time**: Socket.IO
- **APIs**: NewsAPI, API-Football, CricketData

**Design Reference**: `demo_full.html` (Premium dark theme with glassmorphism)


## Phase-by-Phase Implementation Plan

### **Phase 1: Project Setup & Architecture (Week 1)**

#### 1.1 Backend Setup
- [ ] Initialize Node.js project with Express
- [ ] Setup MongoDB connection (local )
- [ ] Configure environment variables (.env)
- [ ] Setup project structure (MVC pattern)
- [ ] Install core dependencies
- [ ] Setup CORS, body-parser, helmet (security)
- [ ] Create basic server with health check endpoint

#### 1.2 Frontend Setup
- [ ] Initialize Expo project (managed workflow)
- [ ] Setup navigation (React Navigation)
- [ ] Configure TypeScript (optional but recommended)
- [ ] Setup folder structure
- [ ] Install core dependencies
- [ ] Configure environment variables
- [ ] Setup theme system (colors, fonts, spacing)

#### 1.3 Development Environment
- [ ] Setup Git repository
- [ ] Create .gitignore files
- [ ] Setup ESLint + Prettier
- [ ] Configure VS Code workspace
- [ ] Setup Postman collection for API testing
- [ ] Create development documentation


### **Phase 2: Database Schema Design (Week 1)**

#### 2.1 User Schema
```
Users Collection:
- _id (ObjectId)
- email (unique, required)
- password (hashed)
- name
- profilePicture
- preferences {
    favoriteTeams: []
    favoriteSports: []
    notificationSettings: {}
  }
- following {
    teams: []
    players: []
    matches: []
  }
- bookmarks: [articleIds]
- createdAt
- updatedAt
```

#### 2.2 Match Schema
```
Matches Collection:
- _id
- sport (cricket/football/basketball)
- homeTeam { name, logo, score }
- awayTeam { name, logo, score }
- status (live/upcoming/finished)
- league/tournament
- venue
- startTime
- liveData {
    currentMinute/over
    events: []
    commentary: []
  }
- stats {}
- externalId (from API)
- lastUpdated
```

#### 2.3 News Schema
```
News Collection:
- _id
- title
- description
- content
- author
- category (cricket/football/basketball/general)
- imageUrl
- source
- publishedAt
- isPremium (boolean)
- views
- bookmarkedBy: [userIds]
```

#### 2.4 Player Schema
```
Players Collection:
- _id
- name
- sport
- team
- position/role
- stats {}
- imageUrl
- externalId
```

#### 2.5 Team Schema
```
Teams Collection:
- _id
- name
- sport
- logo
- league
- stats {}
- externalId
```

---

### **Phase 3: API Integration Strategy (Week 2)**

#### 3.1 NewsAPI Integration
**API Key**: `75705b8a2a7a403ca553e2885a29638f`

**Endpoints to Use**:
- `/v2/everything` - Search sports news
- `/v2/top-headlines` - Get trending news

**Implementation Plan**:
- [ ] Create NewsAPI service class
- [ ] Implement caching (Redis or in-memory)
- [ ] Setup scheduled jobs (fetch every 30 mins)
- [ ] Filter by sports keywords
- [ ] Store in MongoDB for offline access
- [ ] Handle rate limits (1000 requests/day free tier)

#### 3.2 API-Football Integration
**API Key**: `0331700a39932ec89dc7ac831f7a6952`
**Dashboard**: https://dashboard.api-football.com/profile

**Endpoints to Use**:
- `/fixtures` - Get matches
- `/fixtures/live` - Live matches
- `/fixtures/statistics` - Match stats
- `/fixtures/events` - Match events (goals, cards)
- `/fixtures/lineups` - Team lineups
- `/standings` - League tables

**Implementation Plan**:
- [ ] Create FootballAPI service class
- [ ] Implement WebSocket for live updates
- [ ] Cache match data
- [ ] Setup polling for live matches (every 30 seconds)
- [ ] Transform API response to match schema
- [ ] Handle API rate limits

#### 3.3 CricketData Integration
**API Key**: `27b48bcc-d8cd-405c-a0af-df533800f83a`
**Website**: https://cricketdata.org/

**Endpoints to Use**:
- `/currentMatches` - Live matches
- `/matchInfo` - Match details
- `/matchScorecard` - Scorecard
- `/matchCommentary` - Ball-by-ball
- `/series` - Tournament info
- `/playerStats` - Player statistics

**Implementation Plan**:
- [ ] Create CricketAPI service class
- [ ] Implement real-time score updates
- [ ] Cache commentary data
- [ ] Setup polling for live matches
- [ ] Transform data to match schema
- [ ] Handle API limits

#### 3.4 Basketball API Strategy
**Note**: Need to identify free basketball API
**Options**:
- API-Sports (same provider as football)
- BallDontLie API (free, NBA only)
- SportsData.io (limited free tier)

**Implementation Plan**:
- [ ] Research and select API
- [ ] Create BasketballAPI service class
- [ ] Implement similar to football
- [ ] Cache and transform data

---

### **Phase 4: Backend API Development (Week 2-3)**

#### 4.1 Authentication Routes
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
POST /api/auth/refresh-token
POST /api/auth/forgot-password
POST /api/auth/reset-password
```

**Features**:
- [ ] JWT token generation
- [ ] Password hashing (bcrypt)
- [ ] Email verification
- [ ] Refresh token mechanism
- [ ] Rate limiting

#### 4.2 Match Routes
```
GET  /api/matches/live
GET  /api/matches/upcoming
GET  /api/matches/finished
GET  /api/matches/:id
GET  /api/matches/:id/commentary
GET  /api/matches/:id/stats
GET  /api/matches/:id/lineups
GET  /api/matches/sport/:sport
```

**Features**:
- [ ] Pagination
- [ ] Filtering (sport, league, date)
- [ ] Sorting
- [ ] Real-time updates via Socket.IO

#### 4.3 News Routes
```
GET  /api/news
GET  /api/news/:id
GET  /api/news/trending
GET  /api/news/category/:category
POST /api/news/:id/bookmark
```

**Features**:
- [ ] Pagination
- [ ] Search functionality
- [ ] Category filtering
- [ ] Bookmark management

#### 4.4 User Routes
```
GET  /api/users/profile
PUT  /api/users/profile
GET  /api/users/preferences
PUT  /api/users/preferences
GET  /api/users/following
POST /api/users/follow/:type/:id
DELETE /api/users/unfollow/:type/:id
GET  /api/users/bookmarks
```

#### 4.5 Team & Player Routes
```
GET  /api/teams
GET  /api/teams/:id
GET  /api/teams/:id/matches
GET  /api/players/:id
GET  /api/players/:id/stats
```

#### 4.6 Search Route
```
GET  /api/search?q=query&type=all|matches|teams|players
```

---

### **Phase 5: Real-time Features (Week 3)**

#### 5.1 Socket.IO Setup
**Events to Implement**:
```
Server → Client:
- match:update (live score updates)
- match:event (goal, wicket, etc.)
- match:commentary (new commentary)
- notification:new (user notifications)

Client → Server:
- match:subscribe (subscribe to match updates)
- match:unsubscribe
- user:online
```

#### 5.2 Background Jobs (Node-Cron)
- [ ] Fetch live matches every 30 seconds
- [ ] Update news every 30 minutes
- [ ] Clean up old data daily
- [ ] Send scheduled notifications

#### 5.3 Push Notifications (Expo Notifications)
- [ ] Setup Expo push notification service
- [ ] Store device tokens in database
- [ ] Send notifications for:
  - Match starts (followed teams)
  - Goals/wickets (followed matches)
  - News updates (followed topics)

---

### **Phase 6: React Native UI Development (Week 4-6)**

#### 6.1 Design System Setup
**Based on demo_full.html**:
- [ ] Color palette (dark theme)
  - Background: #0f172a
  - Surface: rgba(30, 41, 59, 0.7)
  - Cricket: #3b82f6
  - Football: #22c55e
  - Basketball: #f97316
  - Text: #f8fafc
  - Muted: #94a3b8

- [ ] Typography
  - Primary: Inter
  - Display: Oswald
  - Sizes: 0.75rem - 3rem

- [ ] Spacing system (4px base)
- [ ] Border radius (8px, 12px, 16px)
- [ ] Shadows and glassmorphism effects

#### 6.2 Component Library
**Reusable Components**:
- [ ] Button (primary, outline, text)
- [ ] Card (with glassmorphism)
- [ ] MatchCard (cricket, football, basketball variants)
- [ ] NewsCard
- [ ] Tab (with sticky behavior)
- [ ] Badge (live, status)
- [ ] Avatar
- [ ] Input (text, password, search)
- [ ] Toast/Snackbar
- [ ] Loading indicators
- [ ] Empty states
- [ ] Error boundaries

#### 6.3 Navigation Structure
```
Root Navigator (Stack)
├─ Auth Stack
│  ├─ Login
│  ├─ Register
│  └─ ForgotPassword
│
└─ Main Navigator (Bottom Tabs)
   ├─ Home (Stack)
   │  ├─ Dashboard
   │  └─ MatchDetail
   │
   ├─ Matches (Stack)
   │  ├─ MatchList
   │  ├─ MatchDetail
   │  └─ MatchFilter
   │
   ├─ News (Stack)
   │  ├─ NewsList
   │  └─ NewsDetail
   │
   ├─ Following (Stack)
   │  ├─ FollowingList
   │  └─ TeamDetail
   │
   └─ Profile (Stack)
      ├─ ProfileView
      ├─ Settings
      └─ Preferences
```

#### 6.4 Screen Development Order

**Week 4: Core Screens**
1. [ ] Splash Screen
2. [ ] Login Screen
3. [ ] Register Screen
4. [ ] Home/Dashboard Screen
5. [ ] Match List Screen
6. [ ] Match Detail Screen (Cricket)

**Week 5: Extended Screens**
7. [ ] Match Detail Screen (Football)
8. [ ] Match Detail Screen (Basketball)
9. [ ] News List Screen
10. [ ] News Detail Screen
11. [ ] Profile Screen
12. [ ] Settings Screen

**Week 6: Advanced Screens**
13. [ ] Following Screen
14. [ ] Search Screen
15. [ ] Bookmarks Screen
16. [ ] Notifications Screen
17. [ ] Team Detail Screen
18. [ ] Player Detail Screen

---

### **Phase 7: State Management (Week 5)**

#### 7.1 Redux Toolkit Setup
**Slices to Create**:
- [ ] authSlice (user, token, isAuthenticated)
- [ ] matchesSlice (live, upcoming, finished)
- [ ] newsSlice (articles, trending)
- [ ] userSlice (profile, preferences, following)
- [ ] notificationsSlice
- [ ] themeSlice (dark/light mode)

#### 7.2 RTK Query Setup
**API Endpoints**:
- [ ] authApi
- [ ] matchesApi
- [ ] newsApi
- [ ] usersApi
- [ ] teamsApi

#### 7.3 Persist Configuration
- [ ] AsyncStorage setup
- [ ] Persist auth state
- [ ] Persist user preferences
- [ ] Persist theme

---

### **Phase 8: Advanced Features (Week 7-8)**

#### 8.1 Search Implementation
- [ ] Debounced search input
- [ ] Search history
- [ ] Recent searches
- [ ] Search suggestions
- [ ] Filter by type (matches, teams, players)

#### 8.2 Offline Support
- [ ] Cache API responses
- [ ] Offline indicator
- [ ] Queue actions for sync
- [ ] Optimistic updates

#### 8.3 Performance Optimization
- [ ] Image lazy loading
- [ ] FlatList optimization
- [ ] Memoization (React.memo, useMemo)
- [ ] Code splitting
- [ ] Bundle size optimization

#### 8.4 Animations
- [ ] React Native Reanimated
- [ ] Shared element transitions
- [ ] Tab animations
- [ ] Card animations
- [ ] Pull-to-refresh

---

### **Phase 9: Testing & Quality (Week 9)**

#### 9.1 Backend Testing
- [ ] Unit tests (Jest)
- [ ] Integration tests
- [ ] API endpoint tests
- [ ] Database tests
- [ ] Load testing

#### 9.2 Frontend Testing
- [ ] Component tests (React Native Testing Library)
- [ ] Integration tests
- [ ] E2E tests (Detox)
- [ ] Snapshot tests

#### 9.3 Code Quality
- [ ] ESLint configuration
- [ ] Prettier formatting
- [ ] TypeScript strict mode
- [ ] Code review checklist
- [ ] Performance profiling

---

### **Phase 10: Deployment (Week 10)**

#### 10.1 Backend Deployment
**Platform Options**:
- Heroku (easy, free tier)
- Railway (modern, good free tier)
- DigitalOcean (scalable)
- AWS EC2 (enterprise)

**Steps**:
- [ ] Setup production environment
- [ ] Configure MongoDB Atlas
- [ ] Setup Redis (if using)
- [ ] Configure environment variables
- [ ] Setup CI/CD (GitHub Actions)
- [ ] Configure domain and SSL
- [ ] Setup monitoring (PM2, New Relic)

#### 10.2 Frontend Deployment
**Expo Options**:
- [ ] Expo EAS Build
- [ ] Generate APK/IPA
- [ ] Submit to Play Store
- [ ] Submit to App Store
- [ ] Setup OTA updates

#### 10.3 Production Checklist
- [ ] Security audit
- [ ] Performance testing
- [ ] API rate limit monitoring
- [ ] Error tracking (Sentry)
- [ ] Analytics (Google Analytics, Mixpanel)
- [ ] User feedback system

---

## 📁 Project Structure

### Backend Structure
```
backend/
├── src/
│   ├── config/
│   │   ├── database.js          // MongoDB connection
│   │   ├── env.js               // Environment config
│   │   └── socket.js            // Socket.IO setup
│   ├── models/
│   │   ├── User.js              // User schema
│   │   ├── Match.js             // Match schema
│   │   ├── News.js              // News schema
│   │   ├── Team.js              // Team schema
│   │   └── Player.js            // Player schema
│   ├── controllers/
│   │   ├── authController.js    // Authentication logic
│   │   ├── matchController.js   // Match operations
│   │   ├── newsController.js    // News operations
│   │   ├── userController.js    // User operations
│   │   ├── teamController.js    // Team operations
│   │   └── playerController.js  // Player operations
│   ├── routes/
│   │   ├── authRoutes.js        // Auth endpoints
│   │   ├── matchRoutes.js       // Match endpoints
│   │   ├── newsRoutes.js        // News endpoints
│   │   ├── userRoutes.js        // User endpoints
│   │   ├── teamRoutes.js        // Team endpoints
│   │   └── searchRoutes.js      // Search endpoints
│   ├── middleware/
│   │   ├── auth.js              // JWT authentication
│   │   ├── errorHandler.js      // Error handling
│   │   ├── upload.js            // Multer file upload
│   │   └── validation.js        // Input validation
│   ├── services/
│   │   ├── cricketAPI.js        // CricketData API integration
│   │   ├── footballAPI.js       // API-Football integration
│   │   ├── basketballAPI.js     // Basketball API integration
│   │   ├── newsAPI.js           // NewsAPI integration
│   │   └── notificationService.js // Push notifications
│   ├── utils/
│   │   ├── logger.js            // Winston logger
│   │   ├── cache.js             // Caching utilities
│   │   └── helpers.js           // Helper functions
│   ├── jobs/
│   │   ├── fetchLiveMatches.js  // Cron job for live scores
│   │   └── updateNews.js        // Cron job for news
│   ├── app.js                   // Express app setup
│   └── server.js                // Server entry point
├── tests/
│   ├── auth.test.js
│   ├── matches.test.js
│   └── news.test.js
├── uploads/
│   └── .gitkeep
├── .env
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

### Frontend Structure (Enhanced with demo_full.html features)
```
sportflash-app/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.js              // Primary, Outline, Text variants
│   │   │   ├── Card.js                // Glassmorphism card with hover
│   │   │   ├── Input.js               // Text, Password, Search inputs
│   │   │   ├── Toast.js               // Toast notifications
│   │   │   ├── Badge.js               // LIVE, Status badges
│   │   │   ├── Avatar.js              // User/Team avatars
│   │   │   ├── Skeleton.js            // Loading skeletons
│   │   │   ├── EmptyState.js          // No data states
│   │   │   └── ErrorBoundary.js       // Error handling
│   │   ├── match/
│   │   │   ├── MatchCard.js           // Match preview card
│   │   │   ├── ScoreDisplay.js        // Live score component
│   │   │   ├── LiveBadge.js           // Pulsing LIVE indicator
│   │   │   ├── TeamLogo.js            // Team logo display
│   │   │   ├── MatchHeader.js         // Match detail header
│   │   │   ├── TabBar.js              // Sticky tab navigation
│   │   │   ├── Scorecard.js           // Cricket scorecard
│   │   │   ├── Commentary.js          // Ball-by-ball commentary
│   │   │   ├── Lineups.js             // Football lineups
│   │   │   ├── MatchStats.js          // Match statistics
│   │   │   └── Timeline.js            // Match events timeline
│   │   ├── news/
│   │   │   ├── NewsCard.js            // News article card
│   │   │   ├── NewsList.js            // News feed
│   │   │   ├── NewsDetail.js          // Full article view
│   │   │   └── TrendingNews.js        // Trending section
│   │   ├── search/
│   │   │   ├── SearchModal.js         // Full-screen search
│   │   │   ├── SearchBar.js           // Search input
│   │   │   ├── SearchFilters.js       // Filter chips
│   │   │   ├── SearchResults.js       // Results display
│   │   │   ├── SearchItem.js          // Result item
│   │   │   └── RecentSearches.js      // Search history
│   │   ├── navigation/
│   │   │   ├── Sidebar.js             // Drawer navigation
│   │   │   ├── TopBar.js              // Header bar
│   │   │   ├── BottomTabs.js          // Bottom navigation
│   │   │   └── MenuToggle.js          // Hamburger menu
│   │   ├── filter/
│   │   │   ├── FilterPanel.js         // Advanced filters
│   │   │   ├── DatePicker.js          // Date range selector
│   │   │   ├── SportFilter.js         // Sport selection
│   │   │   └── StatusFilter.js        // Live/Upcoming/Finished
│   │   ├── standings/
│   │   │   ├── StandingsTable.js      // League table
│   │   │   ├── TeamRow.js             // Table row
│   │   │   └── PositionBadge.js       // Position indicator
│   │   ├── player/
│   │   │   ├── PlayerCard.js          // Player profile card
│   │   │   ├── PlayerStats.js         // Player statistics
│   │   │   └── PlayerHeader.js        // Profile header
│   │   ├── team/
│   │   │   ├── TeamCard.js            // Team card
│   │   │   ├── TeamHeader.js          // Team profile header
│   │   │   ├── SquadList.js           // Team squad
│   │   │   └── TeamFixtures.js        // Team matches
│   │   └── notifications/
│   │       ├── NotificationBell.js    // Bell icon with badge
│   │       ├── NotificationPanel.js   // Dropdown panel
│   │       └── NotificationItem.js    // Single notification
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── LoginScreen.js         // Login form
│   │   │   ├── RegisterScreen.js      // Sign up form
│   │   │   ├── ForgotPasswordScreen.js
│   │   │   └── WelcomeScreen.js       // Onboarding
│   │   ├── home/
│   │   │   ├── HomeScreen.js          // Dashboard
│   │   │   ├── LiveMatchesWidget.js   // Live matches section
│   │   │   └── TrendingNewsWidget.js  // News sidebar
│   │   ├── matches/
│   │   │   ├── MatchesScreen.js       // Match list
│   │   │   ├── MatchDetailScreen.js   // Match detail (all sports)
│   │   │   ├── CricketMatchScreen.js  // Cricket-specific
│   │   │   ├── FootballMatchScreen.js // Football-specific
│   │   │   ├── BasketballMatchScreen.js // Basketball-specific
│   │   │   └── MatchFilterScreen.js   // Filter modal
│   │   ├── news/
│   │   │   ├── NewsScreen.js          // News feed
│   │   │   ├── NewsDetailScreen.js    // Article view
│   │   │   └── NewsCategoryScreen.js  // Category filter
│   │   ├── series/
│   │   │   ├── SeriesScreen.js        // Series/Tournaments
│   │   │   ├── StandingsScreen.js     // League tables
│   │   │   └── SeriesDetailScreen.js  // Series info
│   │   ├── following/
│   │   │   ├── FollowingScreen.js     // Following feed
│   │   │   ├── TeamsTab.js            // Followed teams
│   │   │   ├── PlayersTab.js          // Followed players
│   │   │   └── MatchesTab.js          // Followed matches
│   │   ├── profile/
│   │   │   ├── ProfileScreen.js       // User profile
│   │   │   ├── SettingsScreen.js      // App settings
│   │   │   ├── PreferencesScreen.js   // User preferences
│   │   │   ├── BookmarksScreen.js     // Saved articles
│   │   │   └── NotificationsScreen.js // Notification settings
│   │   ├── search/
│   │   │   └── SearchScreen.js        // Search results
│   │   ├── team/
│   │   │   └── TeamDetailScreen.js    // Team profile
│   │   └── player/
│   │       └── PlayerProfileScreen.js  // Player profile
│   ├── navigation/
│   │   ├── AppNavigator.js            // Root navigator
│   │   ├── AuthNavigator.js           // Auth stack
│   │   ├── MainNavigator.js           // Main tabs
│   │   ├── HomeNavigator.js           // Home stack
│   │   ├── MatchesNavigator.js        // Matches stack
│   │   ├── NewsNavigator.js           // News stack
│   │   └── ProfileNavigator.js        // Profile stack
│   ├── store/
│   │   ├── slices/
│   │   │   ├── authSlice.js           // Authentication state
│   │   │   ├── matchesSlice.js        // Matches state
│   │   │   ├── newsSlice.js           // News state
│   │   │   ├── userSlice.js           // User data
│   │   │   ├── searchSlice.js         // Search state
│   │   │   ├── notificationsSlice.js  // Notifications
│   │   │   └── themeSlice.js          // Theme settings
│   │   ├── api/
│   │   │   ├── authApi.js             // Auth endpoints
│   │   │   ├── matchesApi.js          // Matches endpoints
│   │   │   ├── newsApi.js             // News endpoints
│   │   │   ├── usersApi.js            // User endpoints
│   │   │   ├── teamsApi.js            // Teams endpoints
│   │   │   └── searchApi.js           // Search endpoints
│   │   └── store.js                   // Redux store config
│   ├── services/
│   │   ├── api.js                     // Axios instance
│   │   ├── socket.js                  // Socket.IO client
│   │   ├── notifications.js           // Expo notifications
│   │   ├── storage.js                 // AsyncStorage wrapper
│   │   └── analytics.js               // Analytics tracking
│   ├── utils/
│   │   ├── constants.js               // App constants
│   │   ├── helpers.js                 // Helper functions
│   │   ├── theme.js                   // Theme config
│   │   ├── colors.js                  // Color palette
│   │   ├── typography.js              // Font styles
│   │   ├── spacing.js                 // Spacing system
│   │   ├── mockData.js                // Mock data for demo
│   │   └── validators.js              // Form validation
│   ├── hooks/
│   │   ├── useAuth.js                 // Auth hook
│   │   ├── useMatches.js              // Matches hook
│   │   ├── useSocket.js               // Socket hook
│   │   ├── useSearch.js               // Search hook
│   │   ├── useToast.js                // Toast hook
│   │   ├── useTheme.js                // Theme hook
│   │   └── useDebounce.js             // Debounce hook
│   └── App.js                         // Main app component
├── assets/
│   ├── fonts/
│   │   ├── Inter-Regular.ttf
│   │   ├── Inter-Medium.ttf
│   │   ├── Inter-SemiBold.ttf
│   │   ├── Inter-Bold.ttf
│   │   ├── Oswald-Medium.ttf
│   │   └── Oswald-Bold.ttf
│   ├── images/
│   │   ├── logo.png
│   │   ├── splash.png
│   │   └── placeholder.png
│   └── icons/
│       ├── cricket.png
│       ├── football.png
│       └── basketball.png
├── app.json                           // Expo config
├── package.json                       // Dependencies
├── babel.config.js                    // Babel config
├── .env                               // Environment variables
├── .gitignore                         // Git ignore
└── README.md                          // Documentation
```

### Feature Mapping from demo_full.html

**Implemented Features:**
1. ✅ **Search Functionality** - SearchModal, SearchFilters, RecentSearches
2. ✅ **Live Scores** - MatchCard, ScoreDisplay, LiveBadge
3. ✅ **Match Details** - All 3 sports with tabs
4. ✅ **News Section** - NewsCard, NewsList, NewsDetail
5. ✅ **Navigation** - Sidebar, TopBar, BottomTabs
6. ✅ **Responsive Design** - All breakpoints covered
7. ✅ **Toast Notifications** - Toast component
8. ✅ **Sticky Tabs** - TabBar with sticky behavior
9. ✅ **Glassmorphism** - Card component with blur
10. ✅ **Sport-specific Colors** - Theme system

**To Be Added:**
- Loading States (Skeleton components)
- Empty States (EmptyState component)
- Error Handling (ErrorBoundary)
- Enhanced Filters (FilterPanel)
- Standings Tables (StandingsTable)
- Notifications Panel (NotificationPanel)
- Player Profiles (PlayerDetailScreen)
- Team Profiles (TeamDetailScreen)
- Bookmarks (BookmarksScreen)
- Settings (SettingsScreen)
```

---

## 🔑 API Keys & Configuration

### Environment Variables

**Backend (.env)**:
```
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/sportflash
MONGODB_URI_PROD=mongodb+srv://...

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRE=30d

# APIs
NEWS_API_KEY=75705b8a2a7a403ca553e2885a29638f
FOOTBALL_API_KEY=0331700a39932ec89dc7ac831f7a6952
CRICKET_API_KEY=27b48bcc-d8cd-405c-a0af-df533800f83a
BASKETBALL_API_KEY=to-be-determined

# Redis (optional)
REDIS_URL=redis://localhost:6379

# Email (for notifications)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email
EMAIL_PASSWORD=your-password

# Expo Push Notifications
EXPO_ACCESS_TOKEN=your-expo-token
```

**Frontend (.env)**:
```
API_URL=http://localhost:5000/api
SOCKET_URL=http://localhost:5000
```

---

## 📊 API Rate Limits & Considerations

### NewsAPI
- **Free Tier**: 1,000 requests/day
- **Rate**: ~41 requests/hour
- **Strategy**: Cache for 30 minutes, fetch only trending

### API-Football
- **Free Tier**: 100 requests/day
- **Rate**: ~4 requests/hour
- **Strategy**: Cache heavily, poll live matches only

### CricketData
- **Free Tier**: Check documentation
- **Strategy**: Poll live matches every 30 seconds

### Optimization Strategy
1. **Caching**: Use Redis or in-memory cache
2. **Polling**: Only poll live matches
3. **Webhooks**: Use if available
4. **Database**: Store fetched data for offline access
5. **Scheduled Jobs**: Fetch data at intervals, not on-demand

---

## 🎨 UI/UX Implementation Guide

### Design Principles (from demo_full.html)
1. **Dark Theme**: Primary background #0f172a
2. **Glassmorphism**: Semi-transparent cards with blur
3. **Sport Colors**:
   - Cricket: #3b82f6 (Blue)
   - Football: #22c55e (Green)
   - Basketball: #f97316 (Orange)
4. **Typography**: Inter (body), Oswald (headings)
5. **Spacing**: 8px base unit
6. **Border Radius**: 12-16px for cards
7. **Animations**: Smooth, 0.3s transitions

### Key UI Features to Replicate
- [ ] Sticky tabs (React Native Sticky Header)
- [ ] Horizontal scrollable tabs
- [ ] Pull-to-refresh
- [ ] Infinite scroll
- [ ] Skeleton loaders
- [ ] Toast notifications
- [ ] Bottom sheet modals
- [ ] Swipe gestures

---

## 🚀 Development Timeline

### Week 1: Setup
- Day 1-2: Backend setup, database schema
- Day 3-4: Frontend setup, navigation
- Day 5-7: API integration planning, testing

### Week 2-3: Backend Development
- Day 8-10: Auth system
- Day 11-14: Match APIs
- Day 15-17: News APIs
- Day 18-21: Real-time features

### Week 4-6: Frontend Development
- Day 22-28: Core screens
- Day 29-35: Extended screens
- Day 36-42: Advanced screens

### Week 7-8: Advanced Features
- Day 43-49: Search, offline, optimization
- Day 50-56: Animations, polish

### Week 9: Testing
- Day 57-63: Testing, bug fixes

### Week 10: Deployment
- Day 64-70: Production deployment

**Total**: ~70 days (10 weeks)

---

## ✅ Pre-Development Checklist

### Before Starting Backend
- [ ] MongoDB installed/Atlas account created
- [ ] Node.js v16+ installed
- [ ] Postman installed
- [ ] API keys verified and working
- [ ] Git repository created
- [ ] Project structure planned

### Before Starting Frontend
- [ ] Expo CLI installed
- [ ] Android Studio/Xcode setup
- [ ] Physical device or emulator ready
- [ ] Expo account created
- [ ] Design assets prepared
- [ ] Navigation flow mapped

### Tools & Accounts Needed
- [ ] MongoDB Atlas account
- [ ] Expo account
- [ ] GitHub account
- [ ] NewsAPI account (verified)
- [ ] API-Football account (verified)
- [ ] CricketData account (verified)
- [ ] Code editor (VS Code recommended)
- [ ] Postman/Insomnia for API testing

---

## 📝 Next Steps

1. **Review this plan** - Confirm approach and timeline
2. **Setup development environment** - Install all tools
3. **Verify API keys** - Test all API endpoints
4. **Create repositories** - GitHub repos for frontend/backend
5. **Start with backend** - Build foundation first
6. **Parallel frontend** - UI development alongside backend
7. **Integrate** - Connect frontend to backend
8. **Test** - Comprehensive testing
9. **Deploy** - Production release
10. **Iterate** - Based on user feedback

---

**Plan Status**: ✅ Complete & Ready for Implementation  
**Estimated Duration**: 10 weeks (70 days)  
**Team Size**: 1-2 developers  
**Complexity**: Medium-High  
**Success Probability**: High (with proper execution)
