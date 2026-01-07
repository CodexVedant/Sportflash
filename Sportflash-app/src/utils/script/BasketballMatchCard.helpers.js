/**
 * Helper functions for BasketballMatchCard
 */

/**
 * Safely extract quarter score from various API formats
 * @param {Object} quarters - Quarters data from API
 * @param {string} qKey - Quarter key (e.g., "1stQuarter", "2ndQuarter")
 * @returns {Object} Object with home and away scores
 */
export const getQuarterScore = (quarters, qKey) => {
    if (!quarters || !quarters[qKey]) {
        return { home: '-', away: '-' };
    }

    const qData = quarters[qKey];
    if (Array.isArray(qData) && qData.length > 0) {
        return {
            home: qData[0].score_home,
            away: qData[0].score_away
        };
    }
    return { home: '-', away: '-' };
};

/**
 * Parse quarters data from score object
 * @param {Object} score - Score object from API
 * @returns {Object|null} Parsed quarters data or null
 */
export const parseQuarters = (score) => {
    if (!score?.quarters) return null;

    return {
        q1: getQuarterScore(score.quarters, '1stQuarter'),
        q2: getQuarterScore(score.quarters, '2ndQuarter'),
        q3: getQuarterScore(score.quarters, '3rdQuarter'),
        q4: getQuarterScore(score.quarters, '4thQuarter'),
    };
};

