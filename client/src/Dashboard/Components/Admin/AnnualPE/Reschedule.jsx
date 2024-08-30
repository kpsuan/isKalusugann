import Sidebar from "../../SideBar Section/Sidebar";
import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import { Card, Timeline, Accordion, Tabs, Alert, Button, Modal, ModalBody, TextInput, Table, TableCell } from 'flowbite-react';
import { HiAdjustments, HiClipboardList, HiUserCircle } from "react-icons/hi";
import { HiArrowNarrowRight } from "react-icons/hi";
import Divider from '@mui/material/Divider';
import { Banner } from "flowbite-react";
import { HiX } from "react-icons/hi";
import { MdAnnouncement } from "react-icons/md";
import RescheduleRequest from "./RescheduleRequest";


import { MdDashboard } from "react-icons/md"
import { useDispatch } from 'react-redux';

import "../../Annual/annual.css";

import axios from 'axios';

import { Link, useNavigate } from 'react-router-dom'

const Reschedule = () => {
    const navigate = useNavigate();
    const [isPreEnlistEnabled, setIsPreEnlistEnabled] = useState(true);
    const [showModal, setShowModal] = useState(false);
  
    
    

  return (
    <div className="dashboard my-flex">
      <div className="dashboardContainer my-flex">
        <Sidebar />
        <div className="mainContent"> 
            
            <div className="relative flex space-x-1">
                
                
            </div>
            <div className="bg-white pr-3 w-full">
            

            <h1 className="text-3xl pt-10">Reschedule Requests </h1>
                <RescheduleRequest />
                
                
            </div>
          </div>
      </div>
      
    </div>
  );
};

export default Reschedule;
