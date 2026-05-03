const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = userId => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

const registerUser = async ({ name, email, password, college, branch, semester }) => {
  const existing = await User.findOne({ email });
  if (existing) {
    throw { statusCode: 409, message: 'User already exists with this email' };
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashed,
    college,
    branch,
    semester,
  });

  const outputUser = user.toObject();
  delete outputUser.password;

  return { user: outputUser, token: generateToken(user._id) };
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) throw { statusCode: 401, message: 'Invalid credentials' };

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) throw { statusCode: 401, message: 'Invalid credentials' };

  const outputUser = user.toObject();
  delete outputUser.password;

  return { user: outputUser, token: generateToken(user._id) };
};

module.exports = { registerUser, loginUser, generateToken };
