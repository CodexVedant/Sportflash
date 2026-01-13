const axios = require('axios');

/**
 * Cricbuzz API Service (via RapidAPI)
 * Handles all cricket-related API calls
 * Documentation: https://rapidapi.com/cricketapilive/api/cricbuzz-cricket
 */

class CricbuzzService {
    constructor() {
        this.apiKey = process.env.RAPIDAPI_KEY;
        this.baseURL = 'https://cricbuzz-cricket.p.rapidapi.com';
        this.headers = {
            'x-rapidapi-host': 'cricbuzz-cricket.p.rapidapi.com',
            'x-rapidapi-key': this.apiKey
        };
    }

    /**
     * Make API request to Cricbuzz
     * @param {string} endpoint - API endpoint
     */
    async makeRequest(endpoint) {
        try {
            console.log(`🔄 Cricbuzz API Request: ${endpoint}`);

            const response = await axios.get(`${this.baseURL}${endpoint}`, {
                headers: this.headers,
                timeout: 30000 // 30 seconds timeout
            });

            if (response.data) {
                return response.data;
            } else {
                console.error(`❌ Cricbuzz API Error: No data returned`);
                return null;
            }
        } catch (error) {
            console.error(`❌ Cricbuzz API Request Failed: ${endpoint}`, error.message);
            if (error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
            }
            throw error;
        }
    }

    // === MATCHES ===

    /**
     * Get live cricket matches
     */
    async getLiveMatches() {
        return await this.makeRequest('/matches/v1/live');
    }

    /**
     * Get recent cricket matches
     */
    async getRecentMatches() {
        return await this.makeRequest('/matches/v1/recent');
    }

    /**
     * Get upcoming cricket matches
     */
    async getUpcomingMatches() {
        return await this.makeRequest('/matches/v1/upcoming');
    }

    /**
     * Get match details
     * @param {string} matchId - Match ID
     */
    async getMatchDetails(matchId) {
        return await this.makeRequest(`/mcenter/v1/${matchId}`);
    }

    /**
     * Get match scorecard
     * @param {string} matchId - Match ID
     */
    async getMatchScorecard(matchId) {
        return await this.makeRequest(`/mcenter/v1/${matchId}/scard`);
    }

    /**
     * Get match commentary (ball-by-ball)
     * @param {string} matchId - Match ID
     */
    async getMatchCommentary(matchId) {
        return await this.makeRequest(`/mcenter/v1/${matchId}/comm`);
    }

    /**
     * Get match overs (ball-by-ball details)
     * @param {string} matchId - Match ID
     */
    async getMatchOvers(matchId) {
        return await this.makeRequest(`/mcenter/v1/${matchId}/overs`);
    }

    // === TEAMS ===

    /**
     * Get international cricket teams
     */
    async getInternationalTeams() {
        return await this.makeRequest('/teams/v1/international');
    }

    /**
     * Get domestic cricket teams
     */
    async getDomesticTeams() {
        return await this.makeRequest('/teams/v1/domestic');
    }

    /**
     * Get league cricket teams
     */
    async getLeagueTeams() {
        return await this.makeRequest('/teams/v1/league');
    }

    /**
     * Get team details
     * @param {string} teamId - Team ID
     */
    async getTeamDetails(teamId) {
        return await this.makeRequest(`/teams/v1/${teamId}`);
    }

    /**
     * Get team players
     * @param {string} teamId - Team ID
     */
    async getTeamPlayers(teamId) {
        return await this.makeRequest(`/teams/v1/${teamId}/players`);
    }

    // === PLAYERS ===

    /**
     * Search for a player
     * @param {string} playerName - Player name
     */
    async searchPlayer(playerName) {
        return await this.makeRequest(`/stats/v1/player/search?plrN=${encodeURIComponent(playerName)}`);
    }

    /**
     * Get player details
     * @param {string} playerId - Player ID
     */
    async getPlayerDetails(playerId) {
        return await this.makeRequest(`/stats/v1/player/${playerId}`);
    }

    /**
     * Get player career statistics
     * @param {string} playerId - Player ID
     */
    async getPlayerCareerStats(playerId) {
        return await this.makeRequest(`/stats/v1/player/${playerId}/career`);
    }

    /**
     * Get player bowling statistics
     * @param {string} playerId - Player ID
     */
    async getPlayerBowlingStats(playerId) {
        return await this.makeRequest(`/stats/v1/player/${playerId}/bowling`);
    }

    /**
     * Get player batting statistics
     * @param {string} playerId - Player ID
     */
    async getPlayerBattingStats(playerId) {
        return await this.makeRequest(`/stats/v1/player/${playerId}/batting`);
    }

    // === RANKINGS ===

    /**
     * Get ICC batsmen rankings
     * @param {string} formatType - test, odi, or t20
     */
    async getBatsmenRankings(formatType = 'test') {
        return await this.makeRequest(`/stats/v1/rankings/batsmen?formatType=${formatType}`);
    }

    /**
     * Get ICC bowlers rankings
     * @param {string} formatType - test, odi, or t20
     */
    async getBowlersRankings(formatType = 'test') {
        return await this.makeRequest(`/stats/v1/rankings/bowlers?formatType=${formatType}`);
    }

    /**
     * Get ICC all-rounders rankings
     * @param {string} formatType - test, odi, or t20
     */
    async getAllRoundersRankings(formatType = 'test') {
        return await this.makeRequest(`/stats/v1/rankings/allrounders?formatType=${formatType}`);
    }

    /**
     * Get ICC team rankings
     * @param {string} formatType - test, odi, or t20
     */
    async getTeamRankings(formatType = 'test') {
        return await this.makeRequest(`/stats/v1/rankings/teams?formatType=${formatType}`);
    }

    // === NEWS ===

    /**
     * Get latest cricket news
     */
    async getCricketNews() {
        return await this.makeRequest('/news/v1/index');
    }

    /**
     * Get news topics
     */
    async getNewsTopics() {
        return await this.makeRequest('/news/v1/topics');
    }

    /**
     * Get news detail
     * @param {string} newsId - News ID
     */
    async getNewsDetail(newsId) {
        return await this.makeRequest(`/news/v1/detail/${newsId}`);
    }

    // === SERIES ===

    /**
     * Get international series
     */
    async getInternationalSeries() {
        return await this.makeRequest('/series/v1/international');
    }

    /**
     * Get domestic series
     */
    async getDomesticSeries() {
        return await this.makeRequest('/series/v1/domestic');
    }

    /**
     * Get league series
     */
    async getLeagueSeries() {
        return await this.makeRequest('/series/v1/league');
    }

    /**
     * Get series details
     * @param {string} seriesId - Series ID
     */
    async getSeriesDetails(seriesId) {
        return await this.makeRequest(`/series/v1/${seriesId}`);
    }

    /**
     * Get series matches
     * @param {string} seriesId - Series ID
     */
    async getSeriesMatches(seriesId) {
        return await this.makeRequest(`/series/v1/${seriesId}/matches`);
    }

    /**
     * Get series standings
     * @param {string} seriesId - Series ID
     */
    async getSeriesStandings(seriesId) {
        return await this.makeRequest(`/series/v1/${seriesId}/standings`);
    }
}

// Export singleton instance
module.exports = new CricbuzzService();
