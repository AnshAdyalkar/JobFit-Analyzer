const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// SIGNUP
exports.signup = async (req, res, next) => {
  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    const existing = await User.findOne({ email });

    if (existing) {
      return res.status(400).json({
        success: false,
        error: 'Email already registered'
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const verificationToken = crypto.randomBytes(24).toString('hex');

    const user = await User.create({
      email,
      passwordHash,
      verificationToken,
      verified: false
    });

    const verificationUrl =
      `${process.env.FRONTEND_URL}/verify/${verificationToken}`;

    res.status(201).json({
      success: true,
      message: 'Signup successful',
      data: {
        email: user.email,
        verificationUrl
      }
    });

  } catch (error) {
    next(error);
  }
};


// VERIFY EMAIL
exports.verify = async (req, res, next) => {
  try {

    const { token } = req.params;

    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Invalid verification token'
      });
    }

    user.verified = true;
    user.verificationToken = null;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Email verified successfully'
    });

  } catch (error) {
    next(error);
  }
};


// LOGIN
exports.login = async (req, res, next) => {
  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);

    if (!ok) {
      return res.status(400).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    if (!user.verified) {
      return res.status(403).json({
        success: false,
        error: 'Please verify your email first'
      });
    }

    const token = jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
        isAdmin: user.isAdmin
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        email: user.email,
        isAdmin: user.isAdmin
      }
    });

  } catch (error) {
    next(error);
  }
};


// REQUEST PASSWORD RESET
exports.requestReset = async (req, res, next) => {
  try {

    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    user.resetToken = crypto.randomBytes(24).toString('hex');

    await user.save();

    const resetUrl =
      `${process.env.FRONTEND_URL}/reset/${user.resetToken}`;

    res.status(200).json({
      success: true,
      message: 'Reset link generated',
      data: { resetUrl }
    });

  } catch (error) {
    next(error);
  }
};


// RESET PASSWORD
exports.resetPassword = async (req, res, next) => {
  try {

    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({ resetToken: token });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Invalid reset token'
      });
    }

    user.passwordHash = await bcrypt.hash(password, 10);
    user.resetToken = null;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successful'
    });

  } catch (error) {
    next(error);
  }
};