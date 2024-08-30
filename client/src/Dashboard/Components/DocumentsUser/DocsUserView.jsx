
import Sidebar from "../SideBar Section/Sidebar";
import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import GetAllDocs from "./GetAllDocs";
import Top from '../Profile/Components/Header'
import { Card } from 'flowbite-react';

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
            <Top  className="font-medium" title={headerTitle}/> 
            
            <div className="bg-white rounded-lg border border-gray-200 mt-10 p-10 w-full">
            <Card className="w-full h-150 p-10 bg-gradient-to-r from-cyan-600 to-green-500">
                                    <div className="text-2xl font-light tracking-tight text-white dark:text-white">Downloadable docs</div>

            </Card>
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