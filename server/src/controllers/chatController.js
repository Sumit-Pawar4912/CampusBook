const ChatService = require('../services/chatService');

class ChatController {
  static async createConversation(req, res) {
    try {
      const { bookId, sellerId } = req.params;
      const buyerId = req.user.id;

      const conversation = await ChatService.createConversation(bookId, buyerId, sellerId);
      res.status(201).json({ success: true, data: conversation });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async getConversations(req, res) {
    try {
      const userId = req.user.id;
      const conversations = await ChatService.getUserConversations(userId);
      res.json({ success: true, data: conversations });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getMessages(req, res) {
    try {
      const { conversationId } = req.params;
      const userId = req.user.id;

      const messages = await ChatService.getMessages(conversationId, userId);
      res.json({ success: true, data: messages });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async sendMessage(req, res) {
    try {
      const { conversationId } = req.params;
      const { content } = req.body;
      const senderId = req.user.id;

      const message = await ChatService.sendMessage(conversationId, senderId, content);
      res.status(201).json({ success: true, data: message });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = ChatController;