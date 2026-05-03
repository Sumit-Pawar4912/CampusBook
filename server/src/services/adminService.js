const Book = require('../models/Book');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const NotificationService = require('./notificationService');

const getAdminStats = async () => {
  const [totalUsers, totalBooks, pendingListings, approvedListings, rejectedListings, totalTransactions, verifiedUsers] = await Promise.all([
    User.countDocuments(),
    Book.countDocuments(),
    Book.countDocuments({ status: 'Pending' }),
    Book.countDocuments({ status: 'Approved' }),
    Book.countDocuments({ status: 'Rejected' }),
    Transaction.countDocuments(),
    User.countDocuments({ isVerified: true }),
  ]);

  return {
    totalUsers,
    totalBooks,
    pendingListings,
    approvedListings,
    rejectedListings,
    totalTransactions,
    verifiedUsers,
  };
};

const listAllUsers = async () => {
  return User.find().select('-password').sort({ createdAt: -1 });
};

const verifyUserAccount = async userId => {
  return User.findByIdAndUpdate(userId, { isVerified: true }, { new: true }).select('-password');
};

const banUserAccount = async userId => {
  return User.findByIdAndUpdate(userId, { isBanned: true }, { new: true }).select('-password');
};

const unbanUserAccount = async userId => {
  return User.findByIdAndUpdate(userId, { isBanned: false }, { new: true }).select('-password');
};

const getPendingListings = async college => {
  return Book.find({ status: 'Pending', college }).populate('seller', 'name email college');
};

const approveBookListing = async bookId => {
  const book = await Book.findByIdAndUpdate(bookId, { status: 'Approved' }, { new: true }).populate('seller');
  await NotificationService.notifyBookApproved(book.seller, book.title);
  return book;
};

const rejectBookListing = async bookId => {
  const book = await Book.findByIdAndUpdate(bookId, { status: 'Rejected' }, { new: true }).populate('seller');
  await NotificationService.notifyBookRejected(book.seller, book.title);
  return book;
};

module.exports = {
  getAdminStats,
  listAllUsers,
  verifyUserAccount,
  banUserAccount,
  unbanUserAccount,
  getPendingListings,
  approveBookListing,
  rejectBookListing,
};
