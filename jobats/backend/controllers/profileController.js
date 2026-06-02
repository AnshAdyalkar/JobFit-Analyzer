const User = require('../models/User');

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash -verificationToken -resetToken');
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

exports.updateMe = async (req, res, next) => {
  try {
    const allowed = ['name', 'phone', 'city', 'state', 'country', 'linkedin', 'github', 'skills', 'profilePhoto'];
    const updates = {};
    allowed.forEach((key) => {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    });
    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-passwordHash -verificationToken -resetToken');
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};
