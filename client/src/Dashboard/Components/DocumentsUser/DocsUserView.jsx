
import Sidebar from "../SideBar Section/Sidebar";
import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import GetAllDocs from "./GetAllDocs";
import Top from '../Profile/Components/Header'



import "../Annual/annual.css";

import axios from 'axios';


import {Link, useNavigate} from 'react-router-dom'

const DocsUserView = () => {
  const headerTitle = "Documents";
    return (
        <div className="dashboard my-flex">
          <div className="dashboardContainer my-flex">
            <Sidebar />
            <div className="mainContent">
            <Top title={headerTitle}/> 
            <div className="bg-white rounded-lg border border-gray-200 mt-10 p-10 w-full">
              <div className="text-2xl font-light mb-4">All Documents
                <p className="font-light my-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-10 w-full">
                  <GetAllDocs/>
              </div>         
            </div>    
          </div>
        </div>
        </div>
    );
};
export default DocsUserView;