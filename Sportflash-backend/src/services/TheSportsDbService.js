const axios = require('axios');

/**
 * TheSportsDB Service
 * Free Tier API for Sports Data
 * Documentation: https://www.thesportsdb.com/api.php
 */
class TheSportsDbService {
    constructor() {
        // '3' is a common public test key. User also used '123' which often aliases or is a patreon key.
        // We default to '3' as it is the most stable public key.
        this.apiKey = process.env.THESPORTSDB_API_KEY || '3';
        this.baseUrl = `https://www.thesportsdb.com/api/v1/json/${this.apiKey}`;

        // Internal League IDs for TheSportsDB (Mapping our 'Sports' to their 'Leagues')
        // We need these because TheSportsDB is League-centric, not just 'Sport'-centric for some calls.
        this.leagueMap = {
            'English Premier League': '4328',
            'NBA': '4387',
            'IPL': '4402', // Indian Premier League
            'NFL': '4391',
        };
    }

    async makeRequest(endpoint, params = {}) {
        try {
            const url = `${this.baseUrl}/${endpoint}`;
            console.log(`🔄 TheSportsDB Request: ${url}`, params);

            const response = await axios.get(url, { params });
            return response.data;
        } catch (error) {
            console.error(`❌ TheSportsDB Error: ${endpoint}`, error.message);
            return null;
        }
    }

    /**
     * Get Events for a specific day (Used for Livescore / Fixtures)
     * Endpoint: eventsday.php?d=YYYY-MM-DD&s=Soccer
     */
    async getDailyEvents(date, sportName) {
        // Sport names in TheSportsDB: 'Soccer', 'Basketball', 'Cricket'
        const sport = this.normalizeSportName(sportName);
        if (!date) date = new Date().toISOString().split('T')[0];

        const data = await this.makeRequest('eventsday.php', {
            d: date,
            s: sport
        });

        return data?.events || [];
    }

    /**
     * Get Live Scores (TheSportsDB free tier relies mostly on 'latestsoccer.php' or just checking 'eventsday')
     * We will use 'eventsday' and filter locally for simplicity and uniform coverage.
     */
    async getLiveScores(sportName) {
        const today = new Date().toISOString().split('T')[0];
        const events = await this.getDailyEvents(today, sportName);

        // Filter for 'InProgress' roughly if possible, but TheSportsDB free status is basic.
        // We will return ALL today's matches and let the Mapper decide if it's 'live'.
        return events;
    }

    /**
     * Get Fixtures (Upcoming)
     * For "Upcoming", we might need 'eventsnextleague.php' or just iterate days like we did before.
     */
    async getFixtures(sportName, date) {
        return await this.getDailyEvents(date, sportName);
    }

    // --- Helpers ---

    normalizeSportName(sport) {
        if (!sport) return 'Soccer';
        const s = sport.toLowerCase();
        if (s === 'football' || s === 'soccer') return 'Soccer';
        if (s === 'basketball') return 'Basketball';
        if (s === 'cricket') return 'Cricket';
        if (s === 'volleyball') return 'Volleyball';
        // Default: Capitalize first letter (TheSportsDB usually expects Title Case: 'Tennis', 'Rugby', etc.)
        return sport.charAt(0).toUpperCase() + sport.slice(1);
    }
}

module.exports = new TheSportsDbService();
