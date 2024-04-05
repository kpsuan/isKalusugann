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

const InPerson2 = () => {
    const handleButtonClick = () => {
        // Add your desired functionality here
        // For example, you can navigate to a different page
        window.location.href = "/inPerson3";
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
                                <h2> <div className="text2">You’re one step away from being scheduled. </div></h2>
                                <h2> <div className="text4">We’ve now gathered some needed details about you, please click the confirm for scheduling button if you wish to be added to the List of In-Person Medical Examination Students Masterlist  </div></h2>
                        </div>
                    <div className="button-sub flex">
                            <button className='btn'  onClick={handleButtonClick}>Confirm</button>
                            <button className='btn'  onClick={handleButtonClick}>Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InPerson2
