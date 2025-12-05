// jwt.js - thin wrapper for jsonwebtoken
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

exports.generateToken = (payload, expiresIn = '7d') => jwt.sign(payload, JWT_SECRET, { expiresIn });
exports.verifyToken = (token) => jwt.verify(token, JWT_SECRET);
exports.decodeToken = (token) => jwt.decode(token);
