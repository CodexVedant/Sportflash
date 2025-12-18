# 📚 Sportflash Project Architecture Documentation

**Last Updated:** December 17, 2025  
**Project:** Sportflash - Live Sports Score Application  
**Tech Stack:** React Native (Expo) + Node.js + MongoDB + Socket.IO

---

## 🗂️ Project Structure Overview

```
Sportflash/
├── sportflash-app/          # Frontend (React Native/Expo)
├── sportflash-backend/      # Backend (Node.js/Express)
└── document/                # Documentation files
```

---

# 🎨 FRONTEND (sportflash-app)

## 📁 Directory Structure

```
src/
├── components/              # Reusable UI components
│   ├── common/             # Generic components
│   ├── filter/             # Filter-related components
│   ├── match/              # Match-specific components
│   ├── navigation/         # Navigation components
│   ├── notifications/      # Notification components
│   └── standings/          # Standings table components
├── screens/                # Screen components (pages)
│   ├── auth/              # Authentication screens
│   ├── home/              # Home screen
│   ├── matches/           # Matches screen
│   ├── news/              # News screen
│   ├── profile/           # Profile screen
│   └── standings/         # Standings screen
├── context/               # React Context providers
├── hooks/                 # Custom React hooks
├── navigation/            # Navigation configuration
├── services/              # API and external services
├── utils/                 # Utility functions
└── config.js              # App configuration
```

---

## 📄 File-by-File Breakdown

### 🔧 **Configuration Files**

#### `src/config.js`
**Purpose:** Central configuration for API URLs and environment settings  
**Contains:**
- `API_BASE_URL`: Backend API endpoint
- `SOCKET_URL`: Socket.IO server URL
- Platform-specific URL handling (Android uses 10.0.2.2)

**Used By:**
- `src/services/api.js`
- `src/services/socket.js`

---

### 🎯 **Components**

#### 📂 `src/components/common/`

##### `Skeleton.js` (280 lines)
**Purpose:** Loading state animations  
**Exports:**
- `Skeleton` - Generic skeleton component
- `MatchCardSkeleton` - Match card loading state
- `NewsCardSkeleton` - News card loading state
- `TeamCardSkeleton` - Team card loading state
- `PlayerCardSkeleton` - Player card loading state
- `SkeletonList` - Renders multiple skeletons

**Dependencies:**
- `react-native-reanimated` - For shimmer animation
- `../../utils/theme` - Theme colors

**Used By:**
- `src/screens/home/HomeScreen.js`
- `src/screens/matches/MatchesScreen.js`

---

##### `EmptyState.js` (133 lines)
**Purpose:** Display empty state messages with icons  
**Props:**
- `variant` - Predefined empty state types
- `icon` - Custom icon name
- `title` - Main message
- `subtitle` - Secondary message
- `actionLabel` - Button text
- `onAction` - Button callback

**Variants:**
- default, search, error, noResults
- noMatches, noNews, noBookmarks
- noFollowing, noNotifications

**Dependencies:**
- `@expo/vector-icons`
- `../../utils/theme`

**Used By:**
- `src/screens/matches/MatchesScreen.js`
- `src/screens/standings/StandingsScreen.js`

---

##### `ErrorBoundary.js` (175 lines)
**Purpose:** Error handling and display  
**Exports:**
- `ErrorBoundary` - React error boundary (class component)
- `ErrorFallback` - Error UI with retry
- `NetworkError` - Offline/network error display
- `ApiError` - HTTP error display
- `ErrorMessage` - Inline error messages

**Dependencies:**
- `@expo/vector-icons`
- `../../utils/theme`

**Used By:**
- `App.js` - Wraps entire app
- `src/screens/matches/MatchesScreen.js`

---

##### `SearchModal.js` (406 lines)
**Purpose:** Global search functionality  
**Features:**
- Live search across matches, teams, players, news
- Recent searches (stored in AsyncStorage)
- Filter chips
- Blur overlay

**Dependencies:**
- `expo-blur` - BlurView for modal overlay
- `@react-native-async-storage/async-storage` - Persist recent searches
- `react-native-safe-area-context`
- `../../context/ToastContext`

**Used By:**
- `src/screens/home/HomeScreen.js`

