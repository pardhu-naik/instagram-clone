const express = require('express');
const router = express.Router();
const { getProfile, searchUsers } = require('../controllers/userController');

router.get('/search', searchUsers);
router.get('/:username', getProfile);

module.exports = router;
