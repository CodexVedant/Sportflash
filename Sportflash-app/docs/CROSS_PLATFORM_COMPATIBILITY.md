# React Native (Expo) Cross-Platform Compatibility Guide

## 🎯 Purpose
This document identifies and resolves platform-specific issues between **Android (Expo Go)**, **iOS**, and **Web** in the Sportflash application.

---

## 📋 Identified Issues & Fixes

### 1. **DateTimePicker Not Available on Web**

#### **Issue Identified**
`@react-native-community/datetimepicker` is used in `DatePicker.js` but **does not work on Web**.

#### **Root Cause**
- `@react-native-community/datetimepicker` is a **native module** that renders platform-specific date pickers
- On Web, there is **no native date picker bridge** - the module simply doesn't render
- The component will crash or silently fail on Web

#### **Why It Breaks on Web**
- Web doesn't have access to native iOS/Android date picker APIs
- React Native Web cannot polyfill native UI components
- The module's web implementation is non-existent

#### **Correct Fix**

**File: `src/components/filter/DatePicker.js`**

```javascript
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@utils/theme';
import { styles } from '@utils/style/DatePicker.styles';

// Conditional import - only load on native platforms
let DateTimePicker = null;
if (Platform.OS !== 'web') {
    DateTimePicker = require('@react-native-community/datetimepicker').default;
}

export default function DatePicker({ dateRange, onDateChange }) {
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);

    const formatDate = (date) => {
        if (!date) return 'Select Date';
        const d = new Date(date);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const handleStartDateChange = (event, selectedDate) => {
        setShowStartPicker(Platform.OS === 'ios');
        if (selectedDate) {
            onDateChange({ ...dateRange, start: selectedDate });
        }
    };

    const handleEndDateChange = (event, selectedDate) => {
        setShowEndPicker(Platform.OS === 'ios');
        if (selectedDate) {
            onDateChange({ ...dateRange, end: selectedDate });
        }
    };

    // Web-specific date input handler
    const handleWebDateInput = (type, value) => {
        if (Platform.OS === 'web' && value) {
            const newDate = new Date(value);
            onDateChange({ 
                ...dateRange, 
                [type]: newDate 
            });
        }
    };

    const clearDates = () => {
        onDateChange({ start: null, end: null });
    };

    const setQuickDate = (days) => {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - days);
        onDateChange({ start, end });
    };

    return (
        <View style={styles.container}>
            {/* Quick Date Buttons */}
            <View style={styles.quickButtons}>
                <TouchableOpacity
                    style={styles.quickButton}
                    onPress={() => setQuickDate(7)}
                >
                    <Text style={styles.quickButtonText}>Last 7 Days</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.quickButton}
                    onPress={() => setQuickDate(30)}
                >
                    <Text style={styles.quickButtonText}>Last 30 Days</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.quickButton}
                    onPress={() => setQuickDate(90)}
                >
                    <Text style={styles.quickButtonText}>Last 90 Days</Text>
                </TouchableOpacity>
            </View>

            {/* Date Range Selectors */}
            <View style={styles.dateRow}>
                {/* Start Date */}
                <View style={styles.dateContainer}>
                    <Text style={styles.dateLabel}>From</Text>
                    {Platform.OS === 'web' ? (
                        <input
                            type="date"
                            value={dateRange.start ? dateRange.start.toISOString().split('T')[0] : ''}
                            onChange={(e) => handleWebDateInput('start', e.target.value)}
                            max={dateRange.end ? dateRange.end.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                            style={{
                                backgroundColor: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: 8,
                                padding: 10,
                                color: theme.colors.text,
                                fontSize: 14,
                                fontFamily: theme.fonts.body,
                                width: '100%'
                            }}
                        />
                    ) : (
                        <TouchableOpacity
                            style={styles.dateButton}
                            onPress={() => setShowStartPicker(true)}
                        >
                            <Ionicons name="calendar-outline" size={18} color={theme.colors.textMuted} />
                            <Text style={styles.dateText}>{formatDate(dateRange.start)}</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Separator */}
                <View style={styles.separator}>
                    <Ionicons name="arrow-forward" size={16} color={theme.colors.textMuted} />
                </View>

                {/* End Date */}
                <View style={styles.dateContainer}>
                    <Text style={styles.dateLabel}>To</Text>
                    {Platform.OS === 'web' ? (
                        <input
                            type="date"
                            value={dateRange.end ? dateRange.end.toISOString().split('T')[0] : ''}
                            onChange={(e) => handleWebDateInput('end', e.target.value)}
                            min={dateRange.start ? dateRange.start.toISOString().split('T')[0] : undefined}
                            max={new Date().toISOString().split('T')[0]}
                            style={{
                                backgroundColor: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: 8,
                                padding: 10,
                                color: theme.colors.text,
                                fontSize: 14,
                                fontFamily: theme.fonts.body,
                                width: '100%'
                            }}
                        />
                    ) : (
                        <TouchableOpacity
                            style={styles.dateButton}
                            onPress={() => setShowEndPicker(true)}
                        >
                            <Ionicons name="calendar-outline" size={18} color={theme.colors.textMuted} />
                            <Text style={styles.dateText}>{formatDate(dateRange.end)}</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Clear Button */}
            {(dateRange.start || dateRange.end) && (
                <TouchableOpacity style={styles.clearButton} onPress={clearDates}>
                    <Ionicons name="close-circle" size={16} color={theme.colors.textMuted} />
                    <Text style={styles.clearText}>Clear Dates</Text>
                </TouchableOpacity>
            )}

            {/* Date Pickers - Native Only */}
            {Platform.OS !== 'web' && DateTimePicker && (
                <>
                    {showStartPicker && (
                        <DateTimePicker
                            value={dateRange.start || new Date()}
                            mode="date"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={handleStartDateChange}
                            maximumDate={dateRange.end || new Date()}
                            themeVariant="dark"
                        />
                    )}

                    {showEndPicker && (
                        <DateTimePicker
                            value={dateRange.end || new Date()}
                            mode="date"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={handleEndDateChange}
                            minimumDate={dateRange.start || undefined}
                            maximumDate={new Date()}
                            themeVariant="dark"
                        />
                    )}
                </>
            )}
        </View>
    );
}
```

