const User = require('../models/User');
const Resume = require('../models/Resume');
const Analysis = require('../models/Analysis');
const AnalysisRun = require('../models/AnalysisRun');

exports.getStats = async (req, res, next) => {
  try {
    const [users, resumes, analyses, runs] = await Promise.all([
      User.countDocuments(),
      Resume.countDocuments(),
      Analysis.countDocuments(),
      AnalysisRun.countDocuments()
    ]);
    res.status(200).json({
      success: true,
      data: {
        totalUsers: users,
        resumesUploaded: resumes,
        analysesLatest: analyses,
        analysesHistoryRuns: runs
      }
    });
  } catch (error) {
    next(error);
  }
};
