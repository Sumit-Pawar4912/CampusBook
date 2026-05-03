const {
  getAdminStats,
  listAllUsers,
  verifyUserAccount,
  banUserAccount,
  unbanUserAccount,
  getPendingListings,
  approveBookListing,
  rejectBookListing,
} = require('../services/adminService');

const getStats = async (req, res, next) => {
  try {
    const stats = await getAdminStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};

const listUsers = async (req, res, next) => {
  try {
    const users = await listAllUsers();
    res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

const verifyUser = async (req, res, next) => {
  try {
    const user = await verifyUserAccount(req.params.id);
    res.json({ success: true, message: 'User verified', data: user });
  } catch (error) {
    next(error);
  }
};

const banUser = async (req, res, next) => {
  try {
    const user = await banUserAccount(req.params.id);
    res.json({ success: true, message: 'User banned', data: user });
  } catch (error) {
    next(error);
  }
};

const unbanUser = async (req, res, next) => {
  try {
    const user = await unbanUserAccount(req.params.id);
    res.json({ success: true, message: 'User unbanned', data: user });
  } catch (error) {
    next(error);
  }
};

const pendingListings = async (req, res, next) => {
  try {
    const listings = await getPendingListings(req.user.college);
    res.json({ success: true, data: listings });
  } catch (error) {
    next(error);
  }
};

const approveListing = async (req, res, next) => {
  try {
    const book = await approveBookListing(req.params.id);
    res.json({ success: true, message: 'Book listing approved', data: book });
  } catch (error) {
    next(error);
  }
};

const rejectListing = async (req, res, next) => {
  try {
    const book = await rejectBookListing(req.params.id);
    res.json({ success: true, message: 'Book listing rejected', data: book });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStats,
  listUsers,
  verifyUser,
  banUser,
  unbanUser,
  pendingListings,
  approveListing,
  rejectListing,
};
