import { useEffect, useState, useRef } from 'react';
import { Bell } from 'lucide-react';
import notificationApi from '../services/notificationApi.js';
import { useToast } from './ToastProvider.jsx';

const NotificationDropdown = () => {
  const { addToast } = useToast();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    loadUnreadCount();
    loadNotifications();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadUnreadCount = async () => {
    try {
      const response = await notificationApi.getUnreadCount();
      setUnreadCount(response.data.data.count);
    } catch (error) {
      console.error('Failed to load unread count', error);
    }
  };

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const response = await notificationApi.getNotifications();
      setNotifications(response.data.data);
    } catch (error) {
      addToast('Failed to load notifications', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationApi.markAsRead(id);
      setNotifications(prev =>
        prev.map(notif => notif._id === id ? { ...notif, isRead: true } : notif)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      addToast('Failed to mark as read', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await notificationApi.deleteNotification(id);
      setNotifications(prev => prev.filter(notif => notif._id !== id));
      const deletedNotif = notifications.find(n => n._id === id);
      if (deletedNotif && !deletedNotif.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      addToast('Failed to delete notification', 'error');
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'price_drop': return 'bg-emerald-100 text-emerald-800';
      case 'transaction_request': return 'bg-sky-100 text-sky-800';
      case 'transaction_accepted': return 'bg-emerald-100 text-emerald-800';
      case 'book_approved': return 'bg-green-100 text-green-800';
      case 'book_rejected': return 'bg-rose-100 text-rose-800';
      case 'high_demand': return 'bg-orange-100 text-orange-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-600 hover:text-slate-900 focus:outline-none"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-rose-500 text-white text-xs flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-lg border border-slate-200 z-50">
          <div className="p-4 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-950">Notifications</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-slate-500">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-slate-500">No notifications</div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif._id}
                  className={`p-4 border-b border-slate-100 hover:bg-slate-50 ${!notif.isRead ? 'bg-sky-50' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(notif.type)}`}>
                          {notif.type.replace('_', ' ')}
                        </span>
                        {!notif.isRead && (
                          <span className="w-2 h-2 bg-sky-500 rounded-full"></span>
                        )}
                      </div>
                      <p className="text-sm font-medium text-slate-950">{notif.title}</p>
                      <p className="text-sm text-slate-600 mt-1">{notif.message}</p>
                      <p className="text-xs text-slate-500 mt-2">
                        {new Date(notif.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-1 ml-2">
                      {!notif.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(notif._id)}
                          className="text-sky-600 hover:text-sky-700 text-sm"
                        >
                          Mark read
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(notif._id)}
                        className="text-rose-600 hover:text-rose-700 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;