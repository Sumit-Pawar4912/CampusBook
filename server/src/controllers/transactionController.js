const {
  createTransaction,
  getTransactionsForUser,
  acceptTransaction,
  completeTransaction,
  cancelTransaction,
} = require('../services/transactionService');

const requestBook = async (req, res, next) => {
  try {
    const transaction = await createTransaction({
      bookId: req.params.bookId,
      buyerId: req.user._id,
      meetupLocation: req.body.meetupLocation,
      meetupDateTime: req.body.meetupDateTime,
      price: req.body.price,
      notes: req.body.notes,
    });
    res.status(201).json({ success: true, message: 'Transaction requested', data: transaction });
  } catch (error) {
    next(error);
  }
};

const acceptRequest = async (req, res, next) => {
  try {
    const transaction = await acceptTransaction({ transactionId: req.params.id, sellerId: req.user._id });
    res.json({ success: true, message: 'Transaction accepted', data: transaction });
  } catch (error) {
    next(error);
  }
};

const completeRequest = async (req, res, next) => {
  try {
    const transaction = await completeTransaction({ transactionId: req.params.id, sellerId: req.user._id });
    res.json({ success: true, message: 'Transaction completed', data: transaction });
  } catch (error) {
    next(error);
  }
};

const cancelRequest = async (req, res, next) => {
  try {
    const transaction = await cancelTransaction({ transactionId: req.params.id, userId: req.user._id });
    res.json({ success: true, message: 'Transaction cancelled', data: transaction });
  } catch (error) {
    next(error);
  }
};

const myTransactions = async (req, res, next) => {
  try {
    const transactions = await getTransactionsForUser(req.user._id);
    res.json({ success: true, data: transactions });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  requestBook,
  acceptRequest,
  completeRequest,
  cancelRequest,
  myTransactions,
};