---

##### `index.js`
**Purpose:** Export all common components for easy imports  
**Exports:** All components from common folder

---

#### 📂 `src/components/filter/`

##### `FilterPanel.js` (273 lines)
**Purpose:** Comprehensive filter modal  
**Features:**
- Sport filter (Cricket, Football, Basketball, etc.)
- Status filter (Live, Upcoming, Finished)
- League dropdown
- Date range picker
- Apply/Reset functionality

**Dependencies:**
- `expo-blur`
- `./DatePicker`
- `./SportFilter`
- `./StatusFilter`
- `../../utils/theme`

**Used By:**
- `src/screens/matches/MatchesScreen.js`

---

##### `DatePicker.js` (156 lines)
**Purpose:** Date range selection  
**Features:**
- Quick selection buttons (7, 30, 90 days)
- Manual start/end date selection
- Clear functionality

**Dependencies:**
- `@react-native-community/datetimepicker`
- `../../utils/theme`

**Used By:**
- `./FilterPanel.js`

---

##### `SportFilter.js` (99 lines)
**Purpose:** Sport selection cards  
**Sports:** All, Cricket, Football, Basketball

**Used By:**
- `./FilterPanel.js`

---

##### `StatusFilter.js` (95 lines)
**Purpose:** Match status toggles  
**Statuses:** All, Live, Upcoming, Finished

**Used By:**
- `./FilterPanel.js`

---

##### `index.js`
**Purpose:** Export all filter components

---

#### 📂 `src/components/match/`

##### `MatchCard.js` (206 lines)
**Purpose:** Display match information card  
**Features:**
- Sport-specific colors
- Live match pulsing animation
- Team logos (supports URLs)
- Score display
- Timer/overs display
- Gradient background

**Props:**
- `sport` - Sport type (cricket/football/basketball)
- `status` - Match status (live/upcoming/finished)
- `league` - League/tournament name
- `homeTeam` - { name, logo, score }
- `awayTeam` - { name, logo, score }
- `score` - Center score display
- `timer` - Time/overs display
- `onPress` - Click handler

**Dependencies:**
- `expo-linear-gradient`
- `react-native-reanimated` - Pulsing animation
- `../../utils/theme`

**Used By:**
- `src/screens/home/HomeScreen.js`
- `src/screens/matches/MatchesScreen.js`

---

#### 📂 `src/components/navigation/`

##### `Sidebar.js`
**Purpose:** Navigation drawer  
**Features:**
- Menu items (Home, Matches, News, etc.)
- User profile section
- Logout functionality

**Dependencies:**
- `../../context/AuthContext`
- `@react-navigation/native`

**Used By:**
- All main screens

---

#### 📂 `src/components/notifications/`

##### `NotificationBell.js` (77 lines)
**Purpose:** Notification icon with badge  
**Features:**
- Unread count badge
- Press animation
- Conditional rendering (only when logged in)

**Props:**
- `count` - Unread notification count
- `onPress` - Click handler

**Used By:**
- `src/screens/home/HomeScreen.js`
- `src/screens/matches/MatchesScreen.js`
- `src/screens/standings/StandingsScreen.js`

---

##### `NotificationItem.js` (174 lines)
**Purpose:** Individual notification display  
**Features:**
- Type-based icons (match_start, goal, wicket, etc.)
- Read/unread states
- Time ago display
- Mark as read
- Delete functionality

**Props:**
- `notification` - Notification object
- `onPress` - Click handler
- `onMarkAsRead` - Mark read callback
- `onDelete` - Delete callback

**Used By:**
- `./NotificationPanel.js`

---

##### `NotificationPanel.js` (233 lines)
**Purpose:** Notification management modal  
**Features:**
- Filter tabs (All/Unread)
- Mark all as read
- Clear all notifications
- Empty state handling
- Scrollable list

**Props:**
- `visible` - Modal visibility
- `onClose` - Close handler
- `notifications` - Array of notifications
- `onNotificationPress` - Notification click handler

**Dependencies:**
- `expo-blur`
- `./NotificationItem`
- `../common/EmptyState`

**Used By:**
- `src/screens/home/HomeScreen.js`
- `src/screens/matches/MatchesScreen.js`
- `src/screens/standings/StandingsScreen.js`

