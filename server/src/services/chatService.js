const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const Book = require('../models/Book');
const User = require('../models/User');

class ChatService {
  static async createConversation(bookId, buyerId, sellerId) {
    if (buyerId === sellerId) {
      throw new Error('Cannot create conversation with yourself');
    }

    const book = await Book.findById(bookId);
    if (!book) {
      throw new Error('Book not found');
    }

    // ✅ fixed: was book.owner, should be book.seller
    if (book.seller.toString() !== sellerId) {
      throw new Error('Seller does not own this book');
    }

    const existing = await Conversation.findOne({ book: bookId, buyer: buyerId, seller: sellerId });
    if (existing) {
      return existing;
    }

    const conversation = new Conversation({ book: bookId, buyer: buyerId, seller: sellerId });
    await conversation.save();
    return conversation;
  }

  static async getUserConversations(userId) {
    return await Conversation.find({
      $or: [{ buyer: userId }, { seller: userId }],
    })
      .populate('book', 'title author')
      .populate('buyer', 'name')
      .populate('seller', 'name')
      .sort({ updatedAt: -1 });
  }

  static async getMessages(conversationId, userId) {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }
    if (conversation.buyer.toString() !== userId && conversation.seller.toString() !== userId) {
      throw new Error('Access denied');
    }
    return await Message.find({ conversation: conversationId })
      .populate('sender', 'name')
      .sort({ createdAt: 1 });
  }

  static async sendMessage(conversationId, senderId, content) {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }
    if (conversation.buyer.toString() !== senderId && conversation.seller.toString() !== senderId) {
      throw new Error('Access denied');
    }

    const message = new Message({ conversation: conversationId, sender: senderId, content });
    await message.save();

    conversation.updatedAt = Date.now();
    await conversation.save();

    return message.populate('sender', 'name');
  }
}

module.exports = ChatService;