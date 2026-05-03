const express = require('express');
const { param } = require('express-validator');
const {
  requestBook,
  acceptRequest,
  completeRequest,
  cancelRequest,
  myTransactions,
} = require('../controllers/transactionController');
const { protect } = require('../middlewares/authMiddleware');
const validateRequest = require('../middlewares/validateMiddleware');
const {
  requestTransactionValidation,
  transactionIdValidation,
} = require('../validators/transactionValidators');

const router = express.Router();

router.use(protect);
router.post('/request/:bookId', requestTransactionValidation, validateRequest, requestBook);
router.patch('/:id/accept', transactionIdValidation, validateRequest, acceptRequest);
router.patch('/:id/complete', transactionIdValidation, validateRequest, completeRequest);
router.patch('/:id/cancel', transactionIdValidation, validateRequest, cancelRequest);
router.get('/my', myTransactions);

module.exports = router;
