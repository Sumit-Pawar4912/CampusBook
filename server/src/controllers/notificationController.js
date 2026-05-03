const NotificationService = require('../services/notificationService');

class NotificationController {
  static async getNotifications(req, res) {
    try {
      const userId = req.user.id;
      const notifications = await NotificationService.getUserNotifications(userId);
      res.json({ success: true, data: notifications });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async markAsRead(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const notification = await NotificationService.markAsRead(id, userId);
      res.json({ success: true, data: notification });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async deleteNotification(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      await NotificationService.deleteNotification(id, userId);
      res.json({ success: true, message: 'Notification deleted' });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async getUnreadCount(req, res) {
    try {
      const userId = req.user.id;
      const count = await NotificationService.getUnreadCount(userId);
      res.json({ success: true, data: { count } });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = NotificationController;