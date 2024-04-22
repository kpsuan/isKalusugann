//import { UserContext } from '../../../../context/userContext'
import './top.css'
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { BiSearchAlt } from "react-icons/bi";
import { BsArrowRightShort } from "react-icons/bs";
import { TbMessageCircle } from "react-icons/tb";
import { IoIosNotificationsOutline } from "react-icons/io";
import video from '../../../Assets/med.mp4'

//import { useContext } from 'react'

export const Top = () => {
 // const {user} = useContext(UserContext)
  //console.log(user);
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
          <h1>Announcement Board</h1><br/>
          <div className="cont">
            <p>Your assigned schedule for the Annual Physical Examination is on April 21, 2024, Monday. Bring with you your completely filled up Health Declaration Form and a White Folder</p>
            </div>
          <div className="buttons flex">
            <button className='btn'>View All </button>
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
                <span>Today <br/> <small>None</small>
                </span>
                <span>This Month <br/> <small>Dental Check-up - January 4 </small>
                </span>
              </div>

              <span className="flex link">View All Appointments
              <BsArrowRightShort className='icon'/>

              </span>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Top