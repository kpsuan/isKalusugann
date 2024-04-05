
import Sidebar from "../../SideBar Section/Sidebar";
import Top from "../../Profile/Components/Header";


import "./appointment.css";

import axios from 'axios';


import {Link, useNavigate} from 'react-router-dom'

const Appointments = () => {

  
  
  return (
    <div className="dashboard my-flex">
      <div className="dashboardContainer my-flex">
        <Sidebar />
        <div className="mainContent">
          <Top/>
          <div className="heading">
            <h1>Your Appointments</h1>
          </div>

          {/* Start editing from here */}
          <div className="bodyContent">
            
          </div>
          <div className="btn-flex">
            <button className="btnApp"><Link to="/appointmentDetails">Book Appointment</Link></button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Appointments;
