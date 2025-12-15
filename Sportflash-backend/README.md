# SportFlash Backend

Backend API for SportFlash - A multi-sport live score application.

## 🚀 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Real-time**: Socket.IO
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, CORS, bcryptjs
- **Validation**: express-validator

## 📁 Project Structure

```
src/
├── config/          # Configuration files (database, etc.)
├── controllers/     # Route controllers
├── middleware/      # Custom middleware (auth, validation, error handling)
├── models/          # Mongoose models
├── routes/          # API routes
├── services/        # Business logic & external API integrations
├── utils/           # Utility functions & helpers
└── server.js        # Main application file
```

## 🔧 Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/sportflash

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# CORS Configuration
CLIENT_URL=http://localhost:3000
```

### 3. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# Windows
mongod

# macOS/Linux
sudo systemctl start mongod
```

### 4. Seed Database (Optional)

Populate the database with mock data:

```bash
npm run seed
```

### 5. Run the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:5000`

## 📡 API Endpoints

### Health Check
- `GET /health` - Server health status

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)
- `PUT /api/auth/preferences` - Update user preferences (Protected)

### Matches
- `GET /api/matches/live` - Get all live matches
- `GET /api/matches/upcoming` - Get upcoming matches
- `GET /api/matches/sport/:sport` - Get matches by sport (cricket/football/basketball)
- `GET /api/matches/:id` - Get single match details
- `POST /api/matches` - Create match (Admin only)
- `PUT /api/matches/:id` - Update match (Admin only)

## 🔌 Socket.IO Events

### Client → Server
- `join_match` - Join a specific match room for real-time updates
- `leave_match` - Leave a match room

### Server → Client
- `score_update` - Real-time score updates
- `match_update` - Match data changes

## 🗄️ Database Models

### User
- Authentication & user management
- Preferences (favorite teams, sports)
- Bookmarks
- Role-based access control

### Match
- Multi-sport match data
- Real-time status tracking
- Sport-specific fields (cricket, football, basketball)
- External API integration support

### Article
- News & editorial content
- Author management
- Categories & tags
- Publishing workflow

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## 🛡️ Security Features

- Helmet.js for HTTP headers security
- CORS configuration
- Password hashing with bcryptjs
- JWT token expiration
- Input validation with express-validator
- Role-based access control

## 📝 Development Notes

- All timestamps are in UTC
- API responses follow a consistent format:
  ```json
  {
    "success": true/false,
    "data": {},
    "message": "Optional message"
  }
  ```

## 🚧 Phase 1 MVP Features

- ✅ User authentication (register/login)
- ✅ Live match endpoints
- ✅ Real-time updates via Socket.IO
- ✅ Match filtering by sport
- ✅ User preferences
- 🔄 External API integration (Phase 1B)
- 🔄 News & articles (Phase 1B)

## 📦 Dependencies

### Core
- express
- mongoose
- socket.io
- dotenv

### Authentication & Security
- jsonwebtoken
- bcryptjs
- helmet
- cors

### Validation & Utilities
- express-validator
- morgan (logging)
- axios (HTTP client)

### Development
- nodemon

## 🤝 Contributing

This is part of the SportFlash project. Follow the implementation plan in `IMPLEMENTATION_PLAN.md`.

## 📄 License

ISC
