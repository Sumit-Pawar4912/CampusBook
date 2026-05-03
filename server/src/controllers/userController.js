const { getUserProfile, updateUserProfile } = require('../services/userService');

const profile = async (req, res, next) => {
  try {
    const user = await getUserProfile(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const user = await updateUserProfile(req.user._id, req.body);
    res.json({ success: true, message: 'Profile updated successfully', data: user });
  } catch (error) {
    next(error);
  }
};

module.exports = { profile, updateProfile };
