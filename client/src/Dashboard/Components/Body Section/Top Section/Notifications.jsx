import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Bell, Check, Clock } from 'lucide-react';
import Sidebar from '../../SideBar Section/Sidebar';

const Notifications = () => {
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

  const handleNotificationClick = async (notifId) => {
    try {
      const res = await fetch(`/api/user/${currentUser._id}/notifications/${notifId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) throw new Error(`Failed to update notification: ${res.statusText}`);
      
      setNotifications((prevNotifications) =>
        prevNotifications.map((notif) =>
          notif._id === notifId ? { ...notif, isRead: true } : notif
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error.message);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <Bell className="h-4 w-4 text-yellow-500" />;
      default:
        return <Bell className="h-4 w-4 text-blue-500" />;
    }
  };

  const getNotificationBadge = (type) => {
    const baseClasses = "text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full";
    switch (type) {
      case 'success':
        return <span className={`${baseClasses} bg-green-100 text-green-800`}>Success</span>;
      case 'warning':
        return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>Warning</span>;
      default:
        return <span className={`${baseClasses} bg-blue-100 text-blue-800`}>Info</span>;
    }
  };

  return (
    <div className="dashboard flex">
      <div className="dashboardContainer flex">
        <Sidebar />
        
        <div className="flex-1 p-4">
          <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-md">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {notifications.filter(n => !n.isRead).length} Unread
                </span>
              </div>
            </div>
            
            <div className="overflow-y-auto h-[600px]">
              {loading ? (
                <div className="p-4 space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse flex space-x-4">
                      <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                      <div className="flex-1 space-y-2 py-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <Bell className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">No notifications yet</h3>
                  <p className="text-sm text-gray-500">We'll notify you when something important happens.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {notifications.map((notif) => (
                    <div
                      key={notif._id}
                      onClick={() => handleNotificationClick(notif._id)}
                      className={`flex items-start p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                        notif.isRead ? 'bg-gray-50/50' : 'bg-white'
                      }`}
                    >
                      <div className="flex-shrink-0 mr-4">
                        {getNotificationIcon(notif.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link 
                          to={notif.link || '#'} 
                          className="text-sm text-gray-900 hover:text-blue-600"
                        >
                          {notif.message}
                        </Link>
                        <div className="flex items-center mt-1">
                          <Clock className="h-3 w-3 text-gray-400 mr-1" />
                          <span className="text-xs text-gray-500 mr-2">
                            {timeAgo(notif.timestamp)}
                          </span>
                          {getNotificationBadge(notif.type)}
                        </div>
                      </div>
                      {!notif.isRead && (
                        <div className="h-2 w-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;