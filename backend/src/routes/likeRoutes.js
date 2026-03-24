const express = require('express');
const router = express.Router();
const { toggleLike, getPostLikes } = require('../controllers/likeController');
const { protect } = require('../middleware/auth');

router.post('/toggle', protect, toggleLike);
router.get('/:id/likes', getPostLikes);

module.exports = router;
