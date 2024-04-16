
import Sidebar from "../../SideBar Section/Sidebar";
import Top from "../../Profile/Components/Header";
import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';

import "../../Annual/annual.css";

import axios from 'axios';


import {Link, useNavigate} from 'react-router-dom'

const AnnualAdmin = () => {
  const headerTitle = "Annual Physical Examination";
    return (
        <div className="dashboard my-flex">
          <div className="dashboardContainer my-flex">
            <Sidebar />
            <div className="mainContent">
              <Top title={headerTitle} />
              <div className="titlePE my-flex">
                <h4>
                  <b>HSU Admin</b>{" "}
                </h4>
                <h2>
                  {" "}
                  <span className="text2">
                    Manage Annual Physical Examinations
                  </span>
                </h2>
    
                <div className="choicePE">
                    <div className="choice1">
                        <a href="/manage-online">
                        <span class="label-PE">Online Physical Examination
                            <div className="small-desc">View submitted documents</div>
                        </span>
                        </a>
                    </div>
                                    
                    <div className="choice2">
                        <a href="/manageInPerson">
                            <span class="label-PE">Schedule In-Person Examination
                            <div className="small-desc">View & confirm generated shedule</div>
                            </span>
                        </a>
                    </div>
                </div>
            </div>
          </div>
        </div>
    </div>
    );
};
export default AnnualAdmin;