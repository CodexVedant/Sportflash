# ✅ Upcoming Matches Fix

## 🐞 Problem Identified

The "Upcoming" tab was showing "No Matches" for all sports because the backend was **only fetching matches for the current date (today)**.

1. **Frontend**: Requesting `/api/matches/upcoming` without parameters.
2. **Backend**: Defaulting `targetDate` to `today` and fetching fixtures **only** for that single day.
3. **Result**: Since there are rarely "Upcoming" (Not Started) matches *left* in the current day (or none scheduled), the list was empty or contained only live/finished matches which the frontend filtered out.

## 🛠️ Solution Implemented

I updated the backend to fetch matches for a **7-day range** by default.

### 1. Updated `AllSportsApiService.js`

Modified fixture methods (`getFootballFixtures`, `getBasketballFixtures`, `getCricketFixtures`) and the wrapper `getFixturesBySport` to accept a date range (`from` and `to`) instead of just a single `date`.

**Old Logic:**
```javascript
// Only accepted 'date' and set from=date, to=date
params.from = date;
params.to = date;
```

**New Logic:**
```javascript
// Accepts from/to range
if (from && to) {
    params.from = from;
    params.to = to;
}
```

### 2. Updated `MatchController.js`

Modified `getUpcomingMatches` to calculate a 7-day date range when no specific date is provided.

**Old Logic:**
```javascript
const targetDate = date || new Date().toISOString().split('T')[0];
// Fetched only for targetDate
```

**New Logic:**
```javascript
if (!date) {
    const today = new Date();
    fromDate = today.toISOString().split('T')[0];
    
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + parseInt(days)); // days default = 7
    toDateStr = endDate.toISOString().split('T')[0];
}
// Fetches for fromDate to toDateStr
```

## 🧪 Verification

Ran a test request to `/api/matches/upcoming?sport=cricket` and it now returns **97 matches** (previously returned 0 or very few).

The "Upcoming" tab will now display matches scheduled for the next 7 days.

---

### Files Modified:
- `d:\Sportflash\Sportflash-backend\src\services\allSportsApiService.js`
- `d:\Sportflash\Sportflash-backend\src\controllers\matchController.js`
