const { body, query, param } = require('express-validator');

const createBookValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('author').notEmpty().withMessage('Author is required'),
  body('subject').notEmpty().withMessage('Subject is required'),
  body('semester').isInt({ min: 1, max: 12 }).withMessage('Semester must be between 1 and 12'),
  body('condition').isIn(['New', 'Like New', 'Good', 'Old']).withMessage('Condition is invalid'),
  body('type').isIn(['Sell', 'Exchange', 'Donate']).withMessage('Type is invalid'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
];

const updateBookValidation = [
  param('id').isMongoId().withMessage('Valid book ID is required'),
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('author').optional().notEmpty().withMessage('Author cannot be empty'),
  body('subject').optional().notEmpty().withMessage('Subject cannot be empty'),
  body('semester').optional().isInt({ min: 1, max: 12 }).withMessage('Semester must be between 1 and 12'),
  body('branch').optional().notEmpty().withMessage('Branch cannot be empty'),
  body('condition').optional().isIn(['New', 'Like New', 'Good', 'Old']).withMessage('Condition is invalid'),
  body('type').optional().isIn(['Sell', 'Exchange', 'Donate']).withMessage('Type is invalid'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
];

const bookQueryValidation = [
  query('semester').optional().isInt({ min: 1, max: 12 }).toInt(),
  query('minPrice').optional().isFloat({ min: 0 }).toFloat(),
  query('maxPrice').optional().isFloat({ min: 0 }).toFloat(),
  query('condition').optional().isIn(['New', 'Like New', 'Good', 'Old']),
  query('type').optional().isIn(['Sell', 'Exchange', 'Donate']),
  query('sort').optional().isIn(['newest', 'priceAsc', 'priceDesc', 'mostViewed']).withMessage('Sort must be newest, priceAsc, priceDesc, or mostViewed'),
];

const bookIdValidation = [
  param('id').isMongoId().withMessage('Valid book ID is required'),
];

module.exports = { createBookValidation, updateBookValidation, bookQueryValidation, bookIdValidation };
