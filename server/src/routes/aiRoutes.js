const express = require('express');
const { body } = require('express-validator');
const {
  imageQualityCheck,
  ocrScan,
  priceSuggestion,
  trending,
} = require('../controllers/aiController');
const { protect } = require('../middlewares/authMiddleware');
const validateRequest = require('../middlewares/validateMiddleware');
const uploadMiddleware = require('../middlewares/uploadMiddleware');

const router = express.Router();

router.post('/image-check', protect, uploadMiddleware.single('image'), imageQualityCheck);
router.post('/ocr', protect, uploadMiddleware.single('image'), ocrScan);
router.post(
  '/price',
  protect,
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('condition')
      .isIn(['New', 'Like New', 'Good', 'Old'])
      .withMessage('Condition must be New, Like New, Good, or Old'),
    body('semester').isInt({ min: 1, max: 12 }).withMessage('Semester must be between 1 and 12'),
    body('subject').notEmpty().withMessage('Subject is required'),
  ],
  validateRequest,
  priceSuggestion
);
router.get('/trending', trending);

module.exports = router;
