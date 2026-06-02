const express = require('express');
const router = express.Router();

const { getMe, updateMe } = require('../controllers/profileController');
const authMiddleware = require('../middleware/auth');

// Get logged-in user profile
router.get('/me', authMiddleware, getMe);

// Update logged-in user profile
router.put('/me', authMiddleware, updateMe);

module.exports = router;
