const UserModel = require('../models/userModel');
const jwtUtil = require('../utils/jwt');
const { validate, registerSchema, loginSchema } = require('../utils/validators');

exports.register = async (req, res, next) => {
  try {
    const data = validate(registerSchema, req.body);

    if (await UserModel.emailExists(data.email)) {
      return res.status(409).json({ error: 'Email already registered' });
    }
    if (await UserModel.usernameExists(data.username)) {
      return res.status(409).json({ error: 'Username already taken' });
    }

    const userId = await UserModel.createUser(data.email, data.username, data.password, data.school_code);
    const token = jwtUtil.generateToken({ userId, email: data.email, username: data.username });
    res.status(201).json({ message: 'User registered', token, userId, username: data.username });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const data = validate(loginSchema, req.body);
    const user = await UserModel.getUserByEmail(data.email);
    if (!user || user.password !== data.password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const token = jwtUtil.generateToken({ userId: user.id, email: user.email, username: user.username });
    res.json({ message: 'Login successful', token, userId: user.id, username: user.username });
  } catch (err) {
    next(err);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const user = await UserModel.getUserById(req.user.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (err) {
    next(err);
  }
};
