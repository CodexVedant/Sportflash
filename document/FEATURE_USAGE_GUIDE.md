# Feature Components - Usage Guide

This guide shows how to use all the newly implemented feature components in your Sportflash app.

## 📦 Installation Requirements

Make sure you have these dependencies installed:

```bash
npm install @react-native-community/datetimepicker
```

Or if using Expo:
```bash
npx expo install @react-native-community/datetimepicker
```

---

## 1. Loading States (Skeleton Components)

### Import
```javascript
import { Skeleton, MatchCardSkeleton, NewsCardSkeleton, SkeletonList } from '../components/common';
```

### Usage Examples

#### Match Card Skeleton
```javascript
import { MatchCardSkeleton } from '../components/common';

function MatchesScreen() {
  const [loading, setLoading] = useState(true);

  if (loading) {
    return (
      <View>
        <MatchCardSkeleton />
        <MatchCardSkeleton />
        <MatchCardSkeleton />
      </View>
    );
  }

  return <MatchList matches={matches} />;
}
```

#### Skeleton List (Multiple Items)
```javascript
import { SkeletonList } from '../components/common';

function NewsScreen() {
  const [loading, setLoading] = useState(true);

  if (loading) {
    return <SkeletonList type="news" count={5} />;
  }

  return <NewsList news={news} />;
}
```

#### Custom Skeleton
```javascript
import { Skeleton } from '../components/common';

<Skeleton width={200} height={20} borderRadius={10} />
```

---

## 2. Empty States

### Import
```javascript
import { EmptyState } from '../components/common';
```

### Usage Examples

#### Basic Empty State
```javascript
<EmptyState
  variant="noMatches"
/>
```

#### Empty State with Action
```javascript
<EmptyState
  variant="noBookmarks"
  actionLabel="Explore Matches"
  onAction={() => navigation.navigate('Matches')}
/>
```

#### Custom Empty State
```javascript
<EmptyState
  icon="trophy-outline"
  title="No Trophies Yet"
  subtitle="Start winning matches to earn trophies"
  actionLabel="View Matches"
  onAction={() => navigation.navigate('Matches')}
/>
```

#### Available Variants
- `default` - Generic empty state
- `search` - Search empty state
- `error` - Error state
- `noResults` - No search results
- `noMatches` - No matches available
- `noNews` - No news available
- `noBookmarks` - No bookmarks
- `noFollowing` - Not following anyone
- `noNotifications` - No notifications

---

## 3. Error Handling

### Import
```javascript
import { ErrorBoundary, NetworkError, ApiError, ErrorMessage } from '../components/common';
```

### Usage Examples

#### Error Boundary (Wrap your app)
```javascript
import { ErrorBoundary } from '../components/common';

function App() {
  return (
    <ErrorBoundary showDetails={__DEV__}>
      <YourApp />
    </ErrorBoundary>
  );
}
```

#### Network Error
```javascript
import { NetworkError } from '../components/common';

function MatchesScreen() {
  const [error, setError] = useState(null);

  if (error?.type === 'network') {
    return <NetworkError onRetry={fetchMatches} />;
  }

  return <MatchList />;
}
```

#### API Error
```javascript
import { ApiError } from '../components/common';

if (error?.type === 'api') {
  return (
    <ApiError
      statusCode={error.statusCode}
      message={error.message}
      onRetry={fetchData}
    />
  );
}
```

#### Error Message (Inline)
```javascript
import { ErrorMessage } from '../components/common';

<ErrorMessage
  type="error"
  message="Failed to load matches"
  onDismiss={() => setError(null)}
/>
```

---

## 4. Enhanced Filters

### Import
```javascript
import { FilterPanel } from '../components/filter';
```

### Usage Example

```javascript
import { FilterPanel } from '../components/filter';

function MatchesScreen() {
  const [filterVisible, setFilterVisible] = useState(false);
  const [filters, setFilters] = useState({
    sport: 'all',
    status: 'all',
    league: 'all',
    dateRange: { start: null, end: null },
  });

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    // Fetch matches with new filters
    fetchMatches(newFilters);
  };

  return (
    <View>
      {/* Filter Button */}
      <TouchableOpacity onPress={() => setFilterVisible(true)}>
        <Ionicons name="options-outline" size={24} />
      </TouchableOpacity>

      {/* Filter Panel */}
      <FilterPanel
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onApply={handleApplyFilters}
        initialFilters={filters}
      />

      {/* Your content */}
      <MatchList filters={filters} />
    </View>
  );
}
```

---

## 5. Standings Tables

### Import
```javascript
import { StandingsTable } from '../components/standings';
```

### Usage Example

```javascript
import { StandingsTable } from '../components/standings';

function StandingsScreen() {
  const teams = [
    {
      id: 1,
      position: 1,
      name: 'Manchester City',
      logo: 'https://...',
      played: 20,
      won: 15,
      drawn: 3,
      lost: 2,
      gd: 25,
      points: 48,
    },
    // ... more teams
  ];

  return (
    <StandingsTable
      teams={teams}
      sport="football"
      league="Premier League"
      onTeamPress={(team) => navigation.navigate('TeamDetail', { teamId: team.id })}
    />
  );
}
```

### Cricket Standings Example
```javascript
const cricketTeams = [
  {
    id: 1,
    position: 1,
    name: 'Mumbai Indians',
    logo: 'https://...',
    played: 14,
    won: 10,
    lost: 4,
    nrr: 1.25,
    points: 20,
  },
  // ... more teams
];

<StandingsTable
  teams={cricketTeams}
  sport="cricket"
  league="IPL"
  onTeamPress={handleTeamPress}
/>
```

