const mongooseLib = require('mongoose');
const mongoose = mongooseLib.default || mongooseLib;
const { Schema, model } = mongoose;

const analysisSchema = new Schema({
  email: {
    type: String,
    required: true,
    ref: 'Resume',
  },
  atsScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  scoreBreakdown: {
    formatting: Number,
    keywords: Number,
    experience: Number,
    education: Number,
    skills: Number,
  },
  jobSuggestions: [{
    title: String,
    matchPercentage: Number,
    reason: String,
  }],
  targetJob: {
    title: String,
    requiredSkills: [String],
    missingSkills: [String],
  },
  careerPlan: {
    type: String,
    default: '',
  },
  analyzedAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = model('Analysis', analysisSchema);
