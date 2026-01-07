const axios = require('axios');

/**
 * NewsData.io Service
 * Handles all API calls to NewsData.io for sports news
 * API Documentation: https://newsdata.io/documentation
 */

class NewsDataService {
    constructor() {
        this.apiKey = process.env.NEWS_API_KEY;
        this.baseUrl = 'https://newsdata.io/api/1/latest';
        // In-memory cache for articles (keyed by article_id)
        this.articlesCache = new Map();
    }

    /**
     * Make API request to NewsData.io
     * @param {object} params - Query parameters
     */
    async makeRequest(params = {}) {
        try {
            const queryParams = {
                apikey: this.apiKey,
                language: 'en',
                ...params
            };

            console.log('📰 NewsData.io Request:', JSON.stringify(queryParams, null, 2));

            const response = await axios.get(this.baseUrl, {
                params: queryParams,
                timeout: 30000 // 30 seconds timeout
            });

            if (response.data && response.data.status === 'success') {
                console.log(`✅ NewsData.io: Fetched ${response.data.results?.length || 0} articles`);
                return response.data.results;
            } else {
                console.error('❌ NewsData.io Error:', response.data);
                return [];
            }
        } catch (error) {
            console.error('❌ NewsData.io Request Failed:', error.message);
            if (error.response) {
                console.error('Response data:', error.response.data);
            }
            return [];
        }
    }

    /**
     * Get sports news by category
     * @param {string} category - Sport category (cricket, football, basketball, or 'all')
     * @param {number} limit - Number of articles to fetch (default: 10)
     */
    async getSportsNews(category = 'all', limit = 10) {
        const params = {
            category: 'sports,top'
        };

        // Add sport-specific keywords if not 'all'
        if (category !== 'all') {
            const keywords = this.getCategoryKeywords(category);
            if (keywords) {
                params.q = keywords;
            }
        }

        return await this.makeRequest(params);
    }

    /**
     * Get trending sports news
     * @param {number} limit - Number of articles to fetch (default: 10)
     */
    async getTrendingNews(limit = 10) {
        return await this.makeRequest({
            category: 'sports,top'
        });
    }

    /**
     * Get news for a specific sport
     * @param {string} sport - Sport name (cricket, football, basketball)
     * @param {number} limit - Number of articles to fetch (default: 10)
     */
    async getNewsBySport(sport, limit = 10) {
        const keywords = this.getCategoryKeywords(sport);

        return await this.makeRequest({
            category: 'sports,top',
            q: keywords
        });
    }

    /**
     * Search news by query
     * @param {string} query - Search query
     * @param {number} limit - Number of articles to fetch (default: 10)
     */
    async searchNews(query, limit = 10) {
        return await this.makeRequest({
            category: 'sports,top',
            q: query
        });
    }

    /**
     * Get category-specific keywords for better filtering
     * @param {string} category - Category name
     * @returns {string} Keywords for the category
     */
    getCategoryKeywords(category) {
        const keywordMap = {
            cricket: 'cricket',
            football: 'football',
            basketball: 'basketball',
            all: null
        };

        return keywordMap[category.toLowerCase()] || null;
    }

    /**
     * Map NewsData.io article to our format
     * @param {object} article - Raw article from NewsData.io
     * @returns {object} Mapped article
     */
    mapArticle(article) {
        const mappedArticle = {
            id: article.article_id,
            title: article.title,
            description: article.description || article.content || '',
            content: article.content || article.description || '',
            url: article.link,
            imageUrl: article.image_url || null,
            publishedAt: article.pubDate,
            source: {
                id: article.source_id,
                name: article.source_name || article.source_id
            },
            author: article.creator ? article.creator.join(', ') : null,
            category: this.detectSportCategory(article),
            // Additional metadata
            keywords: article.keywords || [],
            country: article.country || [],
            language: article.language || 'en'
        };

        // Cache the article for later retrieval by ID
        if (mappedArticle.id) {
            this.articlesCache.set(mappedArticle.id, mappedArticle);
        }

        return mappedArticle;
    }

    /**
     * Detect sport category from article
     * @param {object} article - Article object
     * @returns {string} Detected category
     */
    detectSportCategory(article) {
        const text = `${article.title} ${article.description} ${article.keywords?.join(' ')}`.toLowerCase();

        if (text.includes('cricket') || text.includes('ipl') || text.includes('t20')) {
            return 'cricket';
        } else if (text.includes('football') || text.includes('soccer') || text.includes('fifa')) {
            return 'football';
        } else if (text.includes('basketball') || text.includes('nba')) {
            return 'basketball';
        }


        return 'general';
    }

    /**
     * Get article from cache by ID
     * @param {string} id - Article ID
     * @returns {object|null} Cached article or null
     */
    getArticleById(id) {
        return this.articlesCache.get(id) || null;
    }
}

// Export singleton instance
module.exports = new NewsDataService();
