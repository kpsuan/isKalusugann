import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { BiSearchAlt } from "react-icons/bi";
import { BsArrowRightShort } from "react-icons/bs";
import { IoIosNotificationsOutline } from "react-icons/io";
import { Button } from 'flowbite-react';
import video from '../../../Assets/med.mp4';
import './top.css';
import DOMPurify from "dompurify";

import axios from 'axios';
import { IoNotificationsCircleOutline } from "react-icons/io5";

import { useNavigate } from 'react-router-dom';  // Import useNavigate


export const Top = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [latestAnnouncement, setLatestAnnouncement] = useState(null);
  const [events, setEvents] = useState([]);
  const [notifications, setNotifications] = useState([]); 
  const navigate = useNavigate();  // Use useNavigate hook for navigation

  const [isDropdownOpen, setIsDropdownOpen] = useState(false); 
  const nowUTC = new Date();
  const nowLocalUTCPlus8 = new Date(nowUTC.getTime() + (8 * 60 * 60 * 1000)); // Get current time in UTC+8
  const timeAgo = (timestamp) => {
    const now = nowLocalUTCPlus8; // Use the current time in UTC+8
    const then = new Date(timestamp); // Convert the provided timestamp to Date object
    const diffInMillis = now - then; // Time difference in milliseconds
  
    const diffInSeconds = Math.floor(diffInMillis / 1000); // Convert to seconds
    const diffInMinutes = Math.floor(diffInMillis / (60 * 1000)); // Convert to minutes
    const diffInHours = Math.floor(diffInMillis / (60 * 60 * 1000)); // Convert to hours
    const diffInDays = Math.floor(diffInMillis / (24 * 60 * 60 * 1000)); // Convert to days
  
    // Return the appropriate time ago string
    if (diffInSeconds < 60) {
      return `${diffInSeconds} second${diffInSeconds === 1 ? '' : 's'} ago`;
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
    } else if (diffInDays < 30) {
      return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
    } else {
      return `${Math.floor(diffInDays / 30)} month${Math.floor(diffInDays / 30) === 1 ? '' : 's'} ago`;
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
        const response = await axios.get(`/api/user/${currentUser._id}/notifications`); // Match the backend route
        setNotifications(response.data.notifications);

      } catch (error) {
        console.error('Failed to fetch notifications:', error.message);
      }
    };

    fetchNotifications();
  }, [currentUser._id]);

  const unreadNotificationsCount = notifications.filter(notif => !notif.read).length;

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
      navigate(link);  // This will handle the redirection

    } catch (error) {
      console.error('Error marking notification as read:', error.message);
    }
  };
  

  // Split notifications into new and earlier
  const newNotifications = notifications.filter(notif => {
    const now = new Date();
    const notifTime = new Date(notif.timestamp);
    const diffInMinutes = Math.floor((now - notifTime) / 60000);
    return diffInMinutes <= 60; // Consider notifications within the last hour as new
  });

  const earlierNotifications = notifications.filter(notif => {
    const now = new Date();
    const notifTime = new Date(notif.timestamp);
    const diffInMinutes = Math.floor((now - notifTime) / 60000);
    return diffInMinutes > 60; // Notifications older than an hour are considered earlier
  });
  

  

  return (
    <div className='topSection'>
      <div className="headerSection flex">
        <div className="title text-2xl mt-5">
          <h1 className='font-light'>Hi {currentUser.firstName}!</h1>
          <p>What would you like to do today?</p>
        </div>

        <div className="adminDiv flex relative">
        <div className="dropdown relative mt-1">
            <IoIosNotificationsOutline 
              className="icon cursor-pointer"
              onClick={toggleDropdown}
            />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadNotificationsCount}
              </span>
            )}
            {isDropdownOpen && (
              <div className="dropdown-content absolute right-0 bg-white shadow-lg w-96 rounded-md z-[1000]">
                <h1 className="p-2 font-bold border-b text-lg">Notifications</h1>
                <ul>
                  {newNotifications.length > 0 && (
                    <div>
                      <h3 className="p-2 font-bold">New Notifications</h3>
                      {newNotifications.map((notif) => (
                        <li
                          key={notif._id}
                          className={`flex items-center gap-2 p-2 border-b hover:bg-gray-100 ${notif.isRead ? 'opacity-50' : ''}`}
                          onClick={() => handleNotificationClick(notif._id, notif.link)}
                          >
                          <IoNotificationsCircleOutline className={`text-lg text-${notif.type}`} />
                          <Link to={notif.link || "#"} className="text-sm text-blue-500 hover:underline">
                            {notif.message} - <small>{timeAgo(notif.timestamp)}</small>
                          </Link>
                        </li>
                      ))}
                    </div>
                  )}
                  {earlierNotifications.length > 0 && (
                    <div>
                      <h3 className="p-2 font-bold">Earlier Notifications</h3>
                      {earlierNotifications.map((notif) => (
                        <li
                          key={notif._id}
                          className={`flex items-center gap-2 p-2 border-b hover:bg-gray-100 ${notif.isRead ? 'opacity-50' : ''}`}
                          onClick={() => handleNotificationClick(notif._id, notif.link)}
                          >
                          <IoNotificationsCircleOutline className={`text-5xl text-blue-500 text-${notif.type}`} />
                          <Link to={notif.link || "#"} className="text-sm text-blue-500 hover:underline">
                            {notif.message} <small>{timeAgo(notif.timestamp)}</small>
                          </Link>
                          
                        </li>
                      ))}
                    </div>
                  )}
                  {notifications.length === 0 && (
                    <li className="p-2 text-gray-500">No notifications</li>
                  )}
                </ul>

                <div className="p-2">
                  <Link to="/notifications">
                    <Button className="w-full text-cyan-500 hover:bg-cyan-100">
                      See More
                    </Button>
                  </Link>
                </div>
              </div>
            )}
        </div>



          <div className="adminImage h-10 w-7">
            <Link to='/profile'>
              {currentUser ? (
                <img src={currentUser.profilePicture} alt='profile' className='object-cover' />
              ) : (
                <li>Sign In</li>
              )}
            </Link>
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
                View All 
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
                          .slice(0, 3) // Limit to 2 or 3 events
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
