const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const {
  uploadResume,
  getResumeHistory,
  deleteResume,
  downloadResume,
  previewResume
} = require('../controllers/resumeController');
const authMiddleware = require('../middleware/auth');

router.post('/upload', upload.single('resume'), uploadResume);
router.get('/history/:email', authMiddleware, getResumeHistory);
router.delete('/:id', authMiddleware, deleteResume);
router.get('/download/:id', authMiddleware, downloadResume);
router.get('/preview/:id', authMiddleware, previewResume);

module.exports = router;
