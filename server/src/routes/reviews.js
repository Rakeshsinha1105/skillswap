const express = require('express');
const router = express.Router();
const { createReview, getUserReviews } = require('../controllers/reviewsController');
const auth = require('../middleware/auth');

router.get('/user/:userId', getUserReviews);
router.post('/', auth, createReview);

module.exports = router;
