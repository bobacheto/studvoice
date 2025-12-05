// errorHandler.js

module.exports = (err, req, res, next) => {
  console.error(err && (err.stack || err.message) ? (err.stack || err.message) : err);
  if (res.headersSent) return next(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
};
