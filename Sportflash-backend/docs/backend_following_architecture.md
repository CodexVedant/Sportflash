# Backend Architecture: Following & Preferences System

## Overview
The "Following" feature (Matches, Teams, Leagues) is implemented using a **User-Centric Data Model** stored in **MongoDB**. It uses a specialized `preferences` object embedded directly within the User document for fast access and personalization.

## 1. Database Schema (MongoDB)
We use a **NoSQL approach** to store followed items. Instead of separate join tables (SQL style), we store arrays of IDs and Objects directly in the `User` collection.

**File:** `src/models/User.js`

### Schema Structure
```javascript
preferences: {
    // 1. Followed Matches (Strict ID List)
    // Used for Push Notification filtering
    followedMatches: [String], // e.g., ["12345", "67890"]

    // 2. Favorite Teams (Rich Objects)
    // Stores Name, Logo, Sport for UI display without extra API calls
    favoriteTeams: [{
        id: String,
        name: String,     // e.g., "India"
        sport: String,    // e.g., "cricket"
        logo: String
    }],

    // 3. Favorite Leagues
    favoriteLeagues: [{
        id: String,
        name: String,     // e.g., "Premier League"
        sport: String
    }]
}
```

## 2. API Implementation
We use a **REST API** to manage these preferences.

**File:** `src/controllers/authController.js`

### Endpoint: `PUT /api/auth/preferences`
- **Purpose**: Updates any part of the preference object.
- **Logic**:
    1.  Receives the new list (e.g., `followedMatches` or `favoriteTeams`).
    2.  **Sanitizes** the input (ensures IDs are strings, handles legacy formats).
    3.  Updates the User document using `user.save()`.
    4.  Returns the updated User object to the Frontend (Redux).

## 3. Data Flow
1.  **User Action**: User clicks "Bell Icon" 🔔 on App.
2.  **Frontend**: `HomeScreen.tsx` updates Redux locally.
3.  **API Call**: Frontend sends `PUT /api/auth/preferences` with the new array.
4.  **Database**: MongoDB updates the `User` document.
5.  **Notification System**: When a match event occurs (`server.js`), the server checks `user.preferences.followedMatches.includes(matchId)` to decide whether to send a Push Notification.

## 4. Why this approach?
-   **Performance**: Reading user preferences is instant (bundled with User Auth).
-   **Scalability**: MongoDB handles embedded arrays efficiently.
-   **Simplicity**: No complex JOIN queries required to check if a user follows a match.
