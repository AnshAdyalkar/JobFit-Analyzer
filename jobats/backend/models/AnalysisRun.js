const mongooseLib = require('mongoose');
const mongoose = mongooseLib.default || mongooseLib;
const { Schema, model } = mongoose;

const analysisRunSchema = new Schema({
  email: { type: String, required: true, index: true },
  atsScore: { type: Number, required: true, min: 0, max: 100 },
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
  createdAt: { type: Date, default: Date.now }
});

module.exports = model('AnalysisRun', analysisRunSchema);
