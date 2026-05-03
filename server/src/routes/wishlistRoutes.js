const express = require('express');
const { getWishlist, addWishlistItem, removeWishlistItem } = require('../controllers/wishlistController');
const { protect } = require('../middlewares/authMiddleware');
const validateRequest = require('../middlewares/validateMiddleware');
const { param } = require('express-validator');

const router = express.Router();

router.use(protect);
router.get('/', getWishlist);
router.post('/:bookId', [param('bookId').isMongoId().withMessage('Valid book ID is required')], validateRequest, addWishlistItem);
router.delete('/:bookId', [param('bookId').isMongoId().withMessage('Valid book ID is required')], validateRequest, removeWishlistItem);

module.exports = router;
