import React from "react";
import Sidebar from '../../../SideBar Section/Sidebar'
import Top from '../../../Profile/Components/Header'
import '../../../../../App.css'
import './inPerson2.css'
import { Link } from 'react-router-dom'; 
import { Card, Button } from "flowbite-react";

import { FaCloudUploadAlt } from "react-icons/fa";
import { IoIosStarOutline } from "react-icons/io";
import { IoIosLink } from "react-icons/io";



//import '../../onlinePE.scss'

const InPerson3 = () => {
    const handleButtonClick = () => {
        // Add your desired functionality here
        // For example, you can navigate to a different page
        window.location.href = "/annualHome";
    };
    const headerTitle = "Annual Physical Examination";

    return (
        <div className="dashboard flex">
           <div className="dashboardContainer flex">
            <Sidebar/>
                <div className='mainContent'>
                    <Top title={headerTitle} /> 
                        
                        <div className="titleUpload2 flex text-center">
                        
                            <h4><b>Preenlistment Period </b> </h4>
                            
                                <h2> <div className="text-center text-black font-light text-3xl">You are now pre-enlisted. </div></h2>
                                <h2> <div className="text-center text-black font-medium text-lg">Your schedule will be available after the pre-enlistment period</div></h2>
                        </div>
                        <div className="flex-1 p-2 mx-auto w-3/4">
                                    
                                    <Button onClick={handleButtonClick} className="pt-3 w-3/4 mx-auto transition duration-300 ease-in-out transform hover:scale-105 text-2xl bg-gradient-to-r from-blue-500 to-blue-400 text-white px-3 py-3 rounded-md">
                                    Go back to dashboard
                                    </Button>
                                    
                        </div>
                </div>
            </div>
        </div>
    )
}

export default InPerson3
