const express = require('express');
const router = express.Router();
const { createPost, getPosts } = require('../controllers/postController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.route('/')
    .get(getPosts)
    .post(protect, upload.single('image'), createPost);

module.exports = router;
