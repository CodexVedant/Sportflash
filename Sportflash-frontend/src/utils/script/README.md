# Scripts/Helpers Directory

This directory contains helper functions, utilities, and constants used across the Sportflash app.

## Purpose

Instead of defining helper functions and constants inline within component files, we extract them to separate files here for better:
- **Reusability**: Functions can be used across multiple components
- **Testability**: Helper functions can be unit tested independently
- **Maintainability**: Easier to update and manage business logic
- **Organization**: Clear separation of concerns

## File Naming Convention

Each helper file should follow this pattern:
```
[ComponentName].helpers.js
```

Examples:
- `MatchCard.helpers.js` - Helper functions for MatchCard component
- `HomeScreen.helpers.js` - Helper functions for HomeScreen
- `dateHelpers.js` - Date formatting utilities (shared)
- `validators.js` - Validation functions (shared)

## File Structure

Each helper file should export named functions and constants:

```javascript
import { theme } from '@utils/theme';

/**
 * Description of what this function does
 * @param {type} paramName - Description
 * @returns {type} Description
 */
export const helperFunction = (param) => {
    // Implementation
    return result;
};

/**
 * Constant description
 */
export const SOME_CONSTANT = 'value';
```

## Usage in Components

Import helpers in your component:

```javascript
// Direct import
import { getSportColor } from '@utils/script/MatchCard.helpers';

// Or from index (recommended)
import { getSportColor, SPORT_TABS } from '@utils/script';
```

Then use in your component:

```javascript
const sportColor = getSportColor(sport);
```

## Index File

The `index.js` file provides centralized exports for easier imports:

```javascript
// Instead of:
import { getSportColor } from '@utils/script/MatchCard.helpers';

// You can use:
import { getSportColor } from '@utils/script';
```

## Types of Helpers

### Component-Specific Helpers
Functions and constants used primarily by a single component:
- `MatchCard.helpers.js` - `getSportColor()`
- `HomeScreen.helpers.js` - `SPORT_TABS`, `isDesktopSize()`

### Shared Utilities
Functions used across multiple components:
- `dateHelpers.js` - Date formatting, parsing
- `validators.js` - Form validation
- `formatters.js` - Number, currency formatting
- `apiHelpers.js` - API request utilities

## Best Practices

1. **Document functions**: Use JSDoc comments for all exported functions
2. **Pure functions**: Keep functions pure when possible (no side effects)
3. **Single responsibility**: Each function should do one thing well
4. **Meaningful names**: Use descriptive function and variable names
5. **Type safety**: Document parameter and return types
6. **Constants in UPPER_CASE**: Use uppercase for constants
7. **Export named exports**: Avoid default exports for better tree-shaking

## Current Files

- `MatchCard.helpers.js` - Match card helper functions
- `HomeScreen.helpers.js` - Home screen helper functions and constants
- `index.js` - Central export file

## Adding New Helper Files

When creating a new helper file:

1. Create `[Name].helpers.js` in this directory
2. Export functions using named exports:
   ```javascript
   export const myFunction = () => { ... };
   export const MY_CONSTANT = 'value';
   ```
3. Add exports to `index.js`:
   ```javascript
   export { myFunction, MY_CONSTANT } from './[Name].helpers';
   ```
4. Import in your component:
   ```javascript
   import { myFunction } from '@utils/script';
   ```

## Testing

Helper functions should be unit tested. Create test files in the same directory:
```
MatchCard.helpers.js
MatchCard.helpers.test.js
```

Example test:
```javascript
import { getSportColor } from './MatchCard.helpers';
import { theme } from '@utils/theme';

describe('getSportColor', () => {
    it('should return cricket color for cricket sport', () => {
        expect(getSportColor('cricket')).toBe(theme.colors.cricket);
    });
});
```

## Common Helper Categories

### Date & Time
- `formatDate()` - Format dates
- `formatTime()` - Format times
- `getRelativeTime()` - Get relative time (e.g., "2 hours ago")

### Validation
- `validateEmail()` - Email validation
- `validatePassword()` - Password validation
- `validatePhone()` - Phone number validation

### Formatting
- `formatCurrency()` - Format currency values
- `formatNumber()` - Format numbers with separators
- `truncateText()` - Truncate long text

### API
- `buildQueryString()` - Build URL query strings
- `handleApiError()` - Standardized error handling
- `transformApiResponse()` - Transform API responses

### UI
- `getResponsiveSize()` - Calculate responsive sizes
- `getDeviceType()` - Detect device type
- `isTablet()` - Check if device is tablet
