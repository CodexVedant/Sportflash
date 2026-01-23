# Sportflash Frontend

React Native mobile app for live sports scores, news, and real-time updates built with Expo.

## Quick Start

```bash
# Install dependencies
npm install

# Configure environment
# Create .env file with:
# EXPO_PUBLIC_API_URL=your_backend_url

# Start development server
npm start

# Run on specific platform
npm run android  # Android
npm run ios      # iOS
npm run web      # Web
```

## Environment Variables

Create `.env` file:
```
EXPO_PUBLIC_API_URL=http://localhost:5000
```

## Tech Stack

- **Framework**: React Native + Expo
- **Language**: TypeScript
- **Navigation**: React Navigation
- **State Management**: Redux Toolkit + Redux Persist
- **UI Components**: Custom components with Expo Linear Gradient & Blur
- **Real-time**: Socket.io Client
- **Notifications**: Expo Notifications
- **Performance**: FlashList for optimized lists

## Features

- Live sports scores (Football, Basketball, Cricket)
- Real-time match updates via WebSocket
- Sports news feed with bookmarking
- Push notifications
- User authentication
- Dark theme UI

## Project Structure

- `src/screens/` - App screens
- `src/components/` - Reusable components
- `src/navigation/` - Navigation configuration
- `src/store/` - Redux state management
- `src/services/` - API and notification services
