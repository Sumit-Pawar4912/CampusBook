const Transaction = require('../models/Transaction');
const Book = require('../models/Book');
const User = require('../models/User');
const NotificationService = require('./notificationService');

const ensureFutureDate = date => {
  if (isNaN(date.getTime())) {
    throw { statusCode: 400, message: 'Invalid meetup date and time' };
  }
  if (date <= new Date()) {
    throw { statusCode: 400, message: 'Meetup date and time must be in the future' };
  }
};

const createTransaction = async ({ bookId, buyerId, meetupLocation, meetupDateTime, price, notes }) => {
  const book = await Book.findById(bookId).populate('seller');
  if (!book) {
    throw { statusCode: 404, message: 'Book not found' };
  }
  if (book.seller.toString() === buyerId.toString()) {
    throw { statusCode: 403, message: 'You cannot request your own book' };
  }
  if (book.status !== 'Approved') {
    throw { statusCode: 400, message: 'Only approved books can be requested' };
  }
  if (!meetupLocation || !meetupDateTime) {
    throw { statusCode: 400, message: 'Meetup location and date/time are required' };
  }
  const meetDate = new Date(meetupDateTime);
  ensureFutureDate(meetDate);

  const bookOwner = await User.findById(book.seller).select('college');
  const buyer = await User.findById(buyerId).select('college');
  if (!buyer || !bookOwner) {
    throw { statusCode: 404, message: 'User not found' };
  }
  if (buyer.college !== bookOwner.college) {
    throw { statusCode: 403, message: 'Buyer and seller must belong to the same college' };
  }

  const mockPaymentStatus = book.type === 'Donate' ? 'Not Required' : 'Pending';

  const transaction = await Transaction.create({
    book: book._id,
    buyer: buyerId,
    seller: book.seller,
    meetupLocation,
    meetupDateTime: meetDate,
    price: price || book.price,
    notes,
    mockPaymentStatus,
  });

  // Notify seller
  await NotificationService.notifyTransactionRequest(book.seller, buyer.name, book.title);

  return transaction;
};

const getTransactionsForUser = async userId => {
  return Transaction.find({ $or: [{ buyer: userId }, { seller: userId }] })
    .populate('book')
    .populate('buyer', 'name email college')
    .populate('seller', 'name email college')
    .sort({ createdAt: -1 });
};

const acceptTransaction = async ({ transactionId, sellerId }) => {
  const transaction = await Transaction.findById(transactionId).populate('book');
  if (!transaction) {
    throw { statusCode: 404, message: 'Transaction not found' };
  }
  if (transaction.seller.toString() !== sellerId.toString()) {
    throw { statusCode: 403, message: 'Only the seller can accept this request' };
  }
  if (transaction.status !== 'Requested') {
    throw { statusCode: 400, message: 'Only requested transactions can be accepted' };
  }

  transaction.status = 'Accepted';
  await transaction.save();

  // Notify buyer
  const buyer = await User.findById(transaction.buyer);
  await NotificationService.notifyTransactionAccepted(transaction.buyer, buyer.name, transaction.book.title);

  return transaction;
};

const completeTransaction = async ({ transactionId, sellerId }) => {
  const transaction = await Transaction.findById(transactionId).populate('book');
  if (!transaction) {
    throw { statusCode: 404, message: 'Transaction not found' };
  }
  if (transaction.seller.toString() !== sellerId.toString()) {
    throw { statusCode: 403, message: 'Only the seller can complete the transaction' };
  }
  if (transaction.status !== 'Accepted') {
    throw { statusCode: 400, message: 'Only accepted transactions can be completed' };
  }

  transaction.status = 'Completed';
  if (transaction.mockPaymentStatus === 'Pending') {
    transaction.mockPaymentStatus = 'Paid';
  }
  await transaction.save();

  const book = await Book.findById(transaction.book);
  if (book) {
    book.status = 'Sold';
    await book.save();
  }

  const buyer = await User.findById(transaction.buyer);
  const seller = await User.findById(transaction.seller);
  if (buyer) {
    buyer.transactions = (buyer.transactions || 0) + 1;
    await buyer.save();
  }
  if (seller) {
    seller.transactions = (seller.transactions || 0) + 1;
    await seller.save();
  }

  return transaction;
};

const cancelTransaction = async ({ transactionId, userId }) => {
  const transaction = await Transaction.findById(transactionId);
  if (!transaction) {
    throw { statusCode: 404, message: 'Transaction not found' };
  }
  if (transaction.status === 'Completed') {
    throw { statusCode: 400, message: 'Completed transactions cannot be cancelled' };
  }
  if (transaction.buyer.toString() !== userId.toString() && transaction.seller.toString() !== userId.toString()) {
    throw { statusCode: 403, message: 'Only buyer or seller can cancel this transaction' };
  }

  transaction.status = 'Cancelled';
  await transaction.save();
  return transaction;
};

module.exports = {
  createTransaction,
  getTransactionsForUser,
  acceptTransaction,
  completeTransaction,
  cancelTransaction,
};