---

##### `index.js`
**Purpose:** Export all notification components

---

#### 📂 `src/components/standings/`

##### `StandingsTable.js` (181 lines)
**Purpose:** League standings table  
**Features:**
- Sport-specific columns (Cricket: NRR, Football: GD, Basketball: Win%)
- Sortable columns
- Scrollable header
- Legend for position colors
- Responsive design

**Props:**
- `teams` - Array of team data
- `sport` - Sport type (cricket/football/basketball)
- `league` - League name
- `onTeamPress` - Team click handler

**Dependencies:**
- `./TeamRow`
- `../../utils/theme`

**Used By:**
- `src/screens/standings/StandingsScreen.js`

---

##### `TeamRow.js` (148 lines)
**Purpose:** Individual team row in standings  
**Features:**
- Position badge
- Team logo
- Sport-specific stats
- Pressable row

**Props:**
- `team` - Team data object
- `sport` - Sport type
- `onPress` - Click handler

**Dependencies:**
- `./PositionBadge`

**Used By:**
- `./StandingsTable.js`

---

##### `PositionBadge.js` (68 lines)
**Purpose:** Color-coded position indicator  
**Features:**
- Champions League zone (green)
- Europa League zone (blue)
- Relegation zone (red)
- Mid-table (gray)

**Props:**
- `position` - Team position number

**Used By:**
- `./TeamRow.js`

---

##### `index.js`
**Purpose:** Export all standings components

---

### 📱 **Screens**

#### 📂 `src/screens/auth/`

##### `LoginScreen.js` (224 lines)
**Purpose:** User login  
**Features:**
- Email/password inputs
- Inline error messages
- Client-side validation
- Responsive design
- Gradient background

**Dependencies:**
- `../../context/AuthContext`
- `../../components/common/Input`
- `../../components/common/Button`
- `../../components/common/ErrorMessage`
- `expo-linear-gradient`

**Connected To:**
- `RegisterScreen.js` - Navigation link
- `AuthContext` - Login function

---

##### `RegisterScreen.js` (217 lines)
**Purpose:** User registration  
**Features:**
- Name/email/password inputs
- Inline error messages
- Client-side validation
- Responsive design

**Dependencies:**
- `../../context/AuthContext`
- `../../components/common/Input`
- `../../components/common/Button`
- `../../components/common/ErrorMessage`

**Connected To:**
- `LoginScreen.js` - Navigation link
- `AuthContext` - Register function

---

#### 📂 `src/screens/home/`

##### `HomeScreen.js` (358 lines)
**Purpose:** Main landing page  
**Features:**
- Live cricket matches display
- Real-time Socket.IO updates
- Responsive grid layout
- Search modal
- Notification bell (when logged in)
- Sidebar navigation

**State:**
- `matches` - Array of match data
- `loading` - Loading state
- `searchVisible` - Search modal visibility
- `sidebarVisible` - Sidebar visibility
- `notificationVisible` - Notification panel visibility
- `notifications` - Mock notification data

**Dependencies:**
- `../../hooks/useSocket` - Live score updates
- `../../components/match/MatchCard`
- `../../components/common/SearchModal`
- `../../components/notifications/NotificationBell`
- `../../components/notifications/NotificationPanel`
- `../../components/navigation/Sidebar`
- `../../services/api`
- `../../context/AuthContext`

**Data Flow:**
1. Fetches initial matches from API (`/matches/live`)
2. Subscribes to Socket.IO for real-time updates
3. Filters to show only LIVE matches
4. Maps cricket data to UI format
5. Displays in responsive grid

**Connected To:**
- Backend: `GET /api/matches/live`
- Socket.IO: `cricket_update`, `all_scores_update` events

---

#### 📂 `src/screens/matches/`

##### `MatchesScreen.js` (200 lines)
**Purpose:** Matches list with filters  
**Features:**
- Tab navigation (Live/Upcoming/Results)
- Filter panel
- Skeleton loading states
- Empty states
- Network error handling
- Notification bell (when logged in)

**State:**
- `activeTab` - Current tab (Live/Upcoming/Results)
- `matches` - Match data
- `loading` - Loading state
- `error` - Error state
- `filterVisible` - Filter panel visibility
- `filters` - Applied filters

