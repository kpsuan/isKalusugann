import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { BiSearchAlt } from "react-icons/bi";
import { BsArrowRightShort } from "react-icons/bs";
import { IoIosNotificationsOutline } from "react-icons/io";
import { Button } from 'flowbite-react';
import video from '../../../Assets/med.mp4';
import './top.css';
import DOMPurify from "dompurify";
import { toast, ToastContainer } from 'react-toastify';

import axios from 'axios';
import { IoNotificationsCircleOutline } from "react-icons/io5";
import { FaBell, FaRegBell, FaTrash } from "react-icons/fa";
import { BsCheck2All } from "react-icons/bs";

import { useNavigate } from 'react-router-dom';

export const Top = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [latestAnnouncement, setLatestAnnouncement] = useState(null);
  const [events, setEvents] = useState([]);
  const [notifications, setNotifications] = useState([]); 
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const nowUTC = new Date();
  const nowLocalUTCPlus8 = new Date(nowUTC.getTime() + (8 * 60 * 60 * 1000));
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const timeAgo = (timestamp) => {
    const now = nowLocalUTCPlus8;
    const then = new Date(timestamp);
    const diffInMillis = now - then;
  
    const diffInSeconds = Math.floor(diffInMillis / 1000);
    const diffInMinutes = Math.floor(diffInMillis / (60 * 1000));
    const diffInHours = Math.floor(diffInMillis / (60 * 60 * 1000));
    const diffInDays = Math.floor(diffInMillis / (24 * 60 * 60 * 1000));
  
    if (diffInSeconds < 60) {
      return `${diffInSeconds}s ago`;
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInDays < 30) {
      return `${diffInDays}d ago`;
    } else {
      return `${Math.floor(diffInDays / 30)}mo ago`;
    }
  };
  
  useEffect(() => {
    const fetchRecentPost = async () => {
      try {
        const res = await fetch(`/api/post/getposts?limit=1&order=desc`);
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const data = await res.json();

        if (data.posts.length > 0) {
          setLatestAnnouncement(data.posts[0]);
        }
      } catch (error) {
        console.error('Failed to fetch:', error.message);
      }
    };

    fetchRecentPost();
  }, [currentUser.isAdmin]);

  useEffect(() => {
    if (currentUser.isAdmin) {
      const fetchEvents = async () => {
        try {
          const res = await fetch(`/api/events/getevents?limit=10&order=desc`);
          if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
          }
          const data = await res.json();

          const today = new Date();
          const upcomingEvents = data.events.filter(event => new Date(event.date) > today);
          const sortedUpcomingEvents = upcomingEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
          setEvents(sortedUpcomingEvents);
        } catch (error) {
          console.error('Failed to fetch events:', error.message);
        }
      };

      fetchEvents();
    }
  }, [currentUser.isAdmin]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  const sanitizedContent = latestAnnouncement ? DOMPurify.sanitize(
    truncateText(latestAnnouncement.content, 250), {
        USE_PROFILES: { html: true },
        FORBID_ATTR: ['style'],
    }
  ) : '';

  const isToday = (date) => {
    const today = new Date();
    const inputDate = new Date(date);
    return today.toDateString() === inputDate.toDateString();
  };

  const isThisMonth = (date) => {
    const today = new Date();
    const inputDate = new Date(date);
    return today.getMonth() === inputDate.getMonth() && today.getFullYear() === inputDate.getFullYear();
  };

  const scheduleDate = currentUser.schedule ? new Date(currentUser.schedule) : null;
  const todaySchedule = scheduleDate && isToday(scheduleDate);
  const thisMonthSchedule = scheduleDate && isThisMonth(scheduleDate);

  const todayEvent = events.find(event => isToday(event.date));
  const thisMonthEvent = events.find(event => isThisMonth(event.date));

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!currentUser || !currentUser._id) {
        console.error('User ID is missing');
        return;
      }

      try {
        setIsLoading(true);
        const response = await axios.get(`/api/user/${currentUser._id}/notifications`);
        setNotifications(response.data.notifications);
      } catch (error) {
        console.error('Failed to fetch notifications:', error.message);
        toast.error('Failed to load notifications');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
    
    // Set up polling for new notifications every 3 minutes
    const intervalId = setInterval(() => {
      fetchNotifications();
    }, 180000);
    
    return () => clearInterval(intervalId);
  }, [currentUser._id]);

  // Get only unread notifications count
  const unreadNotificationsCount = notifications.filter(notif => !notif.isRead).length;

  const handleNotificationClick = async (notifId, link) => {
    try {
      const res = await fetch(`/api/user/${currentUser._id}/notifications/${notifId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        throw new Error(`Failed to update notification: ${res.statusText}`);
      }

      // Mark the notification as read locally
      setNotifications((prevNotifications) =>
        prevNotifications.map((notif) =>
          notif._id === notifId ? { ...notif, isRead: true } : notif
        )
      );

      // Navigate to the notification's link
      navigate(link);
      setIsDropdownOpen(false);

    } catch (error) {
      console.error('Error marking notification as read:', error.message);
      toast.error('Failed to mark notification as read');
    }
  };
  
  // Split notifications into new and earlier - only show 5 most recent
  const newNotifications = notifications
    .filter(notif => {
      const now = new Date();
      const notifTime = new Date(notif.timestamp);
      const diffInMinutes = Math.floor((now - notifTime) / 60000);
      return diffInMinutes <= 60; // Last hour
    })
    .slice(0, 5);

  const earlierNotifications = notifications
    .filter(notif => {
      const now = new Date();
      const notifTime = new Date(notif.timestamp);
      const diffInMinutes = Math.floor((now - notifTime) / 60000);
      return diffInMinutes > 60; // Older than an hour
    })
    .slice(0, 5);
  
  const handleClearAllNotifications = async () => {
    if (!currentUser || !currentUser._id) {
      toast.error('Unable to clear notifications. User ID is missing.');
      return;
    }
  
    try {
      setIsLoading(true);
      const res = await fetch(`/api/user/notifications/clear/${currentUser._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (!res.ok) {
        throw new Error(`Failed to clear notifications: ${res.statusText}`);
      }
  
      setNotifications([]);
      setIsDropdownOpen(false);
      toast.success('All notifications cleared');
    } catch (error) {
      console.error('Error clearing notifications:', error.message);
      toast.error('Failed to clear notifications');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to get notification icon based on type
  const getNotificationIcon = (type) => {
    switch(type) {
      case 'success':
        return <span className="text-green-500 text-xl">✓</span>;
      case 'warning':
        return <span className="text-yellow-500 text-xl">⚠️</span>;
      case 'danger':
        return <span className="text-red-500 text-xl">⚠</span>;
      case 'info':
      default:
        return <span className="text-blue-500 text-xl">ℹ</span>;
    }
  };
  
  return (
    <div className='topSection '>
      <div className="headerSection flex">
      <ToastContainer className={"z-50"} />
      <div className="welcome-section w-full p-6 rounded-xl shadow-soft">
       <div className="flex items-center space-x-4">
        <div className="welcome-avatar w-16 h-13 rounded-full overflow-hidden border-2 border-cyan-300">
          <img 
            src={currentUser.profilePicture} 
            alt={`${currentUser.firstName}'s avatar`} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className=''>
          <h1 className="text-3xl font-semibold text-gray-800 tracking-tight">
            Hi, {currentUser.firstName}
            <span className="wave text-2xl ml-2">👋</span>
          </h1>
          <p className="text-gray-600 mt-1 text-lg">
            What will you do today?
          </p>
        </div>
      </div>
    </div>

    <div className="adminDiv flex relative">
        <div className="dropdown relative mt-1" ref={dropdownRef}>
            <button 
              className="notification-btn relative flex items-center justify-center text-gray-700 hover:text-cyan-600 transition-colors"
              onClick={toggleDropdown}
              aria-label="Notifications"
            >
              {unreadNotificationsCount > 0 ? (
                <FaBell className="h-8 w-8 cursor-pointer text-cyan-500" />
              ) : (
                <IoIosNotificationsOutline className="icon h-12 w-12 cursor-pointer" />
              )}
              
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {unreadNotificationsCount > 99 ? '99+' : unreadNotificationsCount}
                </span>
              )}
            </button>
           {isDropdownOpen && (
              <div className="dropdown-content absolute right-0 mt-2 bg-white shadow-lg w-96 rounded-md z-[1000] transition-all duration-300 ease-in-out transform overflow-hidden">
                <div className="flex justify-between items-center p-3 border-b">
                  <h1 className="font-bold text-lg">Notifications</h1>
                  <button
                    className="text-red-600 hover:bg-red-100 p-2 rounded-md transition duration-200 flex items-center gap-1 text-sm"
                    onClick={handleClearAllNotifications}
                    disabled={isLoading || notifications.length === 0}
                    title="Clear all notifications"
                  >
                    <FaTrash className="text-sm" />
                    <span>Clear All</span>
                  </button>
                </div>
                
                {isLoading ? (
                  <div className="flex justify-center items-center p-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-500"></div>
                  </div>
                ) : (
                  <div className="max-h-80 overflow-y-auto">
                    {newNotifications.length > 0 && (
                      <div>
                        <h3 className="p-2 bg-gray-50 font-medium text-sm text-gray-500">New</h3>
                        {newNotifications.map((notif) => (
                          <div
                            key={notif._id}
                            className={`flex items-start p-3 border-b hover:bg-gray-50 cursor-pointer transition duration-200 ${
                              !notif.isRead ? 'bg-blue-50' : ''
                            }`}
                            onClick={() => handleNotificationClick(notif._id, notif.link)}
                          >
                            <div className="mr-3 mt-1">
                              {getNotificationIcon(notif.type)}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-800">{notif.message}</p>
                              <p className="text-xs text-gray-500">{timeAgo(notif.timestamp)}</p>
                            </div>
                            {!notif.isRead && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {earlierNotifications.length > 0 && (
                      <div>
                        <h3 className="p-2 bg-gray-50 font-medium text-sm text-gray-500">Earlier</h3>
                        {earlierNotifications.map((notif) => (
                          <div
                            key={notif._id}
                            className={`flex items-start p-3 border-b hover:bg-gray-50 cursor-pointer transition duration-200 ${
                              !notif.isRead ? 'bg-blue-50' : ''
                            }`}
                            onClick={() => handleNotificationClick(notif._id, notif.link)}
                          >
                            <div className="mr-3 mt-1">
                              {getNotificationIcon(notif.type)}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-800">{notif.message}</p>
                              <p className="text-xs text-gray-500">{timeAgo(notif.timestamp)}</p>
                            </div>
                            {!notif.isRead && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {notifications.length === 0 && (
                      <div className="p-6 text-center text-gray-500">
                        <IoNotificationsCircleOutline className="mx-auto text-4xl text-gray-300 mb-2" />
                        <p>No notifications</p>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="p-3 border-t bg-gray-50">
                  <Link 
                    to="/notifications" 
                    className="block w-full py-2 text-center text-sm text-cyan-600 hover:bg-cyan-50 rounded-md transition duration-200"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    View All Notifications
                  </Link>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>

      <div className="cardSection flex">
        <div className="rightCard flex">
        <h1 className='pt-10 pb-5'>
          Announcement: {latestAnnouncement ? latestAnnouncement.title : 'Announcement Board'}
        </h1>
        <div className="cont p-2">
          {latestAnnouncement ? (
            <div>
              <p className="pt-2 ml-2" dangerouslySetInnerHTML={{ __html: sanitizedContent }}></p>
            </div>
          ) : (
            <p>No announcements available.</p>
          )}
        </div>


          <div className="flex w-full mb-5">
            <Link to={`/post/${latestAnnouncement?.slug}`} target='_blank' rel="noopener noreferrer">
              <Button type="submit" className="w- py-2 my-5 text-3xl bg-cyan-500 text-white hover:bg-cyan-600  rounded-md z-10">
                Read Announcement 
              </Button>
            </Link>
          </div>

          <div className="videoDiv">
            <video src={video} autoPlay loop muted></video>
          </div>
        </div>

        <div className="leftCard flex">
          <div className="main flex">
            <div className="textDiv h-48">
              <h1 className='font-semibold'>Reminders</h1>

              <div className="flex flex-col ">
                {currentUser.isAdmin ? (
                  <>
                    {events.length > 0 ? (
                      <>
                        {events
                          .filter(event => isThisMonth(event.date))
                          .slice(0, 3) // Limit to 3 events
                          .map((event, index) => (
                            <span key={index} className="my-1">
                              <span className="font-semibold">{new Date(event.date).toDateString()}</span> <br />
                              <span className="text-cyan-600 font-semibold text-2xl">{event.title}</span>
                            </span>
                          ))}
                        {events.filter(event => isThisMonth(event.date)).length === 0 && (
                          <span>This Month <br /> <small>None</small></span>
                        )}
                      </>
                    ) : (
                      <span>No events available this month.</span>
                    )}
                  </>
                ) : (
                  <>
                    {todaySchedule && (
                      <span>Today <br/><small>ANNUAL PE Examination</small></span>
                    )}
                    {thisMonthSchedule && !todaySchedule && (
                      <span>This Month <br/><span className='text-cyan-600 text-2xl font-extrabold'>ANNUAL PE Examination - {scheduleDate.toDateString()}</span></span>
                    )}
                    {!todaySchedule && !thisMonthSchedule && (
                      <>
                        <span>Today <br/> <small>None</small></span>
                        <span>This Month <br/> <small>None</small></span>
                      </>
                    )}
                  </>
                )}
              </div>

              <a href="/events" target="_blank" rel="noopener noreferrer">
                <span className="flex link mt-4">
                  View All Events
                  <BsArrowRightShort className="icon" />
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Top;