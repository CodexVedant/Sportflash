# 🚀 SportFlash Frontend Quick Start

## Current Status
✅ **Backend is running** on `http://localhost:5000`  
✅ **Frontend is running** via Expo  
✅ **All dependencies installed**

## What's Already Set Up

### 1. **React Native Expo App** (`sportflash-app/`)
- ✅ Project structure created
- ✅ Navigation configured (Auth + Main)
- ✅ Theme system implemented
- ✅ Common components built
- ✅ API service configured
- ✅ Socket.IO service configured

### 2. **Screens Implemented**
- ✅ Welcome Screen
- ✅ Login Screen
- ✅ Register Screen
- ✅ Home Screen (with live matches)
- ✅ Match Detail Screen
- ✅ Search Modal

### 3. **Backend Integration**
- ✅ API service with platform detection
- ✅ Socket.IO for real-time updates
- ✅ Health check endpoints

## 🎯 Next Steps

### Step 1: Test Backend Connection

The backend is already running. You can test it by:

1. **Open a browser** and visit:
   - http://localhost:5000/health
   - http://localhost:5000/api/health

2. **You should see:**
   ```json
   {
     "status": "ok",
     "timestamp": "2025-12-15T...",
     "environment": "development",
     "message": "SportFlash API is running"
   }
   ```

### Step 2: View the Frontend

The frontend is already running in Expo. You can:

1. **Press `w`** in the terminal to open in web browser
2. **Scan QR code** with Expo Go app on your phone
3. **Press `a`** for Android emulator
4. **Press `i`** for iOS simulator (macOS only)

### Step 3: Test the Connection

I've created a **ConnectionTest** component for you. To use it:

1. **Temporarily add it to a screen** (e.g., HomeScreen):
   ```javascript
   import ConnectionTest from '../../components/common/ConnectionTest';
   
   // In your render:
   <ConnectionTest />
   ```

2. **Or create a test screen** in the navigation

3. **Test both:**
   - API Connection (should show "SUCCESS")
   - Socket.IO Connection (should show "CONNECTED")

### Step 4: Navigate the App

The app flow is:
1. **Welcome Screen** → First screen you see
2. **Login/Register** → Authentication (currently mock)
3. **Home Screen** → Main dashboard with live matches
4. **Match Detail** → Click any match card

## 🎨 Design Features

### Current Theme
- **Dark Mode** with vibrant accents
- **Glassmorphism** effects on cards
- **Responsive** design (mobile, tablet, desktop)
- **Smooth animations** and transitions

### Color Palette
- Background: `#0f172a` (Dark Slate)
- Primary: `#3b82f6` (Blue)
- Success: `#10b981` (Green)
- Warning: `#f59e0b` (Orange)
- Danger: `#ef4444` (Red)

## 📱 Platform-Specific Notes

### Web (Recommended for Development)
- **URL:** http://localhost:19006
- **Best for:** Quick testing and debugging
- **DevTools:** Full browser developer tools available

### Android Emulator
- **API URL:** Uses `10.0.2.2:5000` (special emulator localhost)
- **Setup:** Requires Android Studio and emulator
- **Note:** First launch may be slow

### iOS Simulator
- **API URL:** Uses `localhost:5000`
- **Setup:** Requires Xcode (macOS only)
- **Note:** Best native experience

### Physical Device
- **Expo Go:** Download from App Store/Play Store
- **Network:** Must be on same WiFi as development machine
- **API URL:** Will need to use your computer's IP address

## 🔧 Configuration Files

### API Configuration (`src/config.js`)
- Centralized configuration for API and Socket URLs
- **Edit this file** to change your backend URL
- Automatically handles platform differences:
  - **Android Emulator:** `http://10.0.2.2:5000`
  - **iOS/Web:** `http://localhost:5000`

### API Service (`src/services/api.js`)
- Uses configuration from `src/config.js`
- Includes request interceptors for auth tokens

### Socket Service (`src/services/socket.js`)
- Uses configuration from `src/config.js`
- Auto-connect disabled (manual control)
- WebSocket transport only

## 🎮 Available Commands

In the `sportflash-app` directory:

```bash
# Start Expo development server
npm start

# Start with cache cleared
npm start -c

# Run on specific platform
npm run web      # Web browser
npm run android  # Android emulator
npm run ios      # iOS simulator
```

## 🐛 Troubleshooting

### "Cannot connect to API"
1. ✅ Backend is running (you have this)
2. Check firewall settings
3. For Android emulator, verify `10.0.2.2` is used
4. For physical device, use your computer's IP

### "Expo won't start"
```bash
# Clear cache and restart
expo start -c

# Or reinstall dependencies
rm -rf node_modules
npm install
```

### "Socket.IO not connecting"
1. Check backend console for Socket.IO logs
2. Verify CORS settings in backend
3. Use ConnectionTest component to debug

## 📊 Mock Data

The app currently uses mock data for:
- Live matches (3 sample matches)
- User authentication (bypasses real auth)
- Score updates (simulated every 10 seconds)

## 🎯 What to Test

### 1. Navigation Flow
- [ ] Welcome → Login → Home
- [ ] Bottom tabs (Home, Matches, News, Profile)
- [ ] Match card → Match detail

### 2. UI Components
- [ ] Search modal (tap search icon)
- [ ] Match cards (responsive grid)
- [ ] Live indicators (animated pulse)
- [ ] Theme consistency

### 3. Backend Integration
- [ ] API health check
- [ ] Socket.IO connection
- [ ] Real-time score updates

### 4. Responsive Design
- [ ] Mobile view (< 480px)
- [ ] Tablet view (480-768px)
- [ ] Desktop view (> 768px)

## 📝 Next Development Steps

### Phase 1: Complete Authentication
1. Connect login to backend API
2. Implement JWT token storage
3. Add protected routes
4. Handle auth errors

### Phase 2: Real Data Integration
1. Fetch live matches from API
2. Display real scores
3. Implement news feed
4. Add user profiles

### Phase 3: Advanced Features
1. Push notifications
2. Favorites/Following
3. Match predictions
4. Social features

## 🎉 You're All Set!

The frontend is **ready to use**. Just:
1. Open the Expo app (press `w` for web)
2. Navigate through the screens
3. Test the connection with ConnectionTest
4. Start building new features!

---

**Need Help?**
- Check `FRONTEND_SETUP.md` for detailed documentation
- Review component examples in `src/components/`
- Test API with `test-api.ps1` script
- Check backend logs for debugging

**Happy Coding! 🚀**