**Dependencies:**
- `../../components/common/SkeletonList`
- `../../components/common/EmptyState`
- `../../components/common/NetworkError`
- `../../components/filter/FilterPanel`
- `../../components/notifications/NotificationBell`
- `../../components/notifications/NotificationPanel`
- `../../context/AuthContext`

**Data Flow:**
1. Fetches matches based on active tab
2. Applies filters when user changes them
3. Shows skeleton while loading
4. Shows empty state if no matches
5. Shows network error if API fails

**Connected To:**
- Backend: `GET /api/matches/live`, `/api/matches/upcoming`, `/api/matches?status=finished`

---

#### 📂 `src/screens/standings/`

##### `StandingsScreen.js` (280 lines)
**Purpose:** League standings tables  
**Features:**
- Sport selector (Cricket/Football/Basketball)
- Standings table with sortable columns
- Mock data for demonstration
- Notification bell (when logged in)

**State:**
- `selectedSport` - Current sport
- `loading` - Loading state
- `notificationVisible` - Notification panel visibility

**Mock Data:**
- Cricket: IPL standings
- Football: Premier League standings
- Basketball: NBA Western Conference standings

**Dependencies:**
- `../../components/standings/StandingsTable`
- `../../components/notifications/NotificationBell`
- `../../components/notifications/NotificationPanel`
- `../../context/AuthContext`

**Connected To:**
- Currently uses mock data
- Ready for API integration

---

### 🔌 **Services**

#### `src/services/api.js`
**Purpose:** Axios instance for API calls  
**Configuration:**
- Base URL from config
- Default headers
- Request/response interceptors
- Error handling

**Used By:**
- All screens making API calls
- `src/screens/home/HomeScreen.js`
- `src/screens/matches/MatchesScreen.js`

---

#### `src/services/socket.js`
**Purpose:** Socket.IO client setup  
**Configuration:**
- Server URL from config
- Auto-connect disabled
- WebSocket transport forced

**Exports:**
- `socket` - Socket.IO instance
- `connectSocket()` - Connect function
- `disconnectSocket()` - Disconnect function

**Used By:**
- `src/hooks/useSocket.js`

---

### 🪝 **Hooks**

#### `src/hooks/useSocket.js` (82 lines)
**Purpose:** Custom hooks for Socket.IO  
**Exports:**
- `useLiveCricketScores()` - Cricket-only updates
- `useLiveScores()` - All sports updates

**Features:**
- Automatic connection on mount
- Event listeners for score updates
- Cleanup on unmount
- State management for live data

**Events Listened:**
- `cricket_update` - Cricket score updates
- `football_update` - Football score updates
- `basketball_update` - Basketball score updates
- `all_scores_update` - Combined updates

**Used By:**
- `src/screens/home/HomeScreen.js`

**Connected To:**
- `src/services/socket.js`
- Backend Socket.IO server

---

### 🎨 **Context**

#### `src/context/AuthContext.js`
**Purpose:** Global authentication state  
**Provides:**
- `user` - Current user object
- `login(email, password)` - Login function
- `register(name, email, password)` - Register function
- `logout()` - Logout function
- `loading` - Auth loading state

**Used By:**
- All screens requiring auth state
- `src/screens/auth/LoginScreen.js`
- `src/screens/auth/RegisterScreen.js`
- `src/screens/home/HomeScreen.js`

**Connected To:**
- Backend: `POST /api/auth/login`, `POST /api/auth/register`

---

#### `src/context/ToastContext.js`
**Purpose:** Global toast notifications  
**Provides:**
- `showToast(message, type)` - Show toast function

**Used By:**
- `src/components/common/SearchModal.js`

---

### 🛠️ **Utils**

#### `src/utils/theme.js`
**Purpose:** Design system constants  
**Exports:**
- `theme.colors` - Color palette
- `theme.fonts` - Font families
- `theme.sizes` - Font sizes
- `theme.spacing` - Spacing scale
- `theme.borderRadius` - Border radius values

**Used By:**
- All components for consistent styling

---

### 🧭 **Navigation**

