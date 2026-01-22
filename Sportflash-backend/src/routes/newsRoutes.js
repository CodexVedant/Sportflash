const express = require('express');
const router = express.Router();
const {
    getNews,
    getTrendingNews,
    getNewsBySport,
    getNewsById,
    searchNews
} = require('../controllers/newsController');

// @route   POST /api/news/bookmark
// @desc    Toggle bookmark for an article
// @access  Private
const { protect } = require('../middleware/auth');
router.post('/bookmark', protect, require('../controllers/newsController').toggleBookmark);

// @route   GET /api/news/bookmarks
// @desc    Get user bookmarks
// @access  Private
router.get('/bookmarks', protect, require('../controllers/newsController').getBookmarks);

// @route   GET /api/news
// @desc    Get all news or filtered by category
// @access  Public
router.get('/', getNews);

// @route   GET /api/news/trending
// @desc    Get trending news
// @access  Public
router.get('/trending', getTrendingNews);

// @route   GET /api/news/search
// @desc    Search news
// @access  Public
router.get('/search', searchNews);

// @route   GET /api/news/sport/:sport
// @desc    Get news by sport
// @access  Public
router.get('/sport/:sport', getNewsBySport);

// @route   GET /api/news/:id
// @desc    Get single news article
// @access  Public
router.get('/:id', getNewsById);

module.exports = router;