### Basketball Standings Example
```javascript
const basketballTeams = [
  {
    id: 1,
    position: 1,
    name: 'LA Lakers',
    logo: 'https://...',
    played: 50,
    won: 35,
    lost: 15,
    winPct: 0.700,
    streak: 'W5',
  },
  // ... more teams
];

<StandingsTable
  teams={basketballTeams}
  sport="basketball"
  league="NBA"
  onTeamPress={handleTeamPress}
/>
```

---

## 6. Notifications Panel

### Import
```javascript
import { NotificationBell, NotificationPanel } from '../components/notifications';
```

### Usage Example

```javascript
import { NotificationBell, NotificationPanel } from '../components/notifications';

function Header() {
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'match_start',
      title: 'Match Starting Soon',
      message: 'India vs Australia starts in 15 minutes',
      timestamp: new Date(),
      read: false,
    },
    {
      id: 2,
      type: 'goal',
      title: 'GOAL!',
      message: 'Manchester United scored! 1-0',
      timestamp: new Date(Date.now() - 300000),
      read: false,
    },
    // ... more notifications
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <View style={styles.header}>
      <Text style={styles.title}>Sportflash</Text>
      
      {/* Notification Bell */}
      <NotificationBell
        count={unreadCount}
        onPress={() => setNotificationVisible(true)}
      />

      {/* Notification Panel */}
      <NotificationPanel
        visible={notificationVisible}
        onClose={() => setNotificationVisible(false)}
        notifications={notifications}
        onNotificationPress={(notification) => {
          // Handle notification press
          console.log('Notification pressed:', notification);
          setNotificationVisible(false);
        }}
      />
    </View>
  );
}
```

### Notification Types
- `match_start` - Match starting
- `match_end` - Match ended
- `goal` - Goal scored (football)
- `wicket` - Wicket fallen (cricket)
- `score` - Score update
- `news` - News update
- `team_update` - Team update

---

## 7. Complete Integration Example

Here's a complete example showing how to integrate multiple features:

```javascript
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { 
  SkeletonList, 
  EmptyState, 
  NetworkError, 
  ApiError 
} from '../components/common';
import { FilterPanel } from '../components/filter';
import { NotificationBell, NotificationPanel } from '../components/notifications';
import MatchCard from '../components/match/MatchCard';

function MatchesScreen() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [matches, setMatches] = useState([]);
  const [filterVisible, setFilterVisible] = useState(false);
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [filters, setFilters] = useState({
    sport: 'all',
    status: 'all',
    league: 'all',
    dateRange: { start: null, end: null },
  });

  useEffect(() => {
    fetchMatches();
  }, [filters]);

  const fetchMatches = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get('/matches', { params: filters });
      setMatches(response.data.data);
    } catch (err) {
      if (!err.response) {
        setError({ type: 'network' });
      } else {
        setError({ 
          type: 'api', 
          statusCode: err.response.status,
          message: err.response.data.message 
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Loading State
  if (loading) {
    return <SkeletonList type="match" count={5} />;
  }

  // Network Error
  if (error?.type === 'network') {
    return <NetworkError onRetry={fetchMatches} />;
  }

  // API Error
  if (error?.type === 'api') {
    return (
      <ApiError
        statusCode={error.statusCode}
        message={error.message}
        onRetry={fetchMatches}
      />
    );
  }

  // Empty State
  if (matches.length === 0) {
    return (
      <EmptyState
        variant="noMatches"
        actionLabel="Clear Filters"
        onAction={() => setFilters({
          sport: 'all',
          status: 'all',
          league: 'all',
          dateRange: { start: null, end: null },
        })}
      />
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Matches</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={() => setFilterVisible(true)}>
            <Ionicons name="options-outline" size={24} color="#fff" />
          </TouchableOpacity>
          <NotificationBell
            count={5}
            onPress={() => setNotificationVisible(true)}
          />
        </View>
      </View>

      {/* Match List */}
      <FlatList
        data={matches}
        renderItem={({ item }) => <MatchCard match={item} />}
        keyExtractor={item => item.id}
      />

      {/* Filter Panel */}
      <FilterPanel
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onApply={setFilters}
        initialFilters={filters}
      />

      {/* Notification Panel */}
      <NotificationPanel
        visible={notificationVisible}
        onClose={() => setNotificationVisible(false)}
        notifications={[]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 16,
  },
});

export default MatchesScreen;
```

---

## 🎨 Customization

All components support customization through props and can be styled to match your app's theme. They all use the `theme` utility from `../../utils/theme`.

## 📱 Responsive Design

All components are built with responsive design in mind and work seamlessly on both mobile and tablet devices.

## ♿ Accessibility

Components include proper accessibility features like:
- Touchable opacity for better touch feedback
- Proper text sizing
- Color contrast
- Screen reader support

---

## 🐛 Troubleshooting

### DatePicker not working
Make sure you have installed `@react-native-community/datetimepicker`:
```bash
npx expo install @react-native-community/datetimepicker
```

### Shimmer animation not smooth
The shimmer animation uses `useNativeDriver: true` for better performance. Make sure you're testing on a device or simulator, not just in the browser.

### Components not importing
Make sure you're using the correct import paths. You can use the index files for cleaner imports:
```javascript
import { Skeleton, EmptyState } from '../components/common';
```

---

## 📚 Additional Resources

- [React Native Documentation](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)

---

**Created:** December 16, 2025  
**Version:** 1.0