#### **Best Practice Recommendation**
- ✅ **Always check Platform.OS before rendering native-only components**
- ✅ **Use conditional imports** to prevent bundling native modules on Web
- ✅ **Provide Web alternatives** (HTML5 `<input type="date">` works well)
- ✅ **Test on all three platforms** before deploying

---

### 2. **AsyncStorage Web Compatibility**

#### **Issue Identified**
`@react-native-async-storage/async-storage` works differently on Web vs Native.

#### **Root Cause**
- On **Native**: Uses native storage APIs (iOS UserDefaults, Android SharedPreferences)
- On **Web**: Falls back to `localStorage` which has different behavior:
  - **Synchronous** on Web vs **Asynchronous** on Native
  - **5-10MB limit** on Web vs **unlimited** on Native
  - **String-only storage** on Web (requires JSON serialization)

#### **Why It Can Break**
- Large data sets may exceed Web localStorage limits
- Synchronous Web operations can block UI thread
- Different error handling between platforms

#### **Current Implementation Status**
✅ **Already correctly implemented** in `src/store/slices/authSlice.js`
- Uses `await` for all AsyncStorage operations
- Properly serializes objects with `JSON.stringify()`
- Handles errors gracefully

#### **Best Practice Recommendation**
- ✅ **Always use async/await** with AsyncStorage (even though Web is sync)
- ✅ **Keep stored data small** (<1MB per key on Web)
- ✅ **Always JSON.stringify() objects** before storing
- ✅ **Add try/catch blocks** for storage operations
- ❌ **Don't store large binary data** in AsyncStorage on Web

---

### 3. **Socket.IO Web vs Native Connection Issues**

#### **Issue Identified**
WebSocket connections behave differently on Web vs Native, especially with localhost URLs.

#### **Root Cause**
- **Android Emulator**: `localhost` = `10.0.2.2` (emulator's host machine)
- **iOS Simulator**: `localhost` = `127.0.0.1` (works normally)
- **Web**: `localhost` = `127.0.0.1` (browser context)
- **Physical Devices**: Need LAN IP address (e.g., `192.168.x.x`)

#### **Why It Breaks**
- Hardcoded `localhost` won't work on Android emulator
- LAN IPs won't work on Web (CORS issues)
- Socket.IO transport fallbacks differ (WebSocket vs polling)

#### **Current Implementation**
✅ **Already correctly handled** in `src/config.js`:
```javascript
const getBaseUrl = () => {
    if (Platform.OS === 'web') {
        return `http://127.0.0.1:${PORT}`;
    }
    // ... handles Android emulator, iOS, physical devices
};
```

#### **Potential Improvement**

**File: `src/services/socket.js`** (add transport configuration)

```javascript
import io from 'socket.io-client';
import { Platform } from 'react-native';
import { SOCKET_URL } from '../config';

