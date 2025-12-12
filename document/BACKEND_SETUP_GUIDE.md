# Sportflash Master Backend Setup Guide

This guide is aligned with the **SportFlash Implementation Plan**. It covers the complete backend architecture including services for external APIs, cron jobs, and real-time features.

---

## 📋 Prerequisites

- Node.js (v16+)
- MongoDB (Local or Atlas)
- Redis (Optional, for caching)
- API Keys:
  - NewsAPI
  - API-Football
  - CricketData

---

## 🚀 Optimized Directory Structure

Based on `IMPLEMENTATION_PLAN.md`, we will create this exact structure:

```bash
backend/
├── src/
│   ├── config/             # Configuration (DB, Env, Socket)
│   ├── controllers/        # Route logic (Auth, Match, News...)
│   ├── models/             # Mongoose Models (User, Match...)
│   ├── routes/             # API Routes
│   ├── middleware/         # Auth, Upload, Validation, Error
│   ├── services/           # External APIs (Cricket, Football, News)
│   ├── utils/              # Logger, Cache, Helpers
│   ├── jobs/               # Cron jobs (Fetch matches, Update news)
│   ├── app.js              # Express App setup
│   └── server.js           # Server entry point
├── tests/                  # Unit & Integration tests
├── uploads/                # Static files
├── .env
└── package.json
```

---

## 🛠️ Step-by-Step Implementation

### **Step 1: Create Directories**

```bash
mkdir backend
cd backend
mkdir src tests uploads
cd src
mkdir config controllers models routes middleware services utils jobs
cd ..
```

### **Step 2: Initialize & Install Dependencies**

```bash
npm init -y
```

**Install Production Dependencies:**
```bash
npm install express mongoose dotenv cors helmet morgan
npm install jsonwebtoken bcryptjs            # Auth
npm install multer                           # File Upload
npm install socket.io                        # Real-time
npm install axios                            # API Requests
npm install node-cron                        # Scheduled Jobs
npm install express-validator                # Validation
npm install compression                      # Response Compression
npm install winston                          # Logging
```

**Install Dev Dependencies:**
```bash
npm install --save-dev nodemon jest supertest
```

---

### **Step 3: Core Configuration**

#### **3.1 Environment Variables (`.env`)**
```env
# Server
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:19000

# Database
MONGODB_URI=mongodb://localhost:27017/sportflash

# JWT Auth
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d

# External APIs
NEWS_API_KEY=75705b8a2a7a403ca553e2885a29638f
FOOTBALL_API_KEY=0331700a39932ec89dc7ac831f7a6952
CRICKET_API_KEY=27b48bcc-d8cd-405c-a0af-df533800f83a

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

#### **3.2 Database Config (`src/config/database.js`)**
```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ DB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
```

#### **3.3 Socket.IO Config (`src/config/socket.js`)**
```javascript
const socketIO = require('socket.io');

let io;

const initSocket = (server) => {
  io = socketIO(server, {
    cors: {
      origin: process.env.CLIENT_URL || "*",
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log('🔌 Client connected:', socket.id);

    socket.on('match:subscribe', (matchId) => {
      socket.join(`match_${matchId}`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};

module.exports = { initSocket, getIO };
```

---

### **Step 4: Models Setup**

#### **4.1 User Model (`src/models/User.js`)**
```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  avatar: String,
  preferences: {
    favoriteTeams: [String],
    favoriteSports: [String]
  },
  createdAt: { type: Date, default: Date.now }
});

// Hash password
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) next();
  this.password = await bcrypt.hash(this.password, 10);
});

// Sign JWT
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
};

// Match password
UserSchema.methods.matchPassword = async function(enteredPass) {
  return await bcrypt.compare(enteredPass, this.password);
};

module.exports = mongoose.model('User', UserSchema);
```

#### **4.2 Match Model (`src/models/Match.js`)**
```javascript
const mongoose = require('mongoose');

const MatchSchema = new mongoose.Schema({
  sport: { type: String, enum: ['cricket', 'football', 'basketball'], required: true },
  homeTeam: {
    name: String,
    logo: String,
    score: String
  },
  awayTeam: {
    name: String,
    logo: String,
    score: String
  },
  status: { type: String, enum: ['live', 'upcoming', 'finished'], default: 'upcoming' },
  startTime: Date,
  league: String,
  liveData: {
    currentPeriod: String, // '1st Half', 'Over 10.2'
    events: []
  },
  externalId: String // ID from the external API
});

module.exports = mongoose.model('Match', MatchSchema);
```

---

### **Step 5: Services (External APIs)**

#### **5.1 Football API Service (`src/services/footballAPI.js`)**
```javascript
const axios = require('axios');

const fetchLiveMatches = async () => {
  const options = {
    method: 'GET',
    url: 'https://v3.football.api-sports.io/fixtures',
    params: { live: 'all' },
    headers: {
      'x-rapidapi-key': process.env.FOOTBALL_API_KEY,
      'x-rapidapi-host': 'v3.football.api-sports.io'
    }
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

module.exports = { fetchLiveMatches };
```

---

### **Step 6: Middleware**

#### **6.1 File Upload (`src/middleware/upload.js`)**
```javascript
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, './uploads'),
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const types = /jpeg|jpg|png|gif/;
    if (types.test(path.extname(file.originalname).toLowerCase())) {
      cb(null, true);
    } else {
      cb(new Error('Images only!'));
    }
  }
});

module.exports = upload;
```

---

### **Step 7: Server Entry Point**

#### **7.1 App Setup (`src/app.js`)**
```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Static folder
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/matches', require('./routes/matchRoutes'));
// app.use('/api/news', require('./routes/newsRoutes'));

// Error Handler
app.use(errorHandler);

module.exports = app;
```

#### **7.2 Server (`src/server.js`)**
```javascript
const app = require('./app');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const { initSocket } = require('./config/socket');
const http = require('http');

// Load Config
dotenv.config();
connectDB();

const server = http.createServer(app);
const io = initSocket(server); // Initialize Socket.IO

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
```

---

### **Step 8: Cron Jobs Example**

#### **8.1 Fetch Jobs (`src/jobs/fetchLiveMatches.js`)**
```javascript
const cron = require('node-cron');
const { fetchLiveMatches } = require('../services/footballAPI');
const Match = require('../models/Match');

// Run every minute
cron.schedule('*/1 * * * *', async () => {
  console.log('Job: Fetching live matches...');
  // Logic to fetch from API and update DB
  // const matches = await fetchLiveMatches();
  // ... update DB ...
});
```

---

## ✅ What's Next?

1. **Run the Setup**: Execute the directory creation commands.
2. **Implement Routes**: Create route files in `src/routes/` for all controllers.
3. **Build Services**: Fully implement the API wrappers in `src/services/`.
4. **Test**: Use Postman to verify Auth and Uploads.

This structure allows your backend to scale with:
- **Services** for handling the complexity of 3 different sport APIs.
- **Jobs** for keeping data fresh without user requests.
- **Socket.IO** for the "Live" feel of the app.
