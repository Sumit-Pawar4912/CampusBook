const Notification = require('../models/Notification');

class NotificationService {
  static async createNotification(userId, title, message, type) {
    const notification = new Notification({ user: userId, title, message, type });
    await notification.save();
    return notification;
  }

  static async getUserNotifications(userId) {
    return await Notification.find({ user: userId }).sort({ createdAt: -1 });
  }

  static async markAsRead(notificationId, userId) {
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, user: userId },
      { isRead: true },
      { new: true }
    );
    if (!notification) {
      throw new Error('Notification not found');
    }
    return notification;
  }

  static async deleteNotification(notificationId, userId) {
    const result = await Notification.findOneAndDelete({ _id: notificationId, user: userId });
    if (!result) {
      throw new Error('Notification not found');
    }
    return result;
  }

  static async getUnreadCount(userId) {
    return await Notification.countDocuments({ user: userId, isRead: false });
  }

  // Trigger methods
  static async notifyPriceDrop(userId, bookTitle, newPrice) {
    return await this.createNotification(
      userId,
      'Price Drop Alert',
      `The price of "${bookTitle}" has dropped to ₹${newPrice}`,
      'price_drop'
    );
  }

  static async notifyTransactionRequest(sellerId, buyerName, bookTitle) {
    return await this.createNotification(
      sellerId,
      'Transaction Request',
      `${buyerName} wants to buy your "${bookTitle}"`,
      'transaction_request'
    );
  }

  static async notifyTransactionAccepted(buyerId, sellerName, bookTitle) {
    return await this.createNotification(
      buyerId,
      'Transaction Accepted',
      `${sellerName} accepted your request for "${bookTitle}"`,
      'transaction_accepted'
    );
  }

  static async notifyBookApproved(sellerId, bookTitle) {
    return await this.createNotification(
      sellerId,
      'Book Approved',
      `Your listing "${bookTitle}" has been approved`,
      'book_approved'
    );
  }

  static async notifyBookRejected(sellerId, bookTitle) {
    return await this.createNotification(
      sellerId,
      'Book Rejected',
      `Your listing "${bookTitle}" has been rejected`,
      'book_rejected'
    );
  }

  static async notifyHighDemand(userId, bookTitle) {
    return await this.createNotification(
      userId,
      'High Demand Alert',
      `"${bookTitle}" is in high demand - consider selling yours!`,
      'high_demand'
    );
  }
}

module.exports = NotificationService;