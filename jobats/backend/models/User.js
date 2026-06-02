const mongooseLib = require('mongoose');
const mongoose = mongooseLib.default || mongooseLib;
const { Schema, model } = mongoose;

const userSchema = new Schema({
  name: { type: String, default: '' },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  phone: { type: String, default: '' },
  city: { type: String, default: '' },
  state: { type: String, default: '' },
  country: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  github: { type: String, default: '' },
  skills: { type: [String], default: [] },
  profilePhoto: { type: String, default: '' },
  verified: { type: Boolean, default: false },
  verificationToken: { type: String, default: null },
  resetToken: { type: String, default: null },
  isAdmin: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = model('User', userSchema);
