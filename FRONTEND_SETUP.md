# SportFlash Frontend Setup Guide

## 🎯 Overview
The SportFlash frontend is built with **React Native** and **Expo**, providing a cross-platform mobile experience for iOS, Android, and Web.

## 📁 Project Structure

```
sportflash-app/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── common/       # Generic components (Button, Input, Card, etc.)
│   │   ├── match/        # Match-specific components
│   │   ├── navigation/   # Navigation components
│   │   ├── news/         # News components
│   │   └── ...
│   ├── screens/          # Screen components
│   │   ├── auth/         # Authentication screens
│   │   ├── home/         # Home screen
│   │   ├── matches/      # Match screens
│   │   ├── news/         # News screens
│   │   └── ...
│   ├── navigation/       # Navigation configuration
│   ├── services/         # API and Socket.IO services
│   ├── store/            # Redux store (future)
│   ├── utils/            # Utilities and theme
│   └── context/          # React Context providers
├── assets/               # Images, fonts, etc.
├── App.js               # Root component
└── package.json         # Dependencies
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (installed globally or via npx)

### Installation

1. **Navigate to the frontend directory:**
   ```bash
   cd sportflash-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   
   Create a `.env` file in the `sportflash-app` directory (copy from `.env.example`):
   ```env
   API_BASE_URL=http://localhost:5000/api
   SOCKET_URL=http://localhost:5000
   NEWS_API_KEY=your_news_api_key
   FOOTBALL_API_KEY=your_football_api_key
   CRICKET_API_KEY=your_cricket_api_key
   BASKETBALL_API_KEY=your_basketball_api_key
   ```

4. **Start the development server:**
   ```bash
   npm start
   ```

### Running on Different Platforms

- **Web:** Press `w` in the terminal or run `npm run web`
- **iOS Simulator:** Press `i` or run `npm run ios` (macOS only)
- **Android Emulator:** Press `a` or run `npm run android`
- **Physical Device:** Scan the QR code with Expo Go app

## 🎨 Design System

### Theme
The app uses a centralized theme system (`src/utils/theme.js`) with:

- **Colors:** Dark mode optimized with vibrant accents
  - Background: `#0f172a` (dark slate)
  - Primary: `#3b82f6` (blue)
  - Surface: `rgba(30, 41, 59, 0.7)` (glass effect)
  
- **Typography:** System fonts with fallbacks
- **Spacing:** Consistent spacing scale (xs to xxl)
- **Border Radius:** Rounded corners for modern look
- **Shadows:** Elevation and glow effects

### Components

#### Common Components
- `Button` - Primary action button with loading states
- `Input` - Text input with icons and validation
- `Card` - Container with glass morphism effect
- `Badge` - Status indicators
- `Avatar` - User profile images
- `Toast` - Notification messages
- `SearchModal` - Full-screen search interface
- `EmptyState` - Placeholder for empty data
- `Skeleton` - Loading placeholders

#### Match Components
- `MatchCard` - Live match display
- `ScoreBoard` - Detailed score information
- `LiveIndicator` - Animated live status

## 🔌 Backend Integration

### API Service (`src/services/api.js`)

The app uses Axios for HTTP requests with automatic platform detection:

```javascript
import api from '../services/api';

// Example: Fetch matches
const response = await api.get('/matches');

// Example: Login
const response = await api.post('/auth/login', { email, password });
```

**Platform-specific URLs:**
- iOS/Web: `http://localhost:5000/api`
- Android Emulator: `http://10.0.2.2:5000/api`

### Socket.IO Service (`src/services/socket.js`)

Real-time updates for live matches:

```javascript
import socket, { connectSocket, disconnectSocket } from '../services/socket';

// Connect
connectSocket();

// Listen for score updates
socket.on('score_update', (data) => {
  console.log('Score updated:', data);
});

// Join match room
socket.emit('join_match', matchId);

// Disconnect
disconnectSocket();
```

## 📱 Key Features

### 1. Authentication Flow
- Welcome Screen
- Login Screen
- Register Screen
- Forgot Password Screen

### 2. Home Screen
- Live matches grid (responsive)
- Trending news section
- Quick search access
- Bottom tab navigation

### 3. Match Features
- Live score updates via Socket.IO
- Match details and statistics
- Team information
- Player profiles

### 4. Navigation
- Stack navigation for screens
- Bottom tab navigation for main sections
- Modal navigation for search and filters

## 🔧 Configuration

### Platform-Specific Considerations

#### Android
- Uses `10.0.2.2` to access localhost from emulator
- Requires network permissions in `app.json`

#### iOS
- Uses `localhost` directly
- May require additional permissions for camera/location

#### Web
- Runs on `http://localhost:19006` by default
- Full responsive design support

### App Configuration (`app.json`)

```json
{
  "expo": {
    "name": "SportFlash",
    "slug": "sportflash-app",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#0f172a"
    }
  }
}
```

## 🧪 Testing

### Manual Testing
1. Start the backend server (`npm run dev` in `sportflash-backend`)
2. Start the frontend (`npm start` in `sportflash-app`)
3. Test authentication flow
4. Verify live match updates
5. Check responsive design on different screen sizes

### API Testing
Use the provided `test-api.ps1` script to verify backend endpoints:
```powershell
.\test-api.ps1
```

## 🚧 Current Status

### ✅ Completed
- Project structure and navigation
- Authentication screens (UI only)
- Home screen with live matches
- Match detail screen
- Theme system and design components
- API and Socket.IO integration
- Responsive design for mobile, tablet, and desktop

### 🔄 In Progress
- Backend API integration
- Real authentication with JWT
- News feed implementation
- User profile management

### 📋 Upcoming
- Push notifications
- Offline support
- Analytics integration
- Performance optimization

## 🐛 Troubleshooting

### Common Issues

1. **"Unable to connect to backend"**
   - Ensure backend is running on port 5000
   - Check firewall settings
   - Verify API_BASE_URL in .env

2. **"Expo app not loading"**
   - Clear Expo cache: `expo start -c`
   - Reinstall dependencies: `rm -rf node_modules && npm install`

3. **"Socket.IO not connecting"**
   - Verify SOCKET_URL in .env
   - Check backend Socket.IO configuration
   - Ensure CORS is properly configured

4. **"Android emulator can't reach localhost"**
   - Use `10.0.2.2` instead of `localhost`
   - Check emulator network settings

## 📚 Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Socket.IO Client](https://socket.io/docs/v4/client-api/)

## 🤝 Contributing

1. Follow the existing code structure
2. Use the theme system for styling
3. Create reusable components when possible
4. Test on multiple platforms before committing
5. Update this documentation for major changes

## 📞 Support

For issues or questions:
- Check the documentation
- Review existing code examples
- Consult the backend API documentation
- Test with the provided mock data first

---

**Last Updated:** December 15, 2025
**Version:** 1.0.0
**Status:** Development
