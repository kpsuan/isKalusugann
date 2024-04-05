import React from "react";
//import Profile2 from "./Components/Body Section/Profile/Profile2";
import Top from './Header'
import './profile.css'
import UserProfile from "./User/UserProfile";


const Profile = () => {
  const headerTitle = "My Profile";

    return (
        <div className='mainContent'>
          <Top title={headerTitle}/>
    
          <div className="bottom">
            <UserProfile/>
          </div>
          </div>
      )
}

export default Profile