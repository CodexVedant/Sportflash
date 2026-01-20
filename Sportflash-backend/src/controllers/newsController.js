const newsDataService = require('../services/newsDataService');
const cacheService = require('../services/CacheService');
const User = require('../models/User');
const mongoose = require('mongoose'); // Import Mongoose

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

// @desc    Toggle bookmark for an article (Save/Unsave)
// @route   POST /api/news/bookmark
// @access  Private
exports.toggleBookmark = async (req, res) => {
    try {
        const { articleId, articleData } = req.body;
        console.log('🔖 Toggle Bookmark requested:', { articleId, userId: req.user.id });

        if (!articleId) {
            return res.status(400).json({ success: false, message: 'Article ID is required' });
        }

        const user = await User.findById(req.user.id);
        const Article = require('../models/Article');

        let targetArticleId;

        // 1. Is it a MongoDB ObjectId?
        if (mongoose.Types.ObjectId.isValid(articleId)) {
            console.log('   - ID is valid ObjectId, assuming internal article.');
            targetArticleId = articleId;
        } else {
            console.log('   - ID is External, checking/creating local copy...');

            if (!articleData || !articleData.title) {
                console.log('   ❌ Missing articleData or Title for external article.');
                return res.status(400).json({ success: false, message: 'Article Data required for external articles' });
            }

            let localArticle = await Article.findOne({ title: articleData.title });

            if (!localArticle) {
                console.log('   - Creating new local Article:', articleData.title);
                try {
                    // Normalize Category
                    const allowedCategories = ['cricket', 'football', 'basketball', 'general', 'editorial'];
                    let category = 'general';

                    if (articleData.category) {
                        const incoming = String(articleData.category).toLowerCase();
                        if (allowedCategories.includes(incoming)) {
                            category = incoming;
                        } else if (incoming.includes('cricket')) {
                            category = 'cricket';
                        } else if (incoming.includes('football') || incoming.includes('soccer')) {
                            category = 'football';
                        } else if (incoming.includes('basketball') || incoming.includes('nba')) {
                            category = 'basketball';
                        }
                    }

                    // Manual Slug Generation
                    const slug = articleData.title
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/(^-|-$)/g, '') + '-' + Date.now().toString().slice(-4);

                    localArticle = await Article.create({
                        title: articleData.title,
                        slug: slug,
                        content: articleData.content || articleData.description || 'Content not available',
                        excerpt: articleData.description ? articleData.description.substring(0, 299) : null,
                        coverImage: articleData.imageUrl,
                        category: category,
                        author: req.user.id,
                        publishedAt: articleData.publishedAt || new Date(),
                        status: 'published',
                    });
                    console.log('   ✅ Local Article Created:', localArticle._id);
                } catch (createErr) {
                    console.error('   ❌ Failed to create local article:', createErr.message);
                    return res.status(500).json({ success: false, message: 'Failed to create local article copy: ' + createErr.message });
                }
            } else {
                console.log('   - Found existing local Article:', localArticle._id);
            }
            targetArticleId = localArticle._id;
        }

        // Check if already bookmarked
        const bookmarkIndex = user.bookmarks.findIndex(b => b.articleId.toString() === targetArticleId.toString());

        let isBookmarked = false;
        if (bookmarkIndex > -1) {
            user.bookmarks.splice(bookmarkIndex, 1);
            isBookmarked = false;
            console.log('   - Removed bookmark');
        } else {
            user.bookmarks.push({ articleId: targetArticleId });
            isBookmarked = true;
            console.log('   - Added bookmark');
        }

        await user.save();
        console.log('✅ User Saved successfully.');

        res.status(200).json({
            success: true,
            isBookmarked,
            bookmarks: user.bookmarks
        });

    } catch (error) {
        console.error('Error toggling bookmark:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get user's bookmarked articles
// @route   GET /api/news/bookmarks
// @access  Private
exports.getBookmarks = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('bookmarks.articleId');

        console.log('🔍 Debug Bookmarks - Raw User Bookmarks count:', user.bookmarks.length);
        if (user.bookmarks.length > 0) {
            console.log('🔍 First raw bookmark:', JSON.stringify(user.bookmarks[0], null, 2));
        }

        // Filter out nulls (in case article was deleted)
        const validBookmarks = user.bookmarks
            .filter(b => b.articleId)
            .map(b => {
                const article = b.articleId;
                // Debug if article is not an object
                if (!article.title) {
                    console.error('❌ Mapped article seems missing data (Populate failed?):', article);
                }
                return {
                    id: article._id,
                    title: article.title,
                    description: article.excerpt || article.content,
                    url: article.url || '', // Local articles might not have external URL
                    imageUrl: article.coverImage, // Map coverImage to imageUrl
                    publishedAt: article.publishedAt,
                    source: 'SportFlash',
                    category: article.category,
                    author: 'SportFlash'
                };
            });

        console.log('📤 Sending Bookmarks to Frontend:', JSON.stringify(validBookmarks.slice(0, 2), null, 2));

        res.status(200).json({
            success: true,
            count: validBookmarks.length,
            data: validBookmarks
        });

    } catch (error) {
        console.error('Error fetching bookmarks:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = exports;
