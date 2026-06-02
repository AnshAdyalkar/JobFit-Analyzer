const express = require('express');
const router = express.Router();
const {
  analyzeResume,
  generateCareerPlan,
  getAnalysis,
  getHistory,
} = require('../controllers/analysisController');

router.post('/analyze', analyzeResume);
router.post('/career-plan', generateCareerPlan);
router.get('/:email', getAnalysis);
router.get('/history/:email', getHistory);

module.exports = router;