#### `src/navigation/MainNavigator.js`
**Purpose:** Bottom tab navigation  
**Tabs:**
- Home
- Matches
- News
- Standings (NEW!)
- Profile

**Dependencies:**
- `@react-navigation/bottom-tabs`
- `expo-blur` - Tab bar background

**Used By:**
- `App.js`

---

#### `src/navigation/AppNavigator.js`
**Purpose:** Root navigation stack  
**Screens:**
- MainNavigator (tabs)
- Login
- Register
- MatchDetail

**Dependencies:**
- `@react-navigation/native-stack`

**Used By:**
- `App.js`

---

# 🖥️ BACKEND (sportflash-backend)

## 📁 Directory Structure

```
src/
├── config/              # Configuration files
│   └── database.js     # MongoDB connection
├── controllers/         # Route handlers
│   ├── authController.js
│   └── matchController.js
├── middleware/          # Express middleware
│   ├── auth.js         # JWT authentication
│   └── validator.js    # Request validation
├── models/             # Mongoose schemas
│   ├── User.js
│   └── Match.js
├── routes/             # API routes
│   ├── authRoutes.js
│   └── matchRoutes.js
└── server.js           # Main server file
```

---

## 📄 Backend File Details

### 🚀 **Main Server**

#### `src/server.js` (277 lines)
**Purpose:** Express server with Socket.IO  
**Features:**
- REST API endpoints
- Socket.IO real-time updates
- Cricket score fetching from CricketData.org
- Football/Basketball API integration (subscription needed)
- MongoDB connection
- CORS configuration
- Error handling

**Key Functions:**

##### `fetchCricketScores()` (Lines 22-78)
**Purpose:** Fetch live cricket scores  
**API:** CricketData.org API  
**Endpoint:** `https://api.cricapi.com/v1/currentMatches`  
**Interval:** Every 50 seconds  
**Rate Limit:** 100 hits/day  

**Data Mapping:**
```javascript
{
  id: match.id,
  sport: 'cricket',
  status: 'live' | 'finished' | 'upcoming',
  homeTeam: { name, logo, score },
  awayTeam: { name, logo, score },
  cricketData: { overs }
}
```

**Emits:** `cricket_update` event via Socket.IO

---

##### `fetchFootballScores()` (Lines 80-110)
**Purpose:** Fetch live football scores  
**API:** API-Football (RapidAPI)  
**Status:** Subscription required  
**Emits:** `football_update` event

---

##### `fetchBasketballScores()` (Lines 112-142)
**Purpose:** Fetch live basketball scores  
**API:** API-NBA (RapidAPI)  
**Status:** Subscription required  
**Emits:** `basketball_update` event

---

##### `fetchAllLiveScores()` (Lines 144-178)
**Purpose:** Fetch all sports in parallel  
**Features:**
- Uses `Promise.allSettled()` for parallel execution
- Combines all sport scores
- Broadcasts via Socket.IO

**Emits:** `all_scores_update` event with:
```javascript
{
  cricket: [...matches],
  football: [...matches],
  basketball: [...matches],
  timestamp: ISO string
}
```

---

**Socket.IO Events:**
- `connection` - Client connected
- `disconnect` - Client disconnected
- `join_match` - Join match-specific room
- `leave_match` - Leave match room

