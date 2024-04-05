import React from 'react'
import '../../Body Section/body.css'
import { BiSearchAlt } from "react-icons/bi";
import { BsArrowRightShort } from "react-icons/bs";
import { TbMessageCircle } from "react-icons/tb";
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { IoIosNotificationsOutline } from "react-icons/io";
import img from '../../../Assets/admin.jpg'
export const Profile2 = ({ title }) => {
  const { currentUser } = useSelector((state) => state.user);
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
          <div className="adminImage">
          <Link to='/profile'>
            {currentUser ? (
              <img src={currentUser.profilePicture} alt='profile' className='h-7 w-7 rounded-full object-cover' />
            ) : (
              <li>Sign In</li>
            )}
          </Link>
          </div>
        </div>
      </div>
      </div>
    )
  }

export default Profile2