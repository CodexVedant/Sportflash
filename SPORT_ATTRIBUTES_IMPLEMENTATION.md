# Sport-Specific Player Attributes Implementation

## Overview
Implemented comprehensive sport-specific player attributes across the Sportflash application, ensuring that each sport (Cricket, Football, Basketball) displays relevant player information according to its unique characteristics.

## Backend Changes (`dataMappers.js`)

### Sport-Aware Lineup Normalization
The `normalizeLineups` function now accepts a `sport` parameter and routes to sport-specific mapper functions:

```javascript
const normalizeLineups = (lineups, sport = 'football') => {
    const mapper = sport === 'cricket' ? mapCricketLineupPlayer :
                   sport === 'basketball' ? mapBasketballLineupPlayer :
                   mapFootballLineupPlayer;
    // ...
}
```

### Cricket Player Attributes (`mapCricketLineupPlayer`)
Extracts and maps:
- **Basic**: name, number, position
- **Roles**: isCaptain, isWicketKeeper
- **Styles**: battingStyle, bowlingStyle
- **Stats**: runs, wickets, strikeRate, economyRate, oversBowled

```javascript
{
    name: p.player || p.lineup_player || p.player_name || p.name,
    number: p.number || p.lineup_number || p.player_number || '',
    position: p.position || p.lineup_position || p.player_position || p.player_type || '',
    battingStyle: p.batting_style || p.battingStyle || '',
    bowlingStyle: p.bowling_style || p.bowlingStyle || '',
    isCaptain: p.captain === '1' || p.is_captain === true || p.isCaptain === true || false,
    isWicketKeeper: p.wicket_keeper === '1' || p.isWicketKeeper === true || 
                    p.position === 'Wicket Keeper' || p.position === 'WK' || false,
    runs: p.runs || p.R || null,
    wickets: p.wickets || p.W || null,
    strikeRate: p.strike_rate || p.SR || null,
    economyRate: p.economy_rate || p.economy || p.ER || null,
    oversBowled: p.overs_bowled || p.overs || p.O || null
}
```

### Football Player Attributes (`mapFootballLineupPlayer`)
Extracts and maps:
- **Basic**: name, number, position
- **Roles**: isCaptain, isGoalkeeper
- **Stats**: goals, assists, yellowCards, redCards, minutesPlayed

```javascript
{
    name: p.player || p.lineup_player || p.player_name || p.name,
    number: p.number || p.lineup_number || p.player_number || '',
    position: p.position || p.lineup_position || p.player_position || '',
    isCaptain: p.captain === '1' || p.is_captain === true || p.isCaptain === true || false,
    isGoalkeeper: p.position === 'Goalkeeper' || p.position === 'GK' || 
                  p.player_position === 'Goalkeeper' || false,
    goals: p.goals || p.player_goals || null,
    assists: p.assists || p.player_assists || null,
    yellowCards: p.yellow_cards || p.player_yellow_cards || null,
    redCards: p.red_cards || p.player_red_cards || null,
    minutesPlayed: p.minutes_played || p.player_minutes_played || null
}
```

### Basketball Player Attributes (`mapBasketballLineupPlayer`)
Extracts and maps:
- **Basic**: name, number, position
- **Stats**: points, rebounds, assists, steals, blocks, fieldGoalPercentage

```javascript
{
    name: p.player || p.lineup_player || p.player_name || p.name,
    number: p.number || p.lineup_number || p.player_number || '',
    position: p.position || p.lineup_position || p.player_position || '',
    points: p.points || p.player_points || null,
    rebounds: p.rebounds || p.total_rebounds || p.player_total_rebounds || null,
    assists: p.assists || p.player_assists || null,
    steals: p.steals || p.player_steals || null,
    blocks: p.blocks || p.player_blocks || null,
    fieldGoalPercentage: p.field_goal_percentage || p.fg_percentage || p.FG || null
}
```

## Frontend Changes

### PlayerRow Component (`SharedComponents.js`)

Enhanced to display sport-specific information:

#### Cricket Display
- Shows Captain badge (C)
- Shows Wicket Keeper badge (WK)
- Displays batting and bowling styles as sub-info

