import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Bell, Check, Clock, Info } from 'lucide-react';
import Sidebar from '../../SideBar Section/Sidebar';

const Notifications = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!currentUser?._id) {
        console.error('User ID is missing');
        return;
      }

      try {
        const res = await fetch(`/api/user/${currentUser._id}/notifications`);
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        const data = await res.json();
        setNotifications(data.notifications);
      } catch (error) {
        console.error('Failed to fetch notifications:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [currentUser?._id]);

  const timeAgo = (timestamp) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffInMillis = now - then;
    const diffInSeconds = Math.floor(diffInMillis / 1000);
    const diffInMinutes = Math.floor(diffInMillis / (60 * 1000));
    const diffInHours = Math.floor(diffInMillis / (60 * 60 * 1000));
    const diffInDays = Math.floor(diffInMillis / (24 * 60 * 60 * 1000));

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 30) return `${diffInDays}d ago`;
    return `${Math.floor(diffInDays / 30)}mo ago`;
  };

  const handleNotificationClick = async (notif) => {
    try {
      const res = await fetch(`/api/user/${currentUser._id}/notifications/${notif._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) throw new Error(`Failed to update notification: ${res.statusText}`);
      
      setNotifications((prevNotifications) =>
        prevNotifications.map((n) =>
          n._id === notif._id ? { ...n, isRead: true } : n
        )
      );

      // Navigate to the notification link after marking as read
      if (notif.link) {
        navigate(notif.link);
      }
    } catch (error) {
      console.error('Error marking notification as read:', error.message);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <Check className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <Bell className="h-5 w-5 text-yellow-500" />;
      default:
        return <Bell className="h-5 w-5 text-blue-500" />;
    }
  };

  const getNotificationBadge = (type) => {
    switch (type) {
      case 'success':
        return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">Success</span>;
      case 'warning':
        return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">Warning</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">Info</span>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      
      <main className="flex-1 overflow-hidden">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Stay updated with your latest activities
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-200">
                    <Bell className="w-4 h-4 mr-1" />
                    {notifications.filter(n => !n.isRead).length} Unread
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Notifications Content */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-8 space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse flex items-center space-x-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                    <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-12 w-12"></div>
                    <div className="flex-1 space-y-3">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : notifications.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-full p-4 mb-4">
                  <Bell className="h-8 w-8 text-blue-500 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No notifications yet</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
                  We'll notify you when something important happens in your account.
                </p>
              </div>
            ) : (
              <div className="p-8 space-y-4">
                {notifications.map((notif) => (
                  <div
                    key={notif._id}
                    onClick={() => handleNotificationClick(notif)}
                    className={`group flex items-start p-6 rounded-lg transition-all cursor-pointer
                      ${notif.isRead 
                        ? 'bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800' 
                        : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
                      } shadow-sm hover:shadow-md`}
                  >
                    <div className={`flex-shrink-0 rounded-full p-2 mr-4
                      ${notif.type === 'success' ? 'bg-green-50 dark:bg-green-900/20' :
                        notif.type === 'warning' ? 'bg-yellow-50 dark:bg-yellow-900/20' :
                        'bg-blue-50 dark:bg-blue-900/20'}`}
                    >
                      {getNotificationIcon(notif.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {notif.message}
                      </p>
                      <div className="flex items-center mt-2 space-x-3">
                        <span className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Clock className="h-4 w-4 mr-1" />
                          {timeAgo(notif.timestamp)}
                        </span>
                        {getNotificationBadge(notif.type)}
                      </div>
                    </div>
                    {!notif.isRead && (
                      <span className="flex-shrink-0 h-3 w-3 bg-blue-600 rounded-full"></span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Notifications;