**REST Endpoints:**
- `GET /health` - Health check
- `GET /api/health` - API health check
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/preferences` - Update preferences
- `GET /api/matches/live` - Get live matches
- `GET /api/matches/upcoming` - Get upcoming matches
- `GET /api/matches?status=finished` - Get finished matches

**Dependencies:**
- `express` - Web framework
- `socket.io` - Real-time communication
- `axios` - HTTP client for external APIs
- `cors` - CORS middleware
- `helmet` - Security headers
- `morgan` - Request logging
- `dotenv` - Environment variables

---

### 🗄️ **Models**

#### `src/models/User.js` (94 lines)
**Purpose:** User data schema  
**Fields:**
- `name` - User's full name
- `email` - Unique email (lowercase)
- `password` - Hashed password (bcrypt)
- `avatar` - Profile picture URL
- `preferences` - User preferences object
  - `favoriteTeams` - Array of team IDs
  - `favoriteSports` - Array of sports
  - `notifications` - Boolean
- `bookmarks` - Array of saved articles
- `role` - user/editor/admin
- `isActive` - Account status
- `lastLogin` - Last login timestamp

**Methods:**
- `comparePassword(candidatePassword)` - Verify password
- `toJSON()` - Remove sensitive data

**Middleware:**
- Pre-save hook to hash password

**Used By:**
- `src/controllers/authController.js`

---

#### `src/models/Match.js`
**Purpose:** Match data schema  
**Fields:**
- `sport` - Sport type
- `status` - Match status
- `league` - League/tournament
- `homeTeam` - Home team data
- `awayTeam` - Away team data
- `scheduledAt` - Match start time
- `cricketData` - Cricket-specific data
- `footballData` - Football-specific data
- `basketballData` - Basketball-specific data

**Used By:**
- `src/controllers/matchController.js`

---

### 🎮 **Controllers**

#### `src/controllers/authController.js` (163 lines)
**Purpose:** Authentication logic  

**Functions:**

##### `register(req, res)` (Lines 14-55)
**Purpose:** Create new user account  
**Validation:**
- Name required (min 2 chars)
- Valid email format
- Password min 6 chars
- Email uniqueness

**Returns:**
```javascript
{
  success: true,
  data: {
    user: { id, name, email, role },
    token: "JWT token"
  }
}
```

---

##### `login(req, res)` (Lines 60-116)
**Purpose:** Authenticate user  
**Process:**
1. Find user by email
2. Compare password (bcrypt)
3. Update lastLogin
4. Generate JWT token

**Returns:**
```javascript
{
  success: true,
  data: {
    user: { id, name, email, role, preferences },
    token: "JWT token"
  }
}
```

---

##### `getMe(req, res)` (Lines 121-135)
**Purpose:** Get current user profile  
**Auth:** Required (JWT)

---

##### `updatePreferences(req, res)` (Lines 140-162)
**Purpose:** Update user preferences  
**Auth:** Required (JWT)

---

#### `src/controllers/matchController.js`
**Purpose:** Match data operations  
**Functions:**
- `getLiveMatches()` - Get all live matches
- `getUpcomingMatches()` - Get upcoming matches
- `getMatchById()` - Get specific match details

---

### 🛡️ **Middleware**

#### `src/middleware/auth.js`
**Purpose:** JWT authentication  
**Function:** `protect(req, res, next)`  
**Process:**
1. Extract token from Authorization header
2. Verify JWT token
3. Attach user to request object
4. Call next middleware

**Used By:**
- Protected routes in `authRoutes.js`

---

#### `src/middleware/validator.js`
**Purpose:** Request validation  
**Function:** `validate(req, res, next)`  
**Uses:** `express-validator`  
**Returns:** 400 error with validation messages

**Used By:**
- `src/routes/authRoutes.js`

---

### 🛣️ **Routes**

#### `src/routes/authRoutes.js` (32 lines)
**Purpose:** Authentication endpoints  

**Routes:**
- `POST /api/auth/register` - User registration
  - Validation: name, email, password
  - Handler: `authController.register`
  
- `POST /api/auth/login` - User login
  - Validation: email, password
  - Handler: `authController.login`
  
- `GET /api/auth/me` - Get current user
  - Auth: Required
  - Handler: `authController.getMe`
  
- `PUT /api/auth/preferences` - Update preferences
  - Auth: Required
  - Handler: `authController.updatePreferences`

**Validation Rules:**
- Email: Valid email format
- Password: Min 6 characters
- Name: Required, not empty

---

#### `src/routes/matchRoutes.js`
**Purpose:** Match data endpoints  

**Routes:**
- `GET /api/matches/live` - Get live matches
- `GET /api/matches/upcoming` - Get upcoming matches
- `GET /api/matches/:id` - Get match by ID

---

### ⚙️ **Configuration**

#### `src/config/database.js`
**Purpose:** MongoDB connection  
**Function:** `connectDB()`  
**Uses:** Mongoose  
**Connection String:** From `process.env.MONGODB_URI`

**Used By:**
- `src/server.js`

---

#### `.env` (25 lines)
**Purpose:** Environment variables  

**Variables:**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/sportflash
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
CLIENT_URL=*
RAPIDAPI_KEY=862dfe30b0msh36b3afa6b8fed96p1bc544jsnfa5dce3dce15
CRICKET_API_KEY=32501aba-64c8-4611-9c82-fb0f8affd04b
```

