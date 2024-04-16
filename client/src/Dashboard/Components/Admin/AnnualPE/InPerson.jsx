
import Sidebar from "../../SideBar Section/Sidebar";
import Top from "../../Profile/Components/Header";
import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';


import "../../Annual/annual.css";

import axios from 'axios';


import {Link, useNavigate} from 'react-router-dom'
import UserInPerson from "./UserInPerson";

const InPerson = () => {

  const headerTitle = "Annual Physical Examination";
    return (
        <div className="dashboard my-flex">
          <div className="dashboardContainer my-flex">
            <Sidebar />
            <div className="mainContent">
            <div className="bg-white rounded-lg border border-gray-200 p-10 w-full">
                        <div className="text-2xl font-light mb-4">List of Students for Scheduling</div>
                        <p className="font-light my-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec nisl quis risus eleifend venenatis. Mauris nec justo nec ligula suscipit consequat. Donec rutrum nisi nec faucibus euismod. Sed sit amet vestibulum metus.</p>
                        </div>
                        <UserInPerson/>
            </div>
           
          </div>
        </div>
    );
};
export default InPerson;