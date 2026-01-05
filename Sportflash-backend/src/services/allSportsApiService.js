const axios = require('axios');

/**
 * AllSportsAPI Service
 * Handles all API calls to AllSportsAPI.com
 * API Documentation: https://allsportsapi.com
 */

class AllSportsApiService {
    constructor() {
        this.apiKey = process.env.ALLSPORTS_API_KEY;
        this.baseUrls = {
            football: 'https://apiv2.allsportsapi.com/football/',
            basketball: 'https://apiv2.allsportsapi.com/basketball/',
            cricket: 'https://apiv2.allsportsapi.com/cricket/'
        };
    }

    /**
     * Make API request to AllSportsAPI
     * @param {string} sport - Sport type (football, basketball, cricket)
     * @param {string} method - API method name
     * @param {object} params - Additional query parameters
     */
    async makeRequest(sport, method, params = {}) {
        try {
            const baseUrl = this.baseUrls[sport];
            if (!baseUrl) {
                throw new Error(`Invalid sport: ${sport}`);
            }

            const url = `${baseUrl}`;
            const queryParams = {
                met: method,
                APIkey: this.apiKey,
                ...params
            };

            console.log(`🔄 AllSportsAPI Request: ${sport} - ${method}`);

            const response = await axios.get(url, {
                params: queryParams,
                timeout: 30000 // 30 seconds timeout
            });

            if (response.data && response.data.success === 1) {
                return response.data.result;
            } else {
                console.error(`❌ AllSportsAPI Error: ${sport} - ${method}`, response.data);
                return null;
            }
        } catch (error) {
            console.error(`❌ AllSportsAPI Request Failed: ${sport} - ${method}`, error.message);
            if (error.response) {
                console.error('Response data:', error.response.data);
            }
            throw error;
        }
    }

    // ==================== FOOTBALL METHODS ====================

    /**
     * Get football countries
     */
    async getFootballCountries() {
        return await this.makeRequest('football', 'Countries');
    }

    /**
     * Get football leagues
     * @param {string} countryId - Optional country ID filter
     */
    async getFootballLeagues(countryId = null) {
        const params = countryId ? { country_id: countryId } : {};
        return await this.makeRequest('football', 'Leagues', params);
    }

    /**
     * Get football live scores
     */
    async getFootballLiveScores() {
        return await this.makeRequest('football', 'Livescore');
    }

    /**
     * Get football fixtures
     * @param {string} date - Date in YYYY-MM-DD format
     * @param {string} leagueId - Optional league ID filter
     * @param {string} teamId - Optional team ID filter
     */
    async getFootballFixtures({ date = null, leagueId = null, teamId = null } = {}) {
        const params = {};
        if (date) params.from = date;
        if (date) params.to = date;
        if (leagueId) params.league_id = leagueId;
        if (teamId) params.team_id = teamId;

        return await this.makeRequest('football', 'Fixtures', params);
    }

    /**
     * Get football standings
     * @param {string} leagueId - League ID
     */
    async getFootballStandings(leagueId) {
        return await this.makeRequest('football', 'Standings', { leagueId: leagueId });
    }

    /**
     * Get football team details
     * @param {string} teamId - Team ID
     */
    async getFootballTeam(teamId) {
        return await this.makeRequest('football', 'Teams', { teamId: teamId });
    }

    /**
     * Get football H2H (Head to Head)
     * @param {string} firstTeamId - First team ID
     * @param {string} secondTeamId - Second team ID
     */
    async getFootballH2H(firstTeamId, secondTeamId) {
        return await this.makeRequest('football', 'H2H', {
            firstTeamId,
            secondTeamId
        });
    }

    /**
     * Get football top scorers
     * @param {string} leagueId - League ID
     */
    async getFootballTopScorers(leagueId) {
        return await this.makeRequest('football', 'Topscorers', { leagueId: leagueId });
    }

    /**
     * Get football player details
     * @param {string} playerId - Player ID
     */
    async getFootballPlayer(playerId) {
        return await this.makeRequest('football', 'Players', { player_id: playerId });
    }

    // ==================== BASKETBALL METHODS ====================

    /**
     * Get basketball countries
     */
    async getBasketballCountries() {
        return await this.makeRequest('basketball', 'Countries');
    }

    /**
     * Get basketball leagues
     * @param {string} countryId - Optional country ID filter
     */
    async getBasketballLeagues(countryId = null) {
        const params = countryId ? { countryId: countryId } : {};
        return await this.makeRequest('basketball', 'Leagues', params);
    }

    /**
     * Get basketball live scores
     */
    async getBasketballLiveScores() {
        return await this.makeRequest('basketball', 'Livescore');
    }

