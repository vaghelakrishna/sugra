function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

function errorHandler(err, _req, res, _next) {
  console.error(err);
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: 'Validation failed', errors: Object.values(err.errors).map((item) => item.message) });
  }
  if (err.code === 11000) return res.status(409).json({ message: 'A record with that value already exists' });
  if (err.name === 'CastError') return res.status(400).json({ message: 'Invalid resource id' });
  res.status(err.statusCode || 500).json({ message: err.message || 'Internal server error' });
}

module.exports = { notFound, errorHandler };
