# Authentication System Documentation

## Overview
The SportFlash app uses **AuthContext** for authentication management across all screens.

## Components

### 1. AuthContext (`src/context/AuthContext.js`)
- **Purpose**: Centralized authentication state management
- **Features**:
  - User login
  - User registration
  - User logout
  - Load user from AsyncStorage on app start
  - Update user preferences
  - Automatic token management with Axios

### 2. Login Screen (`src/screens/auth/LoginScreen.js`)
- **Features**:
  - Email and password input
  - Client-side validation (email format, required fields)
  - Error handling with ErrorMessage component
  - "Forgot Password" link
  - Navigation to Register screen
  - Responsive design (desktop/mobile)
  - Loading states

### 3. Register Screen (`src/screens/auth/RegisterScreen.js`)
- **Features**:
  - Name, email, and password input
  - Client-side validation:
    - Name minimum 2 characters
    - Password minimum 6 characters
    - Valid email format
  - Error handling with ErrorMessage component
  - Navigation to Login screen
  - Responsive design (desktop/mobile)
  - Loading states

### 4. Profile Screen (`src/screens/profile/ProfileScreen.js`)
- **Features**:
  - Display user information (name, email, avatar)
  - Show user stats (following teams, sports, alerts)
  - Menu items for navigation
  - Logout functionality with confirmation dialog
  - Guest mode for non-logged-in users
  - Premium member badge

## Authentication Flow

### Login Flow
1. User enters email and password
2. Client-side validation checks
3. API call to `/auth/login`
4. On success:
   - Token and user data stored in AsyncStorage
   - Axios default headers updated with Bearer token
   - User state updated in AuthContext
   - Navigate back to previous screen
5. On failure:
   - Error message displayed

### Registration Flow
1. User enters name, email, and password
2. Client-side validation checks
3. API call to `/auth/register`
4. On success:
   - Token and user data stored in AsyncStorage
   - Axios default headers updated with Bearer token
   - User state updated in AuthContext
   - Navigate back to previous screen
5. On failure:
   - Error message displayed

### Logout Flow
1. User clicks logout button
2. Confirmation dialog appears
3. On confirm:
   - Token and user data removed from AsyncStorage
   - Axios default headers cleared
   - User state cleared in AuthContext
   - App automatically handles navigation

### Auto-Login Flow
1. App starts
2. AuthContext loads token and user from AsyncStorage
3. If found:
   - User state populated
   - Axios headers configured
   - User remains logged in
4. If not found:
   - User remains as guest

## API Endpoints

### Login
- **Endpoint**: `POST /auth/login`
- **Body**: `{ email, password }`
- **Response**: `{ token, user }`

### Register
- **Endpoint**: `POST /auth/register`
- **Body**: `{ name, email, password }`
- **Response**: `{ token, user }`

### Update Preferences
- **Endpoint**: `PUT /auth/preferences`
- **Headers**: `Authorization: Bearer {token}`
- **Body**: `{ preferences }`
- **Response**: `{ user }`

## State Management

### AuthContext State
```javascript
{
  user: {
    _id: string,
    name: string,
    email: string,
    preferences: {
      favoriteTeams: array,
      favoriteSports: array,
      ...
    }
  },
  token: string,
  loading: boolean
}
```

## Usage in Components

### Accessing Auth State
```javascript
import { AuthContext } from '@context/AuthContext';
import { useContext } from 'react';

function MyComponent() {
  const { user, login, logout } = useContext(AuthContext);
  
  // Use user, login, logout as needed
}
```

### Conditional Rendering Based on Auth
```javascript
{user ? (
  <LoggedInView />
) : (
  <GuestView />
)}
```

## Security Features

1. **Token Storage**: Secure storage using AsyncStorage
2. **Password Security**: Passwords are never stored locally
3. **Automatic Token Injection**: Axios interceptor adds token to all requests
4. **Token Cleanup**: Token removed on logout
5. **Client-side Validation**: Prevents unnecessary API calls

## Error Handling

- Network errors
- Invalid credentials
- Validation errors
- Server errors
- All errors displayed using ErrorMessage component

## Responsive Design

- Desktop: 450px card width
- Mobile: 90% screen width
- Keyboard-aware scrolling
- Safe area handling

## todo Enhancements

- [ ] Forgot password functionality
- [ ] Email verification
- [ ] Social login (Google, Facebook)
- [ ] Biometric authentication
- [ ] Remember me option
- [ ] Session timeout
- [ ] Refresh token mechanism
