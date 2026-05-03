const { body } = require('express-validator');

const updateProfileValidation = [
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('college').optional().notEmpty().withMessage('College cannot be empty'),
  body('branch').optional().notEmpty().withMessage('Branch cannot be empty'),
  body('semester').optional().isInt({ min: 1, max: 12 }).withMessage('Semester must be between 1 and 12'),
];

module.exports = { updateProfileValidation };
