# Sportflash Backend Setup Guide

Complete step-by-step guide to set up the Node.js backend with Express, MongoDB, JWT, and Multer.

---

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB installed locally OR MongoDB Atlas account
- Code editor (VS Code recommended)
- Postman or similar API testing tool

---

## 🚀 Step-by-Step Setup

### **Step 1: Create Backend Directory Structure**

```bash
# Navigate to your project root
cd d:\Sportflash

# Create backend directory
mkdir backend
cd backend

# Create project structure
mkdir src
cd src
mkdir config controllers models routes middleware utils
cd ..
```

Your structure should look like:
```
backend/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── utils/
```

---

### **Step 2: Initialize Node.js Project**

```bash
# Initialize package.json
npm init -y
```

---

### **Step 3: Install Core Dependencies**

```bash
# Core dependencies
npm install express mongoose dotenv cors helmet morgan

# Authentication & Security
npm install jsonwebtoken bcryptjs

# File Upload
npm install multer

# Validation
npm install express-validator

# Development dependencies
npm install --save-dev nodemon
```

**Dependencies Explained:**
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `dotenv` - Environment variables
- `cors` - Cross-Origin Resource Sharing
- `helmet` - Security headers
- `morgan` - HTTP request logger
- `jsonwebtoken` - JWT authentication
- `bcryptjs` - Password hashing
- `multer` - File upload handling
- `express-validator` - Input validation
- `nodemon` - Auto-restart server on changes

---

### **Step 4: Create Environment Variables**

Create `.env` file in the `backend` directory:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# MongoDB Configuration
# For Local MongoDB:
MONGODB_URI=mongodb://localhost:27017/sportflash

# For MongoDB Atlas (replace with your connection string):
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/sportflash?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

# CORS Configuration
CLIENT_URL=http://localhost:3000
```

**Important:** Add `.env` to `.gitignore`!

---

### **Step 5: Create MongoDB Configuration**

Create `src/config/database.js`:

```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
```

---

### **Step 6: Create Middleware**

#### **6.1 Error Handler Middleware**
Create `src/middleware/errorHandler.js`:

```javascript
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log to console for dev
  console.error(err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = { message, statusCode: 404 };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = { message, statusCode: 400 };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = { message, statusCode: 400 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error'
  });
};

module.exports = errorHandler;
```

#### **6.2 JWT Authentication Middleware**
Create `src/middleware/auth.js`:

```javascript
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  let token;

  // Check for token in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized to access this route'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request
    req.user = await User.findById(decoded.id);

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized to access this route'
    });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};
```

#### **6.3 Multer File Upload Middleware**
Create `src/middleware/upload.js`:

```javascript
const multer = require('multer');
const path = require('path');

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.env.UPLOAD_PATH || './uploads');
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedTypes = /jpeg|jpg|png|gif|mp4|mov|avi/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images and videos are allowed.'));
  }
};

// Upload middleware
const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5242880 // 5MB default
  },
  fileFilter: fileFilter
});

module.exports = upload;
```

---

### **Step 7: Create User Model**

Create `src/models/User.js`:

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  avatar: {
    type: String,
    default: 'default-avatar.jpg'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
```

---

### **Step 8: Create Authentication Controller**

Create `src/controllers/authController.js`:

```javascript
const User = require('../models/User');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role
    });

    sendTokenResponse(user, 201, res);
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide an email and password'
      });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// Helper function to get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
};
```

---

### **Step 9: Create Routes**

Create `src/routes/authRoutes.js`:

```javascript
const express = require('express');
const {
  register,
  login,
  getMe
} = require('../controllers/authController');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

module.exports = router;
```

---

### **Step 10: Create Main Server File**

Create `src/server.js`:

```javascript
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security middleware
app.use(helmet());

// Enable CORS
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Serve static files (uploads)
app.use('/uploads', express.static('uploads'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Mount routers
app.use('/api/auth', require('./routes/authRoutes'));

// Error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`❌ Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
```

---

### **Step 11: Update package.json Scripts**

Edit `package.json` and add these scripts:

```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  }
}
```

---

### **Step 12: Create Uploads Directory**

```bash
# In backend directory
mkdir uploads
```

---

### **Step 13: Update .gitignore**

Create/update `.gitignore` in backend directory:

```
node_modules/
.env
uploads/*
!uploads/.gitkeep
*.log
.DS_Store
```

Create `.gitkeep` in uploads:
```bash
touch uploads/.gitkeep
```

---

## 🧪 Testing the Setup

### **1. Start the Server**

```bash
cd backend
npm run dev
```

You should see:
```
✅ MongoDB Connected: localhost
🚀 Server running in development mode on port 5000
```

### **2. Test Health Check Endpoint**

Open browser or Postman:
```
GET http://localhost:5000/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-12-11T08:17:52.000Z"
}
```

### **3. Test User Registration**

**POST** `http://localhost:5000/api/auth/register`

Headers:
```
Content-Type: application/json
```

Body:
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}
```

Expected response:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "Test User",
    "email": "test@example.com",
    "role": "user"
  }
}
```

### **4. Test User Login**

**POST** `http://localhost:5000/api/auth/login`

Body:
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

### **5. Test Protected Route**

**GET** `http://localhost:5000/api/auth/me`

Headers:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## 📁 Final Project Structure

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

---

## 🔐 Security Best Practices

1. **Never commit `.env` file** - Add to `.gitignore`
2. **Use strong JWT secrets** - Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
3. **Set appropriate CORS origins** - Don't use `*` in production
4. **Validate all inputs** - Use express-validator
5. **Rate limiting** - Install `express-rate-limit` for production
6. **Use HTTPS** - In production environments
7. **Keep dependencies updated** - Run `npm audit` regularly

---

## 🎯 Next Steps

1. ✅ Create additional models (Posts, Comments, etc.)
2. ✅ Add more controllers and routes
3. ✅ Implement file upload endpoints using Multer
4. ✅ Add input validation with express-validator
5. ✅ Set up MongoDB Atlas for production
6. ✅ Add rate limiting and additional security
7. ✅ Write API documentation
8. ✅ Add unit tests

---

## 🐛 Common Issues & Solutions

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Make sure MongoDB is running locally or check your Atlas connection string.

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:** Change PORT in `.env` or kill the process using port 5000.

### JWT Secret Not Found
```
Error: secretOrPrivateKey must have a value
```
**Solution:** Make sure `JWT_SECRET` is set in `.env` file.

---

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [JWT.io](https://jwt.io/)
- [Multer Documentation](https://github.com/expressjs/multer)
- [MongoDB Atlas Setup](https://www.mongodb.com/cloud/atlas)

---

**Happy Coding! 🚀**
