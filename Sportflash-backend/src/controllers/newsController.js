const newsDataService = require('../services/newsDataService');
const cacheService = require('../services/CacheService');

/**
 * @desc    Get all news or filtered by category
 * @route   GET /api/news
 * @access  Public
 */
exports.getNews = async (req, res) => {
    try {
        const { category = 'all', limit = 20 } = req.query;

        // Generate cache key
        const cacheKey = cacheService.generateKey('news', { category, limit });

        // Check cache first
        const cachedData = cacheService.get(cacheKey);
        if (cachedData) {
            return res.json(cachedData);
        }

        console.log(`📰 Fetching news - Category: ${category}, Limit: ${limit}`);

        const articles = await newsDataService.getSportsNews(category, parseInt(limit));

        // Map articles to our format
        const mappedArticles = articles.map(article => newsDataService.mapArticle(article));

        const response = {
            success: true,
            count: mappedArticles.length,
            category,
            data: mappedArticles
        };

        // Cache the response (15 minutes for news)
        const ttl = parseInt(process.env.CACHE_TTL_NEWS) || 900;
        cacheService.set(cacheKey, response, ttl);

        res.json(response);
    } catch (error) {
        console.error('Error in getNews:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching news',
            error: error.message
        });
    }
};

/**
 * @desc    Get trending news
 * @route   GET /api/news/trending
 * @access  Public
 */
exports.getTrendingNews = async (req, res) => {
    try {
        const { limit = 10 } = req.query;

        console.log(`📰 Fetching trending news - Limit: ${limit}`);

        const articles = await newsDataService.getTrendingNews(parseInt(limit));

        // Map articles to our format
        const mappedArticles = articles.map(article => newsDataService.mapArticle(article));

        res.json({
            success: true,
            count: mappedArticles.length,
            data: mappedArticles
        });
    } catch (error) {
        console.error('Error in getTrendingNews:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching trending news',
            error: error.message
        });
    }
};

/**
 * @desc    Get news by sport
 * @route   GET /api/news/sport/:sport
 * @access  Public
 */
exports.getNewsBySport = async (req, res) => {
    try {
        const { sport } = req.params;
        const { limit = 20 } = req.query;

        // Generate cache key
        const cacheKey = cacheService.generateKey('news_sport', { sport, limit });

        // Check cache first
        const cachedData = cacheService.get(cacheKey);
        if (cachedData) {
            return res.json(cachedData);
        }

        console.log(`📰 Fetching ${sport} news - Limit: ${limit}`);

        // Use NewsData.io for all sports (cricket, football, basketball)
        const articles = await newsDataService.getNewsBySport(sport, parseInt(limit));
        const mappedArticles = articles.map(article => newsDataService.mapArticle(article));
        const source = 'NewsData.io';

        const response = {
            success: true,
            count: mappedArticles.length,
            sport,
            source,
            data: mappedArticles
        };

        // Cache the response (15 minutes for news)
        const ttl = parseInt(process.env.CACHE_TTL_NEWS) || 900;
        cacheService.set(cacheKey, response, ttl);

        res.json(response);
    } catch (error) {
        console.error('Error in getNewsBySport:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching news by sport',
            error: error.message
        });
    }
};

/**
 * @desc    Get single news article by ID
 * @route   GET /api/news/:id
 * @access  Public
 */
exports.getNewsById = async (req, res) => {
    try {
        const { id } = req.params;

        console.log(`📰 Fetching news article - ID: ${id}`);

        // Try to get article from cache
        const article = newsDataService.getArticleById(id);

        if (article) {
            res.json({
                success: true,
                data: article
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Article not found. It may have expired from cache or never been loaded.'
            });
        }
    } catch (error) {
        console.error('Error in getNewsById:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching news article',
            error: error.message
        });
    }
};

/**
 * @desc    Search news
 * @route   GET /api/news/search
 * @access  Public
 */
exports.searchNews = async (req, res) => {
    try {
        const { q, limit = 20 } = req.query;

        if (!q) {
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }

        console.log(`📰 Searching news - Query: ${q}, Limit: ${limit}`);

        const articles = await newsDataService.searchNews(q, parseInt(limit));

        // Map articles to our format
        const mappedArticles = articles.map(article => newsDataService.mapArticle(article));

        res.json({
            success: true,
            count: mappedArticles.length,
            query: q,
            data: mappedArticles
        });
    } catch (error) {
        console.error('Error in searchNews:', error);
        res.status(500).json({
            success: false,
            message: 'Error searching news',
            error: error.message
        });
    }
};

module.exports = exports;
