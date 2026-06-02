const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: err.message,
    });
  }

  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      error: 'Duplicate Entry',
      message: 'Email already exists in database',
    });
  }

  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Server Error',
  });
};

module.exports = errorHandler;