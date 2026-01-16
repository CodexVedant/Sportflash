# Implementation Plan: Dynamic League Filtering

## Goal
Implement real-time, data-driven league filtering for `HomeScreen` (Live matches) and `MatchesScreen` (All tabs), replacing hardcoded mock data.

## User Review Required
> [!NOTE]
> The `FilterPanel` mock data (IPL, Premier League, etc.) will be removed. Filters will now only show leagues that *actually have matches* in the current view. If no matches are loaded, the filter list will be empty (except "All").

## Proposed Changes

### Components Layer

#### [MODIFY] [FilterPanel.tsx](file:///d:/Sportflash/Sportflash-frontend/src/components/filter/FilterPanel.tsx)
-   Update `FilterPanelProps` to accept `availableLeagues`.
-   Remove hardcoded `leagues` array.
-   Render `availableLeagues` passed from parent.

### Screens Layer

#### [MODIFY] [MatchesScreen.tsx](file:///d:/Sportflash/Sportflash-frontend/src/screens/matches/MatchesScreen.tsx)
-   **Data Extraction**: Create a `useMemo` hook to extract unique leagues from the currently loaded matches (`liveMatches`, `upcomingMatches`, or `finishedMatches`).
-   **Pass Props**: Pass this dynamic list to `FilterPanel`.
-   **Logic Fix**: Ensure the filter logic matches against `league.name` or `league` string correctly.

#### [MODIFY] [HomeScreen.tsx](file:///d:/Sportflash/Sportflash-frontend/src/screens/home/HomeScreen.tsx)
-   **New State**: `selectedLeague` (string | 'all').
-   **UI Addition**: Insert a horizontal `ScrollView` of chips below the Sport Tabs.
    -   Chips: "All", "League A", "League B"...
    -   Derived from `activeSport` matches.
-   **Filtering**: Update the `matches` useMemo to also filter by `selectedLeague`.

## Verification Plan

### Manual Verification
1.  **Home Screen**:
    -   Set sport to 'Football'.
    -   Verify league chips appear (e.g., "Premier League", "La Liga").
    -   Click "Premier League" -> Only PL matches shown.
    -   Click "All" -> All football matches shown.
2.  **Matches Screen**:
    -   Go to "Upcoming" tab.
    -   Open Filter Panel.
    -   Verify "LEAGUE" section lists only leagues with upcoming matches.
    -   Select a league and apply -> List is filtered.