const socket = io(SOCKET_URL, {
    transports: Platform.OS === 'web' ? ['websocket', 'polling'] : ['websocket'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
    timeout: 10000,
    // Web-specific CORS handling
    ...(Platform.OS === 'web' && {
        withCredentials: false,
        extraHeaders: {
            'Access-Control-Allow-Origin': '*'
        }
    })
});

export default socket;
```

#### **Best Practice Recommendation**
- ✅ **Use environment-aware URL configuration**
- ✅ **Specify transport order** (WebSocket first, polling fallback)
- ✅ **Handle reconnection logic** differently per platform
- ✅ **Test on emulator, simulator, physical device, and web**

---

### 4. **Monospace Font Rendering**

#### **Issue Identified**
`fontFamily: 'monospace'` renders differently across platforms.

#### **Root Cause**
- **iOS**: Uses `Menlo` or `Courier New`
- **Android**: Uses `monospace` (system default, varies by device)
- **Web**: Uses browser's monospace stack (usually `Consolas`, `Monaco`, or `Courier`)

#### **Why It Breaks**
- Inconsistent character widths across platforms
- Different font weights and styles
- Web may not respect `fontFamily: 'monospace'` in StyleSheet

#### **Correct Fix**

**Create: `src/utils/fonts.js`**

```javascript
import { Platform } from 'react-native';

export const getMonospaceFont = () => {
    if (Platform.OS === 'ios') {
        return 'Menlo';
    } else if (Platform.OS === 'android') {
        return 'monospace';
    } else {
        // Web - use CSS font stack
        return 'Consolas, Monaco, "Courier New", monospace';
    }
};

export const fonts = {
    mono: getMonospaceFont(),
    // ... other fonts
};
```

**Update any component using monospace:**

```javascript
import { fonts } from '@utils/fonts';

const styles = StyleSheet.create({
    scoreText: {
        fontFamily: fonts.mono,
        // ... other styles
    }
});
```

#### **Best Practice Recommendation**
- ✅ **Use platform-specific font helpers**
- ✅ **Test font rendering on all platforms**
- ✅ **Provide CSS fallback stacks for Web**
- ❌ **Don't hardcode `fontFamily: 'monospace'`**

---

### 5. **Blur Effects (expo-blur) Web Limitations**

#### **Issue Identified**
`expo-blur` `BlurView` component has limited support on Web.

#### **Root Cause**
- **Native**: Uses platform-specific blur APIs (UIVisualEffectView on iOS, RenderScript on Android)
- **Web**: Falls back to CSS `backdrop-filter: blur()` which:
  - **Not supported** in older browsers
  - **Performance issues** on complex layouts
  - **Different visual quality** than native

#### **Current Implementation**
✅ **Already handled** in `src/components/common/Card.js`:
```javascript
if (variant === 'glass' && Platform.OS === 'ios') {
    // Only use BlurView on iOS
}
```

#### **Recommended Enhancement**

**File: `src/components/common/Card.js`**

```javascript
import { BlurView } from 'expo-blur';
import { Platform, View } from 'react-native';

export default function Card({ variant, children, style }) {
    const useNativeBlur = Platform.OS !== 'web' && variant === 'glass';
    
    if (useNativeBlur) {
        return (
            <BlurView intensity={80} tint="dark" style={style}>
                {children}
            </BlurView>
        );
    }
    
    // Web fallback with CSS backdrop-filter
    return (
        <View 
            style={[
                style,
                variant === 'glass' && Platform.OS === 'web' && {
                    backgroundColor: 'rgba(15, 23, 42, 0.8)',
                    // Note: backdrop-filter is applied via web-specific CSS
                }
            ]}
        >
            {children}
        </View>
    );
}
```

**Add Web-specific CSS (if using custom web styles):**

```css
/* For web builds */
.glass-card {
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
}
```

#### **Best Practice Recommendation**
- ✅ **Provide visual fallbacks for Web**
- ✅ **Test blur performance on low-end devices**
- ✅ **Use opacity-based backgrounds as fallback**
- ❌ **Don't assume blur works consistently across platforms**

---

### 6. **KeyboardAvoidingView Behavior Differences**

#### **Issue Identified**
`KeyboardAvoidingView` in `LoginScreen.js` and `RegisterScreen.js` behaves differently on Web.

#### **Root Cause**
- **Native**: Keyboard events trigger view adjustments
- **Web**: No keyboard events (desktop browsers don't have virtual keyboards)
- **Mobile Web**: Keyboard behavior varies by browser

#### **Why It Breaks on Web**
- `behavior="padding"` or `behavior="height"` does nothing on Web
- Can cause layout shifts or unnecessary padding
- Virtual keyboard on mobile web is handled by browser, not React Native

#### **Correct Fix**

**File: `src/screens/auth/LoginScreen.js` and `RegisterScreen.js`**

```javascript
import { Platform, KeyboardAvoidingView, ScrollView } from 'react-native';

// In render:
const KeyboardWrapper = Platform.OS === 'web' ? ScrollView : KeyboardAvoidingView;
const keyboardProps = Platform.OS === 'web' 
    ? {} 
    : {
        behavior: Platform.OS === 'ios' ? 'padding' : 'height',
        keyboardVerticalOffset: Platform.OS === 'ios' ? 64 : 0
    };

return (
    <KeyboardWrapper
        style={styles.container}
        {...keyboardProps}
    >
        {/* Form content */}
    </KeyboardWrapper>
);
```

#### **Best Practice Recommendation**
- ✅ **Use ScrollView on Web instead of KeyboardAvoidingView**
- ✅ **Conditionally apply keyboard behavior props**
- ✅ **Test form inputs on mobile web browsers**
- ❌ **Don't wrap Web forms in KeyboardAvoidingView**

---

## 🛠️ General Cross-Platform Best Practices

### 1. **Platform-Specific Imports**
```javascript
// ❌ Bad - imports native module on all platforms
import NativeModule from 'react-native-native-module';

// ✅ Good - conditional import
let NativeModule = null;
if (Platform.OS !== 'web') {
    NativeModule = require('react-native-native-module').default;
}
```

### 2. **Platform-Specific Styling**
```javascript
const styles = StyleSheet.create({
    container: {
        padding: 16,
        ...Platform.select({
            ios: { paddingTop: 20 },
            android: { paddingTop: 0 },
            web: { maxWidth: 1200, marginHorizontal: 'auto' }
        })
    }
});
```

### 3. **Safe Libraries for All Platforms**
✅ **Safe for Web + Native:**
- `@expo/vector-icons`
- `react-navigation`
- `@reduxjs/toolkit`
- `axios`
- `socket.io-client`
- `react-native-reanimated` (with web support)

❌ **Native-Only (Need Web Alternatives):**
- `@react-native-community/datetimepicker`
- `react-native-camera`
- `react-native-maps`
- Native modules without web implementations

### 4. **Testing Checklist**
Before deploying, test on:
- [ ] Android Emulator (Expo Go)
- [ ] iOS Simulator (Expo Go)
- [ ] Physical Android Device
- [ ] Physical iOS Device
- [ ] Chrome (Web)
- [ ] Safari (Web)
- [ ] Firefox (Web)

### 5. **Debugging Platform Issues**
```javascript
// Add platform logging
console.log('Platform:', Platform.OS);
console.log('Platform Version:', Platform.Version);

// Web-specific debugging
if (Platform.OS === 'web') {
    console.log('Window size:', window.innerWidth, window.innerHeight);
    console.log('User agent:', navigator.userAgent);
}
```

---

## 📚 Additional Resources

- [React Native Web Compatibility](https://necolas.github.io/react-native-web/docs/compatibility/)
- [Expo Platform Differences](https://docs.expo.dev/guides/platform-differences/)
- [Platform-Specific Code](https://reactnative.dev/docs/platform-specific-code)

---

## 🎯 Summary

Your Sportflash app has **good platform awareness** in most areas (config.js, AsyncStorage usage). The main issues to fix are:

1. **DatePicker Web Support** - Add HTML5 date input fallback
2. **Socket.IO Configuration** - Add transport options
3. **Font Consistency** - Use platform-specific font helper
4. **KeyboardAvoidingView** - Use ScrollView on Web

Implement these fixes to achieve **100% cross-platform compatibility**.