---

# 🔗 Data Flow & Connections

## 🏏 Cricket Live Scores Flow

```
CricketData.org API
        ↓
Backend: fetchCricketScores() (every 50s)
        ↓
Socket.IO: Emit 'cricket_update'
        ↓
Frontend: useSocket hook listens
        ↓
HomeScreen: Updates state
        ↓
MatchCard: Displays updated scores
```

## 🔐 Authentication Flow

```
User enters credentials
        ↓
LoginScreen: Validates input
        ↓
AuthContext: Calls login()
        ↓
Backend: POST /api/auth/login
        ↓
authController: Verifies credentials
        ↓
Returns JWT token + user data
        ↓
AuthContext: Stores in state
        ↓
App: Shows authenticated UI
```

## 📊 Match Data Flow

```
User opens MatchesScreen
        ↓
Calls api.get('/matches/live')
        ↓
Backend: matchController.getLiveMatches()
        ↓
Returns match data from DB
        ↓
Frontend: Maps to UI format
        ↓
MatchCard: Renders each match
```

## 🔔 Notification Flow

```
User logs in
        ↓
NotificationBell: Shows in header
        ↓
User clicks bell
        ↓
NotificationPanel: Opens modal
        ↓
Displays notifications from state
        ↓
User can mark read/delete
```

---

# 📦 Key Dependencies

## Frontend
- `react-native` - Mobile framework
- `expo` - Development platform
- `@react-navigation/native` - Navigation
- `socket.io-client` - Real-time updates
- `axios` - HTTP client
- `react-native-reanimated` - Animations
- `expo-blur` - Blur effects
- `@expo/vector-icons` - Icons
- `@react-native-async-storage/async-storage` - Local storage
- `@react-native-community/datetimepicker` - Date picker

## Backend
- `express` - Web framework
- `socket.io` - WebSocket server
- `mongoose` - MongoDB ODM
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT tokens
- `axios` - HTTP client
- `cors` - CORS middleware
- `helmet` - Security
- `morgan` - Logging
- `dotenv` - Environment variables
- `express-validator` - Validation

---

# 🎯 Feature Implementation Status

| Feature | Status | Files Involved |
|---------|--------|----------------|
| Search | ✅ Complete | SearchModal.js, HomeScreen.js |
| Loading States | ✅ Complete | Skeleton.js, all screens |
| Empty States | ✅ Complete | EmptyState.js, all screens |
| Error Handling | ✅ Complete | ErrorBoundary.js, all screens |
| Filters | ✅ Complete | FilterPanel.js, DatePicker.js, SportFilter.js, StatusFilter.js, MatchesScreen.js |
| Standings | ✅ Complete | StandingsTable.js, TeamRow.js, PositionBadge.js, StandingsScreen.js |
| Notifications | ✅ Complete | NotificationBell.js, NotificationItem.js, NotificationPanel.js, all screens |
| Live Cricket Scores | ✅ Complete | server.js, useSocket.js, HomeScreen.js |
| Authentication | ✅ Complete | LoginScreen.js, RegisterScreen.js, AuthContext.js, authController.js |

---

# 🚀 Getting Started

## Backend Setup
```bash
cd sportflash-backend
npm install
npm run dev  # Starts on port 5000
```

## Frontend Setup
```bash
cd sportflash-app
npm install
npm start    # Opens Expo dev server
```

## Environment Setup
1. Create `.env` in backend folder
2. Add MongoDB URI
3. Add API keys (Cricket, RapidAPI)
4. Set JWT secret

---

# 📝 Notes

- **Cricket API:** Limited to 100 calls/day
- **Socket.IO:** Fetches every 50 seconds
- **Caching:** HTTP 304 responses are normal and good
- **Mock Data:** Standings use mock data (ready for API)
- **Notifications:** Currently using mock data
- **Theme:** Centralized in `utils/theme.js`
- **Error Handling:** Comprehensive with retry functionality

---

**End of Documentation**
