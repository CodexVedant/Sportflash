# 🚀 Quick Start Guide - SportFlash

## ⚠️ Prerequisites

Before starting the application, ensure you have:

1. **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
2. **MongoDB** (v5 or higher) - [Download](https://www.mongodb.com/try/download/community)
3. **Git** - [Download](https://git-scm.com/)

---

## 📋 Step-by-Step Setup

### 1️⃣ Start MongoDB

**Windows:**
```powershell
# Option 1: Start as a service
net start MongoDB

# Option 2: Run directly
"C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --dbpath="C:\data\db"
```

**macOS:**
```bash
# Using Homebrew
brew services start mongodb-community

# Or run directly
mongod --config /usr/local/etc/mongod.conf
```

**Linux:**
```bash
sudo systemctl start mongod
sudo systemctl enable mongod  # Auto-start on boot
```

**Verify MongoDB is running:**
```bash
# Should connect successfully
mongosh
```

---

### 2️⃣ Backend Setup

```bash
# Navigate to backend directory
cd Sportflash-backend

# Install dependencies (if not already done)
npm install

# Seed the database with mock data
npm run seed

# Start the development server
npm run dev
```

**Expected Output:**
```
⚡ Server running on http://localhost:5000
🏥 Health check: http://localhost:5000/health
🔌 Socket.IO ready for connections
📊 Environment: development
✅ MongoDB Connected: localhost
```

**Test the API:**
- Open browser: http://localhost:5000/health
- Should see: `{"status":"ok","timestamp":"...","environment":"development"}`

---

### 3️⃣ Frontend Setup

```bash
# Navigate to frontend directory (in a NEW terminal)
cd Sportflash-app

# Install dependencies (if not already done)
npm install

# Start Expo
npm start
```

**Choose your platform:**
- Press `a` for Android emulator
- Press `i` for iOS simulator (macOS only)
- Press `w` for web browser
- Scan QR code with Expo Go app on your phone

---

## 🧪 Testing the Setup

### Backend Tests

1. **Health Check**
   ```bash
   curl http://localhost:5000/health
   ```

2. **Get Live Matches**
   ```bash
   curl http://localhost:5000/api/matches/live
   ```

3. **Register a User**
   ```bash
   curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
   ```

### Frontend Tests

1. Open the app on your device/emulator
2. You should see the HomeScreen with live matches
3. Click on a match to view details
4. Test the search functionality

---

## 🔧 Troubleshooting

### MongoDB Connection Issues

**Error:** `connect ECONNREFUSED 127.0.0.1:27017`

**Solutions:**
1. Make sure MongoDB is running (see Step 1)
2. Check if MongoDB is using the default port (27017)
3. Verify the connection string in `.env`:
   ```
   MONGODB_URI=mongodb://localhost:27017/sportflash
   ```

### Port Already in Use

**Error:** `Port 5000 is already in use`

**Solutions:**
1. Kill the process using port 5000:
   ```bash
   # Windows
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   
   # macOS/Linux
   lsof -ti:5000 | xargs kill -9
   ```
2. Or change the port in `.env`:
   ```
   PORT=5001
   ```

### Expo Connection Issues

**Problem:** Can't connect to development server

**Solutions:**
1. Make sure your phone and computer are on the same WiFi
2. Try running with tunnel: `npx expo start --tunnel`
3. For Android emulator, the API uses `10.0.2.2` instead of `localhost`

---

## 📱 Platform-Specific Notes

### Android Emulator
- API connects to `http://10.0.2.2:5000` (host machine's localhost)
- Make sure the emulator is running before starting Expo

### iOS Simulator
- API connects to `http://localhost:5000`
- Requires macOS and Xcode

### Web
- API connects to `http://localhost:5000`
- Run with: `npm run web` or press `w` in Expo

---

## 🎯 What to Expect

### Backend (http://localhost:5000)
- ✅ Health check endpoint
- ✅ Authentication (register/login)
- ✅ Live matches API
- ✅ Real-time Socket.IO updates
- ✅ Mock data seeded

### Frontend (Expo App)
- ✅ Home screen with live matches
- ✅ Responsive design (mobile/tablet/desktop)
- ✅ Search functionality
- ✅ Navigation structure
- ✅ Theme system

---

## 📊 Project Status

| Component | Status | Notes |
|-----------|--------|-------|
| Backend Server | ✅ Ready | Needs MongoDB running |
| Database Models | ✅ Complete | User, Match, Article |
| API Endpoints | ✅ Working | Auth & Matches |
| Socket.IO | ✅ Configured | Real-time updates |
| Frontend App | ✅ Running | Expo development server |
| API Integration | ✅ Configured | Platform-specific URLs |
| Mock Data | ✅ Available | Run seed script |

---

## 🚀 Next Development Steps

1. **Complete Authentication UI**
   - Login screen
   - Register screen
   - Profile screen

2. **Match Detail Pages**
   - Cricket scorecard
   - Football lineups
   - Basketball box score
   - Live commentary

3. **External API Integration**
   - NewsAPI for articles
   - API-Football for football data
   - CricketData for cricket matches

4. **Real-time Features**
   - Live score updates
   - Push notifications
   - Match subscriptions

---

## 📞 Need Help?

- Check `PHASE1_COMPLETE.md` for detailed implementation notes
- Review `IMPLEMENTATION_PLAN.md` for the full roadmap
- Backend docs: `Sportflash-backend/README.md`
- Design reference: `demo_full.html`

---

## ✅ Quick Checklist

Before you start development:

- [ ] MongoDB is installed and running
- [ ] Node.js is installed (v16+)
- [ ] Backend dependencies installed (`npm install`)
- [ ] Frontend dependencies installed (`npm install`)
- [ ] Database seeded (`npm run seed`)
- [ ] Backend server running (`npm run dev`)
- [ ] Expo server running (`npm start`)
- [ ] Can access http://localhost:5000/health
- [ ] App loads on device/emulator

---

**Happy Coding! 🎉**

*Last updated: December 15, 2025*
