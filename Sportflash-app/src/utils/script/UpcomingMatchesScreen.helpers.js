/**
 * UpcomingMatchesScreen Helper Functions
 * Handles business logic and data transformations for upcoming matches
 */

/**
 * Format match date and time
 * @param {string} dateString - ISO date string
 * @returns {object} Formatted date and time
 */
export const formatMatchDateTime = (dateString) => {
    if (!dateString) return { date: 'TBD', time: 'TBD' };

    const matchDate = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Format date
    let formattedDate;
    if (matchDate.toDateString() === today.toDateString()) {
        formattedDate = 'Today';
    } else if (matchDate.toDateString() === tomorrow.toDateString()) {
        formattedDate = 'Tomorrow';
    } else {
        formattedDate = matchDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: matchDate.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
        });
    }

    // Format time
    const formattedTime = matchDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });

    return { date: formattedDate, time: formattedTime };
};

/**
 * Group matches by date
 * @param {Array} matches - Array of match objects
 * @returns {Array} Grouped matches by date
 */
export const groupMatchesByDate = (matches) => {
    if (!matches || matches.length === 0) return [];

    const grouped = matches.reduce((acc, match) => {
        const { date } = formatMatchDateTime(match.date || match.startTime);

        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(match);

        return acc;
    }, {});

    // Convert to array format for rendering
    return Object.entries(grouped).map(([date, matches]) => ({
        date,
        matches
    }));
};

/**
 * Filter matches by sport
 * @param {Array} matches - Array of match objects
 * @param {string} sport - Sport filter (all, football, basketball, cricket)
 * @returns {Array} Filtered matches
 */
export const filterMatchesBySport = (matches, sport) => {
    if (!sport || sport === 'all') return matches;
    return matches.filter(match => match.sport?.toLowerCase() === sport.toLowerCase());
};

/**
 * Get next 7 days dates
 * @returns {Array} Array of date objects
 */
export const getNextSevenDays = () => {
    const dates = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);

        dates.push({
            value: date.toISOString().split('T')[0],
            label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : date.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
            }),
            dayOfWeek: date.toLocaleDateString('en-US', { weekday: 'short' }),
            date: date.getDate()
        });
    }

    return dates;
};

/**
 * Check if match is happening soon (within 2 hours)
 * @param {string} dateString - ISO date string
 * @returns {boolean} True if match is happening soon
 */
export const isMatchSoon = (dateString) => {
    if (!dateString) return false;

    const matchDate = new Date(dateString);
    const now = new Date();
    const diffInHours = (matchDate - now) / (1000 * 60 * 60);

    return diffInHours > 0 && diffInHours <= 2;
};

/**
 * Get countdown text for match
 * @param {string} dateString - ISO date string
 * @returns {string} Countdown text
 */
export const getMatchCountdown = (dateString) => {
    if (!dateString) return '';

    const matchDate = new Date(dateString);
    const now = new Date();
    const diff = matchDate - now;

    if (diff <= 0) return 'Starting soon';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours < 1) {
        return `${minutes}m`;
    } else if (hours < 24) {
        return `${hours}h ${minutes}m`;
    } else {
        const days = Math.floor(hours / 24);
        return `${days}d`;
    }
};
