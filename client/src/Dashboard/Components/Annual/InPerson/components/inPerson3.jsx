import React from "react";
import Sidebar from '../../../SideBar Section/Sidebar'
import Top from '../../../Profile/Components/Header'
import '../../../../../App.css'
import './inPerson2.css'
import { Link } from 'react-router-dom'; 

import { FaCloudUploadAlt } from "react-icons/fa";
import { IoIosStarOutline } from "react-icons/io";
import { IoIosLink } from "react-icons/io";



//import '../../onlinePE.scss'

const InPerson3 = () => {
    const handleButtonClick = () => {
        // Add your desired functionality here
        // For example, you can navigate to a different page
        window.location.href = "/result-inperson";
    };
    const headerTitle = "Annual Physical Examination";

    return (
        <div className="dashboard flex">
           <div className="dashboardContainer flex">
            <Sidebar/>
                <div className='mainContent'>
                    <Top title={headerTitle}/> 
                        <div className="titleUpload2 flex">
                            <h4><b>Preenlistment Period </b> <span class="lighter-font">(January 12-20, 2024)</span></h4>
                                <h2> <div className="text2">You are now pre-enlisted. </div></h2>
                                <h2> <div className="text4">Your schedule will be available after the pre-enlistment period</div></h2>
                        </div>
                    <div className="button-sub flex">
                            <button className='btn'  onClick={handleButtonClick}>View Schedule</button>
                            <button className='btn'  onClick={handleButtonClick}>Go Back to Dashboard</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InPerson3
