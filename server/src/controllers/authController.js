const { registerUser, loginUser, adminLoginUser } = require('../services/authService');

const register = async (req, res, next) => {
  try {
    const { user, token } = await registerUser(req.body);
    res.status(201).json({ success: true, message: 'User registered successfully', data: { user, token } });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { user, token } = await loginUser(req.body);
    res.json({ success: true, message: 'Login successful', data: { user, token } });
  } catch (error) {
    next(error);
  }
};

const adminLogin = async (req, res, next) => {
  try {
    const { user, token } = await adminLoginUser(req.body);
    res.json({ success: true, message: 'Admin login successful', data: { user, token } });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    res.json({ success: true, data: req.user });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, adminLogin, getMe };
