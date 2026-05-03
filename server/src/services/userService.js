const User = require('../models/User');

const getUserProfile = async userId => {
  return User.findById(userId).select('-password');
};

const updateUserProfile = async (userId, updateData) => {
  const allowed = ['name', 'college', 'branch', 'semester'];
  const payload = {};
  allowed.forEach(field => {
    if (updateData[field] !== undefined) payload[field] = updateData[field];
  });
  return User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true }).select('-password');
};

const getUsersByCollege = async college => {
  return User.find({ college }).select('-password');
};

const verifyUser = async userId => {
  return User.findByIdAndUpdate(userId, { verified: true }, { new: true }).select('-password');
};

module.exports = { getUserProfile, updateUserProfile, getUsersByCollege, verifyUser };