    /**
     * Get basketball fixtures
     * @param {string} date - Date in YYYY-MM-DD format
     * @param {string} leagueId - Optional league ID filter
     * @param {string} teamId - Optional team ID filter
     */
    async getBasketballFixtures({ date = null, leagueId = null, teamId = null } = {}) {
        const params = {};
        if (date) params.from = date;
        if (date) params.to = date;
        if (leagueId) params.leagueId = leagueId;
        if (teamId) params.teamId = teamId;

        return await this.makeRequest('basketball', 'Fixtures', params);
    }

    /**
     * Get basketball standings
     * @param {string} leagueId - League ID
     */
    async getBasketballStandings(leagueId) {
        return await this.makeRequest('basketball', 'Standings', { leagueId: leagueId });
    }

    /**
     * Get basketball team details
     * @param {string} teamId - Team ID
     */
    async getBasketballTeam(teamId) {
        return await this.makeRequest('basketball', 'Teams', { teamId: teamId });
    }

    /**
     * Get basketball H2H (Head to Head)
     * @param {string} firstTeamId - First team ID
     * @param {string} secondTeamId - Second team ID
     */
    async getBasketballH2H(firstTeamId, secondTeamId) {
        return await this.makeRequest('basketball', 'H2H', {
            firstTeamId,
            secondTeamId
        });
    }

    // ==================== CRICKET METHODS ====================

    /**
     * Get cricket leagues
     */
    async getCricketLeagues() {
        return await this.makeRequest('cricket', 'Leagues');
    }

    /**
     * Get cricket live scores
     */
    async getCricketLiveScores() {
        return await this.makeRequest('cricket', 'Livescore');
    }

    /**
     * Get cricket fixtures
     * @param {string} date - Date in YYYY-MM-DD format
     * @param {string} leagueId - Optional league ID filter
     * @param {string} teamId - Optional team ID filter
     */
    async getCricketFixtures({ date = null, leagueId = null, teamId = null } = {}) {
        const params = {};
        if (date) params.from = date;
        if (date) params.to = date;
        if (leagueId) params.league_id = leagueId;
        if (teamId) params.team_id = teamId;

        return await this.makeRequest('cricket', 'Fixtures', params);
    }

    /**
     * Get cricket standings
     * @param {string} leagueId - League ID
     */
    async getCricketStandings(leagueId) {
        // Cricket API specific parameter naming
        return await this.makeRequest('cricket', 'Standings', { leagueId: leagueId });
    }

    /**
     * Get cricket team details
     * @param {string} teamId - Team ID
     */
    async getCricketTeam(teamId) {
        return await this.makeRequest('cricket', 'Teams', { teamId: teamId });
    }

    /**
     * Get cricket H2H (Head to Head)
     * @param {string} firstTeamId - First team ID
     * @param {string} secondTeamId - Second team ID
     */
    async getCricketH2H(firstTeamId, secondTeamId) {
        return await this.makeRequest('cricket', 'H2H', {
            firstTeamId,
            secondTeamId
        });
    }

    /**
     * Get cricket match commentary
     * @param {string} matchId - Match event key
     */
    async getCricketCommentary(matchId) {
        return await this.makeRequest('cricket', 'Livescore', {
            match_id: matchId
        });
    }

    // ==================== UNIFIED METHODS ====================

    /**
     * Get live scores for all sports
     */
    async getAllLiveScores() {
        try {
            const [football, basketball, cricket] = await Promise.allSettled([
                this.getFootballLiveScores(),
                this.getBasketballLiveScores(),
                this.getCricketLiveScores()
            ]);

            return {
                football: football.status === 'fulfilled' ? football.value : null,
                basketball: basketball.status === 'fulfilled' ? basketball.value : null,
                cricket: cricket.status === 'fulfilled' ? cricket.value : null,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error('❌ Error fetching all live scores:', error.message);
            throw error;
        }
    }

    /**
     * Get fixtures for a specific sport and date
     * @param {string} sport - Sport type (football, basketball, cricket)
     * @param {string} date - Date in YYYY-MM-DD format
     */
    async getFixturesBySport(sport, date = null) {
        const today = date || new Date().toISOString().split('T')[0];

        switch (sport.toLowerCase()) {
            case 'football':
            case 'soccer':
                return await this.getFootballFixtures({ date: today });
            case 'basketball':
                return await this.getBasketballFixtures({ date: today });
            case 'cricket':
                return await this.getCricketFixtures({ date: today });
            default:
                throw new Error(`Unsupported sport: ${sport}`);
        }
    }
}

// Export singleton instance
module.exports = new AllSportsApiService();
