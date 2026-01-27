# Styles Directory

This directory contains external StyleSheet definitions for all React Native components in the Sportflash app.

## Purpose

Instead of defining styles inline within component files using `StyleSheet.create()`, we extract them to separate files here for better:
- **Organization**: All styles in one place
- **Reusability**: Styles can be shared across components
- **Maintainability**: Easier to update and manage styles
- **Performance**: Styles are created once and reused

## File Naming Convention

Each style file should follow this pattern:
```
[ComponentName].styles.js
```

Examples:
- `MatchCard.styles.js` - Styles for MatchCard component
- `HomeScreen.styles.js` - Styles for HomeScreen
- `Button.styles.js` - Styles for Button component

## File Structure

Each style file should export a `styles` object:

```javascript
import { StyleSheet } from 'react-native';
import { theme } from '@utils/theme';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    // ... more styles
});
```

## Usage in Components

Import styles in your component:

```javascript
// Direct import
import { styles } from '@utils/style/MatchCard.styles';

// Or from index (recommended)
import { MatchCardStyles } from '@utils/style';
```

Then use in JSX:

```javascript
<View style={styles.container}>
    {/* content */}
</View>
```

## Index File

The `index.js` file provides centralized exports for easier imports:

```javascript
// Instead of:
import { styles } from '@utils/style/MatchCard.styles';

// You can use:
import { MatchCardStyles } from '@utils/style';
```

## Best Practices

1. **Use theme variables**: Always reference `theme` for colors, spacing, fonts, etc.
2. **Descriptive names**: Use clear, descriptive style names
3. **Group related styles**: Keep related styles together
4. **Comment complex styles**: Add comments for non-obvious styling decisions
5. **Avoid inline styles**: Move all styles to these files

## Current Files

- `MatchCard.styles.js` - Match card component styles
- `HomeScreen.styles.js` - Home screen styles
- `index.js` - Central export file

## Adding New Style Files

When creating a new style file:

1. Create `[ComponentName].styles.js` in this directory
2. Export styles using `export const styles = StyleSheet.create({...})`
3. Add export to `index.js`:
   ```javascript
   export { styles as [ComponentName]Styles } from './[ComponentName].styles';
   ```
4. Import in your component:
   ```javascript
   import { styles } from '@utils/style/[ComponentName].styles';
   ```
