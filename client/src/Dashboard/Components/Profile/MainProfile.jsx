import React from "react";
import Profile from "../Profile/Components/Profile"
import Sidebar from "../SideBar Section/Sidebar"
import '../../../../App.css'

const MainProfile = () => {

    return (
        <div className="dashboard flex">
           <div className="dashboardContainer flex">
            <Sidebar/>
            <Profile/>
           </div>
        </div>
    )
}

export default MainProfile
