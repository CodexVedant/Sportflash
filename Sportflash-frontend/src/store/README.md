# SportFlash Redux Store Architecture

This directory contains the state management logic for the SportFlash application, utilizing **Redux Toolkit (RTK)** and **RTK Query**.

## Structure

```text
src/store/
├── api/            # RTK Query API definitions (Data Fetching)
├── slices/         # Redux State Slices (Client-side State)
└── store.js        # Main Store Configuration
```

## 1. Store Configuration (`store.js`)
The `store.js` file is the entry point for the Redux store. It acts as the single source of truth for the application's state.
- **Reducers**: Combines reducers from both `slices` and `api` services.
- **Middleware**: Integrates RTK Query middleware to handle caching, invalidation, and polling.
- **Config**: Sets up optional configurations like serializable checks (disabled here to prevent warnings with non-serializable data types if needed).

## 2. API Services (`src/store/api/`)
We use **RTK Query** for efficient data fetching and caching. Each file corresponds to a domain of the backend API.

| File | Purpose | Key Endpoints |
|------|---------|---------------|
| `authApi.js` | Auxiliary auth operations | `forgotPassword`, `resetPassword` |
| `matchesApi.js` | Match data handling | `getLiveMatches` (Live scores), `getMatchDetails` |
| `newsApi.js` | News content | `getNews`, `getTrendingNews`, `getNewsDetail` |
| `searchApi.js` | Global search | `globalSearch` |
| `teamsApi.js` | Team information | `getTeam`, `searchTeams`, `toggleFollowTeam` |
| `usersApi.js` | User profile management | `getUserProfile`, `updateProfile` |

**Key Features:**
- **Automatic Caching**: Data is cached by default to reduce network requests.
- **Auto-refetching**: Can be configured to refetch data on focus or reconnect.
- **Optimistic Updates**: (Future) Can update UI immediately before server confirms.

## 3. State Slices (`src/store/slices/`)
These slices manage client-side state that isn't directly tied to an API cache or requires complex local manipulation.

| File | State Managed | Actions |
|------|---------------|---------|
| `authSlice.js` | User authentication status | `login`, `register`, `logout`, `loadUser` (AsyncThunks) |
| `matchesSlice.js` | UI filters for matches | `setFilter`, `setSelectedSport`, `toggleFavoriteMatch` |
| `newsSlice.js` | News UI state | `setNewsCategory`, `toggleBookmark` |
| `notificationsSlice.js` | In-app notifications | `addNotification`, `markAsRead`, `markAllAsRead` |
| `searchSlice.js` | Search history & queries | `addToHistory`, `clearHistory`, `setLastQuery` |
| `themeSlice.js` | App Theme (Light/Dark) | `toggleTheme`, `setTheme` |
| `userSlice.js` | User view state | `setViewingProfileId` |

## Usage Guide

### Using State (Slices)
Use `useSelector` to read data and `useDispatch` to change it.

```javascript
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '@store/slices/themeSlice';

const Component = () => {
    const dispatch = useDispatch();
    const themeMode = useSelector((state) => state.theme.mode);

    return <Button onPress={() => dispatch(toggleTheme())} title={themeMode} />;
};
```

### Using APIs (RTK Query)
Use the auto-generated hooks from the API files.

```javascript
import { useGetLiveMatchesQuery } from '@store/api/matchesApi';

const MatchesList = () => {
    const { data: matches, isLoading, error } = useGetLiveMatchesQuery();

    if (isLoading) return <Loader />;
    return <List data={matches} />;
};
```

## Migration Note
This structure replaces the previous `Context` based approach (`AuthContext`, etc.) to provide a more scalable and performant state management solution suitable for larger applications.
