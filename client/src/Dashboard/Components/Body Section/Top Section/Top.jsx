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

export const Top = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [latestAnnouncement, setLatestAnnouncement] = useState(null);

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

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  // Using DOMPurify to sanitize the announcement content
  const sanitizedContent = latestAnnouncement ? DOMPurify.sanitize(
    truncateText(latestAnnouncement.content, 450), {
        USE_PROFILES: { html: true }, // Allows basic HTML
        FORBID_ATTR: ['style'], // Forbid the style attribute to remove inline styles
    }
  ) : '';

  return (
    <div className='topSection'>
      <div className="headerSection flex">
        <div className="title">
          <h1><b>Hi {currentUser.firstName}!</b></h1>
          <p>What would you like to do today?</p>
        </div>

        <div className="searchBar flex">
          <input type="text" placeholder='Search' />
          <BiSearchAlt className='icon'/>
        </div>

        <div className="adminDiv flex">
          <IoIosNotificationsOutline className='icon'/>
          <div className="adminImage h-10 w-7">
            <Link to='/profile'>
              {currentUser ? (
                <img src={currentUser.profilePicture} alt='profile' className=' object-cover' />
              ) : (
                <li>Sign In</li>
              )}
            </Link>
          </div>
        </div>
      </div>

      <div className="cardSection flex">
        <div className="rightCard flex">
          <h1 className='pt-4 pb-5'>Announcement Board</h1>
          <div className="cont p-4">
          {latestAnnouncement ? (
              <div>
                  <p
                      className="pt-0"
                      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                  ></p>
              </div>
          ) : (
              <p>No announcements available.</p>
          )}
          </div>

          <div className="flex w-full">
          <Link to={`/post/${latestAnnouncement?.slug}`} target='_blank' rel="noopener noreferrer">
            <Button type="submit" className="w-full my-5 text-3xl bg-cyan-500 text-white hover:bg-cyan-600 py-2 rounded-md z-10">
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
            <div className="textDiv">
              <h1>Upcoming Appointments</h1>

              <div className="flex">
                <span>Today <br/> <small>None</small></span>
                <span>This Month <br/> <small>Dental Check-up - January 4</small></span>
              </div>

              <span className="flex link">View All Appointments
              <BsArrowRightShort className='icon'/></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Top;
