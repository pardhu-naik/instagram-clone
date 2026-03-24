const express = require('express');
const router = express.Router();
const { addComment, getPostComments } = require('../controllers/commentController');
const { protect } = require('../middleware/auth');

router.post('/', protect, addComment);
router.get('/:id/comments', getPostComments);

module.exports = router;
