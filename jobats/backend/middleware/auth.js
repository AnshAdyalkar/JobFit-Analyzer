const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {

    const authHeader = req.headers.authorization;

    // Check if token exists
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: No token provided'
      });
    }

    // Extract token
    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user
    const user = await User.findById(decoded.id).select('-passwordHash');

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: User not found'
      });
    }

    // Attach user to request
    req.user = {
      id: user._id.toString(),
      email: user.email,
      isAdmin: user.isAdmin
    };

    next();

  } catch (error) {

    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Invalid or expired token'
    });

  }
};

module.exports = auth;
