
import Sidebar from "../../../SideBar Section/Sidebar";
import Top from "../../../Profile/Components/Header";


import "./schedApp.css";

import axios from 'axios';


import {Link, useNavigate} from 'react-router-dom'
const scheduleAppointment = () => {
    return (
        <div className="dashboard my-flex">
          <div className="dashboardContainer my-flex">
            <Sidebar />
            <div className="mainContent">
              <Top/>
              <div className="heading">
                <h1>Schedule a Dental Appointment</h1>
              </div>
    
              {/* Start editing from here */}
              <div className="bodyContent">
                
              </div>
              <div className="btn-flex">
                </div>
            </div>
          </div>
        </div>
      );
}

export default scheduleAppointment