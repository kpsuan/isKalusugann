import React, { useState, useEffect } from "react";
import Sidebar from '../../../SideBar Section/Sidebar'
import Top from '../../../Profile/Components/Header'
import '../../../../../App.css'
import { Link } from 'react-router-dom'; 
import Table from './components/resultTable';
import './results.css'
import { FaCloudUploadAlt } from "react-icons/fa";
import { IoIosStarOutline } from "react-icons/io";
import { IoIosLink } from "react-icons/io";




//import '../../onlinePE.scss'

const OnlineSubmission = () => {
    const handleButtonClick = () => {
        // Add your desired functionality here
        // For example, you can navigate to a different page
        window.location.href = "/submissionInfo";
    };
    const headerTitle = "Annual Physical Examination";

    return (
        <div className="dashboard flex">
           <div className="dashboardContainer flex">
            <Sidebar/>
                <div className='mainContent'>
                    <Top title={headerTitle}/> 
                        <div className="titleUpload flex">
                                <h2> <span class="text2">Online Medical Examination System</span></h2>
                        </div>
                    <div className="tableArea">
                        <Table/>
                    </div>
                    
                </div>
            </div>
        </div>
    )
}

export default OnlineSubmission
