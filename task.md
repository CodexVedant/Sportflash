# Tasks: Dynamic League Filtering

- [ ] Refactor `FilterPanel` Component
    - [ ] Update props interface to accept `availableLeagues` (array of {id, name, icon}).
    - [ ] Use `availableLeagues` instead of hardcoded `leagues` constant.
- [ ] Update `MatchesScreen`
    - [ ] Logic to extract unique leagues from `allMatches` (Live, Upcoming, or Results depending on tab).
    - [ ] Pass extracted leagues to `FilterPanel`.
    - [ ] Fix filter application logic to compare league names case-insensitively correctly.
- [ ] Update `HomeScreen`
    - [ ] Add `selectedLeague` state.
    - [ ] Implement `LeagueFilterChips` component (Horizontal ScrollView).
    - [ ] Extract unique leagues from `matches` (the live matches list).
    - [ ] Filter `LiveMatchesWidget` data based on `selectedLeague`.
