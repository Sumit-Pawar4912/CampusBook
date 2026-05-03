const express = require('express');
const ChatController = require('../controllers/chatController');
const { protect } = require('../middlewares/authMiddleware');
const { body } = require('express-validator');

const router = express.Router();

router.use(protect);

router.post('/conversation/:bookId/:sellerId', ChatController.createConversation);
router.get('/conversations', ChatController.getConversations);
router.get('/messages/:conversationId', ChatController.getMessages);
router.post(
  '/messages/:conversationId',
  [
    body('content').trim().isLength({ min: 1, max: 500 }).withMessage('Message must be 1-500 characters'),
  ],
  ChatController.sendMessage
);

module.exports = router;