#### Football Display
- Shows Captain badge (C)
- Shows Goalkeeper badge (GK)

#### Basketball Display
- No badges (position is sufficient)

#### Additional Features
- `renderBadges()`: Conditionally renders sport-specific badges
- `renderAdditionalInfo()`: Shows batting/bowling styles for cricket
- Fallback for missing player names
- Disabled state when no onPress handler

### Scorecard Components

#### CricketScorecard.js
Passes cricket-specific props:
```javascript
<PlayerRow
    name={player.name}
    number={player.number}
    position={player.position}
    isCaptain={player.isCaptain}
    isWicketKeeper={player.isWicketKeeper}
    battingStyle={player.battingStyle}
    bowlingStyle={player.bowlingStyle}
    sport="cricket"
    onPress={...}
/>
```

#### FootballStats.js
Passes football-specific props:
```javascript
<PlayerRow
    name={player.name}
    number={player.number}
    position={player.position}
    isCaptain={player.isCaptain}
    isGoalkeeper={player.isGoalkeeper}
    sport="football"
    onPress={...}
/>
```

#### BasketballStats.js
Passes basketball-specific props:
```javascript
<PlayerRow
    name={player.name}
    number={player.number}
    position={player.position}
    sport="basketball"
    onPress={...}
/>
```

## Sport-Specific Attributes Matrix

### 🏏 Cricket
| Attribute | Type | Description |
|-----------|------|-------------|
| name | string | Player name |
| number | string | Jersey number |
| position | string | Player type/role |
| battingStyle | string | Right-hand / Left-hand bat |
| bowlingStyle | string | Fast / Spin / Medium |
| isCaptain | boolean | Team captain flag |
| isWicketKeeper | boolean | Wicket-keeper flag |
| runs | number | Total runs scored |
| wickets | number | Total wickets taken |
| strikeRate | number | Batting strike rate |
| economyRate | number | Bowling economy |
| oversBowled | number | Total overs bowled |

### ⚽ Football
| Attribute | Type | Description |
|-----------|------|-------------|
| name | string | Player name |
| number | string | Jersey number |
| position | string | GK / DEF / MID / FWD |
| isCaptain | boolean | Team captain flag |
| isGoalkeeper | boolean | Goalkeeper flag |
| goals | number | Total goals scored |
| assists | number | Total assists |
| yellowCards | number | Yellow cards count |
| redCards | number | Red cards count |
| minutesPlayed | number | Total minutes played |

### 🏀 Basketball
| Attribute | Type | Description |
|-----------|------|-------------|
| name | string | Player name |
| number | string | Jersey number |
| position | string | PG / SG / SF / PF / C |
| points | number | Total points scored |
| rebounds | number | Total rebounds |
| assists | number | Total assists |
| steals | number | Steals made |
| blocks | number | Blocks |
| fieldGoalPercentage | number | Shooting accuracy |

## Styling

Added `playerSubInfo` style for displaying additional information:
```javascript
playerSubInfo: {
    color: theme.colors.textMuted,
    fontSize: 11,
    marginTop: 2,
    fontStyle: 'italic',
}
```

## Benefits

1. **Sport-Appropriate Display**: Each sport shows only relevant attributes
2. **Extensibility**: Easy to add new sports or attributes
3. **Type Safety**: Explicit prop passing prevents errors
4. **Maintainability**: Clear separation of concerns
5. **User Experience**: Rich, contextual player information
6. **API Flexibility**: Handles multiple field name variations from different API sources

## Testing Recommendations

### Cricket
- ✅ Verify captain badges display
- ✅ Verify wicket keeper badges display
- ✅ Check batting/bowling styles appear as sub-info
- ✅ Test with players having only batting or only bowling style

### Football
- ✅ Verify captain badges display
- ✅ Verify goalkeeper badges display
- ✅ Ensure position shows correctly (GK, DEF, MID, FWD)

### Basketball
- ✅ Verify no badges are shown
- ✅ Check position displays (PG, SG, SF, PF, C)
- ✅ Ensure clean, minimal display

### General
- ✅ Test with missing/null data
- ✅ Verify fallback to "Unknown Player"
- ✅ Test onPress functionality
- ✅ Check responsive layout
