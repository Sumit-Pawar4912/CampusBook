const express = require('express');
const { param } = require('express-validator');
const { getStats, listUsers, verifyUser, banUser, unbanUser, pendingListings, approveListing, rejectListing } = require('../controllers/adminController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const validateRequest = require('../middlewares/validateMiddleware');

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/stats', getStats);
router.get('/users', listUsers);
router.patch('/users/:id/verify', [param('id').isMongoId().withMessage('Valid user ID is required')], validateRequest, verifyUser);
router.patch('/users/:id/ban', [param('id').isMongoId().withMessage('Valid user ID is required')], validateRequest, banUser);
router.patch('/users/:id/unban', [param('id').isMongoId().withMessage('Valid user ID is required')], validateRequest, unbanUser);
router.get('/books/pending', pendingListings);
router.patch('/books/:id/approve', [param('id').isMongoId().withMessage('Valid book ID is required')], validateRequest, approveListing);
router.patch('/books/:id/reject', [param('id').isMongoId().withMessage('Valid book ID is required')], validateRequest, rejectListing);

module.exports = router;
