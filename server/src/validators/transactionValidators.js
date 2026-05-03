const { body, param } = require('express-validator');

const requestTransactionValidation = [
  param('bookId').isMongoId().withMessage('Valid book ID is required'),
  body('meetupLocation').notEmpty().withMessage('Meetup location is required'),
  body('meetupDateTime').isISO8601().withMessage('Meetup date and time is required and must be a valid ISO date'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('notes').optional().isString().trim(),
];

const transactionIdValidation = [
  param('id').isMongoId().withMessage('Valid transaction ID is required'),
];

module.exports = { requestTransactionValidation, transactionIdValidation };
