
import Sidebar from "../../SideBar Section/Sidebar";
import Top from "../../Profile/Components/Header";
import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import Docs from "./Docs";
import GetDocs from "./GetDocs";


import "../../Annual/annual.css";

import axios from 'axios';


import {Link, useNavigate} from 'react-router-dom'

const Documents = () => {
    return (
        <div className="dashboard my-flex">
          <div className="dashboardContainer my-flex">
            <Sidebar />
            <div className="mainContent">
            <div className="bg-white rounded-lg border border-gray-200 p-10 w-full">
                        <div className="text-2xl font-light mb-4">Upload Documents</div>
                        <p className="font-light my-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                        </div> 
                        <Docs/>
                        <div className="bg-white rounded-lg border border-gray-200 p-10 w-full">
                        <div className="text-2xl font-light mb-4">Your Documents</div>
                        <p className="font-light my-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                        <GetDocs/>
                        </div>
                        
            </div>
           
          </div>
        </div>
    );
};
export default Documents;