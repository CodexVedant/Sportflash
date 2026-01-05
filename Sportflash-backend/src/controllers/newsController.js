const newsDataService = require('../services/newsDataService');

/**
 * @desc    Get all news or filtered by category
 * @route   GET /api/news
 * @access  Public
 */
exports.getNews = async (req, res) => {
    try {
        const { category = 'all', limit = 20 } = req.query;

        console.log(`📰 Fetching news - Category: ${category}, Limit: ${limit}`);

        const articles = await newsDataService.getSportsNews(category, parseInt(limit));

        // Map articles to our format
        const mappedArticles = articles.map(article => newsDataService.mapArticle(article));

        res.json({
            success: true,
            count: mappedArticles.length,
            category,
            data: mappedArticles
        });
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

        console.log(`📰 Fetching ${sport} news - Limit: ${limit}`);

        const articles = await newsDataService.getNewsBySport(sport, parseInt(limit));

        // Map articles to our format
        const mappedArticles = articles.map(article => newsDataService.mapArticle(article));

        res.json({
            success: true,
            count: mappedArticles.length,
            sport,
            data: mappedArticles
        });
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

        // Since NewsData.io doesn't have a direct "get by ID" endpoint,
        // we'll need to search or cache articles
        // For now, return a message that this needs to be implemented with caching

        res.status(501).json({
            success: false,
            message: 'News detail endpoint requires caching implementation. Use the article URL from the list instead.'
        });
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
