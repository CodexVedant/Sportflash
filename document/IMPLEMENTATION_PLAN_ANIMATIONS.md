# Implementation Plan - Phase 1 Animations & Search

## Goal
Port the dynamic animations and interactive features from `script.js` and `style.css` to the React Native app, specifically:
1.  **Search Functionality**: Modal with recent history and filter chips.
2.  **Live Score Simulation**: Random score updates with "Flash" effect and Toasts.
3.  **Tab Animation**: Smooth sliding indicator for Match Detail tabs.

## Proposed Changes

### 1. Search Component
#### [NEW] `src/components/common/SearchModal.js`
-   Full screen or large modal overlay.
-   Input field with icon.
-   Recent searches list (stored in AsyncStorage later, mock for now).
-   Filter chips (All, Matches, Teams, News).
-   Animation: Fade in / Slide up `Modal`.

### 2. Toast Notification System
#### [NEW] `src/components/common/Toast.js`
-   Absolute positioned view at bottom.
-   Animeated entry/exit (Slide up/down).
-   Context `ToastContext` to allow calling `showToast(msg)` from anywhere.

#### [MODIFY] `App.js`
-   Wrap app in `ToastProvider`.

### 3. Match Detail Enhancements
#### [MODIFY] `src/screens/matches/MatchDetailScreen.js`
-   **Tab Indicator**: Use `LayoutAnimation` or `Reanimated` to slide the bottom border to the active tab.
-   **Live Simulation**: Add `useEffect` with `setInterval` to:
    -   Randomly increment score.
    -   Trigger `showToast` on "Wicket" or "Goal".
    -   Flash the score text color (using Reanimated `useSharedValue` for color interpolation).

### 4. Home Screen Enhancements
#### [MODIFY] `src/screens/home/HomeScreen.js`
-   Connect Search Icon to open `SearchModal`.

## Verification Plan

### Automated Tests
-   None (Visual animations are hard to unit test).

### Manual Verification
1.  **Search**: Click Search Icon on Home -> Verify Modal opens. Type text -> Verify mock results. Close -> Verify it closes.
2.  **Live Updates**: Open Match Detail (Live Cricket) -> Wait 3-5 seconds. Verify Score updates, Text flashes Blue, and Toast appears ("Wicket" or "Score Update").
3.  **Tabs**: Switch tabs in Match Detail -> Verify the underline slides smoothly, not just jumps.
