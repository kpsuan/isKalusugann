import React from "react";
import Sidebar from '../../SideBar Section/Sidebar'
import Top from '../../Profile/Components/Header'
import '../../../../App.css'
import './onlinePE.scss'
import Accordion from './Accordion/Accordion'
import OnlineSubmission from './Submission/OnlineSubmission'
import { Link } from 'react-router-dom'; 


const OnlinePE = () => {
    const headerTitle = "Annual Physical Examination";
    const handleButtonClick = () => {
        // Add your desired functionality here
        // For example, you can navigate to a different page
        window.location.href = "/onlineSub";
    };

    return (
        <div className="dashboard my-flex">
           <div className="dashboardContainer my-flex">
            <Sidebar/>
                <div className='mainContent'>
                    <Top title={headerTitle}/>
                            <div className="titleOnlinePE my-flex">
                                <h4><b>Preenlistment Period </b> <span class="lighter-font">(January 12-20, 2024)</span></h4>
                                    <h2> <span class="text2">Online Medical Examination System</span></h2>
                                <Accordion/>
                                <div className="buttons my-flex">
                                    <button className='btn'  onClick={handleButtonClick}>Get Started</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
    );
}

export default OnlinePE
