# Sport-Specific PlayerRow Component Update

## Overview
Updated the `PlayerRow` component and all scorecard components to be sport-aware, ensuring that only relevant player information is displayed for each sport.

## Changes Made

### 1. **SharedComponents.js** - PlayerRow Component
- Added `sport` prop to the PlayerRow component
- Made the component render sport-specific badges:
  - **Football & Cricket**: Shows Captain badge (C)
  - **Football only**: Shows Goalkeeper badge (GK)
  - **Basketball**: No badges (position is sufficient)
- Added fallback for missing player names ("Unknown Player")
- Disabled TouchableOpacity when no onPress handler is provided

### 2. **CricketScorecard.js**
- Removed `isGoalkeeper` prop (not relevant for cricket)
- Added `sport="cricket"` prop
- Explicitly passes only: `name`, `number`, `position`, `isCaptain`, `sport`

### 3. **FootballStats.js**
- Kept `isGoalkeeper` prop (relevant for football)
- Added `sport="football"` prop
- Explicitly passes: `name`, `number`, `position`, `isCaptain`, `isGoalkeeper`, `sport`

### 4. **BasketballStats.js**
- Removed `isCaptain` and `isGoalkeeper` props (not typically used in basketball lineups)
- Added `sport="basketball"` prop
- Explicitly passes only: `name`, `number`, `position`, `sport`

### 5. **Backend - dataMappers.js**
- Enhanced `mapLineupPlayer` function to extract:
  - `isCaptain`: Checks for `captain === '1'`, `is_captain === true`, or `isCaptain === true`
  - `isGoalkeeper`: Checks if position is "Goalkeeper" or "GK"
- These properties are now available for all sports but only used where relevant

## Sport-Specific Attributes

| Sport      | Name | Number | Position | Captain | Goalkeeper |
|------------|------|--------|----------|---------|------------|
| Football   | ✅   | ✅     | ✅       | ✅      | ✅         |
| Cricket    | ✅   | ✅     | ✅       | ✅      | ❌         |
| Basketball | ✅   | ✅     | ✅       | ❌      | ❌         |

## Benefits
1. **Sport-appropriate display**: Each sport shows only relevant information
2. **Type safety**: Explicit prop passing prevents unexpected data from causing errors
3. **Maintainability**: Clear separation of concerns for each sport
4. **Extensibility**: Easy to add new sports or sport-specific attributes
5. **Error prevention**: Fixed the "Unexpected text node" error by ensuring all text is properly wrapped

## Testing Recommendations
- Verify cricket lineups show captain badges
- Verify football lineups show both captain and goalkeeper badges
- Verify basketball lineups show only name, number, and position
- Test with missing data (null/undefined values) to ensure graceful fallbacks
