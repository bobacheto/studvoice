const rateLimit = require('express-rate-limit');

const createLimiter = rateLimit({
  windowMs: 30 * 1000,
  max: 1,
  message: 'Too many requests, please wait 30 seconds before trying again',
  standardHeaders: true,
  legacyHeaders: false
});

const generalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = { createLimiter, generalLimiter };